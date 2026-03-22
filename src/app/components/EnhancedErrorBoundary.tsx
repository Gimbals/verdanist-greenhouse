import React, { Component, ErrorInfo, ReactNode } from 'react';
import { motion } from 'motion/react';
import { AlertTriangle, RefreshCw, Bug, Home, Settings } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
  errorId: string;
  retryCount: number;
}

export class EnhancedErrorBoundary extends Component<Props, State> {
  private maxRetries = 3;

  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      errorId: this.generateErrorId(),
      retryCount: 0,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorId: `ERR-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      retryCount: 0,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('EnhancedErrorBoundary caught an error:', error, errorInfo);
    
    this.setState({
      error,
      errorInfo,
    });

    // Call custom error handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // Log error details for debugging
    this.logError(error, errorInfo);
  }

  private generateErrorId = (): string => {
    return `ERR-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  };

  private logError = (error: Error, errorInfo: ErrorInfo) => {
    const errorDetails = {
      id: this.state.errorId,
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href,
    };

    // Store in localStorage for debugging
    const errors = JSON.parse(localStorage.getItem('verdanist-errors') || '[]');
    errors.push(errorDetails);
    localStorage.setItem('verdanist-errors', JSON.stringify(errors.slice(-10))); // Keep last 10 errors

    // In production, you would send this to your error tracking service
    if (process.env.NODE_ENV === 'production') {
      // Send to error tracking service (Sentry, LogRocket, etc.)
      console.log('Error logged to tracking service:', errorDetails);
    }
  };

  private handleRetry = () => {
    if (this.state.retryCount < this.maxRetries) {
      this.setState(prevState => ({
        hasError: false,
        error: undefined,
        errorInfo: undefined,
        retryCount: prevState.retryCount + 1,
        errorId: this.generateErrorId(),
      }));
    }
  };

  private handleGoHome = () => {
    window.location.href = '/';
  };

  private handleReload = () => {
    window.location.reload();
  };

  private copyErrorDetails = () => {
    const errorDetails = {
      id: this.state.errorId,
      message: this.state.error?.message,
      stack: this.state.error?.stack,
      componentStack: this.state.errorInfo?.componentStack,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href,
    };

    navigator.clipboard.writeText(JSON.stringify(errorDetails, null, 2));
  };

  render() {
    if (this.state.hasError) {
      // If custom fallback is provided, use it
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default error UI
      return <ErrorFallback 
        error={this.state.error}
        errorInfo={this.state.errorInfo}
        errorId={this.state.errorId}
        retryCount={this.state.retryCount}
        maxRetries={this.maxRetries}
        onRetry={this.handleRetry}
        onGoHome={this.handleGoHome}
        onReload={this.handleReload}
        onCopyError={this.copyErrorDetails}
      />;
    }

    return this.props.children;
  }
}

interface ErrorFallbackProps {
  error?: Error;
  errorInfo?: ErrorInfo;
  errorId: string;
  retryCount: number;
  maxRetries: number;
  onRetry: () => void;
  onGoHome: () => void;
  onReload: () => void;
  onCopyError: () => void;
}

