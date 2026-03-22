import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router";
import { useAuth } from "../context/AuthContext";
import { toast } from "sonner";

export function AuthCallbackPage() {
  const { supabase } = useAuth();
  const [status, setStatus] = useState<"working" | "error">("working");

  const oauthError = useMemo(() => {
    const url = new URL(window.location.href);
    const error =
      url.searchParams.get("error_description") ||
      url.searchParams.get("error") ||
      url.searchParams.get("message");
    return error;
  }, []);

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      try {
        if (oauthError) {
          setStatus("error");
          toast.error(decodeURIComponent(oauthError));
          return;
        }

        // Ensure OAuth redirect URL is processed (PKCE code exchange)
        await supabase.auth.initialize();

        // Wait briefly for session to settle (avoids race on slow networks)
        for (let i = 0; i < 10; i++) {
          const { data, error } = await supabase.auth.getSession();
          if (error) throw error;
          if (data.session?.user) {
            if (!cancelled) {
              // Hindari useNavigate di sini untuk mencegah error Router context.
              window.location.replace("/dashboard");
            }
            return;
          }
          await new Promise((r) => setTimeout(r, 250));
        }

        setStatus("error");
        toast.error("Login berhasil, tapi sesi belum terbaca. Silakan coba lagi.");
      } catch (e: any) {
        console.error("OAuth callback error:", e);
        setStatus("error");
        toast.error(e?.message || "Gagal memproses login Google");
      }
    };

    run();

    return () => {
      cancelled = true;
    };
  }, [oauthError, supabase]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#E6F786] font-['Poppins'] p-6">
      <div className="bg-white rounded-2xl shadow-xl border border-[#E6F786] p-8 w-full max-w-md">
        {status === "working" ? (
          <div className="flex flex-col items-center gap-4">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#28951B]" />
            <div className="text-center">
              <div className="text-[#1a3a10] font-bold text-lg">
                Menyelesaikan login Google…
              </div>
              <div className="text-[#4a6a35] text-sm mt-1">
                Mohon tunggu sebentar.
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center space-y-3">
            <div className="text-[#1a3a10] font-bold text-lg">
              Login Google gagal
            </div>
            <div className="text-[#4a6a35] text-sm">
              Silakan kembali ke halaman login dan coba lagi.
            </div>
            <Link
              to="/login"
              className="inline-flex items-center justify-center w-full bg-[#28951B] hover:bg-[#1a3a10] text-white font-bold py-3 rounded-xl transition-colors"
            >
              Kembali ke Login
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

