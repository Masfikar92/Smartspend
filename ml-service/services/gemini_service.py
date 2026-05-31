import os
import time
import asyncio
import logging
import threading
from collections import defaultdict
from typing import Optional

import google.generativeai as genai

from .prompt_template import build_prompt

# ─── Logging ─────────────────────────────────────────────────────────────────
logger = logging.getLogger("smartspend.gemini")

# ─── Gemini Init ─────────────────────────────────────────────────────────────
GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY", "")

if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)
    logger.info("Gemini API configured successfully.")
else:
    logger.warning("GEMINI_API_KEY not set — SmartSpend AI will return fallback.")

# ─── Model Config ─────────────────────────────────────────────────────────────
MODEL_NAME = "gemini-3.5-flash"
MAX_TOKENS     = 1500
TEMPERATURE    = 0.7
TIMEOUT_SECS   = 25
MAX_RETRIES    = 1
# ─── Rate Limiting (per user_id) ─────────────────────────────────────────────
_rate_limits: dict[str, list] = defaultdict(list)
_rate_lock    = threading.Lock()
MAX_RPM       = 5
GLOBAL_RPM    = 30 
_global_calls: list  = []


def _check_rate_limit(user_id: str) -> tuple[bool, str]:
    """
    Returns (allowed: bool, reason: str).
    Cleans old entries (older than 60s) before checking.
    """
    now = time.time()
    with _rate_lock:
        # Clean per-user
        _rate_limits[user_id] = [t for t in _rate_limits[user_id] if now - t < 60]
        if len(_rate_limits[user_id]) >= MAX_RPM:
            return False, f"Rate limit: maks {MAX_RPM} request/menit per user"

        # Clean global
        global _global_calls
        _global_calls = [t for t in _global_calls if now - t < 60]
        if len(_global_calls) >= GLOBAL_RPM:
            return False, f"Rate limit global: maks {GLOBAL_RPM} request/menit"

        # Record call
        _rate_limits[user_id].append(now)
        _global_calls.append(now)
        return True, "ok"


# ─── Gemini Generation ────────────────────────────────────────────────────────
async def generate_ai_analysis(data: dict, user_id: str = "anonymous") -> str:
    """
    Main entry point.
    - Checks rate limit
    - Builds prompt from data
    - Calls Gemini API async
    - Returns analysis string or fallback message
    """

    # 0. Check API key
    if not GEMINI_API_KEY:
        return _fallback_message(reason="GEMINI_API_KEY belum dikonfigurasi.")

    # 1. Rate limit check
    allowed, reason = _check_rate_limit(user_id)
    if not allowed:
        logger.warning("Rate limit hit for user %s: %s", user_id, reason)
        return _fallback_message(reason="Terlalu banyak permintaan. Coba lagi dalam 1 menit.")

    # 2. Build prompt
    try:
        prompt = build_prompt(data)
    except Exception as e:
        logger.error("Prompt building failed: %s", e)
        return _fallback_message(reason="Gagal mempersiapkan data analisis.")

    # 3. Call Gemini dengan retry
    for attempt in range(1, MAX_RETRIES + 2):   # attempt 1 dan 2
        try:
            result = await _call_gemini(prompt)
            logger.info("Gemini OK for user %s (attempt %d)", user_id, attempt)
            return result
        except asyncio.TimeoutError:
            logger.warning("Gemini timeout (attempt %d) for user %s", attempt, user_id)
            if attempt > MAX_RETRIES:
                return _fallback_message(reason="Analisis AI memerlukan waktu lebih lama dari biasa.")
        except Exception as e:
            logger.error("Gemini error (attempt %d): %s", attempt, str(e))
            if attempt > MAX_RETRIES:
                return _fallback_message(reason="Layanan AI sementara tidak tersedia.")

    return _fallback_message(reason="Analisis AI gagal setelah beberapa percobaan.")


async def _call_gemini(prompt: str) -> str:
    """Actual async Gemini API call with timeout."""
    model = genai.GenerativeModel(
        model_name=MODEL_NAME,
        generation_config=genai.GenerationConfig(
            max_output_tokens=MAX_TOKENS,
            temperature=TEMPERATURE,
        ),
    )

    # Gemini SDK is sync; wrap in executor to avoid blocking event loop
    loop = asyncio.get_event_loop()
    response = await asyncio.wait_for(
        loop.run_in_executor(
            None,
            lambda: model.generate_content(prompt)
        ),
        timeout=TIMEOUT_SECS,
    )

    # Extract text safely
    if not response or not response.text:
        raise ValueError("Gemini returned empty response")

    return response.text.strip()


# ─── Fallback ─────────────────────────────────────────────────────────────────
def _fallback_message(reason: str = "") -> str:
    """
    Pesan fallback ketika Gemini tidak tersedia.
    Frontend menampilkan ini daripada error kosong.
    """
    base = (
        "✨ Analisis SmartSpend AI sedang dalam maintenance atau memerlukan lebih banyak waktu. "
        "Gunakan rekomendasi Data Science dan prediksi AI di atas sebagai panduan keuanganmu."
    )
    if reason:
        logger.info("SmartSpend AI fallback reason: %s", reason)
    return base
