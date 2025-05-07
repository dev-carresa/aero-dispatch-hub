
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import Dashboard from "./pages/Dashboard";
import Users from "./pages/Users";
import ApiUsers from "./pages/ApiUsers";
import ApiUserDetails from "./pages/ApiUserDetails";
import EditApiUser from "./pages/EditApiUser";
import NewApiUser from "./pages/NewApiUser";
import BookingsIndex from "./pages/BookingsIndex";
import BookingDetails from "./pages/BookingDetails";
import NewBooking from "./pages/NewBooking";
import EditBooking from "./pages/EditBooking";
import BookingApiTest from "./pages/BookingApiTest";
import Vehicles from "./pages/Vehicles";
import NewVehicle from "./pages/NewVehicle";
import EditVehicle from "./pages/EditVehicle";
import Airports from "./pages/Airports";
import AirportDetails from "./pages/AirportDetails";
import NewAirport from "./pages/NewAirport";
import EditAirport from "./pages/EditAirport";
import NewMeetingPoint from "./pages/NewMeetingPoint";
import EditMeetingPoint from "./pages/EditMeetingPoint";
import Reports from "./pages/Reports";
import GenerateReport from "./pages/GenerateReport";
import SavedReports from "./pages/SavedReports";
import ReportDetails from "./pages/ReportDetails";
import Invoices from "./pages/Invoices";
import InvoiceDetails from "./pages/InvoiceDetails";
import GenerateInvoice from "./pages/GenerateInvoice";
import Complaints from "./pages/Complaints";
import ComplaintDetails from "./pages/ComplaintDetails";
import NewComplaint from "./pages/NewComplaint";
import DriverComments from "./pages/DriverComments";
import DriverCommentDetails from "./pages/DriverCommentDetails";
import QualityReviews from "./pages/QualityReviews";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import NewUser from "./pages/NewUser";
import UserProfile from "./pages/UserProfile";
import ProfilePage from "./pages/ProfilePage";
import EditProfilePage from "./pages/EditProfilePage";
import NotFound from "./pages/NotFound";
import Settings from "./pages/Settings";
import { Layout } from "./components/layout/Layout";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";
import { PermissionProvider } from "./context/PermissionContext";
import { ThemeProvider } from "./components/theme/ThemeProvider";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthRedirect } from "./components/auth/AuthRedirect";
import { AuthenticationCheck } from "./components/auth/AuthenticationCheck";
import { useEffect } from "react";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <AuthenticationCheck>
            <PermissionProvider>
              <ThemeProvider>
                <Routes>
                  <Route path="/login" element={<AuthRedirect><LoginPage /></AuthRedirect>} />
                  <Route path="/forgot-password" element={<AuthRedirect><ForgotPasswordPage /></AuthRedirect>} />
                  <Route path="/reset-password" element={<AuthRedirect><ResetPasswordPage /></AuthRedirect>} />
                  <Route element={<Layout />}>
                    <Route path="/" element={<ProtectedRoute><Navigate to="/dashboard" /></ProtectedRoute>} />
                    <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                    <Route path="/users" element={<ProtectedRoute permission="users:view"><Users /></ProtectedRoute>} />
                    <Route path="/users/new" element={<ProtectedRoute permission="users:create"><NewUser /></ProtectedRoute>} />
                    <Route path="/users/:id" element={<ProtectedRoute permission="users:view"><UserProfile /></ProtectedRoute>} />
                    <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
                    <Route path="/profile/edit" element={<ProtectedRoute><EditProfilePage /></ProtectedRoute>} />
                    <Route path="/api-users" element={<ProtectedRoute permission="api_users:view"><ApiUsers /></ProtectedRoute>} />
                    <Route path="/api-users/new" element={<ProtectedRoute permission="api_users:create"><NewApiUser /></ProtectedRoute>} />
                    <Route path="/api-users/:id" element={<ProtectedRoute permission="api_users:view"><ApiUserDetails /></ProtectedRoute>} />
                    <Route path="/api-users/:id/edit" element={<ProtectedRoute permission="api_users:edit"><EditApiUser /></ProtectedRoute>} />
                    <Route path="/bookings" element={<ProtectedRoute permission="bookings:view"><BookingsIndex /></ProtectedRoute>} />
                    <Route path="/bookings/new" element={<ProtectedRoute permission="bookings:create"><NewBooking /></ProtectedRoute>} />
                    <Route path="/bookings/:id" element={<ProtectedRoute permission="bookings:view"><BookingDetails /></ProtectedRoute>} />
                    <Route path="/bookings/:id/edit" element={<ProtectedRoute permission="bookings:edit"><EditBooking /></ProtectedRoute>} />
                    <Route path="/bookings/api-test" element={<ProtectedRoute permission="bookings:api_integration"><BookingApiTest /></ProtectedRoute>} />
                    <Route path="/vehicles" element={<ProtectedRoute permission="vehicles:view"><Vehicles /></ProtectedRoute>} />
                    <Route path="/vehicles/new" element={<ProtectedRoute permission="vehicles:create"><NewVehicle /></ProtectedRoute>} />
                    <Route path="/vehicles/:id/edit" element={<ProtectedRoute permission="vehicles:edit"><EditVehicle /></ProtectedRoute>} />
                    <Route path="/airports" element={<ProtectedRoute permission="airports:view"><Airports /></ProtectedRoute>} />
                    <Route path="/airports/new" element={<ProtectedRoute permission="airports:create"><NewAirport /></ProtectedRoute>} />
                    <Route path="/airports/:id" element={<ProtectedRoute permission="airports:view"><AirportDetails /></ProtectedRoute>} />
                    <Route path="/airports/:id/edit" element={<ProtectedRoute permission="airports:edit"><EditAirport /></ProtectedRoute>} />
                    <Route path="/airports/:airportId/meeting-points/new" element={<ProtectedRoute permission="airports:create"><NewMeetingPoint /></ProtectedRoute>} />
                    <Route path="/airports/meeting-points/:id/edit" element={<ProtectedRoute permission="airports:edit"><EditMeetingPoint /></ProtectedRoute>} />
                    <Route path="/reports" element={<ProtectedRoute permission="reports:view"><Reports /></ProtectedRoute>} />
                    <Route path="/reports/generate" element={<ProtectedRoute permission="reports:create"><GenerateReport /></ProtectedRoute>} />
                    <Route path="/reports/saved" element={<ProtectedRoute permission="reports:view"><SavedReports /></ProtectedRoute>} />
                    <Route path="/reports/:id" element={<ProtectedRoute permission="reports:view"><ReportDetails /></ProtectedRoute>} />
                    <Route path="/invoices" element={<ProtectedRoute permission="invoices:view"><Invoices /></ProtectedRoute>} />
                    <Route path="/invoices/new" element={<ProtectedRoute permission="invoices:create"><GenerateInvoice /></ProtectedRoute>} />
                    <Route path="/invoices/:id" element={<ProtectedRoute permission="invoices:view"><InvoiceDetails /></ProtectedRoute>} />
                    <Route path="/complaints" element={<ProtectedRoute permission="complaints:view"><Complaints /></ProtectedRoute>} />
                    <Route path="/complaints/new" element={<ProtectedRoute permission="complaints:create"><NewComplaint /></ProtectedRoute>} />
                    <Route path="/complaints/:id" element={<ProtectedRoute permission="complaints:view"><ComplaintDetails /></ProtectedRoute>} />
                    <Route path="/driver-comments" element={<ProtectedRoute permission="driver_comments:view"><DriverComments /></ProtectedRoute>} />
                    <Route path="/driver-comments/:id" element={<ProtectedRoute permission="driver_comments:view"><DriverCommentDetails /></ProtectedRoute>} />
                    <Route path="/quality-reviews" element={<ProtectedRoute permission="quality_reviews:view"><QualityReviews /></ProtectedRoute>} />
                    <Route path="/settings/*" element={<ProtectedRoute permission="settings:view"><Settings /></ProtectedRoute>} />
                    <Route path="*" element={<NotFound />} />
                  </Route>
                </Routes>
                <Toaster />
                <SonnerToaster richColors position="top-right" />
              </ThemeProvider>
            </PermissionProvider>
          </AuthenticationCheck>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
