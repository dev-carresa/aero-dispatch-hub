
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
import AuthPage from "./pages/AuthPage";
import UpdatePasswordPage from "./pages/UpdatePasswordPage";
import LandingPage from "./pages/LandingPage";
import Unauthorized from "./pages/Unauthorized";
import { AuthProvider } from "./context/AuthContext";
import { PermissionProvider } from "./context/PermissionContext";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import { RoleProtectedRoute } from "./components/auth/RoleProtectedRoute";

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
      <AuthProvider>
        <PermissionProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                {/* Public routes - accessible to everyone */}
                <Route path="/welcome" element={<LandingPage />} />
                <Route path="/auth" element={<AuthPage />} />
                <Route path="/auth/update-password" element={<UpdatePasswordPage />} />
                <Route path="/unauthorized" element={<Unauthorized />} />
                
                {/* Protected routes - require authentication */}
                <Route element={<ProtectedRoute />}>
                  {/* Dashboard */}
                  <Route path="/" element={<RoleProtectedRoute requiredPermission="dashboard:view"><Layout><Dashboard /></Layout></RoleProtectedRoute>} />
                  
                  {/* Bookings */}
                  <Route path="/bookings" element={<RoleProtectedRoute requiredPermission="bookings:view"><Layout><BookingsIndex /></Layout></RoleProtectedRoute>} />
                  <Route path="/bookings/:id" element={<RoleProtectedRoute requiredPermission="bookings:view"><Layout><BookingDetails /></Layout></RoleProtectedRoute>} />
                  <Route path="/bookings/:id/edit" element={<RoleProtectedRoute requiredPermission="bookings:edit"><Layout><EditBooking /></Layout></RoleProtectedRoute>} />
                  <Route path="/bookings/new" element={<RoleProtectedRoute requiredPermission="bookings:create"><Layout><NewBooking /></Layout></RoleProtectedRoute>} />
                  
                  {/* Users */}
                  <Route path="/users" element={<RoleProtectedRoute requiredPermission="users:view"><Layout><Users /></Layout></RoleProtectedRoute>} />
                  <Route path="/users/:id" element={<RoleProtectedRoute requiredPermission="users:view"><Layout><UserProfile /></Layout></RoleProtectedRoute>} />
                  <Route path="/users/new" element={<RoleProtectedRoute requiredPermission="users:create"><Layout><NewUser /></Layout></RoleProtectedRoute>} />
                  
                  {/* API Users */}
                  <Route path="/api-users" element={<RoleProtectedRoute requiredPermission="api_users:view"><Layout><ApiUsers /></Layout></RoleProtectedRoute>} />
                  <Route path="/api-users/new" element={<RoleProtectedRoute requiredPermission="api_users:create"><Layout><NewApiUser /></Layout></RoleProtectedRoute>} />
                  <Route path="/api-users/:id" element={<RoleProtectedRoute requiredPermission="api_users:view"><Layout><ApiUserDetails /></Layout></RoleProtectedRoute>} />
                  <Route path="/api-users/:id/edit" element={<RoleProtectedRoute requiredPermission="api_users:edit"><Layout><EditApiUser /></Layout></RoleProtectedRoute>} />

                  {/* Invoices */}
                  <Route path="/invoices" element={<RoleProtectedRoute requiredPermission="invoices:view"><Layout><Invoices /></Layout></RoleProtectedRoute>} />
                  <Route path="/invoices/generate" element={<RoleProtectedRoute requiredPermission="invoices:create"><Layout><GenerateInvoice /></Layout></RoleProtectedRoute>} />
                  <Route path="/invoices/:id" element={<RoleProtectedRoute requiredPermission="invoices:view"><Layout><InvoiceDetails /></Layout></RoleProtectedRoute>} />
                  
                  {/* Settings */}
                  <Route path="/settings" element={<RoleProtectedRoute requiredPermission="settings:view"><Layout><Settings /></Layout></RoleProtectedRoute>} />
                  
                  {/* Profile pages - all logged-in users can access their own profile */}
                  <Route path="/profile" element={<Layout><ProfilePage /></Layout>} />
                  <Route path="/profile/edit" element={<Layout><EditProfilePage /></Layout>} />
                  
                  {/* Vehicle routes */}
                  <Route path="/vehicles" element={<RoleProtectedRoute requiredPermission="vehicles:view"><Layout><Vehicles /></Layout></RoleProtectedRoute>} />
                  <Route path="/vehicles/new" element={<RoleProtectedRoute requiredPermission="vehicles:create"><Layout><NewVehicle /></Layout></RoleProtectedRoute>} />
                  <Route path="/vehicles/:id/edit" element={<RoleProtectedRoute requiredPermission="vehicles:edit"><Layout><EditVehicle /></Layout></RoleProtectedRoute>} />
                  
                  {/* Report routes */}
                  <Route path="/reports" element={<RoleProtectedRoute requiredPermission="reports:view"><Layout><Reports /></Layout></RoleProtectedRoute>} />
                  <Route path="/reports/generate" element={<RoleProtectedRoute requiredPermission="reports:create"><Layout><GenerateReport /></Layout></RoleProtectedRoute>} />
                  <Route path="/reports/saved" element={<RoleProtectedRoute requiredPermission="reports:view"><Layout><SavedReports /></Layout></RoleProtectedRoute>} />
                  <Route path="/reports/view/:id" element={<RoleProtectedRoute requiredPermission="reports:view"><Layout><ReportDetails /></Layout></RoleProtectedRoute>} />
                  
                  {/* Complaint routes */}
                  <Route path="/complaints" element={<RoleProtectedRoute requiredPermission="complaints:view"><Layout><Complaints /></Layout></RoleProtectedRoute>} />
                  <Route path="/complaints/new" element={<RoleProtectedRoute requiredPermission="complaints:create"><Layout><NewComplaint /></Layout></RoleProtectedRoute>} />
                  <Route path="/complaints/:id" element={<RoleProtectedRoute requiredPermissions={["complaints:view", "complaints:respond"]}><Layout><ComplaintDetails /></Layout></RoleProtectedRoute>} />
                  
                  {/* Driver Comment routes */}
                  <Route path="/driver-comments" element={<RoleProtectedRoute requiredPermission="driver_comments:view"><Layout><DriverComments /></Layout></RoleProtectedRoute>} />
                  <Route path="/driver-comments/:id" element={<RoleProtectedRoute requiredPermission="driver_comments:view"><Layout><DriverCommentDetails /></Layout></RoleProtectedRoute>} />
                  
                  {/* Quality Reviews routes */}
                  <Route path="/quality-reviews" element={<RoleProtectedRoute requiredPermission="quality_reviews:view"><Layout><QualityReviews /></Layout></RoleProtectedRoute>} />
                  
                  {/* Airport and Meeting Point routes */}
                  <Route path="/airports" element={<RoleProtectedRoute requiredPermission="airports:view"><Layout><Airports /></Layout></RoleProtectedRoute>} />
                  <Route path="/airports/:id" element={<RoleProtectedRoute requiredPermission="airports:view"><Layout><AirportDetails /></Layout></RoleProtectedRoute>} />
                  <Route path="/airports/new" element={<RoleProtectedRoute requiredPermission="airports:create"><Layout><NewAirport /></Layout></RoleProtectedRoute>} />
                  <Route path="/airports/:id/edit" element={<RoleProtectedRoute requiredPermission="airports:edit"><Layout><EditAirport /></Layout></RoleProtectedRoute>} />
                  <Route path="/airports/meeting-points/new" element={<RoleProtectedRoute requiredPermission="airports:create"><Layout><NewMeetingPoint /></Layout></RoleProtectedRoute>} />
                  <Route path="/airports/meeting-points/:id/edit" element={<RoleProtectedRoute requiredPermission="airports:edit"><Layout><EditMeetingPoint /></Layout></RoleProtectedRoute>} />
                </Route>
                
                {/* Catch-all route */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </PermissionProvider>
      </AuthProvider>
    </QueryClientProvider>
  </ThemeProvider>
);

export default App;
