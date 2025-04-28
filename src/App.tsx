
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "./components/layout/Layout";
import Dashboard from "./pages/Dashboard";
import BookingsIndex from "./pages/BookingsIndex";
import BookingDetails from "./pages/BookingDetails";
import NewBooking from "./pages/NewBooking";
import EditBooking from "./pages/EditBooking";
import Users from "./pages/Users";
import Invoices from "./pages/Invoices";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout><Dashboard /></Layout>} />
          <Route path="/bookings" element={<Layout><BookingsIndex /></Layout>} />
          <Route path="/bookings/:id" element={<Layout><BookingDetails /></Layout>} />
          <Route path="/bookings/:id/edit" element={<Layout><EditBooking /></Layout>} />
          <Route path="/bookings/new" element={<Layout><NewBooking /></Layout>} />
          <Route path="/users" element={<Layout><Users /></Layout>} />
          <Route path="/invoices" element={<Layout><Invoices /></Layout>} />
          <Route path="/settings" element={<Layout><Settings /></Layout>} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
