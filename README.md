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
├── backend/             # REST API (Node.js + Express)
│   ├── controllers/     
│   ├── routes/
│   ├── models/
│   ├── middleware/
│   ├── app.js
│   └── package.json
├── frontend/            # Antarmuka pengguna (React + Vite)
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   └── ...
│   └── package.json
├── ml-service/          # ML Service (FastAPI + Python)      
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
- **React.js + Vite** — Library UI & build tool
- **React Router** — Client-side routing
- **Tailwind CSS** — Utility classes (partial)
- **Axios** — HTTP Client
- **Recharts** — Visualisasi grafik keuangan
- **React Icons** — Icon library

### Backend
- **Node.js + Express.js** — REST API Server
- **JWT** — Autentikasi token
- **bcrypt** — Enkripsi password
- **MySQL** — Database relasional
- **Passport.js** — Google OAuth2

### ML Service
- **FastAPI** — API server untuk model ML
- **TensorFlow / Keras** — Deep Learning framwork (AI model)
- **scikit-learn** — KMeaqns Clustering (DS model)

### AI / Data Science
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
- [Node.js](https://nodejs.org/) v18+
- [Python](https://www.python.org/) 3.11
- [MySQL](https://www.mysql.com/) 8.0+
- [Git](https://git-scm.com/)

---

### 1. Clone Repositori

```bash
git clone https://github.com/Masfikar92/Smartspend.git
cd Smartspend
```

---

### 2. Setup Database

Jalankan MySQL dan buat database:

```sql
CREATE DATABASE smartspend;
```

Import schema tabel yang dibutuhkan (transactions, users, saving_goals, user_profiles).

---

### 3. Menjalankan Backend

```bash
cd backend
npm install
```

Buat file `.env` di dalam folder `backend/`:

```env
PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=smartspend
JWT_SECRET=your_jwt_secret_key
FRONTEND_URL=http://localhost:5173
SESSION_SECRET=your_session_secret
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

Jalankan server:

```bash
npm run dev
```

Server akan berjalan di: `http://localhost:3000`

---

### 4. Menjalankan Frontend

```bash
cd frontend
npm install
npm run dev
```

Aplikasi akan berjalan di: `http://localhost:5173`

---

### 5. Menjalankan ML Service

```bash
cd ml-service
py -3.11 -m pip install -r requirements.txt
py -3.11 -m uvicorn main:app --reload --port 8000
```

ML Service akan berjalan di: `http://localhost:8000`

> **Catatan:** Python 3.11 diperlukan karena TensorFlow belum mendukung Python 3.12+

---

## Model AI & Data Science

### AI Model (Deep Learning)
Lokasi: `AI_Project/` dan `ml-service/models/ai/`

- **Arsitektur:** Multi-output Neural Network
- **Output 1:** Klasifikasi kondisi keuangan (3 kelas)
- **Output 2:** Regresi nominal tabungan ideal (Rp)
- **Akurasi klasifikasi:** 88%
- **MAE regresi:** ~Rp 100.572

### DS Model (KMeans Clustering)
Lokasi: `DS_Project/` dan `ml-service/models/ds/`

- **Algoritma:** KMeans dengan 3 cluster
- **Cluster 0:** Pengelola Menengah
- **Cluster 1:** Pengelola Hemat
- **Cluster 2:** Pengelola Mapan
- **Output:** Segmentasi profil + rekomendasi budgeting dinamis

### Contoh Input-Output

**Input:**
```json
{
  "pendapatan_bulanan": 5000000,
  "total_pengeluaran": 3500000,
  "rasio_tabungan_persen": 30.0,
  "provinsi": "DI Yogyakarta",
  "usia": 25
}
```

**Output AI Model:**
```json
{
  "kondisi_keuangan": "Keuangan Sehat",
  "confidence": 0.92,
  "probabilities": {
    "Keuangan Sehat": 0.92,
    "Cukup Baik": 0.06,
    "Perlu Perbaikan": 0.02
  },
  "rekomendasi_tabungan": 1000000,
  "pesan": "Keuangan Anda sangat baik! Pertahankan dan tingkatkan investasi."
}
```

---

## API Endpoints

### Auth
| Method | Endpoint | Deskripsi |
|---|---|---|
| `POST` | `/api/auth/register` | Registrasi pengguna baru |
| `POST` | `/api/auth/login` | Login & mendapat JWT token |
| `GET` | `/api/auth/google` | Login via Google OAuth |

### Transaksi
| Method | Endpoint | Deskripsi |
|---|---|---|
| `GET` | `/api/transactions` | Ambil riwayat transaksi |
| `POST` | `/api/transactions` | Tambah transaksi baru |
| `DELETE` | `/api/transactions/:id` | Hapus transaksi |
| `GET` | `/api/transactions/summary` | Ringkasan keuangan bulanan |
| `GET` | `/api/transactions/chart` | Data grafik 6 bulan terakhir |

### Target Tabungan
| Method | Endpoint | Deskripsi |
|---|---|---|
| `GET` | `/api/savings` | Ambil semua target tabungan |
| `POST` | `/api/savings` | Buat target tabungan baru |
| `PUT` | `/api/savings/:id/progress` | Update progres tabungan |
| `DELETE` | `/api/savings/:id` | Hapus target tabungan |

### Rekomendasi & Prediksi
| Method | Endpoint | Deskripsi |
|---|---|---|
| `GET` | `/api/recommendation` | Prediksi kondisi keuangan + rekomendasi budgeting |

### Profil
| Method | Endpoint | Deskripsi |
|---|---|---|
| `GET` | `/api/profile` | Ambil profil demografi user |
| `POST` | `/api/profile` | Simpan/update profil demografi |

### User
| Method | Endpoint | Deskripsi |
|---|---|---|
| `GET` | `/api/user/me` | Data user yang sedang login |
| `PUT` | `/api/user/update` | Update nama lengkap |
| `PUT` | `/api/user/password` | Ganti password |

---


## 👨‍💻 Tim Pengembang

Proyek ini dikembangkan oleh tim **Capstone Coding Camp**:

| Nama | Role |
|---|---|
| Muhammad Zulfikar | Data Scienctist / Project Lead |
| Akmal Farhan Hidayat | Data Scientist |
| Gagah Didjaya Anbarosi | Fullstack Developer |
| Angger Dwi Cahyo | Fullstack Developer |
| Fani Lestari | AI Engineer |
| Adila Ramdhan Ma'Ruf | AI Engineer |

---

## Lisensi

Proyek ini dikembangkan untuk keperluan **Capstone Project Coding Camp** dan bersifat edukatif.

---

<p align="center">
  Dibuat oleh tim AI Engineer,Data Scientist dan Fullstack Developer Coding Camp 2026
</p>
