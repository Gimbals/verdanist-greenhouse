import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { projectId, publicAnonKey } from "../../../utils/supabase/info";
import { toast } from "sonner";

// Initialize Supabase client
const supabase = createClient(
  `https://${projectId}.supabase.co`,
  publicAnonKey,
  {
    auth: {
      // PKCE is recommended for SPAs (more secure than implicit flow)
      flowType: "pkce",
      detectSessionInUrl: true,
      persistSession: true,
      autoRefreshToken: true,
    },
  }
);

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password?: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  updateProfile: (payload: { name?: string }) => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
  supabase: SupabaseClient;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check active session
    const checkSession = async () => {
      try {
        // Important for OAuth redirects: process session from URL if present
        await supabase.auth.initialize();
        const { data: { session }, error } = await supabase.auth.getSession();
        if (session?.user) {
          setUser({
            id: session.user.id,
            email: session.user.email || "",
            name: session.user.user_metadata?.name || "User",
          });
        }
      } catch (err) {
        console.error("Session check failed", err);
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser({
            id: session.user.id,
            email: session.user.email || "",
            name: session.user.user_metadata?.name || "User",
        });
      } else {
        setUser(null);
      }
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password?: string) => {
    if (!password) {
        toast.error("Password required for login");
        return;
    }

    try {
        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) throw error;
        toast.success("Successfully logged in");
    } catch (error: any) {
        console.error("Login error:", error);
        const msg = error?.message ?? "";
        const isNetworkError =
          msg === "Failed to fetch" ||
          msg === "Network request failed" ||
          error?.name === "TypeError";
        if (isNetworkError) {
          toast.error(
            "Koneksi gagal. Cek internet Anda atau buka Supabase Dashboard dan pastikan project tidak paused."
          );
        } else {
          toast.error(msg || "Failed to login");
        }
        throw error;
    }
  };

  const loginWithGoogle = async () => {
    try {
        setIsLoading(true);
        // Dynamic redirect URL based on environment
        const isProduction = window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1';
        const baseUrl = isProduction ? 'https://verdanist-greenhouse-g3e6.vercel.app' : window.location.origin;
        const redirectTo = `${baseUrl}/auth/callback`;
        
        console.log("🔐 Google OAuth Debug:");
        console.log("- Is Production:", isProduction);
        console.log("- Base URL:", baseUrl);
        console.log("- Redirect URL:", redirectTo);
        console.log("- Project ID:", projectId);
        
        const { error } = await supabase.auth.signInWithOAuth({
            provider: "google",
            options: { redirectTo },
        });

        console.log("🔐 OAuth Response:", error);
        
        if (error) throw error;
    } catch (error: any) {
        console.error("Login with Google error:", error);
        const msg = error?.message ?? "";
        const isNetworkError =
          msg === "Failed to fetch" ||
          msg === "Network request failed" ||
          error?.name === "TypeError";
        if (isNetworkError) {
          toast.error(
            "Koneksi gagal. Cek internet atau pastikan project Supabase tidak paused di dashboard."
          );
        } else {
          toast.error(msg || "Failed to login with Google");
        }
    } finally {
        setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
        await supabase.auth.signOut();
        setUser(null);
        toast.success("Logged out");
    } catch (error) {
        console.error("Logout error", error);
    }
  };

  const updateProfile = async (payload: { name?: string }) => {
    try {
      const updates: Record<string, string> = {};
      if (payload.name) {
        updates.name = payload.name;
      }

      if (Object.keys(updates).length === 0) {
        return;
      }

      const { data, error } = await supabase.auth.updateUser({
        data: updates,
      });

      if (error) throw error;

      if (data.user) {
        setUser((prev) =>
          prev
            ? {
                ...prev,
                name: data.user.user_metadata?.name || prev.name,
              }
            : prev
        );
      }

      toast.success("Profile updated");
    } catch (error: any) {
      console.error("Update profile error", error);
      toast.error(error.message || "Failed to update profile");
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, loginWithGoogle, updateProfile, logout, isLoading, supabase }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}