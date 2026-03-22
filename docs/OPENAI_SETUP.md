# OpenAI API Setup Guide

## 🚀 Mengaktifkan OpenAI API untuk Greenhouse AI Assistant

### Langkah 1: Dapatkan OpenAI API Key

1. Kunjungi [OpenAI Platform](https://platform.openai.com/)
2. Login atau daftar akun baru
3. Buka [API Keys page](https://platform.openai.com/api-keys)
4. Klik "Create new secret key"
5. Beri nama key (contoh: "Greenhouse AI")
6. Copy API key Anda

### Langkah 2: Konfigurasi Environment

1. Buka file `.env.local` di root project
2. Ganti placeholder dengan API key Anda:

```bash
# .env.local
VITE_OPENAI_API_KEY=sk-your-actual-openai-api-key-here
```

### Langkah 3: Restart Development Server

```bash
npm run dev
```

## 🎯 Cara Kerja

### Mode OpenAI API (Aktif)
- **Response Dinamis:** AI memberikan jawaban unik berdasarkan sensor data
- **Natural Language:** Response yang natural dan kontekstual
- **Real Analysis:** Analisis yang lebih mendalam dan personal

### Mode Simulation (Fallback)
- **Template Responses:** Menggunakan response yang sudah diprogram
- **Offline Mode:** Berfungsi tanpa internet/API key
- **Basic Functionality:** Tetap memberikan rekomendasi dasar

## 📊 Contoh Response

### Dengan OpenAI API:
```
Berdasarkan sensor data Anda, suhu 35.1°C terlalu tinggi untuk tomat. 
Saya sarankan buka ventilasi atap 80% dan nyalakan kipas pendingin. 
Juga kurangi irigasi 15% karena evaporasi tinggi.
```

### Dengan Simulation:
```
🌡️ Climate Control Analysis
Temperature Assessment:
- Current: 35°C
- Status: High Alert
Recommendations: [Template response]
```

## 🔧 Troubleshooting

### API Key tidak berfungsi?
1. Pastikan API key valid dan aktif
2. Check billing di OpenAI dashboard
3. Pastikan API key tidak expired

### Masalah CORS?
1. Pastikan API key dimulai dengan `sk-`
2. Check environment variables terload dengan benar
3. Restart development server

### Tetap menggunakan simulation?
1. Check console untuk error message
2. Pastikan `.env.local` ada di root folder
3. Verify API key tidak mengandung spasi

## 💰 Cost Estimation

- **Model:** GPT-4 (recommended)
- **Token limit:** 500 tokens per request
- **Estimasi cost:** ~$0.03 per 1000 requests
- **Usage:** Light usage untuk greenhouse monitoring

## 🛡️ Security

- API key disimpan di environment variables
- Tidak di-expose ke client-side
- Gunakan rate limiting untuk production
- Monitor API usage di OpenAI dashboard

## 🚀 Production Deployment

Untuk production:
1. Gunakan backend proxy untuk API calls
2. Implement rate limiting
3. Add user authentication
4. Monitor API costs and usage

---

**Need help?** Check OpenAI [documentation](https://platform.openai.com/docs) atau contact support.
