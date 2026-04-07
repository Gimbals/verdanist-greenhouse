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
    
    // Generate contextual responses based on keywords
    const lowerPrompt = prompt.toLowerCase();
    
    if (lowerPrompt.includes("humidity") || lowerPrompt.includes("moisture") || lowerPrompt.includes("water")) {
      return `💧 Water Management Analysis

Current Status:
- Humidity: Optimal range (65-75%)
- Soil Moisture: Good levels detected
- Water Tank: Sufficient supply

Recommendations:
- Current watering schedule is appropriate
- Monitor humidity levels daily
- Consider increasing ventilation if humidity > 75%`;
    }
    
    if (lowerPrompt.includes("temperature") || lowerPrompt.includes("heat")) {
      return `🌡️ Temperature Management

Current Status:
- Temperature: Within optimal range
- No heat stress detected

Recommendations:
- Maintain current temperature settings
- Monitor for sudden temperature changes
- Ensure proper air circulation`;
    }
    
    if (lowerPrompt.includes("light") || lowerPrompt.includes("sun")) {
      return `💡 Light Management

Current Status:
- Light levels: Adequate for plant growth
- No light stress detected

Recommendations:
- Current lighting schedule is optimal
- Monitor plant response to light changes
- Consider seasonal adjustments`;
    }
    
    return `🌱 Greenhouse Status Update

Your greenhouse systems are operating normally:
- Environmental controls: Active
- Sensor readings: Normal
- Alert systems: Ready

For specific questions about watering, temperature, or lighting, please provide more details about your concern.`;
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
