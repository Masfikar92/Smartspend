import tensorflow as tf
import joblib
import os

print("STEP 1: Loading model...")
model = tf.keras.models.load_model(
    "artifacts/smartspend_best.keras"
)

print("STEP 2: Loading feature_scaler...")
feature_scaler = joblib.load(
    "artifacts/feature_scaler.pkl"
)

print("STEP 3: Loading target_scaler...")
target_scaler = joblib.load(
    "artifacts/target_scaler.pkl"
)

print("STEP 4: Loading label_encoder...")
label_encoder = joblib.load(
    "artifacts/label_encoder.pkl"
)

print("✅ ALL ARTIFACTS LOADED")