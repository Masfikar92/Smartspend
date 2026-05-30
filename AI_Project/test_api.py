"""
Script untuk test API SmartSpend secara lokal.
Jalankan setelah API sudah running:
    python -m uvicorn app.main:app --port 8001
"""

import requests
import json

BASE_URL = "http://127.0.0.1:8001"


def test_health():
    print("=== Health Check ===")
    res = requests.get(f"{BASE_URL}/health")
    print(res.json())
    print()


def test_predict(pendapatan, pengeluaran, cicilan):
    print(f"=== Prediksi ===")
    print(f"Pendapatan : Rp {pendapatan:,}")
    print(f"Pengeluaran: Rp {pengeluaran:,}")
    print(f"Cicilan    : Rp {cicilan:,}")

    payload = {
        "pendapatan_bulanan": pendapatan,
        "total_pengeluaran": pengeluaran,
        "cicilan_hutang": cicilan
    }

    res = requests.post(
        f"{BASE_URL}/predict",
        json=payload
    )

    result = res.json()
    print(f"\nStatus Finansial : {result['financial_status']}")
    print(f"Estimasi Tabungan: Rp {result['predicted_savings']:,.0f}")
    print()


if __name__ == "__main__":
    test_health()

    # Contoh test cases
    test_predict(8_000_000, 5_000_000, 1_000_000)
    test_predict(5_000_000, 4_800_000, 500_000)
    test_predict(15_000_000, 6_000_000, 2_000_000)