function ErrorFallback({
  error,
  errorInfo,
  errorId,
  retryCount,
  maxRetries,
  onRetry,
  onGoHome,
  onReload,
  onCopyError,
}: ErrorFallbackProps) {
  const { theme } = useTheme();

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4"
      style={{
        background: theme === 'dark' ? '#1a3a10' : '#E6F786',
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="max-w-lg w-full"
      >
        <div 
          className="rounded-2xl p-8 shadow-2xl"
          style={{
            background: theme === 'dark' ? '#2d4a1e' : '#ffffff',
            border: `2px solid ${theme === 'dark' ? 'rgba(239, 68, 68, 0.3)' : 'rgba(239, 68, 68, 0.2)'}`,
          }}
        >
          {/* Error Icon */}
          <div className="flex justify-center mb-6">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 2 }}
              className="w-16 h-16 rounded-full flex items-center justify-center"
              style={{
                background: theme === 'dark' ? 'rgba(239, 68, 68, 0.15)' : 'rgba(239, 68, 68, 0.1)',
              }}
            >
              <AlertTriangle 
                size={32} 
                style={{ 
                  color: theme === 'dark' ? '#ef4444' : '#d4183d' 
                }} 
              />
            </motion.div>
          </div>

          {/* Error Title */}
          <h1 
            className="text-center mb-4"
            style={{
              fontFamily: 'Poppins, sans-serif',
              fontSize: '1.5rem',
              fontWeight: 700,
              color: theme === 'dark' ? '#ef4444' : '#d4183d',
            }}
          >
            Oops! Something went wrong
          </h1>

          {/* Error Message */}
          <p 
            className="text-center mb-6"
            style={{
              fontFamily: 'Poppins, sans-serif',
              fontSize: '0.95rem',
              color: theme === 'dark' ? '#8aab6a' : '#6b8a55',
              lineHeight: 1.5,
            }}
          >
            {error?.message || 'An unexpected error occurred while rendering this component.'}
          </p>

          {/* Error ID */}
          <div 
            className="text-center mb-6 p-3 rounded-lg"
            style={{
              background: theme === 'dark' ? 'rgba(0, 0, 0, 0.2)' : 'rgba(0, 0, 0, 0.05)',
            }}
          >
            <span 
              style={{
                fontFamily: 'monospace',
                fontSize: '0.8rem',
                color: theme === 'dark' ? '#89CC41' : '#28951B',
              }}
            >
              Error ID: {errorId}
            </span>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            {retryCount < maxRetries && (
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={onRetry}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl transition-all"
                style={{
                  background: 'linear-gradient(135deg, #28951B, #89CC41)',
                  color: 'white',
                  fontFamily: 'Poppins, sans-serif',
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  border: 'none',
                }}
              >
                <RefreshCw size={18} />
                Try Again ({maxRetries - retryCount} attempts left)
              </motion.button>
            )}

            <div className="grid grid-cols-2 gap-3">
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={onGoHome}
                className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl transition-all"
                style={{
                  background: theme === 'dark' ? 'rgba(137, 204, 65, 0.15)' : 'rgba(40, 149, 27, 0.08)',
                  color: theme === 'dark' ? '#89CC41' : '#28951B',
                  fontFamily: 'Poppins, sans-serif',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  border: `1px solid ${theme === 'dark' ? 'rgba(137, 204, 65, 0.3)' : 'rgba(40, 149, 27, 0.2)'}`,
                }}
              >
                <Home size={16} />
                Go Home
              </motion.button>

              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={onReload}
                className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl transition-all"
                style={{
                  background: theme === 'dark' ? 'rgba(137, 204, 65, 0.15)' : 'rgba(40, 149, 27, 0.08)',
                  color: theme === 'dark' ? '#89CC41' : '#28951B',
                  fontFamily: 'Poppins, sans-serif',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  border: `1px solid ${theme === 'dark' ? 'rgba(137, 204, 65, 0.3)' : 'rgba(40, 149, 27, 0.2)'}`,
                }}
              >
                <RefreshCw size={16} />
                Reload
              </motion.button>
            </div>

            {/* Debug Info (Development) */}
            {process.env.NODE_ENV === 'development' && (
              <details className="mt-4">
                <summary 
                  className="cursor-pointer p-2 rounded-lg text-sm font-medium"
                  style={{
                    background: theme === 'dark' ? 'rgba(0, 0, 0, 0.2)' : 'rgba(0, 0, 0, 0.05)',
                    color: theme === 'dark' ? '#8aab6a' : '#6b8a55',
                  }}
                >
                  <div className="flex items-center gap-2">
                    <Bug size={16} />
                    Debug Information
                  </div>
                </summary>
                <div className="mt-3 space-y-3">
                  <div className="flex gap-2">
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={onCopyError}
                      className="flex items-center gap-1 px-3 py-1 rounded text-sm"
                      style={{
                        background: theme === 'dark' ? 'rgba(137, 204, 65, 0.15)' : 'rgba(40, 149, 27, 0.08)',
                        color: theme === 'dark' ? '#89CC41' : '#28951B',
                        fontFamily: 'Poppins, sans-serif',
                        fontSize: '0.75rem',
                        border: `1px solid ${theme === 'dark' ? 'rgba(137, 204, 65, 0.3)' : 'rgba(40, 149, 27, 0.2)'}`,
                      }}
                    >
                      Copy Error Details
                    </motion.button>
                  </div>
                  
                  {error && (
                    <div>
                      <h4 
                        style={{
                          fontFamily: 'Poppins, sans-serif',
                          fontSize: '0.8rem',
                          fontWeight: 600,
                          color: theme === 'dark' ? '#ef4444' : '#d4183d',
                          marginBottom: '8px',
                        }}
                      >
                        Error Stack:
                      </h4>
                      <pre 
                        className="p-3 rounded-lg text-xs overflow-auto max-h-32"
                        style={{
                          background: theme === 'dark' ? 'rgba(0, 0, 0, 0.3)' : 'rgba(0, 0, 0, 0.05)',
                          color: theme === 'dark' ? '#8aab6a' : '#6b8a55',
                          fontFamily: 'monospace',
                        }}
                      >
                        {error.stack}
                      </pre>
                    </div>
                  )}
                  
                  {errorInfo && (
                    <div>
                      <h4 
                        style={{
                          fontFamily: 'Poppins, sans-serif',
                          fontSize: '0.8rem',
                          fontWeight: 600,
                          color: theme === 'dark' ? '#ef4444' : '#d4183d',
                          marginBottom: '8px',
                        }}
                      >
                        Component Stack:
                      </h4>
                      <pre 
                        className="p-3 rounded-lg text-xs overflow-auto max-h-32"
                        style={{
                          background: theme === 'dark' ? 'rgba(0, 0, 0, 0.3)' : 'rgba(0, 0, 0, 0.05)',
                          color: theme === 'dark' ? '#8aab6a' : '#6b8a55',
                          fontFamily: 'monospace',
                        }}
                      >
                        {errorInfo.componentStack}
                      </pre>
                    </div>
                  )}
                </div>
              </details>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
