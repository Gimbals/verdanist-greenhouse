import { Outlet } from "react-router";
import { AuthProvider } from "../context/AuthContext";

export function AuthWrapper() {
  return (
    <AuthProvider>
      <Outlet />
    </AuthProvider>
  );
}
