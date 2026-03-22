import { RouterProvider } from "react-router";
import { router } from "./routes";
import { GreenhouseProvider } from "./context/GreenhouseContext";
import { ThemeProvider } from "./context/ThemeContext";
import { Toaster } from "sonner";
import { EnhancedErrorBoundary } from "./components/EnhancedErrorBoundary";
import { SmartControls } from "./components/SmartControls";

export default function App() {
  return (
    <EnhancedErrorBoundary
      onError={(error, errorInfo) => {
        // Log to external service in production
        console.error('Global error caught:', error, errorInfo);
      }}
    >
      <ThemeProvider>
        <GreenhouseProvider>
          <Toaster position="top-right" richColors />
          <RouterProvider router={router} />
          <SmartControls />
        </GreenhouseProvider>
      </ThemeProvider>
    </EnhancedErrorBoundary>
  );
}
