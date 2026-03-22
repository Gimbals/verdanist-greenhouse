# 🚀 RAILWAY DEPLOYMENT GUIDE
## Setup Verdanist IoT Greenhouse di Railway

---

## **📋 SUDAH DIPERSIAPKAN UNTUK ANDA:**

### **✅ Frontend Setup:**
- **Dockerfile** - Untuk deployment
- **package.json** - Dependencies & build scripts
- **vite.config.ts** - Build configuration
- **index.html** - Entry point
- **App.tsx** - Main component dengan status display
- **App.css** - Styling (tanpa Tailwind dependency)

### **✅ Backend Setup:**
- **Dockerfile** - Untuk deployment
- **package.json** - Dependencies & scripts
- **src/index.js** - Express server dengan MQTT
- **Health endpoint** - `/health` untuk monitoring

---

## **🚀 LANGKAH-LANGKAH DEPLOYMENT**

### **Step 1: Push ke GitHub (2 menit)**
```bash
# Buka terminal di folder d:\verdanist
git add .
git commit -m "Add Railway deployment setup"
git push origin main
```

### **Step 2: Setup Railway (3 menit)**
```bash
1. Buka: railway.app
2. Login dengan GitHub
3. Click "New Project"
4. Pilih repository: "Gimbals/verdanist-greenhouse"
```

### **Step 3: Deploy Backend (5 menit)**
```bash
1. Click "New Service" → "Deploy from GitHub"
2. Pilih repository yang sama
3. Configure:
   - Root Path: /backend
   - Build Command: npm install
   - Start Command: npm start
   - Port: 3000
4. Add Environment Variables:
   - NODE_ENV: production
   - DATABASE_URL: (akan diisi Railway)
   - MQTT_BROKER: mqtt://test.mosquitto.org:1883
5. Click "Deploy"
```

### **Step 4: Add Database (2 menit)**
```bash
1. Click "New Project" → "New Project"
2. Pilih "Database" → "PostgreSQL"
3. Railway akan create database otomatis
4. Copy connection string
5. Kembali ke backend service
6. Add DATABASE_URL environment variable
7. Restart deployment
```

### **Step 5: Deploy Frontend (5 menit)**
```bash
1. Click "New Service" → "Deploy from GitHub"
2. Pilih repository yang sama
3. Configure:
   - Root Path: /frontend
   - Build Command: npm install && npm run build
   - Start Command: npm start
   - Port: 3000
4. Add Environment Variables:
   - REACT_APP_API_URL: https://backend-url.railway.app
5. Click "Deploy"
```

---

## **📊 HASIL AKHIR**

### **🌐 Yang Anda Dapatkan:**
- **Frontend**: React app di Railway URL
- **Backend**: Node.js API dengan MQTT
- **Database**: PostgreSQL untuk sensor data
- **Real-time**: WebSocket & MQTT support
- **Monitoring**: Health checks & logs
- **Free Forever**: 0 biaya selamanya

### **🔗 URLs yang Akan Anda Dapat:**
```
Frontend: https://verdanist-frontend-production.up.railway.app
Backend:  https://verdanist-backend-production.up.railway.app
Database: Railway dashboard access
```

---

## **🧪 TESTING SETELAH DEPLOYMENT**

### **🌐 Test Frontend:**
```bash
1. Buka frontend URL di browser
2. Should see "Verdanist IoT Greenhouse" dengan status:
   - Frontend: ✅ Active
   - Backend: ✅ Connected
   - Database: ✅ Ready
   - MQTT: ✅ Listening
```

### **🔧 Test Backend:**
```bash
1. Test health endpoint:
   curl https://backend-url.railway.app/health
   
2. Should return:
   {"status":"ok","database":"connected"}
```

---

## **🎯 NEXT STEPS**

### **📋 Setelah Live:**
1. **Connect ESP32** ke MQTT broker
2. **Test sensor data** flow
3. **Monitor dashboard** real-time
4. **Setup custom domain** (opsional)
5. **Configure alerts** (opsional)

---

## **🆘 TROUBLESHOOTING**

### **❌ Common Issues:**
- **Build failed**: Check package.json dependencies
- **Database connection**: Verify DATABASE_URL format
- **Port conflict**: Ensure ports 3000 for both services
- **MQTT connection**: Test broker accessibility

### **🔧 Quick Fixes:**
- Restart deployment di Railway dashboard
- Check logs di Railway
- Verify environment variables
- Test API endpoints manually

---

## **🎉 SELAMAT!**

### **✅ System Anda Sekarang:**
- **Production ready** di Railway
- **100% free hosting** forever
- **Auto-deployment** dari GitHub
- **Professional infrastructure**
- **Scalable** untuk growth

### **🚀 Ready untuk:**
- ESP32 device integration
- Real-time sensor monitoring
- Smart automation
- AI-powered assistance
- Mobile app development

---

## **📞 Need Help?**

### **🆘 Support Options:**
- **Railway docs**: docs.railway.app
- **Community**: community.railway.app
- **GitHub**: Repository issues
- **Saya**: Ask me anything!

---

*Setup ini minimalis dan fungsional untuk deployment cepat!* 🚀✨
