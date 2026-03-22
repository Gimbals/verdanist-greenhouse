import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { motion } from "motion/react";
import { Leaf, Mail, Lock, User, ArrowRight, ArrowLeft } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { toast } from "sonner";
import { projectId, publicAnonKey } from "../../../utils/supabase/info";

export function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login, loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
        const res = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-204a7b79/signup`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${publicAnonKey}`
            },
            body: JSON.stringify({ email, password, name })
        });
        
        const data = await res.json();
        
        if (!res.ok) {
            throw new Error(data.error || "Failed to create account");
        }
        
        toast.success("Account created successfully!");
        
        // Auto login
        await login(email, password);
        navigate("/dashboard");
        
    } catch (error: any) {
        console.error(error);
        toast.error(error.message);
    } finally {
        setIsSubmitting(false);
    }
  };

  const handleGoogleRegister = async () => {
    try {
      await loginWithGoogle();
    } catch (error) {
      console.error("Google registration failed:", error);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFFF0] flex items-center justify-center p-4 font-['Poppins']">
      {/* Back Button */}
      <Link 
        to="/" 
        className="fixed top-6 left-6 flex items-center gap-2 text-[#28951B] hover:text-[#1a3a10] font-semibold transition-colors group"
      >
        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
        <span className="hidden sm:inline">Back to Home</span>
      </Link>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8 md:p-12 border border-[#E6F786]"
      >
        <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#E6F786] mb-6 text-[#28951B] shadow-lg shadow-[#E6F786]/50">
            <Leaf className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-bold text-[#1a3a10] mb-2">Join Verdanist</h1>
          <p className="text-[#4a6a35]">Start monitoring your greenhouse today</p>
        </div>

        {/* Google Register Button */}
        <button 
          onClick={handleGoogleRegister}
          className="w-full bg-white border-2 border-gray-200 hover:border-[#E6F786] text-[#1a3a10] font-semibold py-3.5 rounded-xl transition-all hover:-translate-y-0.5 active:scale-[0.98] flex items-center justify-center gap-3 mb-6"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Continue with Google
        </button>

        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-white text-[#4a6a35]">Or register with email</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
            <div>
            <label className="block text-sm font-medium text-[#1a3a10] mb-2 ml-1">Full Name</label>
            <div className="relative">
              <User className="absolute left-4 top-3.5 w-5 h-5 text-[#4a6a35]/60" />
              <input 
                type="text" 
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-[#E6F786] bg-[#FFFFF0]/50 focus:ring-2 focus:ring-[#28951B] focus:border-transparent outline-none transition-all text-[#1a3a10] placeholder-[#4a6a35]/40"
                placeholder="John Doe"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#1a3a10] mb-2 ml-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-3.5 w-5 h-5 text-[#4a6a35]/60" />
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-[#E6F786] bg-[#FFFFF0]/50 focus:ring-2 focus:ring-[#28951B] focus:border-transparent outline-none transition-all text-[#1a3a10] placeholder-[#4a6a35]/40"
                placeholder="farmer@verdanist.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#1a3a10] mb-2 ml-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-3.5 w-5 h-5 text-[#4a6a35]/60" />
              <input 
                type="password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-[#E6F786] bg-[#FFFFF0]/50 focus:ring-2 focus:ring-[#28951B] focus:border-transparent outline-none transition-all text-[#1a3a10] placeholder-[#4a6a35]/40"
                placeholder="Create a strong password"
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full bg-[#28951B] hover:bg-[#1a3a10] text-white font-bold py-4 rounded-xl shadow-lg shadow-[#28951B]/20 transition-all hover:-translate-y-1 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isSubmitting ? "Creating Account..." : "Create Account"}
            {!isSubmitting && <ArrowRight className="w-5 h-5" />}
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-[#4a6a35]">
          Already have an account?{' '}
          <Link to="/login" className="text-[#28951B] font-bold hover:underline">
            Sign In
          </Link>
        </div>
      </motion.div>
    </div>
  );
}