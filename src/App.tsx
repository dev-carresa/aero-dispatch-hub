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
import { ThemeProvider } from "./components/theme/ThemeProvider";
import ProfilePage from "./pages/ProfilePage";
import EditProfilePage from "./pages/EditProfilePage";
import LandingPage from "./pages/LandingPage";
import AuthPage from "./pages/AuthPage";
import Index from "./pages/Index";
import { AuthProvider } from "./context/AuthContext";
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
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <Routes>
              {/* Public routes */}
              <Route path="/welcome" element={<LandingPage />} />
              <Route path="/auth" element={<AuthPage />} />
              
              {/* Protected routes */}
              <Route path="/" element={
                <ProtectedRoute>
                  <Layout><Index /></Layout>
                </ProtectedRoute>
              } />
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <Layout><Dashboard /></Layout>
                </ProtectedRoute>
              } />
              
              {/* Bookings - Protected */}
              <Route path="/bookings" element={
                <ProtectedRoute>
                  <Layout><BookingsIndex /></Layout>
                </ProtectedRoute>
              } />
              <Route path="/bookings/:id" element={
                <ProtectedRoute>
                  <Layout><BookingDetails /></Layout>
                </ProtectedRoute>
              } />
              <Route path="/bookings/:id/edit" element={
                <ProtectedRoute>
                  <Layout><EditBooking /></Layout>
                </ProtectedRoute>
              } />
              <Route path="/bookings/new" element={
                <ProtectedRoute>
                  <Layout><NewBooking /></Layout>
                </ProtectedRoute>
              } />
              
              {/* Rest of the protected routes */}
              <Route path="/users" element={<ProtectedRoute><Layout><Users /></Layout></ProtectedRoute>} />
              <Route path="/users/:id" element={<ProtectedRoute><Layout><UserProfile /></Layout></ProtectedRoute>} />
              <Route path="/users/new" element={<ProtectedRoute><Layout><NewUser /></Layout></ProtectedRoute>} />
              
              <Route path="/api-users" element={<ProtectedRoute><Layout><ApiUsers /></Layout></ProtectedRoute>} />
              <Route path="/api-users/new" element={<ProtectedRoute><Layout><NewApiUser /></Layout></ProtectedRoute>} />
              <Route path="/api-users/:id" element={<ProtectedRoute><Layout><ApiUserDetails /></Layout></ProtectedRoute>} />
              <Route path="/api-users/:id/edit" element={<ProtectedRoute><Layout><EditApiUser /></Layout></ProtectedRoute>} />

              <Route path="/invoices" element={<ProtectedRoute><Layout><Invoices /></Layout></ProtectedRoute>} />
              <Route path="/invoices/generate" element={<ProtectedRoute><Layout><GenerateInvoice /></Layout></ProtectedRoute>} />
              <Route path="/invoices/:id" element={<ProtectedRoute><Layout><InvoiceDetails /></Layout></ProtectedRoute>} />
              
              <Route path="/settings" element={<ProtectedRoute><Layout><Settings /></Layout></ProtectedRoute>} />
              
              <Route path="/profile" element={<ProtectedRoute><Layout><ProfilePage /></Layout></ProtectedRoute>} />
              <Route path="/profile/edit" element={<ProtectedRoute><Layout><EditProfilePage /></Layout></ProtectedRoute>} />
              
              <Route path="/vehicles" element={<ProtectedRoute><Layout><Vehicles /></Layout></ProtectedRoute>} />
              <Route path="/vehicles/new" element={<ProtectedRoute><Layout><NewVehicle /></Layout></ProtectedRoute>} />
              <Route path="/vehicles/:id/edit" element={<ProtectedRoute><Layout><EditVehicle /></Layout></ProtectedRoute>} />
              
              <Route path="/reports" element={<ProtectedRoute><Layout><Reports /></Layout></ProtectedRoute>} />
              <Route path="/reports/generate" element={<ProtectedRoute><Layout><GenerateReport /></Layout></ProtectedRoute>} />
              <Route path="/reports/saved" element={<ProtectedRoute><Layout><SavedReports /></Layout></ProtectedRoute>} />
              <Route path="/reports/view/:id" element={<ProtectedRoute><Layout><ReportDetails /></Layout></ProtectedRoute>} />
              
              <Route path="/complaints" element={<ProtectedRoute><Layout><Complaints /></Layout></ProtectedRoute>} />
              <Route path="/complaints/new" element={<ProtectedRoute><Layout><NewComplaint /></Layout></ProtectedRoute>} />
              <Route path="/complaints/:id" element={<ProtectedRoute><Layout><ComplaintDetails /></Layout></ProtectedRoute>} />
              
              <Route path="/driver-comments" element={<ProtectedRoute><Layout><DriverComments /></Layout></ProtectedRoute>} />
              <Route path="/driver-comments/:id" element={<ProtectedRoute><Layout><DriverCommentDetails /></Layout></ProtectedRoute>} />
              
              <Route path="/quality-reviews" element={<ProtectedRoute><Layout><QualityReviews /></Layout></ProtectedRoute>} />
              
              <Route path="/airports" element={<ProtectedRoute><Layout><Airports /></Layout></ProtectedRoute>} />
              <Route path="/airports/:id" element={<ProtectedRoute><Layout><AirportDetails /></Layout></ProtectedRoute>} />
              <Route path="/airports/new" element={<ProtectedRoute><Layout><NewAirport /></Layout></ProtectedRoute>} />
              <Route path="/airports/:id/edit" element={<ProtectedRoute><Layout><EditAirport /></Layout></ProtectedRoute>} />
              <Route path="/airports/meeting-points/new" element={<ProtectedRoute><Layout><NewMeetingPoint /></Layout></ProtectedRoute>} />
              <Route path="/airports/meeting-points/:id/edit" element={<ProtectedRoute><Layout><EditMeetingPoint /></Layout></ProtectedRoute>} />
              
              {/* Catch-all route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </ThemeProvider>
);

export default App;
