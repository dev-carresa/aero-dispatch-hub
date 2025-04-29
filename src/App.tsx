
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
import UserProfile from "./pages/UserProfile";
import NewUser from "./pages/NewUser";
import Invoices from "./pages/Invoices";
import InvoiceDetails from "./pages/InvoiceDetails";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

// Vehicle pages
import Vehicles from "./pages/Vehicles";
import NewVehicle from "./pages/NewVehicle";
import EditVehicle from "./pages/EditVehicle";

// Report pages
import Reports from "./pages/Reports";
import GenerateReport from "./pages/GenerateReport";
import SavedReports from "./pages/SavedReports";
import ReportDetails from "./pages/ReportDetails";

// Invoice pages
import GenerateInvoice from "./pages/GenerateInvoice";

// Complaint pages
import Complaints from "./pages/Complaints";
import NewComplaint from "./pages/NewComplaint";
import ComplaintDetails from "./pages/ComplaintDetails";

// Driver Comment pages
import DriverComments from "./pages/DriverComments";
import DriverCommentDetails from "./pages/DriverCommentDetails";

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
          <Route path="/users/:id" element={<Layout><UserProfile /></Layout>} />
          <Route path="/users/new" element={<Layout><NewUser /></Layout>} />
          <Route path="/invoices" element={<Layout><Invoices /></Layout>} />
          <Route path="/invoices/generate" element={<Layout><GenerateInvoice /></Layout>} />
          <Route path="/invoices/:id" element={<Layout><InvoiceDetails /></Layout>} />
          <Route path="/settings" element={<Layout><Settings /></Layout>} />
          
          {/* Vehicle routes */}
          <Route path="/vehicles" element={<Layout><Vehicles /></Layout>} />
          <Route path="/vehicles/new" element={<Layout><NewVehicle /></Layout>} />
          <Route path="/vehicles/:id/edit" element={<Layout><EditVehicle /></Layout>} />
          
          {/* Report routes */}
          <Route path="/reports" element={<Layout><Reports /></Layout>} />
          <Route path="/reports/generate" element={<Layout><GenerateReport /></Layout>} />
          <Route path="/reports/saved" element={<Layout><SavedReports /></Layout>} />
          <Route path="/reports/view/:id" element={<Layout><ReportDetails /></Layout>} />
          
          {/* Complaint routes */}
          <Route path="/complaints" element={<Layout><Complaints /></Layout>} />
          <Route path="/complaints/new" element={<Layout><NewComplaint /></Layout>} />
          <Route path="/complaints/:id" element={<Layout><ComplaintDetails /></Layout>} />
          
          {/* Driver Comment routes */}
          <Route path="/driver-comments" element={<Layout><DriverComments /></Layout>} />
          <Route path="/driver-comments/:id" element={<Layout><DriverCommentDetails /></Layout>} />
          
          {/* Catch-all route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
