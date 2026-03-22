import React from 'react'
import { createRoot } from "react-dom/client";
import './styles/index.css'
import './i18n/config' // Initialize i18n
import App from './app/App.tsx';

createRoot(document.getElementById("root")!).render(<App />);