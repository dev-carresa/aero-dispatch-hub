
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route, Navigate } from "react-router-dom";
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
import { ThemeProvider } from "./components/theme/ThemeProvider";
import ProfilePage from "./pages/ProfilePage";
import EditProfilePage from "./pages/EditProfilePage";
import LoginPage from "./pages/LoginPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import { AuthProvider } from "./context/AuthContext";
import { PermissionProvider } from "./context/PermissionContext";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";

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

// Quality Reviews pages
import QualityReviews from "./pages/QualityReviews";

// Airport and Meeting Point pages
import Airports from "./pages/Airports";
import AirportDetails from "./pages/AirportDetails";
import NewAirport from "./pages/NewAirport";
import EditAirport from "./pages/EditAirport";
import NewMeetingPoint from "./pages/NewMeetingPoint";
import EditMeetingPoint from "./pages/EditMeetingPoint";

// API Users pages
import ApiUsers from "./pages/ApiUsers";
import NewApiUser from "./pages/NewApiUser";
import EditApiUser from "./pages/EditApiUser";
import ApiUserDetails from "./pages/ApiUserDetails";

const queryClient = new QueryClient();

const App = () => (
  <ThemeProvider defaultTheme="light">
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <PermissionProvider>
            <Toaster />
            <Sonner />
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<LoginPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
              <Route path="/reset-password" element={<ResetPasswordPage />} />
              
              {/* Application routes - protected */}
              <Route element={<ProtectedRoute />}>
                {/* Dashboard */}
                <Route path="/dashboard" element={<Layout><Dashboard /></Layout>} />
                
                {/* Bookings */}
                <Route path="/bookings" element={<Layout><BookingsIndex /></Layout>} />
                <Route path="/bookings/:id" element={<Layout><BookingDetails /></Layout>} />
                <Route path="/bookings/:id/edit" element={<Layout><EditBooking /></Layout>} />
                <Route path="/bookings/new" element={<Layout><NewBooking /></Layout>} />
                
                {/* Users */}
                <Route path="/users" element={<Layout><Users /></Layout>} />
                <Route path="/users/:id" element={<Layout><UserProfile /></Layout>} />
                <Route path="/users/new" element={<Layout><NewUser /></Layout>} />
                
                {/* API Users */}
                <Route path="/api-users" element={<Layout><ApiUsers /></Layout>} />
                <Route path="/api-users/new" element={<Layout><NewApiUser /></Layout>} />
                <Route path="/api-users/:id" element={<Layout><ApiUserDetails /></Layout>} />
                <Route path="/api-users/:id/edit" element={<Layout><EditApiUser /></Layout>} />

                {/* Invoices */}
                <Route path="/invoices" element={<Layout><Invoices /></Layout>} />
                <Route path="/invoices/generate" element={<Layout><GenerateInvoice /></Layout>} />
                <Route path="/invoices/:id" element={<Layout><InvoiceDetails /></Layout>} />
                
                {/* Settings */}
                <Route path="/settings" element={<Layout><Settings /></Layout>} />
                
                {/* Profile pages */}
                <Route path="/profile" element={<Layout><ProfilePage /></Layout>} />
                <Route path="/profile/edit" element={<Layout><EditProfilePage /></Layout>} />
                
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
                
                {/* Quality Reviews routes */}
                <Route path="/quality-reviews" element={<Layout><QualityReviews /></Layout>} />
                
                {/* Airport and Meeting Point routes */}
                <Route path="/airports" element={<Layout><Airports /></Layout>} />
                <Route path="/airports/:id" element={<Layout><AirportDetails /></Layout>} />
                <Route path="/airports/new" element={<Layout><NewAirport /></Layout>} />
                <Route path="/airports/:id/edit" element={<Layout><EditAirport /></Layout>} />
                <Route path="/airports/meeting-points/new" element={<Layout><NewMeetingPoint /></Layout>} />
                <Route path="/airports/meeting-points/:id/edit" element={<Layout><EditMeetingPoint /></Layout>} />
              </Route>
              
              {/* Catch-all route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </PermissionProvider>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  </ThemeProvider>
);

export default App;
