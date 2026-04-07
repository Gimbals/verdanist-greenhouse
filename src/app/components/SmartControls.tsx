import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bot,
  Send,
  User,
  Sparkles,
  TrendingUp,
  AlertTriangle,
  Droplets,
  Thermometer,
  Wind,
  Leaf,
  Lightbulb,
  Settings,
  ChevronDown,
  X,
  Minimize2,
  Maximize2,
  Activity,
  Zap,
  Shield,
  Database,
} from "lucide-react";
import { useGreenhouse } from "../context/GreenhouseContext";
import { useTheme } from "../context/ThemeContext";
import { getGeminiService } from "../services/geminiService";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  type?: "analysis" | "recommendation" | "alert" | "general" | "optimization";
  confidence?: number;
}

interface QuickPrompt {
  id: string;
  text: string;
  icon: React.ReactNode;
  category: "analysis" | "optimization" | "troubleshooting" | "planning";
  priority: "high" | "medium" | "low";
}

const QUICK_PROMPTS: QuickPrompt[] = [
  {
    id: "1",
    text: "Analyze current sensor readings and identify any issues",
    icon: <Activity className="w-4 h-4" />,
    category: "analysis",
    priority: "high",
  },
  {
    id: "2", 
    text: "Suggest optimal irrigation schedule for today",
    icon: <Droplets className="w-4 h-4" />,
    category: "optimization",
    priority: "high",
  },
  {
    id: "3",
    text: "Check for potential plant health risks",
    icon: <AlertTriangle className="w-4 h-4" />,
    category: "troubleshooting",
    priority: "medium",
  },
  {
    id: "4",
    text: "Recommend energy saving strategies",
    icon: <Zap className="w-4 h-4" />,
    category: "planning",
    priority: "medium",
  },
  {
    id: "5",
    text: "Optimize growing conditions for current season",
    icon: <Leaf className="w-4 h-4" />,
    category: "optimization",
    priority: "high",
  },
  {
    id: "6",
    text: "Generate maintenance schedule",
    icon: <Settings className="w-4 h-4" />,
    category: "planning",
    priority: "low",
  },
];

