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

// Singleton instance
let geminiService: GeminiService | null = null;

export function getGeminiService(): GeminiService {
  if (!geminiService) {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (!apiKey || apiKey === 'your-gemini-api-key-here') {
      console.warn("Gemini API key not found. Using simulation mode.");
      throw new Error("Gemini API key not configured");
    }
    geminiService = new GeminiService(apiKey);
  }
  return geminiService;
}
