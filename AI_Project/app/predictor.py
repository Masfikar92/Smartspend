import pandas as pd
import numpy as np

from app.model_loader import (
    model,
    feature_scaler,
    target_scaler,
    label_encoder
)


def predict_financial_status(data):
    """
    Memprediksi status finansial dan estimasi tabungan
    berdasarkan input pengguna.
    """
    try:
        # Raw input
        sample = pd.DataFrame([{
            "pendapatan_bulanan": data.pendapatan_bulanan,
            "total_pengeluaran" : data.total_pengeluaran,
            "cicilan_hutang"    : data.cicilan_hutang
        }])

        # Derived features
        sample["sisa_pendapatan"] = (
            sample["pendapatan_bulanan"]
            - sample["total_pengeluaran"]
        )

        sample["estimasi_tabungan"] = (
            sample["pendapatan_bulanan"]
            - sample["total_pengeluaran"]
            - sample["cicilan_hutang"]
        )

        # Replace NaN / Inf
        sample.replace([np.inf, -np.inf], np.nan, inplace=True)
        sample.fillna(0, inplace=True)

        # One hot encoding
        sample_encoded = pd.get_dummies(sample)

        # Align columns dengan training set
        sample_aligned = (
            sample_encoded
            .reindex(
                columns=feature_scaler.feature_names_in_,
                fill_value=0
            )
            .astype(float)
        )

        # Scaling
        sample_scaled = feature_scaler.transform(sample_aligned)

        # Prediction
        clf_probs, reg_scaled = model.predict(
            sample_scaled,
            verbose=0
        )

        # Classification
        predicted_class = np.argmax(clf_probs, axis=1)
        predicted_label = label_encoder.inverse_transform(
            predicted_class
        )[0]

        # Regression
        predicted_savings = (
            target_scaler
            .inverse_transform(reg_scaled)[0][0]
        )

        return {
            "financial_status" : predicted_label,
            "predicted_savings": float(predicted_savings)
        }

    except Exception as e:
        print(f"[ERROR] Prediction failed: {e}")
        return {
            "financial_status" : "Error",
            "predicted_savings": 0.0
        }