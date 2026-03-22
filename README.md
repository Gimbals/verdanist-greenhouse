# 🌱 Verdanist IoT Smart Greenhouse

Complete IoT monitoring and automation system for smart greenhouse management.

## 🚀 Quick Start

### Railway Deployment (Recommended)
- **Cost**: Free forever
- **Time**: 15 minutes
- **Infrastructure**: Professional grade

See [RAILWAY_SETUP_GUIDE.md](./RAILWAY_SETUP_GUIDE.md) for detailed instructions.

### Local Development
```bash
# Install dependencies
npm install

# Start frontend
npm run dev

# Start backend (in another terminal)
cd backend && npm install && npm start
```

## 📁 Project Structure

```
verdanist-greenhouse/
├── frontend/           # React frontend application
├── backend/            # Node.js Express API + MQTT
├── database/           # PostgreSQL schemas and migrations
├── docs/              # Documentation and guides
└── README.md          # This file
```

## 🌟 Features

- **Real-time Monitoring** - Live sensor data visualization
- **MQTT Integration** - ESP32/ESP8266 device connectivity
- **Smart Automation** - Rule-based control systems
- **AI Assistant** - Google Gemini powered recommendations
- **Alert System** - Custom notifications and warnings
- **Database Storage** - Historical data tracking
- **WebSocket Support** - Real-time updates

## 🔧 Technology Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for build tooling
- **CSS3** for styling
- **WebSocket** for real-time updates

### Backend
- **Node.js** with Express
- **PostgreSQL** for database
- **MQTT** for IoT communication
- **WebSocket** for real-time API

### Infrastructure
- **Railway** for hosting (free tier)
- **GitHub** for version control
- **Docker** for containerization

## 📱 Device Support

### Supported Sensors
- **DHT22** - Temperature & Humidity
- **Soil Moisture** - Water content monitoring
- **Light Sensor** - Light intensity
- **pH Sensor** - Water/soil pH levels
- **Ultrasonic** - Water level measurement

### Supported Actuators
- **Water Pumps** - Automated irrigation
- **LED Grow Lights** - Lighting control
- **Fans** - Air circulation
- **Heaters** - Temperature control

## 🌐 MQTT Topics

```
verdanist/greenhouse/{device_id}/sensors/{sensor_type}
verdanist/greenhouse/{device_id}/status/online
verdanist/greenhouse/{device_id}/controls/{actuator}
```

## 📊 API Endpoints

### Sensors
- `GET /api/sensors/latest` - Latest sensor readings
- `GET /api/sensors/history/:type` - Historical data
- `POST /api/sensors` - Add sensor reading

### Devices
- `GET /api/devices` - List all devices
- `POST /api/devices/register` - Register new device
- `POST /api/devices/:id/control` - Control device

### Health
- `GET /health` - System health check

## 🔒 Security

- **Environment variables** for sensitive data
- **JWT authentication** (optional)
- **HTTPS** on Railway (automatic)
- **Database encryption** at rest

## 📈 Monitoring

- **Health checks** built-in
- **Logging system** for debugging
- **Performance metrics** on Railway
- **Error tracking** and alerts

## 🚀 Deployment

### Railway (Recommended)
1. Push to GitHub
2. Connect Railway to GitHub
3. Deploy backend service
4. Add PostgreSQL database
5. Deploy frontend service
6. Configure environment variables

See [RAILWAY_SETUP_GUIDE.md](./RAILWAY_SETUP_GUIDE.md) for complete steps.

## 📚 Documentation

- [Railway Setup Guide](./RAILWAY_SETUP_GUIDE.md)
- [IoT Integration Guide](./docs/IOT_GREENHOUSE_SYSTEM_GUIDE.md)
- [Budget Options](./docs/BUDGET_MURAH_IOT_GUIDE.md)
- [Complete System Report](./docs/COMPREHENSIVE_SYSTEM_REPORT.md)

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
3. Make your changes
4. Test thoroughly
5. Submit pull request

## 📞 Support

- **Issues**: GitHub Issues
- **Documentation**: See docs folder
- **Community**: GitHub Discussions

## 📄 License

MIT License - Free for commercial and personal use

---

## 🎯 Quick Deployment

**Ready to deploy in 15 minutes on Railway (free forever):**

1. **Push to GitHub**: `git push origin main`
2. **Setup Railway**: Connect repository
3. **Deploy Services**: Backend + Database + Frontend
4. **Go Live**: Your IoT system is online!

🚀 **Start your smart greenhouse journey today!**
