from pydantic import BaseModel


# ─────────────────────────────────────────────
# Input: data keuangan user
# ─────────────────────────────────────────────
class PredictionInput(BaseModel):
    pendapatan_bulanan: float
    total_pengeluaran: float
    cicilan_hutang: float


# ─────────────────────────────────────────────
# Response: hasil prediksi model DL saja
# Dipakai oleh endpoint POST /predict
# ─────────────────────────────────────────────
class PredictionResponse(BaseModel):
    financial_status: str
    predicted_savings: float


# ─────────────────────────────────────────────
# Response: hasil prediksi + komentar Selva Ray
# Dipakai oleh endpoint POST /analyze
# ─────────────────────────────────────────────
class AnalyzeResponse(BaseModel):
    financial_status: str
    predicted_savings: float
    selva_ray_comment: str