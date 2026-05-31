import os
import numpy as np
import pandas as pd
import joblib
import tensorflow as tf
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
from services.gemini_service import generate_ai_analysis  # SmartSpend AI (GenAI)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
AI_DIR   = os.path.join(BASE_DIR, "models", "ai")
DS_DIR   = os.path.join(BASE_DIR, "models", "ds")

ai_model       = tf.keras.models.load_model(os.path.join(AI_DIR, "smartspend_best.keras"))
feature_scaler = joblib.load(os.path.join(AI_DIR, "feature_scaler.pkl"))
target_scaler  = joblib.load(os.path.join(AI_DIR, "target_scaler.pkl"))
label_encoder  = joblib.load(os.path.join(AI_DIR, "label_encoder.pkl"))
ds_kmeans      = joblib.load(os.path.join(DS_DIR, "kmeans_model.pkl"))
ds_scaler      = joblib.load(os.path.join(DS_DIR, "scaler.pkl"))

app = FastAPI(title="SmartSpend ML Service")
app.add_middleware(CORSMiddleware, allow_origins=["https://smartspend-production-c4da.up.railway.app"], allow_methods=["POST", "GET"], allow_headers=["*"])

class AIInput(BaseModel):
    provinsi              : Optional[str]   = "DKI Jakarta"
    klasifikasi_wilayah   : Optional[str]   = "Perkotaan"
    jenis_kelamin         : Optional[str]   = "Laki-laki"
    usia                  : Optional[float] = 25
    pendidikan_terakhir   : Optional[str]   = "SMA"
    status_pekerjaan      : Optional[str]   = "Karyawan Swasta"
    status_pernikahan     : Optional[str]   = "Belum Menikah"
    jumlah_tanggungan     : Optional[float] = 0
    skor_literasi_keuangan: Optional[float] = 50
    cicilan_hutang        : Optional[float] = 0
    pendapatan_bulanan           : float
    total_pengeluaran            : float
    tabungan_bulanan             : float
    rasio_tabungan_persen        : float
    pengeluaran_makanan_pokok    : Optional[float] = 0
    pengeluaran_lauk_pauk        : Optional[float] = 0
    pengeluaran_sayur_buah       : Optional[float] = 0
    pengeluaran_jajan_makan_luar : Optional[float] = 0
    pengeluaran_rokok_tembakau   : Optional[float] = 0
    pengeluaran_transportasi     : Optional[float] = 0
    pengeluaran_perumahan_listrik: Optional[float] = 0
    pengeluaran_kesehatan        : Optional[float] = 0
    pengeluaran_pendidikan       : Optional[float] = 0
    pengeluaran_pakaian          : Optional[float] = 0
    pengeluaran_hiburan_rekreasi : Optional[float] = 0
    cicilan_hutang_bulanan       : Optional[float] = 0

class DSInput(BaseModel):
    pendapatan_bulanan           : float
    total_pengeluaran            : float
    tabungan_bulanan             : float
    rasio_tabungan_persen        : float
    skor_literasi_keuangan       : Optional[float] = 50
    cicilan_hutang               : Optional[float] = 0
    pengeluaran_perumahan_listrik: Optional[float] = 0
    pengeluaran_makanan_pokok    : Optional[float] = 0
    pengeluaran_transportasi     : Optional[float] = 0
    pengeluaran_pendidikan       : Optional[float] = 0
    pengeluaran_kesehatan        : Optional[float] = 0
    pengeluaran_hiburan_rekreasi : Optional[float] = 0
    pengeluaran_jajan_makan_luar : Optional[float] = 0

# NEW: SmartSpend AI Input
class SmartSpendAIInput(BaseModel):
    """
    Gabungan output ML models + data keuangan + profil user
    untuk dikirim ke Gemini dan menghasilkan analisis personal.
    """
    user_id: Optional[str] = "anonymous"
    kondisi: dict
    cluster: dict
    summary: dict
    profile: dict
    budget_5030_20: dict
    kategori: Optional[dict] = {}

def preprocess_ai(data: dict) -> np.ndarray:
    df = pd.DataFrame([data])
    df['sisa_pendapatan']   = df['pendapatan_bulanan'] - df['total_pengeluaran']
    df['estimasi_tabungan'] = df['pendapatan_bulanan'] - df['total_pengeluaran'] - df.get('cicilan_hutang', pd.Series([0]))
    df.replace([np.inf, -np.inf], np.nan, inplace=True)
    df.fillna(0, inplace=True)
    cat_cols = ['provinsi', 'klasifikasi_wilayah', 'jenis_kelamin', 'pendidikan_terakhir', 'status_pekerjaan', 'status_pernikahan']
    df = pd.get_dummies(df, columns=cat_cols, drop_first=True)
    expected_cols = feature_scaler.feature_names_in_
    for col in expected_cols:
        if col not in df.columns:
            df[col] = 0
    df = df[expected_cols]
    X = df.values.astype(np.float32)
    X = np.nan_to_num(X, nan=0.0)
    return feature_scaler.transform(X)

