# VERDANIST GREENHOUSE - FIELD TESTING SOP
# Real-World Testing Before Partner Deployment

## 🎯 TESTING PHASES

### **PHASE 1: LAB TESTING (1-2 DAYS)**
Test dalam kondisi terkontrol sebelum ke lapangan.

---

## 🧪 LAB TEST CHECKLIST

### **1.1 📶 CONNECTIVITY TESTS**
```bash
□ WiFi Disconnect Test:
  - Matikan WiFi router
  - Tunggu 2 menit
  - Expected: ESP32 auto-reconnect
  - Expected: Local auto-mode tetap jalan
  - Expected: Dashboard show "offline" status

□ Firebase Disconnect Test:
  - Putus internet connection
  - Tunggu 5 menit
  - Expected: ESP32 detect offline
  - Expected: Pump auto-off (safety)
  - Expected: Local mode active

□ Power Cycle Test:
  - Cabut pasang power ESP32
  - Expected: Auto-boot and connect
  - Expected: Normal operation dalam 2 menit
```

### **1.2 🔧 SAFETY TESTS**
```bash
□ Pump Fail-Safe Test:
  - Nyalakan pump dari dashboard
  - Matikan internet
  - Tunggu 5 menit + 10 detik
  - Expected: Pump mati otomatis
  - Expected: Firebase status "off"

□ Sensor Error Test:
  - Lepas DHT22 sensor
  - Tunggu 3 menit
  - Expected: Invalid data ditolak
  - Expected: System tetap jalan
  - Expected: Error log di Serial

□ Relay Stuck Test:
  - Force relay ON manual
  - Restart ESP32
  - Expected: Relay ke OFF (safe state)
  - Expected: Normal operation recovery
```

### **1.3 📊 PERFORMANCE TESTS**
```bash
□ Memory Leak Test:
  - Monitor free heap setiap jam
  - Jalankan 24 jam non-stop
  - Expected: Memory stabil (tidak turun terus)
  - Expected: No crash/restart

□ Data Integrity Test:
  - Upload sensor data setiap 3 menit
  - Cek Firebase setiap upload
  - Expected: Data valid (0-100% range)
  - Expected: Timestamp benar
  - Expected: No missing data

□ Control Latency Test:
  - Tekan tombol ON/OFF dashboard
  - Hitung waktu response
  - Expected: < 2 detik
  - Expected: Relay sesuai command
```

---

## 🌍 PHASE 2: FIELD TESTING (3-5 DAYS)

### **2.1 🏠 GREENHOUSE SIMULATION**
```bash
□ Weak WiFi Test:
  - Posisikan ESP32 jauh dari router
  - Gunakan WiFi extender jelek
  - Expected: Reconnect otomatis
  - Expected: Data tetap terkirim

□ Power Fluctuation Test:
  - Gunakan power supply tidak stabil
  - Simulasi listrik naik turun
  - Expected: ESP32 tetap hidup
  - Expected: Auto-reboot jika perlu

□ Environmental Stress Test:
  - Suhu tinggi (>35°C) simulation
  - Kelembaban tinggi (>80%) simulation
  - Expected: Sensor tetap baca
  - Expected: Relay tidak overheat
```

### **2.2 📱 DASHBOARD USABILITY TEST**
```bash
□ User-Friendly Test:
  - Berikan ke orang awam
  - Minta untuk kontrol system
  - Expected: Mudah dimengerti
  - Expected: Tidak ada error fatal

□ Mobile Responsiveness Test:
  - Buka di smartphone
  - Test semua fungsi
  - Expected: Responsive design
  - Expected: Touch-friendly controls

□ Real-time Update Test:
  - Buka dashboard di 2 browser
  - Control dari browser 1
  - Expected: Browser 2 update otomatis
  - Expected: < 3 detik delay
```

---

## 🚨 PHASE 3: STRESS TESTING (2-3 DAYS)

