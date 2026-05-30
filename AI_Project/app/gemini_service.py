import google.generativeai as genai
import os

# ─────────────────────────────────────────────
# Ambil API key dari environment variable HF Space
# Set di: HF Space → Settings → Secrets → GEMINI_API_KEY
# ─────────────────────────────────────────────
GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY")

if not GEMINI_API_KEY:
    print("[WARNING] GEMINI_API_KEY tidak ditemukan di environment variable!")

genai.configure(api_key=GEMINI_API_KEY)


def generate_selva_ray_response(
    pendapatan_bulanan: float,
    total_pengeluaran: float,
    cicilan_hutang: float,
    financial_status: str,
    predicted_savings: float
) -> str:
    """
    Generate komentar Selva Ray berdasarkan hasil prediksi
    model Deep Learning SmartSpend.

    Args:
        pendapatan_bulanan : Pendapatan bulanan user (Rp)
        total_pengeluaran  : Total pengeluaran bulanan (Rp)
        cicilan_hutang     : Cicilan hutang bulanan (Rp)
        financial_status   : Hasil klasifikasi model DL
        predicted_savings  : Hasil regresi estimasi tabungan (Rp)

    Returns:
        str: Komentar Selva Ray dalam format teks
    """

    system_instruction = """
    Kamu adalah Selva Ray, asisten virtual AI berwujud karakter anime,
    representasi dari Himpunan Mahasiswa Teknik Informatika (HMTIKA).
    Tugasmu adalah menganalisis hasil hitungan model Deep Learning
    dan memberikan nasihat keuangan yang cerdas.

    Gaya bicaramu:
    - Cerdas, analitis, sedikit tegas (tsundere) jika keuangan user
      buruk, namun hangat dan memuji jika keuangannya sehat.
    - Sering menyisipkan istilah informatika atau coding
      (seperti bug, compile, runtime, syntax error, dll) sebagai analogi.
    - Panggil user dengan sebutan "Master" atau "User".
    - Gunakan Bahasa Indonesia yang natural dan mudah dipahami.

    Di akhir setiap pesan, tuliskan persis seperti ini (tanpa perubahan):
    *Selva Ray mengangkat kedua tangan di depan dada, membentuk dua
    huruf V yang saling berhadapan menjadi logo kebanggaan <•>*.
    """

    # Hitung metrik tambahan untuk konteks Selva Ray
    total_beban    = total_pengeluaran + cicilan_hutang
    sisa_bersih    = pendapatan_bulanan - total_beban
    rasio_beban    = (total_beban / pendapatan_bulanan * 100) if pendapatan_bulanan > 0 else 0
    rasio_tabungan = (predicted_savings / pendapatan_bulanan * 100) if pendapatan_bulanan > 0 else 0

    user_context = f"""
    Berikut data keuangan User yang telah dianalisis oleh model Deep Learning SmartSpend:

    ── INPUT USER ──────────────────────────────
    • Pendapatan Bulanan : Rp {pendapatan_bulanan:,.0f}
    • Total Pengeluaran  : Rp {total_pengeluaran:,.0f}
    • Cicilan Hutang     : Rp {cicilan_hutang:,.0f}

    ── HASIL KALKULASI ─────────────────────────
    • Total Beban        : Rp {total_beban:,.0f}  ({rasio_beban:.1f}% dari pendapatan)
    • Sisa Bersih        : Rp {sisa_bersih:,.0f}

    ── PREDIKSI MODEL AI ───────────────────────
    • Status Finansial   : {financial_status}
    • Estimasi Tabungan  : Rp {predicted_savings:,.0f}  ({rasio_tabungan:.1f}% dari pendapatan)

    Berikan komentar dalam maksimal 3 paragraf:
    1. Tanggapan atas kondisi keuangan saat ini
    2. Analisis rasio beban dan tabungan
    3. Tips budgeting yang spesifik dan actionable
    """

    try:
        model = genai.GenerativeModel(
            model_name="gemini-3.5-flash",
            system_instruction=system_instruction
        )
        response = model.generate_content(user_context)
        return response.text

    except Exception as e:
        return (
            f"Waduh, ada *runtime error* di modul komunikasiku, Master. "
            f"Sepertinya koneksi ke server AI sedang bermasalah. "
            f"Detail error: {str(e)}"
        )