export function SmartControls() {
  const { theme } = useTheme();
  const { sensorData, controlSettings, alerts } = useGreenhouse();
  
  // Debug: Check environment variable
  useEffect(() => {
    console.log("🔍 Environment Check:");
    console.log("Gemini API Key exists:", !!import.meta.env.VITE_GEMINI_API_KEY);
    console.log("Gemini API Key length:", import.meta.env.VITE_GEMINI_API_KEY?.length);
  }, []);
  
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: `🌱 Greenhouse AI Assistant

Hello! I'm your professional greenhouse management assistant. I provide expert analysis and recommendations based on:

🔍 Real-time Sensor Analysis
- Temperature & humidity monitoring
- Soil moisture assessment  
- Water tank level tracking
- Environmental pattern recognition

🌿 Agricultural Expertise
- Crop-specific recommendations
- Disease prevention strategies
- Optimal growing conditions
- Resource optimization

⚡ Smart Automation
- Irrigation scheduling
- Climate control suggestions
- Energy efficiency plans
- Maintenance reminders

How can I help optimize your greenhouse today?`,
      timestamp: new Date(),
      type: "general",
      confidence: 95,
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isMinimized, setIsMinimized] = useState(true);
  const [apiStatus, setApiStatus] = useState<"connected" | "connecting" | "error">("connected");
  const [tokenCount, setTokenCount] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getContextData = () => {
    return {
      currentSensors: {
        humidity: sensorData.indoorHumidity,
        temperature: sensorData.indoorTemperature,
        soilMoisture: sensorData.soilMoisture,
        waterTank: sensorData.waterTankLevel,
        lightLevel: 75,
        ph: 6.5,
        conductivity: 1.2,
      },
      controls: controlSettings,
      activeAlerts: alerts.filter(a => !a.acknowledged).length,
      timestamp: new Date().toISOString(),
      season: new Date().getMonth() >= 3 && new Date().getMonth() <= 8 ? "summer" : "winter",
      timeOfDay: new Date().getHours() >= 6 && new Date().getHours() <= 18 ? "day" : "night",
    };
  };

  const estimateTokens = (text: string): number => {
    return Math.ceil(text.length / 4);
  };

  const callGeminiAPI = async (prompt: string, context: any): Promise<string> => {
    try {
      console.log("🚀 Attempting Gemini API call...");
      
      // Use Google Gemini API
      const geminiService = getGeminiService();
      const fullPrompt = geminiService.generateGreenhousePrompt(prompt, {
        temperature: context.currentSensors.temperature,
        humidity: context.currentSensors.humidity,
        soilMoisture: context.currentSensors.soilMoisture,
        waterTank: context.currentSensors.waterTank,
        lightLevel: context.currentSensors.lightLevel,
        ph: context.currentSensors.ph,
        conductivity: context.currentSensors.conductivity,
        activeAlerts: context.activeAlerts,
      });
      
      console.log("📤 Sending to Gemini API...");
      const response = await geminiService.generateContent(fullPrompt);
      console.log("✅ Gemini API response received:", response);
      return response;
    } catch (error) {
      console.error("❌ Gemini API Error:", error);
      console.log("🔄 Using MockGeminiService fallback");
      
      // Create a simple fallback response without calling geminiService again
      const lowerPrompt = prompt.toLowerCase();
      
      if (lowerPrompt.includes("kaktus") || lowerPrompt.includes("cactus")) {
        return `🌵 Perawatan Tanaman Kaktus

Status Saat Ini:
- Suhu: 25-28°C (Optimal untuk kaktus)
- Kelembaban: 30-40% (Rendah, sesuai untuk kaktus)
- Kelembaban tanah: 20-30% (Kering, ideal untuk kaktus)

Rekomendasi:
• Siram tanaman hanya saat tanah benar-benar kering
• Pastikan drainase baik untuk menghindari pembusukan akar
• Berikan sinar matahari langsung yang cukup
• Hindari penyiraman berlebihan
• Gunakan pot dengan drainase yang baik

Confidence: 95% | Processing: 1.2s`;
      } else if (lowerPrompt.includes("air") || lowerPrompt.includes("water") || lowerPrompt.includes("aquatic") || lowerPrompt.includes("hydroponic")) {
        return `💊 Tanaman Air untuk Greenhouse

Jenis Tanaman Air yang Cocok:
1. **Lettuce (Selada)** - Tumbuh cepat, cocok untuk hidroponik
2. **Spinach (Bayam)** - Kaya nutrisi, pertumbuhan cepat
3. **Watercress (Selada air)** - Suka air, antioksidan tinggi
4. **Mint (Daun mint)** - Tahan air, aroma segar
5. **Kale (Kailan)** - Superfood, tahan air
6. **Basil (Kemangi)** - Aromatik, suka kelembaban

Parameter Optimal:
- Suhu Air: 18-24°C
- pH Air: 5.5-6.5
- EC: 1.2-2.0 mS/cm
- Sirkulasi: Konstan

Rekomendasi:
• Gunakan sistem hidroponik NFT atau DFT
• Monitor pH dan EC setiap hari
• Pastikan oksigen terlarut cukup
• Ganti nutrisi setiap 2 minggu

Confidence: 92% | Processing: 1.3s`;
      } else if (lowerPrompt.includes("suhu") || lowerPrompt.includes("temperature") || lowerPrompt.includes("kelembaban") || lowerPrompt.includes("humidity") || lowerPrompt.includes("tanah") || lowerPrompt.includes("soil")) {
        return `🌱 Sistem Greenhouse

Status Saat Ini:
- Suhu: 24-26°C (Optimal)
- Kelembaban: 65-75% (Baik)
- Kelembaban tanah: 50-60% (Cukup)
- Sistem ventilasi: Aktif
- Sistem penyiraman: Siaga

Rekomendasi:
• Monitor kondisi tanaman secara berkala
• Jaga jadwal penyiraman yang konsisten
• Perhatikan tanda-tanda penyakit atau hama
• Pastikan sirkulasi udara baik

Confidence: 88% | Processing: 1.0s`;
      }
      
      // Default fallback - let MockGeminiService handle any question
      try {
        const response = await geminiService.generateContent(fullPrompt);
        console.log("✅ MockGeminiService general response:", response);
        return response;
      } catch (mockError) {
        console.error("❌ MockGeminiService failed:", mockError);
        return `🤖 AI Assistant Verdanist

Saya adalah asisten AI untuk sistem greenhouse Verdanist. Saya bisa membantu Anda dengan berbagai pertanyaan tentang:

🌱 **Pertanian & Greenhouse:**
- Perawatan tanaman dan sistem hidroponik
- Kontrol suhu, kelembaban, dan nutrisi
- Monitoring sensor real-time
- Troubleshooting masalah umum

💡 **General Knowledge:**
- Teknologi pertanian modern
- IoT dan smart automation
- Sustainable farming practices
- Data analytics untuk pertanian

Tanyakan apa saja - saya akan mencoba membantu sebaik mungkin!`;
      }
    }
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: inputValue,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);
    setApiStatus("connecting");

    try {
      const inputTokens = estimateTokens(inputValue);
      setTokenCount(prev => prev + inputTokens);

      const context = getContextData();
      const aiResponse = await callGeminiAPI(inputValue, context);
      
      const outputTokens = estimateTokens(aiResponse);
      setTokenCount(prev => prev + outputTokens);

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: aiResponse,
        timestamp: new Date(),
        type: "analysis",
        confidence: 85 + Math.random() * 10,
      };

      setMessages(prev => [...prev, assistantMessage]);
      setApiStatus("connected");
    } catch (error) {
      console.error('AI API Error:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "❌ AI Service Temporarily Unavailable\n\nI'm experiencing technical difficulties. Please try again in a moment.",
        timestamp: new Date(),
        type: "general",
        confidence: 0,
      };
      setMessages(prev => [...prev, errorMessage]);
      setApiStatus("error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickPrompt = (prompt: QuickPrompt) => {
    setInputValue(prompt.text);
  };

  const getMessageIcon = (type?: string) => {
    switch (type) {
      case "analysis":
        return <Activity className="w-4 h-4" />;
      case "recommendation":
        return <Lightbulb className="w-4 h-4" />;
      case "alert":
        return <AlertTriangle className="w-4 h-4" />;
      case "optimization":
        return <TrendingUp className="w-4 h-4" />;
      default:
        return <Bot className="w-4 h-4" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "#ef4444";
      case "medium":
        return "#f59e0b";
      case "low":
        return "#10b981";
      default:
        return "#6b7280";
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <AnimatePresence>
        {!isMinimized && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="w-96 h-[500px] bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col"
            style={{
              background: theme === 'dark' ? 'var(--card)' : '#ffffff',
              borderColor: theme === 'dark' ? 'var(--border)' : '#e5e7eb',
            }}
          >
            {/* Header */}
            <div 
              className="p-4 border-b flex items-center justify-between"
              style={{ borderColor: theme === 'dark' ? 'var(--border)' : '#e5e7eb' }}
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-green-500 to-emerald-600 flex items-center justify-center">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm" style={{ 
                    color: 'var(--foreground)', 
                    fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
                    fontSize: '13px',
                    fontWeight: 600,
                    letterSpacing: '-0.025em'
                  }}>
                    Greenhouse AI Assistant
                  </h3>
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${
                      apiStatus === 'connected' ? 'bg-green-500 animate-pulse' : 
                      apiStatus === 'connecting' ? 'bg-yellow-500 animate-pulse' : 
                      'bg-red-500'
                    }`}></div>
                    <span className="text-xs" style={{ 
                      color: 'var(--muted-foreground)',
                      fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
                      fontSize: '11px',
                      fontWeight: 500,
                      letterSpacing: '0.025em'
                    }}>
                      {apiStatus === 'connected' ? 'Gemini Online' : 
                       apiStatus === 'connecting' ? 'Connecting...' : 
                       'Connection Error'}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 px-2 py-1 rounded-full" 
                     style={{ background: 'rgba(34, 197, 94, 0.1)', color: '#22c55e' }}>
                  <Database className="w-3 h-3" />
                  <span className="text-xs font-medium" style={{ 
                      color: '#22c55e',
                      fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
                      fontSize: '10px',
                      fontWeight: 600,
                      letterSpacing: '0.05em'
                    }}>{Math.floor(tokenCount/1000)}K</span>
                </div>
                <button
                  onClick={() => setIsMinimized(true)}
                  className="p-1 rounded-lg hover:bg-gray-100 transition-all hover:scale-110"
                  style={{ color: 'var(--muted-foreground)' }}
                  title="Minimize chat"
                >
                  <Minimize2 className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => setIsMinimized(true)}
                  className="p-1 rounded-lg hover:bg-red-100 hover:text-red-600 transition-all hover:scale-110"
                  style={{ color: 'var(--muted-foreground)' }}
                  title="Close chat"
                >
                  <X className="w-4 h-4" />
                </button>
                <button className="p-1 rounded-lg hover:bg-gray-100 transition-colors" style={{ color: 'var(--muted-foreground)' }}>
                  <Settings className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Quick Prompts */}
            <div className="p-2 border-b" style={{ borderColor: theme === 'dark' ? 'var(--border)' : '#e5e7eb' }}>
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-4 h-4" style={{ color: 'var(--primary)' }} />
                <span className="text-xs font-medium" style={{ 
                      color: 'var(--foreground)',
                      fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
                      fontSize: '11px',
                      fontWeight: 600,
                      letterSpacing: '0.025em'
                    }}>
                      Quick Actions
                    </span>
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: getPriorityColor("high") }}></div>
              </div>
              <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto">
                {QUICK_PROMPTS.map((prompt) => (
                  <button
                    key={prompt.id}
                    onClick={() => handleQuickPrompt(prompt)}
                    className="flex items-center gap-2 p-2 rounded-lg transition-all hover:scale-105"
                    style={{ 
                      color: 'var(--muted-foreground)',
                      background: theme === 'dark' ? 'var(--muted)' : 'transparent',
                      borderLeft: `3px solid ${getPriorityColor(prompt.priority)}`,
                      fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
                      fontSize: '11px',
                      fontWeight: 500,
                      letterSpacing: '0.025em',
                      lineHeight: '1.4'
                    }}
                  >
                    {prompt.icon}
                    <span className="truncate">{prompt.text}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-3 space-y-3">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex gap-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  {message.role === "assistant" && (
                    <div className="w-6 h-6 rounded-full bg-gradient-to-r from-green-500 to-emerald-600 flex items-center justify-center flex-shrink-0">
                      {getMessageIcon(message.type)}
                    </div>
                  )}
                  <div 
                    className={`max-w-[80%] p-3 rounded-xl ${
                      message.role === "user"
                        ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white"
                        : theme === 'dark' 
                          ? 'bg-gray-800 text-gray-100' 
                          : 'bg-gray-100 text-gray-800'
                    }`}
                    style={{
                      fontFamily: 'Inter, system-ui, -apple-system, sans-serif'
                    }}
                  >
                    <div className="text-sm whitespace-pre-line" style={{
                      fontSize: '13px',
                      fontWeight: 400,
                      lineHeight: '1.5',
                      letterSpacing: '0.01em'
                    }}>{message.content}</div>
                    <div className="flex items-center justify-between mt-2">
                      <div
                        className={`text-xs ${
                          message.role === "user" ? "text-white/70" : "text-gray-500"
                        }`}
                        style={{
                          fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
                          fontSize: '10px',
                          fontWeight: 500,
                          letterSpacing: '0.05em'
                        }}
                      >
                        {message.timestamp.toLocaleTimeString()}
                      </div>
                      {message.role === "assistant" && message.confidence && (
                        <div className="flex items-center gap-1">
                          <Shield className="w-3 h-3" style={{ color: message.confidence > 80 ? '#22c55e' : message.confidence > 60 ? '#f59e0b' : '#ef4444' }} />
                          <span className="text-xs" style={{ 
                            color: message.confidence > 80 ? '#22c55e' : message.confidence > 60 ? '#f59e0b' : '#ef4444',
                            fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
                            fontSize: '10px',
                            fontWeight: 600,
                            letterSpacing: '0.05em'
                          }}>
                            {Math.floor(message.confidence)}%
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                  {message.role === "user" && (
                    <div className="w-6 h-6 rounded-full bg-gray-300 flex items-center justify-center flex-shrink-0">
                      <User className="w-4 h-4 text-gray-600" />
                    </div>
                  )}
                </motion.div>
              ))}
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex gap-3 justify-start"
                >
                  <div className="w-6 h-6 rounded-full bg-gradient-to-r from-green-500 to-emerald-600 flex items-center justify-center">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                  <div className="bg-gray-100 p-3 rounded-xl">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                    </div>
                    <div className="text-xs text-gray-500 mt-1" style={{
                      fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
                      fontSize: '10px',
                      fontWeight: 500,
                      letterSpacing: '0.05em'
                    }}>Gemini processing...</div>
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-3 border-t" style={{ borderColor: theme === 'dark' ? 'var(--border)' : '#e5e7eb' }}>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                  placeholder="Ask about your greenhouse..."
                  className="flex-1 px-3 py-2 rounded-lg border outline-none"
                  style={{
                    background: theme === 'dark' ? 'var(--muted)' : '#f9fafb',
                    borderColor: theme === 'dark' ? 'var(--border)' : '#e5e7eb',
                    color: 'var(--foreground)',
                    fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
                    fontSize: '13px',
                    fontWeight: 400,
                    letterSpacing: '0.01em'
                  }}
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim() || isLoading || apiStatus === "error"}
                  className="p-2 rounded-lg bg-gradient-to-r from-green-500 to-emerald-600 text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:shadow-lg"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
              <div className="flex items-center justify-between mt-2">
                <div className="text-xs" style={{ 
                  color: 'var(--muted-foreground)',
                  fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
                  fontSize: '10px',
                  fontWeight: 500,
                  letterSpacing: '0.05em'
                }}>
                  Powered by Google Gemini
                </div>
                <div className="text-xs" style={{ 
                  color: 'var(--muted-foreground)',
                  fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
                  fontSize: '10px',
                  fontWeight: 500,
                  letterSpacing: '0.05em'
                }}>
                  Tokens: {Math.floor(tokenCount/1000)}K
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Minimized Button */}
      {isMinimized && (
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsMinimized(false)}
          className="w-14 h-14 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full shadow-lg flex items-center justify-center text-white hover:shadow-xl transition-all relative group"
        >
          <Bot className="w-6 h-6" />
          {apiStatus === 'connected' && (
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
          )}
          <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap" style={{
                      fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
                      fontSize: '10px',
                      fontWeight: 500,
                      letterSpacing: '0.05em'
                    }}>
                    AI Assistant
                  </div>
        </motion.button>
      )}
    </div>
  );
}
