import { motion, AnimatePresence } from "motion/react";
import { Link } from "react-router";
import { 
  Leaf, 
  ArrowRight, 
  BarChart3, 
  Wifi, 
  Smartphone, 
  CheckCircle2, 
  Droplets, 
  Sun, 
  Wind, 
  Thermometer, 
  Sprout, 
  CloudRain,
  Activity,
  Zap,
  Layers,
  Globe,
  ShieldCheck,
  ChevronRight,
  Menu,
  X,
  Play,
  Settings,
  Bell
} from "lucide-react";
import { useState, useEffect, useRef } from "react";

// --- Components ---

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav 
      className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled 
          ? "bg-[#FFFFF0]/90 backdrop-blur-md shadow-sm border-b border-[#E6F786]" 
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center gap-2">
            <motion.div 
              whileHover={{ rotate: 10, scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="w-10 h-10 rounded-xl bg-[#28951B] flex items-center justify-center text-white shadow-lg shadow-[#28951B]/20 cursor-pointer"
            >
              <Leaf className="w-6 h-6" />
            </motion.div>
            <span className="font-bold text-2xl tracking-tight text-[#1a3a10]">Verdanist</span>
          </div>
          
          <div className="hidden md:flex items-center gap-8">
            {["Features", "How it Works", "Mobile App"].map((item) => (
              <a 
                key={item} 
                href={`#${item.toLowerCase().replace(/\s/g, '-')}`} 
                className="text-[#4a6a35] hover:text-[#28951B] font-medium transition-colors relative group"
              >
                {item}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#28951B] transition-all group-hover:w-full"></span>
              </a>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-4">
            <Link to="/login" className="text-[#28951B] font-semibold hover:text-[#1a3a10] transition-colors">
              Log In
            </Link>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link 
                to="/register" 
                className="bg-[#28951B] hover:bg-[#1a3a10] text-white px-6 py-2.5 rounded-full font-semibold transition-colors shadow-lg shadow-[#28951B]/20"
              >
                Get Started
              </Link>
            </motion.div>
          </div>

          <div className="md:hidden">
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-[#1a3a10]">
              {isMobileMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-[#FFFFF0] border-b border-[#E6F786] overflow-hidden"
          >
            <div className="px-4 py-4 space-y-4">
              {["Features", "How it Works", "Mobile App"].map((item) => (
                <a 
                  key={item} 
                  href={`#${item.toLowerCase().replace(/\s/g, '-')}`}
                  className="block text-[#4a6a35] font-medium py-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item}
                </a>
              ))}
              <div className="pt-4 border-t border-[#E6F786] flex flex-col gap-3">
                <Link to="/login" className="text-center text-[#28951B] font-semibold py-2">Log In</Link>
                <Link to="/register" className="bg-[#28951B] text-white text-center py-3 rounded-xl font-semibold">Get Started</Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const AnimatedBar = ({ height, delay }: { height: number; delay: number }) => (
  <motion.div
    initial={{ height: "10%" }}
    animate={{ height: `${height}%` }}
    transition={{
      duration: 1.5,
      delay: delay,
      repeat: Infinity,
      repeatType: "reverse",
      ease: "easeInOut"
    }}
    className="w-full bg-[#28951B] rounded-t-sm opacity-80"
  />
);

const DashboardVisualizer = () => {
  return (
    <motion.div 
      initial={{ rotateX: 20, rotateY: -20, opacity: 0 }}
      animate={{ rotateX: 0, rotateY: 0, opacity: 1 }}
      transition={{ duration: 1, ease: "easeOut" }}
      className="relative w-full max-w-[550px]"
      style={{ perspective: 1000 }}
    >
      <motion.div 
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="relative bg-white/60 backdrop-blur-xl border border-white/50 rounded-3xl shadow-2xl p-6 overflow-hidden z-10"
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-6 border-b border-[#E6F786]/50 pb-4">
           <div className="flex gap-2">
              <div className="w-3 h-3 rounded-full bg-red-400"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
              <div className="w-3 h-3 rounded-full bg-green-400"></div>
           </div>
           <div className="flex items-center gap-2">
             <div className="flex items-center gap-1 bg-[#E6F786] px-2 py-1 rounded-full">
               <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#28951B] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#28951B]"></span>
              </span>
              <span className="text-[10px] font-bold text-[#1a3a10] tracking-wide">LIVE</span>
             </div>
           </div>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-2 gap-4">
           {/* Chart */}
           <div className="col-span-2 bg-white rounded-2xl p-5 shadow-sm border border-[#E6F786]/30">
              <div className="flex justify-between items-center mb-4">
                 <div>
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Soil Moisture</h4>
                    <p className="text-2xl font-bold text-[#1a3a10]">68%</p>
                 </div>
                 <div className="bg-green-100 text-green-700 px-2 py-1 rounded-lg text-xs font-bold flex items-center">
                    <Activity className="w-3 h-3 mr-1" /> Optimal
                 </div>
              </div>
              <div className="h-24 flex items-end justify-between gap-2 px-1">
                 {[40, 60, 45, 70, 50, 80, 65, 75, 68].map((h, i) => (
                    <AnimatedBar key={i} height={h} delay={i * 0.1} />
                 ))}
              </div>
           </div>

           {/* Card 1 */}
           <motion.div 
             whileHover={{ scale: 1.02 }}
             className="bg-[#28951B] text-white p-4 rounded-2xl shadow-lg relative overflow-hidden"
           >
              <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full blur-xl -mr-10 -mt-10"></div>
              <Thermometer className="w-6 h-6 mb-3 text-[#E6F786]" />
              <div className="text-3xl font-bold mb-1">24°C</div>
              <div className="text-xs text-[#E6F786]">Temperature</div>
           </motion.div>

           {/* Card 2 */}
           <motion.div 
             whileHover={{ scale: 1.02 }}
             className="bg-white p-4 rounded-2xl shadow-sm border border-[#E6F786]/30"
           >
              <Droplets className="w-6 h-6 mb-3 text-blue-500" />
              <div className="text-3xl font-bold mb-1 text-[#1a3a10]">42%</div>
              <div className="text-xs text-gray-500">Humidity</div>
           </motion.div>
        </div>

        {/* Notification Toast Animation */}
        <motion.div 
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 2, duration: 0.5 }}
          className="absolute bottom-6 right-6 bg-[#1a3a10] text-white p-3 rounded-xl shadow-xl flex items-center gap-3 z-20 max-w-[200px]"
        >
           <div className="bg-[#28951B] p-1.5 rounded-full">
             <CheckCircle2 className="w-4 h-4" />
           </div>
           <div>
             <div className="text-xs font-bold">System Optimized</div>
             <div className="text-[10px] text-gray-300">Watering schedule updated</div>
           </div>
        </motion.div>

      </motion.div>
      
      {/* Decorative Back Elements */}
      <div className="absolute top-10 -right-10 w-full h-full bg-[#E6F786]/30 rounded-[3rem] -z-10 transform rotate-6"></div>
      <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-[#28951B]/10 rounded-full blur-2xl -z-10"></div>
    </motion.div>
  );
};

const HeroSection = () => {
  return (
    <section className="pt-32 pb-20 lg:pt-48 lg:pb-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden relative">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[1000px] bg-[#E6F786]/20 rounded-full blur-[120px] -z-10"></div>
      
      <div className="grid lg:grid-cols-2 gap-16 items-center">
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative z-10"
        >
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#E6F786]/40 text-[#1a3a10] font-bold text-sm mb-8 border border-[#E6F786] backdrop-blur-sm shadow-sm"
          >
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#28951B] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-[#28951B]"></span>
            </span>
            #1 Smart Greenhouse Platform
          </motion.div>
          
          <h1 className="text-5xl lg:text-7xl font-bold leading-[1.1] mb-6 text-[#1a3a10] tracking-tight">
            Cultivate the <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#28951B] to-[#76BC57] relative">
              Future of Farming
              <svg className="absolute w-full h-3 -bottom-1 left-0 text-[#E6F786] -z-10" viewBox="0 0 100 10" preserveAspectRatio="none">
                 <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="8" fill="none" />
              </svg>
            </span>
          </h1>
          
          <p className="text-xl text-[#4a6a35] mb-10 leading-relaxed max-w-lg">
             Unlock nature's full potential with Verdanist. 
             Automated climate control, real-time analytics, and peace of mind for modern growers.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link 
                to="/register" 
                className="inline-flex items-center justify-center gap-2 bg-[#28951B] hover:bg-[#1a3a10] text-white px-8 py-4 rounded-full font-bold text-lg transition-colors shadow-xl shadow-[#28951B]/30"
              >
                Join Now
                <ArrowRight className="w-5 h-5" />
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link 
                to="/dashboard" 
                className="inline-flex items-center justify-center gap-2 bg-white hover:bg-[#E6F786]/20 text-[#28951B] border-2 border-[#E6F786] px-8 py-4 rounded-full font-bold text-lg transition-colors"
              >
                <Play className="w-5 h-5 fill-current" />
                See How It Works
              </Link>
            </motion.div>
          </div>
        </motion.div>
        
        <div className="flex items-center justify-center relative">
           <DashboardVisualizer />
        </div>
      </div>
      
      {/* Scroll Indicator */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-[#4a6a35]/60"
      >
        <span className="text-xs uppercase tracking-widest font-bold">Scroll</span>
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M7 13l5 5 5-5M7 6l5 5 5-5"/>
          </svg>
        </motion.div>
      </motion.div>
    </section>
  );
};

const FeatureCard = ({ icon: Icon, title, description, delay }: { icon: any, title: string, description: string, delay: number }) => (
  <motion.div 
    initial={{ opacity: 0, y: 50 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-50px" }}
    transition={{ delay, duration: 0.6, ease: "easeOut" }}
    whileHover={{ y: -10, boxShadow: "0 25px 50px -12px rgba(40, 149, 27, 0.15)" }}
    className="bg-white p-8 rounded-[2rem] border border-[#E6F786]/60 shadow-sm relative overflow-hidden group h-full flex flex-col"
  >
    {/* Background Hover Effect */}
    <div className="absolute inset-0 bg-gradient-to-br from-[#E6F786]/0 to-[#E6F786]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
    
    <div className="w-16 h-16 rounded-2xl bg-[#FFFFF0] border border-[#E6F786] flex items-center justify-center mb-6 text-[#28951B] group-hover:bg-[#28951B] group-hover:text-white group-hover:scale-110 transition-all duration-300 shadow-sm relative z-10">
      <Icon className="w-8 h-8" />
    </div>
    
    <h3 className="text-xl font-bold text-[#1a3a10] mb-3 relative z-10">{title}</h3>
    <p className="text-[#4a6a35] leading-relaxed relative z-10 flex-grow">{description}</p>
    
    <div className="mt-6 flex items-center text-[#28951B] font-bold text-sm relative z-10 group-hover:translate-x-2 transition-transform duration-300">
      Learn more <ChevronRight className="w-4 h-4 ml-1" />
    </div>
  </motion.div>
);

const WhyChooseSection = () => {
  return (
    <section id="features" className="py-24 bg-[#FFFFF0] relative overflow-hidden">
      {/* Decorative blobs */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#E6F786]/20 rounded-full blur-[100px] -z-10"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#28951B]/5 rounded-full blur-[100px] -z-10"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20 max-w-3xl mx-auto">
          <motion.div
             initial={{ opacity: 0, y: 20 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true }}
          >
            <span className="text-[#28951B] font-bold tracking-widest uppercase text-xs border border-[#28951B]/20 px-3 py-1 rounded-full bg-white">Features</span>
            <h2 className="text-4xl md:text-5xl font-bold text-[#1a3a10] mt-6 mb-6">WHY CHOSE VERDANIST?</h2>
            <p className="text-xl text-[#4a6a35]">
              We don't just monitor data; we provide an ecosystem that breathes with your plants.
            </p>
          </motion.div>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <FeatureCard 
            icon={Activity} 
            title="Real-Time Analytics" 
            description="Track every vital statistic of your greenhouse with millisecond precision. Our dashboard updates instantly."
            delay={0}
          />
          <FeatureCard 
            icon={Zap} 
            title="Automated Actions" 
            description="Set triggers for irrigation, fans, and lights. Let the system handle the routine while you focus on growth."
            delay={0.1}
          />
          <FeatureCard 
            icon={Sprout} 
            title="Yield Optimization" 
            description="Historical data analysis helps you understand the perfect conditions for maximizing your crop yield."
            delay={0.2}
          />
           <FeatureCard 
            icon={Layers} 
            title="Multi-Zone Support" 
            description="Manage distinct climate zones within a single greenhouse or across multiple locations easily."
            delay={0.3}
          />
           <FeatureCard 
            icon={CloudRain} 
            title="Weather Integration" 
            description="Smart adjustments based on local weather forecasts to save energy and water efficiently."
            delay={0.4}
          />
           <FeatureCard 
            icon={ShieldCheck} 
            title="Secure & Reliable" 
            description="Enterprise-grade encryption keeps your data safe. Offline mode ensures your plants are never left unattended."
            delay={0.5}
          />
        </div>
      </div>
    </section>
  );
};

const HowItWorksSection = () => {
  const steps = [
    {
      number: "01",
      title: "Connect Devices",
      description: "Install Verdanist sensors in your soil and air. They pair automatically with our secure hub.",
      icon: Wifi
    },
    {
      number: "02",
      title: "Configure Dashboard",
      description: "Set your crop's ideal ranges. Our AI suggests the best settings for your specific plants.",
      icon: Settings
    },
    {
      number: "03",
      title: "Automate & Monitor",
      description: "Relax as Verdanist manages irrigation and climate. Get notified only when it matters.",
      icon: CheckCircle2
    }
  ];

  return (
    <section id="how-it-works" className="py-32 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-24">
          <span className="text-[#28951B] font-bold tracking-widest uppercase text-xs border border-[#28951B]/20 px-3 py-1 rounded-full bg-[#FFFFF0]">Workflow</span>
          <h2 className="text-4xl md:text-5xl font-bold text-[#1a3a10] mt-6 mb-6">HOW IT WORKS</h2>
          <p className="text-xl text-[#4a6a35] max-w-2xl mx-auto">
             Simple setup. Powerful results.
          </p>
        </div>

        <div className="relative grid md:grid-cols-3 gap-12">
          {/* Connector Line Animation */}
          <div className="hidden md:block absolute top-16 left-[15%] right-[15%] h-1 bg-gray-100 z-0 rounded-full overflow-hidden">
             <motion.div 
               initial={{ width: "0%" }}
               whileInView={{ width: "100%" }}
               viewport={{ once: true }}
               transition={{ duration: 1.5, delay: 0.5 }}
               className="h-full bg-[#28951B]"
             />
          </div>
          
          {steps.map((step, index) => (
            <motion.div 
              key={index}
              className="relative flex flex-col items-center text-center group"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.3 }}
            >
              <div className="relative mb-8">
                 <motion.div 
                   whileHover={{ scale: 1.1, rotate: 360 }}
                   transition={{ duration: 0.8, type: "spring" }}
                   className="w-32 h-32 rounded-full bg-white border-4 border-[#28951B] flex items-center justify-center relative z-10 shadow-xl"
                 >
                   <step.icon className="w-12 h-12 text-[#28951B]" />
                 </motion.div>
                 <div className="absolute -top-4 -right-4 w-12 h-12 bg-[#E6F786] text-[#1a3a10] rounded-full flex items-center justify-center font-bold text-lg border-4 border-white shadow-md z-20">
                    {step.number}
                 </div>
              </div>

              <h3 className="text-2xl font-bold text-[#1a3a10] mb-4 group-hover:text-[#28951B] transition-colors">{step.title}</h3>
              <p className="text-[#4a6a35] leading-relaxed max-w-xs">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const ManageAnywhereSection = () => {
  return (
    <section id="mobile-app" className="py-24 bg-[#1a3a10] text-white overflow-hidden relative">
      {/* Background Animated Blobs */}
      <motion.div 
        animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
        transition={{ duration: 20, repeat: Infinity }}
        className="absolute top-0 right-0 w-[800px] h-[800px] bg-[#28951B] rounded-full blur-[150px] opacity-20 pointer-events-none mix-blend-screen"
      />
      <motion.div 
         animate={{ scale: [1, 1.3, 1], x: [0, -50, 0] }}
         transition={{ duration: 15, repeat: Infinity }}
         className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-[#E6F786] rounded-full blur-[150px] opacity-10 pointer-events-none mix-blend-screen"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          <motion.div
             initial={{ opacity: 0, x: -50 }}
             whileInView={{ opacity: 1, x: 0 }}
             viewport={{ once: true }}
             transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#E6F786]/20 text-[#E6F786] font-medium text-sm mb-6 border border-[#E6F786]/20 backdrop-blur-md">
              <Globe className="w-4 h-4" />
              Global Access
            </div>
            <h2 className="text-4xl md:text-6xl font-bold mb-8 leading-tight">
              Manage anywhere <br/> 
              <span className="text-[#E6F786]">anytime.</span>
            </h2>
            <p className="text-xl text-white/80 mb-10 leading-relaxed">
              Whether you're at the market, on vacation, or just in the living room, Verdanist keeps you connected to your greenhouse 24/7.
            </p>
            
            <div className="space-y-6 mb-12">
               {[
                 { title: "Real-time Push Notifications", desc: "Get alerts instantly if values go out of range." },
                 { title: "Remote Manual Override", desc: "Turn on sprinklers or fans with a single tap." },
                 { title: "Multi-Greenhouse View", desc: "Manage all your locations from one dashboard." }
               ].map((item, i) => (
                 <motion.div 
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.2 }}
                    className="flex gap-4"
                 >
                    <div className="mt-1 min-w-[24px]">
                       <div className="w-6 h-6 rounded-full bg-[#28951B] flex items-center justify-center shadow-lg shadow-[#28951B]/50 border border-[#E6F786]/30">
                         <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                       </div>
                    </div>
                    <div>
                       <h4 className="font-bold text-lg">{item.title}</h4>
                       <p className="text-white/60 text-sm">{item.desc}</p>
                    </div>
                 </motion.div>
               ))}
            </div>

            <div className="flex gap-4">
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-3 bg-[#E6F786] text-[#1a3a10] px-8 py-4 rounded-full font-bold text-lg hover:bg-white transition-colors shadow-xl shadow-[#E6F786]/20"
              >
                <Smartphone className="w-5 h-5" />
                Download App
              </motion.button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, rotate: 10, y: 100 }}
            whileInView={{ opacity: 1, rotate: -6, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, type: "spring", bounce: 0.2 }}
            className="relative flex justify-center lg:justify-end"
          >
            {/* Phone Mockup */}
            <div className="relative w-[320px] h-[650px] bg-[#121212] rounded-[3rem] border-8 border-[#2d2d2d] overflow-hidden shadow-2xl shadow-black/50 ring-1 ring-white/10 z-10">
               <div className="absolute top-0 w-full h-8 bg-[#121212] z-20 flex justify-center">
                 <div className="w-32 h-6 bg-[#1a1a1a] rounded-b-xl"></div>
               </div>
               
               {/* Phone Screen Content */}
               <div className="w-full h-full bg-[#f8fafc] flex flex-col p-5 pt-12 overflow-hidden relative">
                  {/* Status Bar Mock */}
                  <div className="flex justify-between items-center mb-6">
                    <div>
                       <div className="text-xs text-gray-500 uppercase tracking-wide font-bold">Good Morning</div>
                       <div className="text-[#1a3a10] font-bold text-xl">My Greenhouse</div>
                    </div>
                    <div className="w-10 h-10 overflow-hidden rounded-full border-2 border-[#E6F786]">
                      <img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80" alt="User" className="w-full h-full object-cover" />
                    </div>
                  </div>
                  
                  {/* Main Status Card */}
                  <motion.div 
                    animate={{ scale: [1, 1.02, 1] }}
                    transition={{ repeat: Infinity, duration: 5 }}
                    className="bg-[#28951B] text-white p-5 rounded-3xl shadow-lg mb-4 relative overflow-hidden"
                  >
                     <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>
                     <div className="flex justify-between items-start mb-4">
                       <div>
                         <div className="text-white/80 text-sm">Status</div>
                         <div className="text-2xl font-bold flex items-center gap-2">
                           Optimal
                         </div>
                       </div>
                       <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center animate-pulse">
                         <Wifi className="w-4 h-4" />
                       </div>
                     </div>
                     <div className="flex gap-2 text-xs font-semibold bg-white/20 p-2 rounded-xl w-fit">
                       <span className="w-2 h-2 bg-[#E6F786] rounded-full animate-pulse"></span>
                       Updating live
                     </div>
                  </motion.div>

                  {/* Sensor Grid */}
                  <div className="grid grid-cols-2 gap-3 mb-4">
                     <div className="bg-white p-4 rounded-3xl shadow-sm border border-gray-100">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mb-2">
                          <Droplets className="w-5 h-5 text-blue-600" />
                        </div>
                        <div className="text-2xl font-bold text-[#1a3a10]">45%</div>
                        <div className="text-xs text-gray-500 font-medium">Humidity</div>
                     </div>
                     <div className="bg-white p-4 rounded-3xl shadow-sm border border-gray-100">
                        <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center mb-2">
                          <Thermometer className="w-5 h-5 text-orange-600" />
                        </div>
                        <div className="text-2xl font-bold text-[#1a3a10]">24°C</div>
                        <div className="text-xs text-gray-500 font-medium">Temp</div>
                     </div>
                  </div>

                  {/* Chart Area */}
                  <div className="flex-1 bg-white rounded-3xl border border-gray-100 p-5 shadow-sm overflow-hidden">
                    <div className="text-sm font-bold text-[#1a3a10] mb-4 flex justify-between">
                      <span>Statistics</span>
                      <span className="text-[#28951B]">Week</span>
                    </div>
                    <div className="flex items-end justify-between h-20 gap-2">
                        {[30, 45, 35, 60, 50, 75, 65].map((h, i) => (
                           <motion.div 
                             key={i} 
                             initial={{ height: 0 }}
                             animate={{ height: `${h}%` }}
                             transition={{ duration: 1, delay: 0.5 + i * 0.1, repeat: Infinity, repeatType: "reverse", repeatDelay: 3 }}
                             className="w-full bg-[#E6F786] rounded-t-lg hover:bg-[#28951B] transition-colors"
                           ></motion.div>
                        ))}
                    </div>
                  </div>
                  
                  {/* Floating Notification */}
                  <motion.div 
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 2, duration: 0.5 }}
                    className="absolute bottom-6 left-4 right-4 bg-white/95 backdrop-blur-md p-3 rounded-2xl shadow-xl border border-gray-100 flex items-center gap-3 z-30"
                  >
                    <div className="bg-[#28951B] p-2 rounded-full text-white">
                       <Bell className="w-3 h-3" />
                    </div>
                    <div>
                       <div className="text-xs font-bold text-[#1a3a10]">Alert Resolved</div>
                       <div className="text-[10px] text-gray-500">Temperature normalized</div>
                    </div>
                  </motion.div>
               </div>
            </div>

            {/* Back Elements for Phone */}
            <div className="absolute top-20 -right-20 w-64 h-64 bg-[#E6F786] rounded-full blur-[80px] opacity-40"></div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

const CTASection = () => {
   return (
      <section className="py-24 bg-[#FFFFF0] relative overflow-hidden">
         <div className="absolute inset-0">
            <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-[#E6F786]/30 rounded-full blur-[100px]"></div>
            <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-[#28951B]/10 rounded-full blur-[100px]"></div>
         </div>

         <div className="max-w-4xl mx-auto px-4 relative z-10 text-center">
            <motion.div
               initial={{ opacity: 0, scale: 0.9 }}
               whileInView={{ opacity: 1, scale: 1 }}
               viewport={{ once: true }}
               transition={{ duration: 0.8 }}
            >
               <h2 className="text-4xl md:text-6xl font-bold text-[#1a3a10] mb-8 leading-tight">
                  Ready to optimize your <br/> greenhouse?
               </h2>
               <p className="text-xl text-[#4a6a35] mb-12 max-w-2xl mx-auto">
                  Join thousands of modern farmers who have increased their yields and reduced resource waste with Verdanist.
               </p>
               
               <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                     <Link 
                        to="/register" 
                        className="bg-[#28951B] text-white px-10 py-5 rounded-full font-bold text-xl shadow-xl shadow-[#28951B]/30 hover:bg-[#1a3a10] transition-colors flex items-center gap-3"
                     >
                        Get Started Now
                        <ArrowRight className="w-6 h-6" />
                     </Link>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                     <a href="mailto:sales@verdanist.com" className="text-[#1a3a10] font-bold text-lg hover:underline decoration-2 underline-offset-4">
                        Contact Sales
                     </a>
                  </motion.div>
               </div>

               <div className="mt-16 flex flex-wrap justify-center gap-8 text-[#4a6a35]/60 font-semibold uppercase tracking-wider text-sm">
                  <span>Startups</span>
                  <span>•</span>
                  <span>Enterprises</span>
                  <span>•</span>
                  <span>Home Growers</span>
                  <span>•</span>
                  <span>Education</span>
               </div>
            </motion.div>
         </div>
      </section>
   );
};

const Footer = () => {
   return (
      <footer className="bg-[#1a3a10] text-white pt-20 pb-10 border-t border-[#E6F786]/10">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-4 gap-12 mb-16">
               <div className="col-span-1 md:col-span-2">
                  <div className="flex items-center gap-2 mb-6">
                     <div className="w-8 h-8 rounded-lg bg-[#28951B] flex items-center justify-center">
                        <Leaf className="w-5 h-5 text-white" />
                     </div>
                     <span className="font-bold text-2xl tracking-tight">Verdanist</span>
                  </div>
                  <p className="text-white/60 max-w-sm leading-relaxed mb-6">
                     Empowering growers with intelligent insights and automation. 
                     Sustainable farming for a better future.
                  </p>
                  <div className="flex gap-4">
                     {['Twitter', 'LinkedIn', 'Instagram'].map(social => (
                        <a key={social} href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#28951B] transition-colors">
                           <span className="sr-only">{social}</span>
                           <Globe className="w-5 h-5" />
                        </a>
                     ))}
                  </div>
               </div>
               
               <div>
                  <h4 className="font-bold text-lg mb-6 text-[#E6F786]">Platform</h4>
                  <ul className="space-y-4 text-white/70">
                     <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                     <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                     <li><a href="#" className="hover:text-white transition-colors">Hardware</a></li>
                     <li><a href="#" className="hover:text-white transition-colors">Integrations</a></li>
                  </ul>
               </div>

               <div>
                  <h4 className="font-bold text-lg mb-6 text-[#E6F786]">Company</h4>
                  <ul className="space-y-4 text-white/70">
                     <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
                     <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                     <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                     <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
                  </ul>
               </div>
            </div>

            <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center text-white/40 text-sm">
               <p>© 2024 Verdanist Inc. All rights reserved.</p>
               <div className="flex gap-6 mt-4 md:mt-0">
                  <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
                  <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
               </div>
            </div>
         </div>
      </footer>
   );
};

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#FFFFF0] font-sans selection:bg-[#28951B] selection:text-white">
      <Navbar />
      <HeroSection />
      <WhyChooseSection />
      <HowItWorksSection />
      <ManageAnywhereSection />
      <CTASection />
      <Footer />
    </div>
  );
}