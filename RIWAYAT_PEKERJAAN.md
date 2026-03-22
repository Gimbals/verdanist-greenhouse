# Riwayat Pekerjaan – Verdanist

Dokumen ini merangkum apa saja yang sudah dikerjakan dan **di mana Anda bisa ngeceknya** di project ini.

---

## 1. Backend IoT (Node.js + PostgreSQL + MQTT)

Ini yang dibikin sesuai **diagram arsitektur** Verdanist (Indoor/Outdoor node, MQTT, dashboard).

### Lokasi: folder `backend/`

```
backend/
├── .env.example          ← Contoh konfigurasi (copy ke .env)
├── .env                  ← Konfigurasi Anda (jangan di-commit)
├── package.json          ← Dependensi & script
├── README.md             ← Cara jalankan backend
├── database/
│   └── schema.sql        ← CEK DI SINI: skema PostgreSQL (tabel devices, sensor_data, dll)
├── scripts/
│   └── run-schema.js     ← Script untuk menjalankan schema ke database
└── src/
    ├── index.js          ← CEK DI SINI: titik masuk server (Express + MQTT)
    ├── config.js         ← CEK DI SINI: PORT, URL database, URL MQTT, daftar topik MQTT
    ├── db/               ← Akses database
    │   ├── client.js     ← Koneksi PostgreSQL
    │   ├── devices.js    ← CRUD devices
    │   ├── sensor-data.js
    │   ├── device-control.js
    │   └── history-log.js
    ├── mqtt/
    │   ├── subscriber.js ← CEK DI SINI: subscribe sensor & status, simpan ke DB
    │   └── publisher.js  ← CEK DI SINI: kirim perintah kontrol (fan, pump)
    ├── middleware/
    │   └── apiKey.js     ← Opsional: auth API key
    └── routes/           ← API untuk dashboard
        ├── index.js      ← Gabungan semua route /api/*
        ├── devices.js    ← GET /api/devices
        ├── sensor-data.js← GET /api/sensor-data/latest & /history
        ├── control.js    ← POST /api/control (kirim fan/pump)
        ├── control-history.js
        └── history-log.js
```

### Cara ngecek backend

1. **Database**  
   Buka `backend/database/schema.sql` → lihat definisi tabel `devices`, `sensor_data`, `device_control`, `history_log`.

2. **API**  
   Setelah `npm run dev` di folder `backend`, buka browser atau Postman:
   - `http://localhost:3001/health` → cek server & DB
   - `http://localhost:3001/api/devices` → daftar devices
   - `http://localhost:3001/api/sensor-data/latest` → data sensor terbaru

3. **MQTT**  
   Buka `backend/src/mqtt/subscriber.js` dan `publisher.js` → lihat topik yang di-subscribe dan di-publish (sesuai diagram).

4. **Daftar API lengkap**  
   Baca `backend/README.md`.

---

## 2. Perbaikan login (error "Failed to fetch")

Ini yang dibikin supaya saat **login gagal karena koneksi** (bukan salah password), pesan errornya jelas.

### Lokasi: file di frontend

```
src/app/context/AuthContext.tsx
```

### Yang diubah

- Di fungsi **login** (email+password): kalau error-nya "Failed to fetch" atau network error, sekarang muncul toast:  
  *"Koneksi gagal. Cek internet Anda atau buka Supabase Dashboard dan pastikan project tidak paused."*
- Di fungsi **loginWithGoogle**: hal yang sama untuk error koneksi.

### Cara ngecek

1. Buka file `src/app/context/AuthContext.tsx`.
2. Cari kata **"Koneksi gagal"** → itu blok `catch` yang ditambah untuk network error.
3. Coba login dengan internet dimatikan atau project Supabase paused → harusnya muncul pesan itu, bukan cuma "Failed to fetch".

---

## Ringkasan singkat

| Yang dikerjakan              | Lokasi ngecek                          |
|-----------------------------|----------------------------------------|
| Skema database PostgreSQL   | `backend/database/schema.sql`          |
| Server Express + API        | `backend/src/index.js` + `backend/src/routes/` |
| MQTT subscriber (sensor)     | `backend/src/mqtt/subscriber.js`       |
| MQTT publisher (kontrol)     | `backend/src/mqtt/publisher.js`       |
| Perbaikan pesan error login | `src/app/context/AuthContext.tsx`      |

Kalau mau ngecek satu per satu, ikuti path di kolom "Lokasi ngecek" di atas.