def generate_rekomendasi(row: dict) -> list:
    rekomendasi = []
    pendapatan = row.get('pendapatan_bulanan', 0)
    if pendapatan == 0:
        return ["Data pendapatan tidak tersedia."]
    pengeluaran    = row.get('total_pengeluaran', 0)
    tabungan       = row.get('tabungan_bulanan', 0)
    rasio_tabungan = row.get('rasio_tabungan_persen', 0)
    literasi       = row.get('skor_literasi_keuangan', 0)
    cicilan        = row.get('cicilan_hutang', 0)
    jajan          = row.get('pengeluaran_jajan_makan_luar', 0)
    hiburan        = row.get('pengeluaran_hiburan_rekreasi', 0)
    transportasi   = row.get('pengeluaran_transportasi', 0)
    target_min     = pendapatan * 0.10
    target_ideal   = pendapatan * 0.20

    if rasio_tabungan >= 25:
        rekomendasi.append(f"TABUNGAN SUDAH SANGAT BAIK — Rasio tabungan {rasio_tabungan:.1f}% (>25%). Anda menabung Rp {tabungan:,.0f}/bulan. Pertahankan dan mulai alokasikan sebagian ke investasi.")
    elif rasio_tabungan >= 10:
        kekurangan = target_ideal - tabungan
        rekomendasi.append(f"TINGKATKAN TABUNGAN — Rasio {rasio_tabungan:.1f}% sudah cukup, namun idealnya 20%. Tambah Rp {kekurangan:,.0f}/bulan untuk mencapai target Rp {target_ideal:,.0f}/bulan.")
    else:
        rekomendasi.append(f"TABUNGAN KRITIS — Rasio hanya {rasio_tabungan:.1f}% (di bawah 10%). Segera sisihkan minimal Rp {target_min:,.0f}/bulan (10% dari pendapatan).")

    rasio_pengeluaran = pengeluaran / pendapatan * 100
    if rasio_pengeluaran > 90:
        rekomendasi.append(f"PENGELUARAN TERLALU TINGGI — {rasio_pengeluaran:.1f}% dari pendapatan habis untuk pengeluaran. Kurangi pengeluaran tidak perlu segera.")
    elif rasio_pengeluaran > 75:
        rekomendasi.append(f"PENGELUARAN PERLU DIPERHATIKAN — {rasio_pengeluaran:.1f}% dari pendapatan untuk pengeluaran. Usahakan maksimal 75%.")

    if jajan > 0:
        pct = jajan / pendapatan * 100
        if pct > 15:
            rekomendasi.append(f"KURANGI MAKAN LUAR — {pct:.1f}% pendapatan (Rp {jajan:,.0f}) untuk jajan. Targetkan maksimal 10% (Rp {pendapatan*0.1:,.0f}).")
        elif pct > 10:
            rekomendasi.append(f"MAKAN LUAR PERLU DIKONTROL — {pct:.1f}% pendapatan untuk jajan. Coba meal-prep mingguan.")

    if hiburan > 0:
        pct = hiburan / pendapatan * 100
        if pct > 10:
            rekomendasi.append(f"KURANGI HIBURAN — {pct:.1f}% pendapatan (Rp {hiburan:,.0f}) untuk hiburan. Targetkan maksimal 5% (Rp {pendapatan*0.05:,.0f}).")

    if cicilan > 0:
        pct = cicilan / pendapatan * 100
        if pct > 35:
            rekomendasi.append(f"BEBAN HUTANG SANGAT TINGGI — Cicilan {pct:.1f}% pendapatan (Rp {cicilan:,.0f}). Pertimbangkan konsolidasi hutang.")
        elif pct > 20:
            rekomendasi.append(f"CICILAN PERLU DIPANTAU — {pct:.1f}% pendapatan untuk cicilan. Hindari hutang baru.")
        else:
            rekomendasi.append(f"CICILAN TERKENDALI — {pct:.1f}% pendapatan (Rp {cicilan:,.0f}), masih dalam batas aman (<30%).")

    if transportasi > 0:
        pct = transportasi / pendapatan * 100
        if pct > 20:
            rekomendasi.append(f"TRANSPORTASI TERLALU BESAR — {pct:.1f}% pendapatan (Rp {transportasi:,.0f}). Pertimbangkan transportasi umum.")

    if literasi < 30:
        rekomendasi.append(f"TINGKATKAN LITERASI KEUANGAN — Skor {literasi:.0f}/100 (rendah). Mulai dari buku atau podcast keuangan dasar.")
    elif literasi < 55:
        rekomendasi.append(f"KEMBANGKAN LITERASI KEUANGAN — Skor {literasi:.0f}/100 (sedang). Pelajari reksa dana pasar uang sebagai langkah awal investasi.")
    elif literasi >= 75:
        rekomendasi.append(f"LITERASI KEUANGAN TINGGI — Skor {literasi:.0f}/100. Diversifikasikan portofolio sesuai profil risiko.")

    if rasio_tabungan < 15:
        rekomendasi.append(f"BANGUN DANA DARURAT — Targetkan 3-6 bulan pengeluaran (Rp {pengeluaran*3:,.0f} - Rp {pengeluaran*6:,.0f}). Simpan di rekening terpisah.")

    return rekomendasi

