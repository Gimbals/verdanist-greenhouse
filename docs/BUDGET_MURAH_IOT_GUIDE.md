# 💰 BUDGET MURAH IOT GREENHOUSE - DI BAWAH 100K!
## Panduan Lengkap Setup Software & Cloud Murah

---

## 🎯 TARGET: < Rp100.000 (SEKALI BAYAR!)

---

## 📱 Option 1: ANDROID PHONE (FREE!) 🏆

### **💰 Total Cost: Rp0 (GRATIS!)**

#### **Requirements:**
- **Android phone lama** yang tidak terpakai
- **USB OTG** (jika perlu)
- **Power bank** (optional)

#### **Software Stack:**
```bash
✅ Termux (Terminal Emulator) - FREE
✅ Node.js via Termux - FREE  
✅ Mosquitto MQTT - FREE
✅ SQLite Database - FREE
✅ Python/Flask - FREE
✅ Ngrok Tunnel - FREE (limited)
```

#### **Setup Steps:**
```bash
# 1. Install Termux dari Play Store
# 2. Install Node.js:
pkg install nodejs npm

# 3. Install MQTT:
pkg install mosquitto

# 4. Install SQLite:
pkg install sqlite

# 5. Clone project:
git clone https://github.com/your-verdanist-project
cd verdanist-backend
npm install

# 6. Start services:
npm start &
mosquitto -d &
```

#### **Performance:**
- **CPU**: Quad-core 1.2GHz+
- **RAM**: 2-4GB
- **Storage**: 16-64GB
- **Network**: WiFi + 4G

#### **✅ Advantages:**
- **0 Rupiah cost** - Pake hp lama!
- **Portable** - Bawa kemana-mana
- **Battery backup** - Tidak mati saat listrik off
- **4G connectivity** - Monitoring dari jauh
- **Camera integration** - Bisa tambah CCTV

#### **⚠️ Limitations:**
- **Thermal throttling** - Overheat protection
- **Background limits** - Android kill background apps
- **Storage limited** - Max 64GB
- **Not 24/7** - Battery drain

---

## 💻 Option 2: OLD LAPTOP/PC (Rp50.000-Rp100.000)

### **💰 Total Cost: Rp50.000 - Rp100.000**

#### **Hardware Options:**
- **Core2Duo Laptop**: Rp50.000 (second hand)
- **Old Desktop PC**: Rp80.000 (second hand)
- **Netbook**: Rp70.000 (second hand)

#### **Requirements:**
- **Minimum**: Core2Duo, 2GB RAM, 40GB HDD
- **OS**: Ubuntu 20.04 (FREE)
- **Network**: WiFi/Ethernet

#### **Software Stack:**
```bash
✅ Ubuntu 20.04 LTS - FREE
✅ Node.js 18.x - FREE
✅ Mosquitto MQTT - FREE
✅ PostgreSQL - FREE
✅ Nginx - FREE
✅ PM2 Process Manager - FREE
```

#### **Setup Commands:**
```bash
# 1. Install Ubuntu (bootable USB)
# 2. Update system:
sudo apt update && sudo apt upgrade -y

# 3. Install Node.js:
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# 4. Install MQTT:
sudo apt install mosquitto mosquitto-clients

# 5. Install PostgreSQL:
sudo apt install postgresql postgresql-contrib

# 6. Install PM2:
sudo npm install -g pm2

# 7. Setup auto-start:
pm2 startup
pm2 save
```

#### **Performance:**
- **CPU**: Core2Duo 2.0GHz+
- **RAM**: 2-8GB
- **Storage**: 40-500GB
- **Power**: 30-65W

#### **✅ Advantages:**
- **Real server** - 24/7 operation
- **Large storage** - Years of data
- **Ethernet port** - Stable connection
- **USB ports** - Banyak device
- **Upgrade path** - Bisa upgrade RAM/CPU

#### **⚠️ Considerations:**
- **Power consumption** - 30-65W
- **Space required** - Butuh meja
- **Noise/heat** - Fan noise
- **Used hardware** - No warranty

---

## 🌐 Option 3: FREE CLOUD SERVICES (Rp0!)

### **💰 Total Cost: Rp0 (FREE TIER!)**

#### **Provider Options:**
- **Oracle Cloud Free Tier**: FREE forever
- **AWS Free Tier**: 12 months free
- **Google Cloud Free Tier**: $300 credit
- **Azure Free Tier**: 12 months free

#### **Oracle Cloud Best Deal:**
```bash
✅ VM: 2 CPU, 1GB RAM, 50GB SSD - FREE forever
✅ Load Balancer - FREE
✅ Object Storage 10GB - FREE
✅ Database 20GB - FREE
✅ Network 10TB - FREE
✅ Public IP - FREE
```

