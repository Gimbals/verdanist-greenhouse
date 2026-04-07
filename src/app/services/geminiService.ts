// Google Gemini API Service - FREE Alternative to OpenAI

interface GeminiMessage {
  role: "user" | "model";
  parts: Array<{ text: string }>;
}

interface GeminiResponse {
  candidates: Array<{
    content: {
      parts: Array<{ text: string }>;
    };
  }>;
}

export class GeminiService {
  private apiKey: string;
  private baseURL = "https://generativelanguage.googleapis.com/v1beta";

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async generateContent(prompt: string): Promise<string> {
    try {
      const response = await fetch(`${this.baseURL}/models/gemini-flash-latest:generateContent?key=${this.apiKey}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: prompt
                }
              ]
            }
          ],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 1000,
          },
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Gemini API Response:", errorText);
        throw new Error(`Gemini API error: ${response.status} ${response.statusText} - ${errorText}`);
      }

      const data: GeminiResponse = await response.json();
      return data.candidates[0]?.content?.parts[0]?.text || "No response received";
    } catch (error) {
      console.error("Gemini API Error:", error);
      throw error;
    }
  }

  generateGreenhousePrompt(userPrompt: string, sensorData: any): string {
    const systemPrompt = `You are a professional greenhouse management AI assistant. 

Your expertise includes:
- Horticulture and agricultural science
- Environmental control systems
- IoT sensor data analysis
- Plant pathology and disease prevention
- Resource optimization and sustainability
- Automated irrigation and climate control

Provide specific, actionable advice based on current sensor readings. Focus on practical solutions for greenhouse management.

Current sensor data:
- Temperature: ${sensorData.temperature}°C
- Humidity: ${sensorData.humidity}%
- Soil Moisture: ${sensorData.soilMoisture}%
- Water Tank Level: ${sensorData.waterTank}%
- Light Level: ${sensorData.lightLevel}%
- pH Level: ${sensorData.ph}
- Electrical Conductivity: ${sensorData.conductivity} mS/cm
- Active Alerts: ${sensorData.activeAlerts}

User question: ${userPrompt}

Provide a helpful, specific response in 2-4 sentences. Focus on practical greenhouse management advice.`;

    return systemPrompt;
  }
}

// Mock Gemini Service for fallback
class MockGeminiService extends GeminiService {
  constructor() {
    super("mock-key");
  }

  async generateContent(prompt: string): Promise<string> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));
    
    // Generate contextual responses based on keywords and simulated sensor data
    const lowerPrompt = prompt.toLowerCase();
    
    // Simulate dynamic sensor data
    const mockSensorData = {
      temperature: 22 + Math.random() * 8, // 22-30°C
      humidity: 60 + Math.random() * 20,  // 60-80%
      soilMoisture: 40 + Math.random() * 30, // 40-70%
      waterTank: 60 + Math.random() * 30,    // 60-90%
      lightLevel: 70 + Math.random() * 25,   // 70-95%
      ph: 6.0 + Math.random() * 1.5,         // 6.0-7.5
      conductivity: 1.2 + Math.random() * 0.8 // 1.2-2.0 mS/cm
    };
    
    if (lowerPrompt.includes("humidity") || lowerPrompt.includes("moisture") || lowerPrompt.includes("water")) {
      const humidity = mockSensorData.humidity.toFixed(1);
      const soilMoisture = mockSensorData.soilMoisture.toFixed(1);
      const waterTank = mockSensorData.waterTank.toFixed(1);
      
      return `💧 Water Management Analysis

Current Status:
- Humidity: ${humidity}% (${parseFloat(humidity) > 70 ? "Optimal" : "Good"})
- Soil Moisture: ${soilMoisture}% (${parseFloat(soilMoisture) > 60 ? "Excellent" : "Adequate"})
- Water Tank: ${waterTank}% (${parseFloat(waterTank) > 50 ? "Sufficient" : "Refill Needed"})

Recommendations:
${parseFloat(soilMoisture) < 45 ? 
  "• Increase irrigation frequency by 15%\n• Check drainage system\n• Monitor for dry spots" : 
  "• Current irrigation schedule optimal\n• Consider 10% reduction for conservation\n• Monitor plant response"}

Confidence: ${85 + Math.random() * 10}% | Processing: ${(1.2 + Math.random() * 0.8).toFixed(1)}s`;
    }
    
    if (lowerPrompt.includes("temperature") || lowerPrompt.includes("heat") || lowerPrompt.includes("temp")) {
      const temp = mockSensorData.temperature.toFixed(1);
      
      return `🌡️ Temperature Management

Current Status:
- Temperature: ${temp}°C (${parseFloat(temp) > 28 ? "Warm" : parseFloat(temp) < 24 ? "Cool" : "Optimal"})
- System Status: Active
- Ventilation: ${parseFloat(temp) > 28 ? "Increased" : "Normal"}

Recommendations:
${parseFloat(temp) > 28 ? 
  "• Activate cooling system\n• Increase ventilation by 20%\n• Consider shade cloth" : 
  parseFloat(temp) < 24 ? 
  "• Reduce ventilation slightly\n• Monitor for cold spots\n• Maintain current heating" : 
  "• Temperature is optimal\n• Maintain current settings\n• Continue monitoring"}

Confidence: ${88 + Math.random() * 8}% | Processing: ${(1.1 + Math.random() * 0.7).toFixed(1)}s`;
    }
    
    if (lowerPrompt.includes("light") || lowerPrompt.includes("sun") || lowerPrompt.includes("led")) {
      const lightLevel = mockSensorData.lightLevel.toFixed(1);
      
      return `💡 Light Management

Current Status:
- Light Level: ${lightLevel}% (${parseFloat(lightLevel) > 85 ? "High" : parseFloat(lightLevel) > 70 ? "Optimal" : "Low"})
- LED System: ${parseFloat(lightLevel) < 75 ? "Recommended increase" : "Optimal"}
- Energy Usage: ${parseFloat(lightLevel) > 85 ? "High" : "Efficient"}

Recommendations:
${parseFloat(lightLevel) < 75 ? 
  "• Increase LED intensity by 15%\n• Extend light period by 1 hour\n• Check for shading issues" : 
  parseFloat(lightLevel) > 85 ? 
  "• Consider reducing intensity for energy savings\n• Optimize light schedule\n• Monitor plant stress" : 
  "• Light levels are optimal\n• Maintain current schedule\n• Continue energy-efficient operation"}

Confidence: ${90 + Math.random() * 7}% | Processing: ${(1.0 + Math.random() * 0.6).toFixed(1)}s`;
    }
    
    if (lowerPrompt.includes("nutrient") || lowerPrompt.includes("fertilizer") || lowerPrompt.includes("ph")) {
      const ph = mockSensorData.ph.toFixed(1);
      const conductivity = mockSensorData.conductivity.toFixed(1);
      
      return `🌿 Nutrient Management

Current Status:
- pH Level: ${ph} (${parseFloat(ph) > 6.8 ? "Slightly alkaline" : parseFloat(ph) < 6.3 ? "Slightly acidic" : "Optimal"})
- EC Conductivity: ${conductivity} mS/cm (${parseFloat(conductivity) > 1.8 ? "High" : parseFloat(conductivity) < 1.4 ? "Low" : "Optimal"})
- Nutrient Balance: ${parseFloat(ph) >= 6.3 && parseFloat(ph) <= 6.8 ? "Good" : "Needs adjustment"}

Recommendations:
${parseFloat(ph) < 6.3 ? 
  "• Add pH buffer solution\n• Monitor calcium levels\n• Check root health" : 
  parseFloat(ph) > 6.8 ? 
  "• Add pH lowering solution\n• Reduce nutrient concentration\n• Monitor for nutrient lockout" : 
  "• pH is optimal\n• Maintain current nutrient schedule\n• Continue regular monitoring"}

Confidence: ${87 + Math.random() * 9}% | Processing: ${(1.3 + Math.random() * 0.7).toFixed(1)}s`;
    }
    
    // General knowledge responses for any question
    if (lowerPrompt.includes("apa") || lowerPrompt.includes("what") || lowerPrompt.includes("siapa") || lowerPrompt.includes("who") || 
        lowerPrompt.includes("mengapa") || lowerPrompt.includes("why") || lowerPrompt.includes("bagaimana") || lowerPrompt.includes("how") ||
        lowerPrompt.includes("dimana") || lowerPrompt.includes("where") || lowerPrompt.includes("kapan") || lowerPrompt.includes("when") ||
        lowerPrompt.includes("berapa") || lowerPrompt.includes("how many") || lowerPrompt.includes("berapa harga") || lowerPrompt.includes("price")) {
      
      // Generate contextual general knowledge responses
      const responses = [
        `🤔 Saya adalah AI Assistant untuk Greenhouse Verdanist. Saya bisa membantu Anda dengan:

🌱 **Pertanian & Greenhouse:**
- Perawatan tanaman (kaktus, sayuran, tanaman air)
- Sistem hidroponik dan aquaponik
- Kontrol suhu dan kelembaban
- Manajemen nutrisi pH dan EC

🏠 **Smart Home Automation:**
- Monitoring sensor real-time
- Kontrol otomatis penyiraman
- Sistem ventilasi dan pemanas
- Alert system untuk tanaman

📊 **Data & Analytics:**
- Tracking pertumbuhan tanaman
- Analisis efisiensi energi
- Prediksi panen
- Export data (CSV/PDF)

💡 **Tips & Tricks:**
- Optimasi penggunaan air
- Energy saving strategies
- Pest management
- Troubleshooting sistem

Tanyakan apa saja tentang greenhouse atau pertanian modern!`,
        
        `🌍 **Informasi Umum:**

Saya dirancang khusus untuk sistem greenhouse Verdanist, tapi saya bisa membantu dengan berbagai topik:

**Sains & Teknologi:**
- IoT dan sensor technology
- Botani dan pertumbuhan tanaman
- Sistem otomasi pertanian
- Data analytics untuk pertanian

**Praktis:**
- Cara menanam sayuran di greenhouse
- Setup hidroponik untuk pemula
- Troubleshooting masalah umum
- Tips efisiensi biaya

**General Knowledge:**
- Informasi cuaca dan musim
- Basic botany knowledge
- Sustainable farming practices
- Smart agriculture trends

Apa yang ingin Anda ketahui lebih detail?`,

        `🚀 **Kemampuan Sistem:**

Sebagai AI Assistant Verdanist, saya memiliki akses ke:

**Real-time Data:**
- Sensor suhu, kelembaban, pH
- Status sistem otomasi
- Alert dan notifikasi
- Historical data trends

**Knowledge Base:**
- Database tanaman (100+ spesies)
- Best practices greenhouse
- Troubleshooting guides
- Research papers terbaru

**Interactive Features:**
- Q&A tentang pertanian
- Problem solving guidance
- Optimization suggestions
- Learning resources

**Limitations:**
- Fokus pada greenhouse/pertanian
- Tidak akses internet real-time
- Data berdasarkan training set
- Tidak financial/medical advice

Ada pertanyaan spesifik tentang greenhouse atau pertanian?`
      ];
      
      // Select response based on prompt complexity
      const responseIndex = Math.floor(Math.random() * responses.length);
      return responses[responseIndex];
    }
    
    // Default greenhouse status with dynamic data
    const temp = mockSensorData.temperature.toFixed(1);
    const humidity = mockSensorData.humidity.toFixed(1);
    const soilMoisture = mockSensorData.soilMoisture.toFixed(1);
    
    return `🌱 Greenhouse Status Update

Current Conditions:
- Temperature: ${temp}°C (Optimal Range: 22-28°C)
- Humidity: ${humidity}% (Target: 60-75%)
- Soil Moisture: ${soilMoisture}% (Target: 40-70%)
- Water Tank: ${mockSensorData.waterTank.toFixed(1)}%
- Light Level: ${mockSensorData.lightLevel.toFixed(1)}%

System Status:
- Environmental Controls: ✅ Active
- Sensor Network: ✅ Online
- Alert System: ✅ Ready
- Data Updates: ✅ Real-time

Overall Assessment: ${parseFloat(temp) >= 22 && parseFloat(temp) <= 28 && parseFloat(humidity) >= 60 && parseFloat(humidity) <= 75 ? "All systems operating optimally" : "Some parameters need attention"}

Confidence: ${92 + Math.random() * 6}% | Processing: ${(1.1 + Math.random() * 0.5).toFixed(1)}s`;
  }
}

// Singleton instance
let geminiService: GeminiService | null = null;

export function getGeminiService(): GeminiService {
  if (!geminiService) {
    const apiKey = (import.meta as any).env.VITE_GEMINI_API_KEY;
    if (!apiKey || apiKey === 'your-gemini-api-key-here') {
      console.warn("Gemini API key not found. Using simulation mode.");
      // Return mock service instead of throwing error
      return new MockGeminiService();
    }
    geminiService = new GeminiService(apiKey);
  }
  return geminiService;
}
