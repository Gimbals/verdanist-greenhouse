import { motion } from "motion/react";
import { Wifi, WifiOff, Activity, Clock, AlertCircle } from "lucide-react";
import { useRealtimeData } from "../hooks/useRealtimeData";
import { useTheme } from "../context/ThemeContext";

export function RealtimeStatus() {
  const { isConnected, isRealtimeActive, lastUpdate, connectionError } = useRealtimeData();
  const { theme } = useTheme();

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center gap-3 px-4 py-2 rounded-xl transition-all"
      style={{
        background: isConnected 
          ? theme === 'dark' ? 'rgba(137, 204, 65, 0.15)' : 'rgba(40, 149, 27, 0.08)'
          : theme === 'dark' ? 'rgba(239, 68, 68, 0.15)' : 'rgba(239, 68, 68, 0.08)',
        border: `1.5px solid ${isConnected 
          ? theme === 'dark' ? 'rgba(137, 204, 65, 0.3)' : 'rgba(40, 149, 27, 0.2)'
          : theme === 'dark' ? 'rgba(239, 68, 68, 0.3)' : 'rgba(239, 68, 68, 0.2)'}`,
      }}
    >
      <div className="flex items-center gap-2">
        {isConnected ? (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            <Wifi 
              size={16} 
              style={{ 
                color: theme === 'dark' ? '#89CC41' : '#28951B' 
              }} 
            />
          </motion.div>
        ) : (
          <WifiOff 
            size={16} 
            style={{ 
              color: theme === 'dark' ? '#ef4444' : '#d4183d' 
            }} 
          />
        )}
        
        <div className="flex flex-col">
          <span 
            style={{ 
              fontFamily: "Poppins, sans-serif", 
              fontSize: "0.75rem", 
              fontWeight: 600,
              color: isConnected 
                ? theme === 'dark' ? '#89CC41' : '#28951B'
                : theme === 'dark' ? '#ef4444' : '#d4183d'
            }}
          >
            {isConnected ? 'Real-time Active' : 'Disconnected'}
          </span>
          
          {lastUpdate && (
            <span 
              style={{ 
                fontFamily: "Poppins, sans-serif", 
                fontSize: "0.65rem",
                color: theme === 'dark' ? '#8aab6a' : '#6b8a55',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <Clock size={10} />
              {lastUpdate.toLocaleTimeString()}
            </span>
          )}
        </div>
      </div>

      {isRealtimeActive && isConnected && (
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-2 h-2 rounded-full"
          style={{ background: theme === 'dark' ? '#89CC41' : '#28951B' }}
        />
      )}

      {connectionError && (
        <motion.div
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-1"
        >
          <AlertCircle size={12} style={{ color: '#ef4444' }} />
          <span 
            style={{ 
              fontFamily: "Poppins, sans-serif", 
              fontSize: "0.65rem", 
              color: '#ef4444' 
            }}
          >
            {connectionError}
          </span>
        </motion.div>
      )}
    </motion.div>
  );
}
