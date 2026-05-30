from fastapi import FastAPI, HTTPException

from app.schemas import (
    PredictionInput,
    PredictionResponse,
    AnalyzeResponse
)
from app.predictor import predict_financial_status
from app.gemini_service import generate_selva_ray_response

app = FastAPI(
    title="SmartSpend AI API",
    description="Prediksi kondisi finansial dan estimasi tabungan dengan komentar Selva Ray",
    version="2.0.0"
)


# ─────────────────────────────────────────────
# GET /
# Info dasar API
# ─────────────────────────────────────────────
@app.get("/")
def home():
    return {
        "message": "SmartSpend API Running",
        "endpoints": {
            "predict" : "POST /predict  → hasil model DL saja",
            "analyze" : "POST /analyze  → hasil model DL + komentar Selva Ray",
            "health"  : "GET  /health   → cek status server",
            "docs"    : "GET  /docs     → Swagger UI"
        }
    }


# ─────────────────────────────────────────────
# POST /predict
# Hanya mengembalikan hasil model DL
# ─────────────────────────────────────────────
@app.post("/predict", response_model=PredictionResponse)
def predict(data: PredictionInput):
    """
    Prediksi status finansial dan estimasi tabungan
    menggunakan model Deep Learning SmartSpend.
    """
    result = predict_financial_status(data)

    if result["financial_status"] == "Error":
        raise HTTPException(
            status_code=500,
            detail="Prediksi model gagal. Cek log server untuk detail."
        )

    return result


# ─────────────────────────────────────────────
# POST /analyze
# Mengembalikan hasil model DL + komentar Selva Ray
# ─────────────────────────────────────────────
@app.post("/analyze", response_model=AnalyzeResponse)
def analyze(data: PredictionInput):
    """
    Prediksi status finansial + generate komentar Selva Ray
    menggunakan model Deep Learning SmartSpend + Gemini AI.
    """
    # Step 1: Jalankan model Deep Learning
    result = predict_financial_status(data)

    if result["financial_status"] == "Error":
        raise HTTPException(
            status_code=500,
            detail="Prediksi model gagal. Cek log server untuk detail."
        )

    # Step 2: Generate komentar Selva Ray via Gemini
    selva_ray_comment = generate_selva_ray_response(
        pendapatan_bulanan  = data.pendapatan_bulanan,
        total_pengeluaran   = data.total_pengeluaran,
        cicilan_hutang      = data.cicilan_hutang,
        financial_status    = result["financial_status"],
        predicted_savings   = result["predicted_savings"]
    )

    # Step 3: Return semua hasil
    return {
        "financial_status"  : result["financial_status"],
        "predicted_savings" : result["predicted_savings"],
        "selva_ray_comment" : selva_ray_comment
    }


# ─────────────────────────────────────────────
# GET /health
# Cek apakah server berjalan normal
# ─────────────────────────────────────────────
@app.get("/health")
def health_check():
    return {"status": "healthy"}