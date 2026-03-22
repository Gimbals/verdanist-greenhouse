import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Globe, Check } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useTheme } from "../context/ThemeContext";

export function LanguageToggle() {
  const { i18n } = useTranslation();
  const { theme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  console.log('Current language:', i18n.language);

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'id', name: 'Indonesia', flag: '🇮🇩' },
  ];

  const currentLanguage = languages.find(lang => lang.code === i18n.language) || languages[0];

  const handleLanguageChange = (languageCode: string) => {
    console.log('Language change clicked:', languageCode);
    i18n.changeLanguage(languageCode);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-xl transition-all cursor-pointer"
        style={{
          background: isOpen 
            ? theme === 'dark' ? 'rgba(137, 204, 65, 0.15)' : 'rgba(40, 149, 27, 0.08)'
            : 'transparent',
          border: `1px solid ${theme === 'dark' ? 'rgba(137, 204, 65, 0.2)' : 'rgba(40, 149, 27, 0.1)'}`,
        }}
      >
        <Globe 
          size={16} 
          style={{ 
            color: theme === 'dark' ? '#89CC41' : '#28951B' 
          }} 
        />
        <span 
          style={{
            fontFamily: 'Poppins, sans-serif',
            fontSize: '0.8rem',
            fontWeight: 500,
            color: theme === 'dark' ? '#E6F786' : '#1a3a10',
          }}
        >
          {currentLanguage.flag} {currentLanguage.name}
        </span>
      </motion.button>

      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.95 }}
          className="absolute right-0 top-12 w-48 rounded-xl shadow-xl z-50 overflow-hidden"
          style={{
            background: theme === 'dark' ? '#2d4a1e' : '#ffffff',
            border: `1px solid ${theme === 'dark' ? 'rgba(137, 204, 65, 0.3)' : 'rgba(137, 204, 65, 0.18)'}`,
          }}
        >
          {languages.map((language) => (
            <motion.button
              key={language.code}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleLanguageChange(language.code)}
              className="w-full px-4 py-3 flex items-center justify-between transition-all"
              style={{
                background: i18n.language === language.code 
                  ? theme === 'dark' ? 'rgba(137, 204, 65, 0.15)' : 'rgba(40, 149, 27, 0.08)'
                  : 'transparent',
              }}
            >
              <div className="flex items-center gap-3">
                <span className="text-lg">{language.flag}</span>
                <span 
                  style={{
                    fontFamily: 'Poppins, sans-serif',
                    fontSize: '0.85rem',
                    fontWeight: 500,
                    color: theme === 'dark' ? '#E6F786' : '#1a3a10',
                  }}
                >
                  {language.name}
                </span>
              </div>
              
              {i18n.language === language.code && (
                <Check 
                  size={16} 
                  style={{ 
                    color: theme === 'dark' ? '#89CC41' : '#28951B' 
                  }} 
                />
              )}
            </motion.button>
          ))}
        </motion.div>
      )}
    </div>
  );
}