#### **Setup Oracle Cloud:**
```bash
# 1. Sign up Oracle Cloud (credit card required, no charge)
# 2. Create Compute Instance:
#    - Shape: VM.Standard.E2.1.Micro
#    - OS: Ubuntu 22.04
#    - Storage: 50GB

# 3. Setup security rules:
#    - Port 22 (SSH)
#    - Port 80 (HTTP)
#    - Port 443 (HTTPS)
#    - Port 1883 (MQTT)

# 4. Connect via SSH:
ssh ubuntu@your-public-ip

# 5. Install stack:
sudo apt update
sudo apt install nodejs npm mosquitto postgresql nginx
```

#### **Performance:**
- **CPU**: 2 cores AMD EPYC
- **RAM**: 1GB
- **Storage**: 50GB SSD
- **Network**: 10TB bandwidth

#### **✅ Advantages:**
- **0 Rupiah forever** - Oracle Cloud free tier
- **Professional infrastructure** - Enterprise grade
- **99.9% uptime** - SLA guarantee
- **Global CDN** - Fast worldwide
- **Auto backup** - Built-in features

#### **⚠️ Limitations:**
- **Credit card required** - For verification
- **Resource limits** - 1GB RAM only
- **Complex setup** - Butuh technical knowledge
- **Account suspension** - If abuse detected

---

## 📊 COMPARISON TABLE

| Feature | Android Phone | Old Laptop | Oracle Cloud |
|---------|---------------|------------|--------------|
| **Cost** | **Rp0** | **Rp50-100k** | **Rp0** |
| **Setup Complexity** | 🟢 Easy | 🟡 Medium | 🔴 Hard |
| **Performance** | 🟡 Medium | 🟢 Good | 🟡 Limited |
| **Storage** | 🔴 16-64GB | 🟢 40-500GB | 🟡 50GB |
| **24/7 Operation** | 🔴 Battery | 🟢 Yes | 🟢 Yes |
| **Remote Access** | 🟢 4G/WiFi | 🟡 WiFi only | 🟢 Global |
| **Maintenance** | 🟡 Charging | 🟡 Updates | 🟡 Cloud ops |
| **Scalability** | 🔴 Limited | 🟡 Upgradeable | 🔴 Fixed |

---

## 🏆 MY RECOMMENDATION

### **🥇 BEST CHOICE: Oracle Cloud Free Tier**

**Why:**
- **0 Rupiah forever** - No monthly cost
- **Professional setup** - Enterprise grade
- **24/7 operation** - Real server
- **Global access** - Monitor dari mana saja
- **Learning value** - Cloud computing skills

### **🥈 BUDGET CHOICE: Old Laptop**

**Why:**
- **One-time cost** - Rp50-100k sekali bayar
- **Full control** - Data di rumah
- **No internet dependency** - Local network
- **Upgrade path** - Bisa improve later

### **🥉 MOBILE CHOICE: Android Phone**

**Why:**
- **0 Rupiah** - Pake hp lama
- **Portable** - Bawa kemana-mana
- **Battery backup** - Tidak mati listrik off
- **4G connectivity** - Monitoring remote

---

## 🛠️ DETAILED SETUP GUIDES

### **Oracle Cloud Setup (Recommended):**

#### **Step 1: Account Registration**
```bash
1. Visit: https://www.oracle.com/cloud/free/
2. Sign up with email
3. Add credit card (no charge)
4. Verify identity
5. Wait for approval (1-2 hours)
```

#### **Step 2: Create Instance**
```bash
1. Login to Oracle Cloud Console
2. Go to Compute → Instances
3. Click "Create Instance"
4. Configure:
   - Name: verdanist-greenhouse
   - Compartment: root
   - Shape: VM.Standard.E2.1.Micro
   - Image: Ubuntu 22.04
   - SSH Key: Upload your public key
5. Click "Create"
```

#### **Step 3: Network Setup**
```bash
1. Go to Networking → Virtual Cloud Network
2. Add Ingress Rules:
   - SSH: Port 22
   - HTTP: Port 80
   - HTTPS: Port 443
   - MQTT: Port 1883
   - WebSocket: Port 3000
```

#### **Step 4: Software Installation**
```bash
# Connect via SSH
ssh ubuntu@your-public-ip

# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install MQTT
sudo apt install mosquitto mosquitto-clients

# Install PostgreSQL
sudo apt install postgresql postgresql-contrib

# Install PM2
sudo npm install -g pm2

# Install Nginx
sudo apt install nginx

# Clone project
git clone https://github.com/your-verdanist-project
cd verdanist-backend
npm install

# Setup database
sudo -u postgres createdb verdanist
sudo -u postgres psql verdanist < schema.sql

# Start services
pm2 start ecosystem.config.js
pm2 startup
pm2 save
```

