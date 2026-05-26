import sys
import json
import numpy as np
import joblib
import tensorflow as tf
from tensorflow import keras

class FinancialAttentionLayer(keras.layers.Layer):
    def __init__(self, units=64, **kwargs):
        super().__init__(**kwargs)
        self.units = units

    def build(self, input_shape):
        self.W_attention = self.add_weight(
            name="W_attention",
            shape=(input_shape[-1], self.units),
            initializer="glorot_uniform", trainable=True)
        self.b_attention = self.add_weight(
            name="b_attention",
            shape=(self.units,),
            initializer="zeros", trainable=True)
        self.W_out = self.add_weight(
            name="W_out",
            shape=(self.units, input_shape[-1]),
            initializer="glorot_uniform", trainable=True)
        super().build(input_shape)

    def call(self, inputs):
        score = tf.nn.tanh(tf.matmul(inputs, self.W_attention) + self.b_attention)
        score = tf.matmul(score, self.W_out)
        attention_weights = tf.nn.softmax(score, axis=-1)
        return inputs * attention_weights

    def get_config(self):
        config = super().get_config()
        config.update({"units": self.units})
        return config

model         = keras.models.load_model(
    "smartspend_model_final.keras",
    custom_objects={"FinancialAttentionLayer": FinancialAttentionLayer}
)
scaler        = joblib.load("scaler.pkl")
le_dict       = joblib.load("label_encoders.pkl")
le_label      = joblib.load("label_encoder_target.pkl")
provinsi_freq = joblib.load("provinsi_freq.pkl")

with open("model_metadata.json") as f:
    metadata = json.load(f)

FEATURE_COLS = metadata["input_features"]

def preprocess(user_data):
    import pandas as pd
    df = pd.DataFrame([user_data])

    df["provinsi_freq"] = df.get("provinsi", pd.Series(["DKI Jakarta"])).map(
        lambda x: provinsi_freq.get(x, 0.01))

    cat_cols = ["klasifikasi_wilayah", "jenis_kelamin", "pendidikan_terakhir",
                "status_pekerjaan", "status_pernikahan"]
    for col in cat_cols:
        le  = le_dict[col]
        val = df[col].iloc[0] if col in df.columns else le.classes_[0]
        df[col] = le.transform([val])[0] if val in le.classes_ else 0

    for col in FEATURE_COLS:
        if col not in df.columns:
            df[col] = 0

    X = df[FEATURE_COLS].values.astype(np.float32)
    X = np.nan_to_num(X, nan=0.0)
    return scaler.transform(X)

def predict(user_data):
    X = preprocess(user_data)
    clf_probs, reg_log = model.predict(X, verbose=0)

    class_idx  = int(np.argmax(clf_probs[0]))
    class_name = le_label.inverse_transform([class_idx])[0]
    confidence = float(clf_probs[0][class_idx])
    all_probs  = {
        label: round(float(prob), 4)
        for label, prob in zip(le_label.classes_, clf_probs[0])
    }
    tabungan_ideal = max(int(np.expm1(reg_log[0][0])), 0)

    pesan_map = {
        "Keuangan Sehat"  : "Keuangan Anda sangat baik! Pertahankan dan tingkatkan investasi.",
        "Cukup Baik"      : "Keuangan Anda cukup baik. Tingkatkan tabungan untuk keamanan lebih.",
        "Perlu Perbaikan" : "Keuangan perlu perhatian. Kurangi pengeluaran tidak perlu."
    }

    return {
        "kondisi_keuangan"    : class_name,
        "confidence"          : round(confidence, 4),
        "probabilities"       : all_probs,
        "rekomendasi_tabungan": tabungan_ideal,
        "pesan"               : pesan_map.get(class_name, "")
    }

if __name__ == "__main__":
    user_input = json.loads(sys.argv[1])
    result     = predict(user_input)
    print(json.dumps(result, ensure_ascii=False))