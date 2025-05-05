import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import 'react-phone-number-input/style.css'
import { BrowserRouter } from 'react-router-dom'
import { ThemeWrapper } from "./components/theme/ThemeWrapper";
import { AuthProvider } from "./components/auth/AuthProvider";
import { PermissionProvider } from "./components/auth/PermissionProvider";
import { SidebarProvider } from "./components/sidebar/SidebarProvider";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeWrapper>
      <BrowserRouter>
        <AuthProvider>
          <PermissionProvider>
            <SidebarProvider>
              <QueryClientProvider client={queryClient}>
                <App />
                <Toaster />
              </QueryClientProvider>
            </SidebarProvider>
          </PermissionProvider>
        </AuthProvider>
      </BrowserRouter>
    </ThemeWrapper>
  </React.StrictMode>
);
