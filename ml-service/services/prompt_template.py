from typing import Any


def _fmt_rp(amount: float) -> str:
    """Format angka ke Rupiah Indonesia. Contoh: 2500000 → Rp 2.500.000"""
    try:
        return f"Rp {int(amount):,.0f}".replace(",", ".")
    except (TypeError, ValueError):
        return "Rp 0"


def _pct(value: float, total: float, decimal: int = 1) -> str:
    """Hitung persentase safely."""
    if total <= 0:
        return "0%"
    return f"{(value / total * 100):.{decimal}f}%"


def build_prompt(data: dict) -> str:
    """
    Membangun prompt lengkap dari data gabungan:
      - data['kondisi']       → output DL model
      - data['cluster']       → output DS model
      - data['summary']       → ringkasan keuangan bulan ini
      - data['profile']       → profil user (usia, pekerjaan, dll.)
      - data['budget_5030_20'] → analisis 50/30/20
      - data['kategori']      → breakdown pengeluaran per kategori (optional)
    """

    # ── Extract data ──────────────────────────────────────────────────────────
    kondisi_data  = data.get("kondisi", {})
    cluster_data  = data.get("cluster", {})
    summary       = data.get("summary", {})
    profile       = data.get("profile", {})
    budget        = data.get("budget_5030_20", {})
    kategori      = data.get("kategori", {})   # optional detail per kategori

    # Kondisi DL
    kondisi_keuangan   = kondisi_data.get("kondisi_keuangan", "Tidak Diketahui")
    confidence         = kondisi_data.get("confidence", 0) * 100
    tabungan_ideal     = kondisi_data.get("rekomendasi_tabungan", 0)
    pesan_kondisi      = kondisi_data.get("pesan", "")

    # Cluster DS
    nama_cluster       = cluster_data.get("nama_cluster", "Tidak Diketahui")
    rekomendasi_ds     = cluster_data.get("rekomendasi", [])

    # Summary keuangan
    income    = float(summary.get("income", 0))
    expense   = float(summary.get("expense", 0))
    saving    = float(summary.get("saving", 0))
    rasio_tab = float(summary.get("rasio", 0))

    # Profil
    usia              = profile.get("usia", 0)
    pekerjaan         = profile.get("status_pekerjaan", "")
    pendidikan        = profile.get("pendidikan_terakhir", "")
    pernikahan        = profile.get("status_pernikahan", "")
    tanggungan        = profile.get("jumlah_tanggungan", 0)
    cicilan           = float(profile.get("cicilan_hutang", 0))
    literasi          = float(profile.get("skor_literasi_keuangan", 50))
    provinsi          = profile.get("provinsi", "")

    # Budget 50/30/20
    kebutuhan_ideal  = budget.get("kebutuhan", {}).get("ideal", income * 0.5)
    kebutuhan_aktual = budget.get("kebutuhan", {}).get("aktual", 0)
    keinginan_ideal  = budget.get("keinginan", {}).get("ideal", income * 0.3)
    keinginan_aktual = budget.get("keinginan", {}).get("aktual", 0)
    tabungan_ideal20 = budget.get("tabungan", {}).get("ideal", income * 0.2)
    tabungan_aktual  = budget.get("tabungan", {}).get("aktual", 0)

    # Derived
    rasio_cicilan    = cicilan / income * 100 if income > 0 else 0
    rasio_pengeluaran = expense / income * 100 if income > 0 else 0
    selisih_kebutuhan = kebutuhan_aktual - kebutuhan_ideal
    selisih_keinginan = keinginan_aktual - keinginan_ideal
    selisih_tabungan  = tabungan_aktual - tabungan_ideal20

    # Kategori top over-budget
    _kat_lines = []
    if kategori:
        for kat, amt in sorted(kategori.items(), key=lambda x: -x[1])[:5]:
            pct_val = amt / income * 100 if income > 0 else 0
            _kat_lines.append(f"    • {kat}: {_fmt_rp(amt)} ({pct_val:.1f}% pendapatan)")
    kat_section = "\n".join(_kat_lines) if _kat_lines else "    (data tidak tersedia)"

    # Rekomendasi DS (maks 5)
    rek_ds_lines = "\n".join([f"  • {r}" for r in rekomendasi_ds[:5]]) if rekomendasi_ds else "  (tidak ada)"

    # ── Build prompt ──────────────────────────────────────────────────────────
    prompt = f"""Kamu adalah SmartSpend AI, asisten keuangan personal cerdas yang peduli dan empati.

Tugasmu adalah menganalisis kondisi keuangan user dan memberikan saran yang:
- PERSONAL (sesuai profil dan kondisi spesifik user)
- ACTIONABLE (saran konkret yang bisa langsung dilakukan)
- EMPATIK (tidak menghakimi, tetap semangat)
- RINGKAS TAPI LENGKAP (tidak bertele-tele)
- BAHASA INDONESIA yang natural dan mudah dipahami

---
DATA KEUANGAN USER BULAN INI:

PROFIL USER:
  Usia: {usia} tahun | Pekerjaan: {pekerjaan} | Pendidikan: {pendidikan}
  Status: {pernikahan} | Tanggungan: {tanggungan} orang | Provinsi: {provinsi}
  Skor Literasi Keuangan: {literasi:.0f}/100
  Cicilan/Hutang: {_fmt_rp(cicilan)}/bulan ({rasio_cicilan:.1f}% pendapatan)

RINGKASAN KEUANGAN:
  Pendapatan    : {_fmt_rp(income)}
  Pengeluaran   : {_fmt_rp(expense)} ({rasio_pengeluaran:.1f}% pendapatan)
  Tabungan bersih: {_fmt_rp(saving)} ({rasio_tab:.1f}% pendapatan)

HASIL PREDIKSI AI (Deep Learning):
  Kondisi Keuangan : {kondisi_keuangan} (confidence: {confidence:.1f}%)
  Pesan model      : {pesan_kondisi}
  Tabungan ideal   : {_fmt_rp(tabungan_ideal)}/bulan (prediksi AI)

SEGMENTASI USER (KMeans Clustering):
  Segmen: {nama_cluster}

ANALISIS 50/30/20:
  Kebutuhan Pokok (ideal 50%={_fmt_rp(kebutuhan_ideal)}): aktual {_fmt_rp(kebutuhan_aktual)} → {"MELEBIHI Rp "+_fmt_rp(selisih_kebutuhan) if selisih_kebutuhan > 0 else "dalam batas ✓"}
  Keinginan (ideal 30%={_fmt_rp(keinginan_ideal)}): aktual {_fmt_rp(keinginan_aktual)} → {"MELEBIHI Rp "+_fmt_rp(selisih_keinginan) if selisih_keinginan > 0 else "dalam batas ✓"}
  Tabungan (ideal 20%={_fmt_rp(tabungan_ideal20)}): aktual {_fmt_rp(tabungan_aktual)} → {"KURANG Rp "+_fmt_rp(abs(selisih_tabungan)) if selisih_tabungan < 0 else "tercapai ✓"}

TOP PENGELUARAN:
{kat_section}

REKOMENDASI DATA SCIENCE:
{rek_ds_lines}

---
INSTRUKSI PENULISAN:

Tulis analisis dalam format berikut (gunakan section heading dengan emoji):

## 📊 Kondisi Keuanganmu Bulan Ini
(2–3 kalimat ringkasan personal berdasarkan kondisi dan confidence DL model)

## 💸 Analisis Pengeluaran
(Evaluasi rasio pengeluaran, kategori dominan, apakah ada yang perlu dikurangi)

## 🐷 Analisis Tabungan
(Bandingkan rasio tabungan aktual vs ideal, gap ke tabungan ideal AI)

## 📋 Analisis Hutang & Cicilan
(Evaluasi beban cicilan, apakah aman atau berbahaya, saran jika tinggi; skip bagian detail jika cicilan = 0)

## 🎯 Saran Prioritas Utama
(3–5 poin saran konkret dan actionable yang paling berdampak, sesuaikan dengan segmen {nama_cluster})

## ⚠️ Warning
(Jika ada kondisi kritis atau pengeluaran berlebih, beri peringatan jelas. Jika tidak ada, tulis "Tidak ada peringatan kritis bulan ini. Pertahankan pola ini!")

---
PENTING:
- Sapa user secara personal ("Keuanganmu", "kamu", bukan "user" atau "Anda")
- Jangan ulangi angka yang sama berulang kali
- Jika kondisi bagus, apresiasi dulu sebelum saran
- Jika kondisi buruk, tetap semangati dan berikan langkah konkret
- Total panjang: 250–400 kata
- JANGAN sertakan pembuka seperti "Tentu!" atau "Berikut analisisnya:"
- Langsung mulai dengan section pertama
"""

    return prompt
