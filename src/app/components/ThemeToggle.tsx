import { motion } from "motion/react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  const handleClick = () => {
    console.log('Theme toggle clicked, current theme:', theme);
    toggleTheme();
  };

  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      onClick={handleClick}
      className="relative w-12 h-6 rounded-full transition-colors duration-300 cursor-pointer"
      style={{
        background: theme === 'dark' 
          ? 'linear-gradient(135deg, #1a3a10, #2d4a1e)' 
          : 'linear-gradient(135deg, #E6F786, #89CC41)',
        border: `1.5px solid ${theme === 'dark' ? 'rgba(168, 216, 99, 0.3)' : 'rgba(137, 204, 65, 0.18)'}`,
      }}
      aria-label="Toggle theme"
    >
      <motion.div
        animate={{
          x: theme === 'dark' ? 24 : 0,
        }}
        transition={{
          type: "spring",
          stiffness: 500,
          damping: 30
        }}
        className="absolute top-0.5 w-5 h-5 rounded-full flex items-center justify-center"
        style={{
          background: theme === 'dark' ? '#89CC41' : '#ffffff',
          boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
        }}
      >
        {theme === 'dark' ? (
          <Moon size={12} style={{ color: '#1a3a10' }} />
        ) : (
          <Sun size={12} style={{ color: '#28951B' }} />
        )}
      </motion.div>
    </motion.button>
  );
}
