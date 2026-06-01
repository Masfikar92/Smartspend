"""
SmartSpend AI — Gemini Service Layer (v3 — No Rate Limit)
Perubahan dari v2:
  - Rate limiting DIHAPUS sepenuhnya
  - MAX_TOKENS naik ke 2048 (lebih dari cukup untuk 250 kata)
  - TIMEOUT_SECS 40 detik
  - Safety settings tetap OFF untuk konten keuangan
"""

import os
import asyncio
import logging

import google.generativeai as genai
from .prompt_template import build_prompt

logger = logging.getLogger("smartspend.gemini")

# ─── Gemini Init ──────────────────────────────────────────────────────────────
GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY", "")

if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)
    logger.info("Gemini API configured.")
else:
    logger.warning("GEMINI_API_KEY tidak diset — SmartSpend AI akan return fallback.")

# ─── Config ───────────────────────────────────────────────────────────────────
MODEL_NAME   = "gemini-3.5-flash"
MAX_TOKENS   = int(os.environ.get("GEMINI_MAX_TOKENS", "2048"))   # ~250 kata = ~600 token, 2048 lebih dari cukup
TEMPERATURE  = float(os.environ.get("GEMINI_TEMPERATURE", "0.9")) # Lebih tinggi → lebih kreatif & lucu
TIMEOUT_SECS = int(os.environ.get("GEMINI_TIMEOUT", "40"))
MAX_RETRIES  = 1


# ─── Main Entry Point ─────────────────────────────────────────────────────────
async def generate_ai_analysis(data: dict, user_id: str = "anonymous") -> str:
    """
    Panggil Gemini dan return analisis keuangan roasting-style.
    Tidak ada rate limiting — setiap request langsung diproses.
    """
    if not GEMINI_API_KEY:
        logger.error("GEMINI_API_KEY belum dikonfigurasi.")
        return _fallback_message()

    try:
        prompt = build_prompt(data)
        logger.debug("Prompt built (%d chars) untuk user=%s", len(prompt), user_id)
    except Exception as e:
        logger.error("Gagal build prompt: %s", e, exc_info=True)
        return _fallback_message()

    for attempt in range(1, MAX_RETRIES + 2):
        try:
            result = await _call_gemini(prompt)
            logger.info("Gemini OK — user=%s attempt=%d len=%d chars", user_id, attempt, len(result))
            return result
        except asyncio.TimeoutError:
            logger.warning("Gemini timeout — user=%s attempt=%d", user_id, attempt)
            if attempt > MAX_RETRIES:
                return _fallback_message()
        except Exception as e:
            logger.error("Gemini error — user=%s attempt=%d: %s", user_id, attempt, str(e))
            if attempt > MAX_RETRIES:
                return _fallback_message()
        await asyncio.sleep(1)

    return _fallback_message()


async def _call_gemini(prompt: str) -> str:
    """Async wrapper untuk Gemini SDK (sync) dengan timeout."""
    safety_settings = [
        {"category": "HARM_CATEGORY_HARASSMENT",        "threshold": "BLOCK_NONE"},
        {"category": "HARM_CATEGORY_HATE_SPEECH",       "threshold": "BLOCK_NONE"},
        {"category": "HARM_CATEGORY_SEXUALLY_EXPLICIT", "threshold": "BLOCK_NONE"},
        {"category": "HARM_CATEGORY_DANGEROUS_CONTENT", "threshold": "BLOCK_NONE"},
    ]

    model = genai.GenerativeModel(
        model_name=MODEL_NAME,
        generation_config=genai.GenerationConfig(
            max_output_tokens=MAX_TOKENS,
            temperature=TEMPERATURE,
        ),
        safety_settings=safety_settings,
    )

    loop = asyncio.get_event_loop()
    response = await asyncio.wait_for(
        loop.run_in_executor(None, lambda: model.generate_content(prompt)),
        timeout=TIMEOUT_SECS,
    )

    if not response or not response.text:
        raise ValueError("Gemini response kosong.")

    return response.text.strip()


def _fallback_message() -> str:
    return (
        "⚠️ SMARTSPEND AI SEDANG OFFLINE\n\n"
        "Kayaknya server AI-nya lagi deploy ulang nih. "
        "Gunakan rekomendasi budgeting di atas dulu ya sebagai panduan keuanganmu."
    )