@app.get("/health")
def health():
    return {"status": "ok", "models": ["ai", "ds"]}

@app.post("/predict/kondisi")
def predict_kondisi(data: AIInput):
    try:
        X = preprocess_ai(data.model_dump())
        clf_probs, reg_scaled = ai_model.predict(X, verbose=0)
        class_idx  = int(np.argmax(clf_probs[0]))
        class_name = label_encoder.inverse_transform([class_idx])[0]
        confidence = float(clf_probs[0][class_idx])
        all_probs  = {label: round(float(prob), 4) for label, prob in zip(label_encoder.classes_, clf_probs[0])}
        tabungan_ideal = max(int(target_scaler.inverse_transform(reg_scaled)[0][0]), 0)
        pesan_map = {
            "Keuangan Sehat"  : "Keuangan Anda sangat baik! Pertahankan dan tingkatkan investasi.",
            "Cukup Baik"      : "Keuangan Anda cukup baik. Tingkatkan tabungan untuk keamanan lebih.",
            "Perlu Perbaikan" : "Keuangan perlu perhatian. Kurangi pengeluaran tidak perlu.",
        }
        return {"kondisi_keuangan": class_name, "confidence": round(confidence, 4), "probabilities": all_probs, "rekomendasi_tabungan": tabungan_ideal, "pesan": pesan_map.get(class_name, "")}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/predict/cluster")
def predict_cluster(data: DSInput):
    try:
        features = np.array([[data.pendapatan_bulanan, data.total_pengeluaran, data.tabungan_bulanan, data.rasio_tabungan_persen, data.skor_literasi_keuangan, data.cicilan_hutang, data.pengeluaran_perumahan_listrik, data.pengeluaran_makanan_pokok, data.pengeluaran_transportasi, data.pengeluaran_pendidikan, data.pengeluaran_kesehatan, data.pengeluaran_hiburan_rekreasi, data.pengeluaran_jajan_makan_luar]])
        scaled     = ds_scaler.transform(features)
        cluster_id = int(ds_kmeans.predict(scaled)[0])
        nama_cluster = {0: "Pengelola Menengah", 1: "Pengelola Hemat", 2: "Pengelola Mapan"}
        rekomendasi = generate_rekomendasi(data.model_dump())
        return {"cluster_id": cluster_id, "nama_cluster": nama_cluster.get(cluster_id, f"Cluster {cluster_id}"), "rekomendasi": rekomendasi}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# NEW: SmartSpend AI Endpoint
@app.post("/analyze/smartspend-ai")
async def analyze_smartspend_ai(data: SmartSpendAIInput):
    """
    Endpoint baru: terima combined data (kondisi + cluster + summary + profile)
    → kirim ke Gemini 1.5 Flash → kembalikan analisis personal dalam Bahasa Indonesia.
    
    Dipanggil oleh backend Node.js sebagai parallel call ke-3 di Promise.all.
    Response: { "saran_ai": "...teks analisis personal..." }
    """
    try:
        logger.info(
            "SmartSpend AI request: user=%s, kondisi=%s, cluster=%s",
            data.user_id,
            data.kondisi.get("kondisi_keuangan", "?"),
            data.cluster.get("nama_cluster", "?")
        )

        saran_ai = await generate_ai_analysis(
            data={
                "kondisi"       : data.kondisi,
                "cluster"       : data.cluster,
                "summary"       : data.summary,
                "profile"       : data.profile,
                "budget_5030_20": data.budget_5030_20,
                "kategori"      : data.kategori or {},
            },
            user_id=data.user_id
        )

        return {"saran_ai": saran_ai}

    except Exception as e:
        logger.error("analyze_smartspend_ai error: %s", e)
        return {
            "saran_ai": (
                "✨ Analisis SmartSpend AI tidak tersedia saat ini. "
                "Gunakan rekomendasi di atas sebagai panduan keuanganmu."
            )
        }
