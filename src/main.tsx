
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import 'react-phone-number-input/style.css'
import { BrowserRouter } from 'react-router-dom'
import { ThemeWrapper } from "./components/theme/ThemeWrapper";
import { TooltipProvider } from "@/components/ui/tooltip";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <TooltipProvider>
      <ThemeWrapper>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </ThemeWrapper>
    </TooltipProvider>
  </React.StrictMode>
);
