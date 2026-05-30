---
title: SmartSpend AI API
emoji: 💰
colorFrom: blue
colorTo: green
sdk: docker
pinned: false
---

# SmartSpend AI API

REST API berbasis FastAPI untuk prediksi kondisi finansial dan estimasi tabungan menggunakan model Deep Learning TensorFlow.

---

## API Endpoint

### POST `/predict`

**Request Body:**

```json
{
  "pendapatan_bulanan": 8000000,
  "total_pengeluaran": 5000000,
  "cicilan_hutang": 1000000
}
```

**Response:**

```json
{
  "financial_status": "Stabil",
  "predicted_savings": 2000000.0
}
```

---

### GET `/health`

```json
{ "status": "healthy" }
```

---

## Swagger UI

```
https://reizu-smartspend-model.hf.space/docs
```

---

## Tech Stack

- Python 3.11
- FastAPI
- TensorFlow (CPU)
- Scikit-learn
- Pandas / NumPy
- Uvicorn
- Docker

---

## Team

SmartSpend Capstone Project