---

### **Old Laptop Setup (Budget Option):**

#### **Step 1: Hardware Preparation**
```bash
1. Clean laptop from dust
2. Test all ports (USB, Ethernet)
3. Check battery (optional)
4. Install Ubuntu 20.04 LTS
5. Connect to internet
```

#### **Step 2: System Configuration**
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install development tools
sudo apt install build-essential git curl

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install database
sudo apt install postgresql postgresql-contrib

# Install MQTT
sudo apt install mosquitto mosquitto-clients

# Install process manager
sudo npm install -g pm2

# Configure auto-login (for 24/7 operation)
sudo systemctl set-default multi-user.target
sudo systemctl enable getty@tty1
```

#### **Step 3: Power Optimization**
```bash
# Disable sleep mode
sudo systemctl mask sleep.target suspend.target hibernate.target hybrid-sleep.target

# Set power profile to performance
sudo cpupower frequency-set -g performance

# Monitor temperature
sudo apt install lm-sensors
sensors-detect
```

---

### **Android Phone Setup (Mobile Option):**

#### **Step 1: Install Termux**
```bash
1. Download Termux from F-Droid (not Play Store)
2. Install Termux:API
3. Grant storage permissions
4. Enable auto-start (if available)
```

#### **Step 2: Install Packages**
```bash
# Update Termux
pkg update && pkg upgrade

# Install Node.js
pkg install nodejs npm

# Install Python (for additional tools)
pkg install python

# Install Git
pkg install git

# Install SQLite
pkg install sqlite

# Install text editor
pkg install nano
```

#### **Step 3: Setup Services**
```bash
# Create project directory
mkdir -p ~/verdanist
cd ~/verdanist

# Clone project
git clone https://github.com/your-verdanist-project backend
cd backend

# Install dependencies
npm install

# Create startup script
echo '#!/bin/bash
cd ~/verdanist/backend
npm start &' > ~/start-services.sh
chmod +x ~/start-services.sh

# Setup auto-start (add to Termux boot)
echo "cd ~/verdanist/backend && npm start &" >> ~/.bashrc
```

#### **Step 4: Network Configuration**
```bash
# Install ngrok for external access
pkg install python
pip install pyngrok

# Create ngrok script
echo 'from pyngrok import ngrok
ngrok.kill()
tunnel = ngrok.connect(3000)
print("Public URL:", tunnel.public_url)' > ~/ngrok.py

# Run ngrok when needed
python ~/ngrok.py
```

---

## 📱 MONITORING APPS

### **Android Monitoring:**
```bash
✅ Termux:API - Access device sensors
✅ JuiceSSH - Remote management
✅ MQTT Dashboard - Monitor MQTT topics
✅ Postman - API testing
✅ Chrome - Web interface
```

### **Laptop Monitoring:**
```bash
✅ htop - System monitoring
✅ iftop - Network monitoring
✅ pm2 monit - Process monitoring
✅ Webmin - Web-based admin
✅ Cockpit - Server dashboard
```

### **Cloud Monitoring:**
```bash
✅ Oracle Cloud Console
✅ PM2 Monitoring
✅ Grafana (if needed)
✅ Custom dashboard
✅ Email alerts
```

---

## 🎯 FINAL RECOMMENDATIONS

### **For Beginners: Oracle Cloud Free Tier**
- **Cost**: Rp0 forever
- **Learning**: Cloud computing skills
- **Reliability**: Professional infrastructure
- **Scalability**: Easy to upgrade

### **For Tinkerers: Old Laptop**
- **Cost**: Rp50-100k one-time
- **Control**: Full hardware ownership
- **Privacy**: Data at home
- **Flexibility**: Custom configurations

### **For Mobile Users: Android Phone**
- **Cost**: Rp0 (use old phone)
- **Portability**: Monitor from anywhere
- **Battery**: Backup power
- **Simplicity**: Easy setup

---

## 🚀 NEXT STEPS

1. **Choose option** based on budget and needs
2. **Prepare hardware** (if needed)
3. **Follow setup guide** step by step
4. **Test with dummy data**
5. **Connect ESP32 devices**
6. **Deploy production system**

**Semua opsi ini DI BAWAH 100K dan worth it untuk greenhouse IoT Anda!** 💰🌱

**Siap memilih opsi mana?** 🤔✨
