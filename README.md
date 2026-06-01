# SmartSpend - AI-Powered Personal Finance Assistant

> **Capstone Project — Coding Camp**  
> Platform asisten keuangan pribadi berbasis kecerdasan buatan (AI) untuk membantu generasi muda Indonesia mengelola keuangan secara lebih cerdas, terstruktur, dan efisien.

---

## Daftar Isi

- [Tentang Proyek](#tentang-proyek)
- [Fitur Utama](#fitur-utama)
- [Arsitektur Sistem](#arsitektur-sistem)
- [Struktur Repositori](#struktur-repositori)
- [Tech Stack](#tech-stack)
- [Cara Menjalankan Proyek](#cara-menjalankan-proyek)
  - [Prasyarat](#prasyarat)
  - [1. Clone Repositori](#1-clone-repositori)
  - [2. Menjalankan Backend](#2-menjalankan-backend)
  - [3. Menjalankan Frontend](#3-menjalankan-frontend)
  - [4. Menjalankan Model AI](#4-menjalankan-model-ai)
- [Model AI & Data Science](#model-ai--data-science)
- [API Endpoints](#api-endpoints)
- [Screenshot](#screenshot)
- [Tim Pengembang](#tim-pengembang)

---

## Tentang Proyek

**SmartSpend** adalah aplikasi web manajemen keuangan pribadi yang mengintegrasikan model *deep learning* untuk memprediksi kondisi keuangan pengguna secara real-time. Aplikasi ini memberikan rekomendasi tabungan ideal, analisis distribusi probabilitas kondisi keuangan, serta target tabungan yang dipersonalisasi berdasarkan profil pengguna.

Proyek ini dikembangkan sebagai **Capstone Project Coding Camp** dengan tujuan membantu masyarakat Indonesia—khususnya generasi muda—dalam memahami dan mengelola keuangan pribadi dengan lebih baik.

---

## Fitur Utama

| Fitur | Deskripsi |
|---|---|
| **Dashboard** | Ringkasan pemasukan, pengeluaran, tabungan, dan rasio tabungan |
| **Rekomendasi AI** | Prediksi kondisi keuangan menggunakan Deep Learning Model |
| **Target Tabungan** | Penetapan dan pemantauan target tabungan bulanan |
| **Distribusi Probabilitas** | Visualisasi probabilitas kondisi keuangan (Keuangan Sehat, Cukup Baik, Perlu Perbaikan) |
| **Riwayat Transaksi** | Pencatatan dan penelusuran riwayat keuangan |
| **Pengaturan** | Kustomisasi profil dan preferensi pengguna |

### Klasifikasi Kondisi Keuangan
- ✅ **Keuangan Sehat** — Rasio tabungan optimal, keuangan dalam kondisi baik
- 🟡 **Cukup Baik** — Ada ruang untuk peningkatan
- 🔴 **Perlu Perbaikan** — Pengeluaran melebihi batas ideal

---

## Arsitektur Sistem

```
┌─────────────┐       ┌─────────────┐       ┌─────────────────┐
│   Frontend  │ ───▶  │   Backend   │ ───▶  │   AI / ML Model │
│  (React.js) │       │  (Node.js)  │       │  (Deep Learning) │
└─────────────┘       └─────────────┘       └─────────────────┘
                             │
                      ┌──────▼──────┐
                      │  Database   │
                      └─────────────┘
```

---

## Struktur Repositori

```
Smartspend/
├── AI_Project/          # Model AI & pipeline prediksi
│   ├── notebooks/       # Jupyter Notebook eksplorasi & training
│   ├── models/          # Model yang sudah ditraining (.pkl / .h5)
│   └── ...
├── DS_Project/          # Data Science & analisis dataset
│   ├── notebooks/       # EDA, preprocessing, visualisasi
│   ├── data/            # Dataset (dummy/sample)
│   └── ...
├── backend/             # REST API (Node.js)
│   ├── controllers/
│   ├── routes/
│   ├── models/
│   ├── middleware/
│   ├── app.js
│   └── package.json
├── frontend/            # Antarmuka pengguna (JavaScript)
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   └── ...
│   └── package.json
├── ml-service/             
│   ├── models
│   ├── services
│   ├── main.py
│   └── requirements.txt
├── .gitignore
└── README.md
```

---

## Tech Stack

### Frontend
- **React.js** — Library UI
- **Tailwind CSS / CSS Modules** — Styling
- **Axios** — HTTP Client

### Backend
- **Node.js + Express.js** — REST API Server
- **JWT** — Autentikasi
- **bcrypt** — Enkripsi password

### AI / Machine Learning
- **Python** — Bahasa pemrograman utama
- **TensorFlow / Keras** — Deep Learning framework
- **scikit-learn** — Preprocessing & evaluasi model
- **Pandas & NumPy** — Manipulasi data
- **Jupyter Notebook** — Eksplorasi & dokumentasi model

### Database
- **MySQL**

---

## Cara Menjalankan Proyek

### Prasyarat

Pastikan sudah terinstall:
- [Node.js](https://nodejs.org/) v16+
- [Python](https://www.python.org/) 3.8+
- [Git](https://git-scm.com/)
- npm atau yarn

---

### 1. Clone Repositori

```bash
git clone https://github.com/Masfikar92/Smartspend.git
cd Smartspend
```

---

### 2. Menjalankan Backend

```bash
cd backend
npm install
```

Buat file `.env` di dalam folder `backend/`:

```env
PORT=5000
JWT_SECRET=your_jwt_secret_key
DATABASE_URL=your_database_connection_string
```

Jalankan server:

```bash
npm start
# atau mode development:
npm run dev
```

Server akan berjalan di: `http://localhost:5000`

---

### 3. Menjalankan Frontend

```bash
cd ../frontend
npm install
```

Buat file `.env` di dalam folder `frontend/`:

```env
REACT_APP_API_URL=http://localhost:5000
```

Jalankan aplikasi:

```bash
npm start
```

Aplikasi akan terbuka di: `http://localhost:3000`

---

### 4. Menjalankan Model AI

```bash
cd ../AI_Project
pip install -r requirements.txt
jupyter notebook
```

Buka notebook yang tersedia untuk:
- Melihat proses training model
- Menjalankan prediksi secara lokal
- Mengekspor model ke format yang digunakan backend

---

## Model AI & Data Science

### Folder `AI_Project`
Berisi pipeline lengkap model prediksi kondisi keuangan:
- **Preprocessing** data keuangan pengguna
- **Training** model klasifikasi berbasis Deep Learning
- **Evaluasi** menggunakan metrik akurasi, precision, recall, F1-score
- **Export** model untuk digunakan di backend

### Folder `DS_Project`
Berisi analisis data eksplorasi (EDA):
- Distribusi data keuangan
- Korelasi antar fitur
- Visualisasi insight keuangan

### Label Klasifikasi Model

| Label | Deskripsi |
|---|---|
| `Keuangan Sehat` | Rasio tabungan ≥ ideal, pengeluaran terkendali |
| `Cukup Baik` | Tabungan ada namun belum optimal |
| `Perlu Perbaikan` | Pengeluaran mendekati atau melebihi pemasukan |

### Contoh Input-Output Model

**Input:**
```json
{
  "pemasukan": 2000000,
  "pengeluaran": 735000,
  "rasio_tabungan": 63.2
}
```

**Output:**
```json
{
  "kondisi": "Keuangan Sehat",
  "confidence": 0.85,
  "distribusi": {
    "Cukup Baik": 0.003,
    "Keuangan Sehat": 0.85,
    "Perlu Perbaikan": 0.147
  },
  "tabungan_ideal": 1600000
}
```

---

## API Endpoints

| Method | Endpoint | Deskripsi |
|---|---|---|
| `POST` | `/api/auth/register` | Registrasi pengguna baru |
| `POST` | `/api/auth/login` | Login & mendapat token |
| `GET` | `/api/dashboard` | Data ringkasan keuangan |
| `POST` | `/api/transaksi` | Tambah transaksi baru |
| `GET` | `/api/transaksi` | Riwayat transaksi |
| `POST` | `/api/predict` | Prediksi kondisi keuangan (AI) |
| `GET` | `/api/target` | Lihat target tabungan |
| `PUT` | `/api/target` | Update target tabungan |

---

## Screenshot

### Dashboard & Rekomendasi AI
> Tampilan utama menampilkan ringkasan keuangan dan hasil prediksi model AI secara real-time, termasuk distribusi probabilitas kondisi keuangan pengguna.

---

## 👨‍💻 Tim Pengembang

Proyek ini dikembangkan oleh tim **Capstone Coding Camp**:

| Nama | Role |
|---|---|
| Masfikar92 | Full Stack / Project Lead |
| *(anggota lain)* | *(tambahkan sesuai tim)* |

---

## Lisensi

Proyek ini dikembangkan untuk keperluan **Capstone Project Coding Camp** dan bersifat edukatif.

---

<p align="center">
  Dibuat oleh tim AI Engineer,Data Scientist dan Fullstack Developer Coding Camp 2026
</p>
