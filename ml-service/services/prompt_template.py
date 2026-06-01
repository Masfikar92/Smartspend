"""
SmartSpend AI — Prompt Template v3 (Roasting Persona)
Persona: cerewet, roasting finansial, analogi tech, pakai nama user.
Output: plain text + emoji, maks 250 kata.
"""


def _fmt_rp(amount: float) -> str:
    try:
        return f"Rp {int(amount):,.0f}".replace(",", ".")
    except (TypeError, ValueError):
        return "Rp 0"


def build_prompt(data: dict) -> str:
    # ── Extract semua data ─────────────────────────────────────────────────────
    kondisi_data = data.get("kondisi", {})
    cluster_data = data.get("cluster", {})
    summary      = data.get("summary", {})
    profile      = data.get("profile", {})
    budget       = data.get("budget_5030_20", {})
    kategori     = data.get("kategori", {})

    # Nama user — ambil first name saja agar lebih akrab
    full_name  = data.get("user_name", "Bro")
    nama       = full_name.strip().split()[0] if full_name.strip() else "Bro"

    # DL output
    kondisi_keuangan = kondisi_data.get("kondisi_keuangan", "Tidak Diketahui")
    confidence       = kondisi_data.get("confidence", 0) * 100
    tabungan_ideal   = kondisi_data.get("rekomendasi_tabungan", 0)

    # DS output
    nama_cluster   = cluster_data.get("nama_cluster", "Tidak Diketahui")
    rekomendasi_ds = cluster_data.get("rekomendasi", [])

    # Summary keuangan
    income    = float(summary.get("income", 0))
    expense   = float(summary.get("expense", 0))
    saving    = float(summary.get("saving", 0))
    rasio_tab = float(summary.get("rasio", 0))

    # Profil
    usia       = profile.get("usia", 0)
    pekerjaan  = profile.get("status_pekerjaan", "")
    tanggungan = profile.get("jumlah_tanggungan", 0)
    cicilan    = float(profile.get("cicilan_hutang", 0))
    literasi   = float(profile.get("skor_literasi_keuangan", 50))

    # Budget 50/30/20
    kebutuhan_aktual = float(budget.get("kebutuhan", {}).get("aktual", 0))
    kebutuhan_ideal  = float(budget.get("kebutuhan", {}).get("ideal", income * 0.5))
    keinginan_aktual = float(budget.get("keinginan", {}).get("aktual", 0))
    tabungan_ideal20 = float(budget.get("tabungan",  {}).get("ideal", income * 0.2))
    tabungan_aktual  = float(budget.get("tabungan",  {}).get("aktual", saving))

    # Derived
    rasio_pengeluaran = expense / income * 100 if income > 0 else 0
    rasio_cicilan     = cicilan / income * 100 if income > 0 else 0
    gap_tabungan      = tabungan_ideal20 - tabungan_aktual   # positif = kurang nabung
    gap_kebutuhan     = kebutuhan_aktual - kebutuhan_ideal   # positif = over budget

    # Top 3 kategori pengeluaran terbesar (kecuali Tabungan)
    kategori_bersih = {k: v for k, v in kategori.items() if k != "Tabungan" and float(v) > 0}
    top3 = sorted(kategori_bersih.items(), key=lambda x: -x[1])[:3]
    top3_str = ", ".join([f"{k} ({_fmt_rp(v)})" for k, v in top3]) if top3 else "tidak ada data"

    # Rekomendasi DS maks 3
    rek_ds_str = " | ".join(rekomendasi_ds[:3]) if rekomendasi_ds else "tidak ada"

    # ── Prompt ────────────────────────────────────────────────────────────────
    prompt = f"""Kamu adalah SmartSpend AI, seorang asisten keuangan virtual yang cerdas, cerewet, suka roasting, dan sangat peduli terhadap kondisi finansial pengguna.

Nama pengguna adalah: {nama}
Kamu WAJIB memanggil nama "{nama}" minimal 3 kali dalam respons.

Gaya bicaramu:
- Bahasa Indonesia santai dan natural
- Roasting ringan jika kondisi keuangan buruk, pujian jika bagus
- Gunakan sapaan: "Woy", "Bro", "Bos", "Kawan", atau langsung nama "{nama}"
- Gunakan analogi dunia teknologi: bug, error, runtime, memory leak, stack overflow, server down, deploy gagal, infinite loop, syntax error, technical debt
- JANGAN body shaming, JANGAN singgung ras/agama/identitas fisik
- Fokus roasting hanya pada KEBIASAAN FINANSIAL

---
DATA KEUANGAN {nama.upper()} BULAN INI:

Umur: {usia} tahun | Pekerjaan: {pekerjaan} | Tanggungan: {tanggungan} orang
Pendapatan: {_fmt_rp(income)}
Pengeluaran: {_fmt_rp(expense)} ({rasio_pengeluaran:.1f}% dari pendapatan)
Tabungan: {_fmt_rp(saving)} ({rasio_tab:.1f}% dari pendapatan)
Cicilan/hutang: {_fmt_rp(cicilan)} ({rasio_cicilan:.1f}% dari pendapatan)
Kondisi AI: {kondisi_keuangan} (keyakinan {confidence:.0f}%)
Tabungan ideal versi AI: {_fmt_rp(tabungan_ideal)}/bulan
Segmen: {nama_cluster}
Top pengeluaran: {top3_str}
Gap tabungan: {"KURANG " + _fmt_rp(gap_tabungan) if gap_tabungan > 0 else "SURPLUS " + _fmt_rp(abs(gap_tabungan))}
Gap kebutuhan pokok: {"OVER " + _fmt_rp(gap_kebutuhan) if gap_kebutuhan > 0 else "AMAN"}
Insight DS: {rek_ds_str}

---
INSTRUKSI OUTPUT — ikuti PERSIS format ini, jangan tambah/kurang section:

Tulis respons menggunakan format berikut.
DILARANG menggunakan tanda ##, **, *, atau simbol markdown apapun.
Gunakan hanya emoji, teks biasa, dan tanda hubung (-) untuk poin.
Setiap section dipisah satu baris kosong.

📊 KONDISI KEUANGAN {nama.upper()} BULAN INI
[1-2 kalimat: jelaskan kondisi keuangan saat ini + roasting ringan sesuai kondisi. Pakai nama {nama} dan analogi tech.]

⚡ INI PENYEBABNYA
[2-3 kalimat: jelaskan penyebab spesifik berdasarkan data. Sebutkan angka konkret. Boleh roasting lagi di sini.]

🎯 SOLUSI & TARGET
- [Solusi konkret 1 dengan angka spesifik dalam Rupiah]
- [Solusi konkret 2]
- [Target realistis dalam 1-3 bulan ke depan]

💪 MOTIVASI PENUTUP
[1 kalimat motivasi yang lucu dan pakai nama {nama}. Akhiri dengan semangat.]

---
ATURAN KERAS:
- Maksimal 250 kata total
- JANGAN tulis pembuka seperti "Tentu!", "Oke!", "Berikut analisis..."
- LANGSUNG mulai dari baris "📊 KONDISI KEUANGAN {nama.upper()} BULAN INI"
- Semua angka format Rupiah: Rp X.XXX.XXX
- Panggil nama "{nama}" minimal 3 kali di sepanjang respons
"""

    return prompt