### **3.1 📡 CONNECTIVITY STRESS**
```bash
□ Network Dropout Test:
  - Matikan internet 5 menit setiap jam
  - Jalankan 24 jam
  - Expected: Auto-reconnect berhasil
  - Expected: Data tidak hilang
  - Expected: Control tetap berfungsi

□ Firebase Rate Limit Test:
  - Kirim data setiap 10 detik (stress)
  - Monitor error messages
  - Expected: Graceful handling
  - Expected: Back to normal interval
```

### **3.2 🔋 POWER STRESS TEST**
```bash
□ 24/7 Operation Test:
  - Jalankan non-stop 3 hari
  - Monitor stability
  - Expected: No random restart
  - Expected: Memory stable
  - Expected: No performance degradation

□ Battery Backup Test:
  - Gunakan power bank
  - Matikan listrik 2 jam
  - Expected: ESP32 tetap hidup
  - Expected: Local mode aktif
  - Expected: Normal saat listrik kembali
```

---

## 📋 TESTING RESULTS TEMPLATE

### **📊 Daily Test Log**
```bash
Date: _______________
Tester: _______________

✅ PASSED TESTS:
□ WiFi reconnect
□ Firebase reconnect
□ Pump fail-safe
□ Sensor validation
□ Memory stability
□ Control latency
□ Local auto-mode
□ Dashboard usability

❌ FAILED TESTS:
□ _____________________
□ _____________________
□ _____________________

📝 NOTES:
_____________________________
_____________________________
_____________________________

🔧 ISSUES FOUND:
_____________________________
_____________________________

💡 IMPROVEMENTS NEEDED:
_____________________________
_____________________________
```

---

## 🎯 SUCCESS CRITERIA

### **✅ MUST PASS (Deployment Ready)**
```bash
🔥 CRITICAL:
□ Pump fail-safe (5-minute timeout)
□ Auto-reconnect WiFi & Firebase
□ Sensor data validation
□ Memory stability (24+ hours)
□ Local auto-mode functionality

📱 IMPORTANT:
□ Dashboard real-time updates
□ Control latency < 3 seconds
□ User-friendly interface
□ Mobile compatibility

🔧 NICE TO HAVE:
□ Error logging
□ Performance monitoring
□ Remote configuration
```

### **❌ BLOCKER ISSUES (Must Fix)**
```bash
🚨 CRITICAL:
□ Pump tidak auto-off
□ Memory leak/crash
□ No auto-reconnect
□ Invalid data accepted
□ Local mode tidak jalan

⚠️ IMPORTANT:
□ Dashboard tidak real-time
□ Control latency > 5 detik
□ Interface tidak user-friendly
```

---

## 📞 NEXT STEPS AFTER TESTING

### **✅ IF ALL CRITICAL TESTS PASS:**
```bash
1. Fix remaining important issues
2. Create user manual
3. Prepare deployment package
4. Schedule partner deployment
5. Set up monitoring
```

### **❌ IF CRITICAL ISSUES FOUND:**
```bash
1. Prioritize critical fixes
2. Re-run failed tests
3. Document all changes
4. Repeat testing cycle
5. Don't deploy to partners
```

---

## 🏆 FINAL DEPLOYMENT CHECKLIST

### **📋 BEFORE PARTNER DEPLOYMENT:**
```bash
□ All critical tests passed
□ No memory leaks
□ Pump fail-safe working
□ Auto-reconnect reliable
□ Dashboard user-friendly
□ Local mode functional
□ 24+ hours stability
□ Error handling complete
□ Documentation ready
□ Support plan prepared
```

---

## 📞 EMERGENCY PROCEDURES

### **🚨 IF SYSTEM FAILS AT PARTNER:**
```bash
1. IMMEDIATE ACTION:
   - Matikan semua relay (safe state)
   - Hubungi partner
   - Dokumentasi masalah

2. TROUBLESHOOTING:
   - Cek Serial log
   - Cek Firebase status
   - Cek WiFi connection
   - Cek power supply

3. RECOVERY:
   - Restart ESP32
   - Test local mode
   - Restore configuration
   - Monitor stability
```

---

**🎉 COMPLETE FIELD TESTING SOP READY!** 🚀✨

**Lakukan semua testing ini sebelum deploy ke partner!** 📋🌱
