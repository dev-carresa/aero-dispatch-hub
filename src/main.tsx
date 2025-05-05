
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import 'react-phone-number-input/style.css'
import { BrowserRouter } from 'react-router-dom'
import { ThemeWrapper } from "./components/theme/ThemeWrapper";
import { AuthProvider } from "./context/AuthContext";
import { PermissionProvider } from "./context/PermissionContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeWrapper>
      <BrowserRouter>
        <AuthProvider>
          <PermissionProvider>
            <QueryClientProvider client={queryClient}>
              <App />
              <Toaster />
            </QueryClientProvider>
          </PermissionProvider>
        </AuthProvider>
      </BrowserRouter>
    </ThemeWrapper>
  </React.StrictMode>
);
