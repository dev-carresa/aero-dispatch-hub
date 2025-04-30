import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
export default function LandingPage() {
  const navigate = useNavigate();
  const {
    user,
    loading
  } = useAuth();
  useEffect(() => {
    if (!loading && user) {
      // If already logged in, redirect to dashboard
      navigate("/");
    }
  }, [user, loading, navigate]);
  return <div className="flex flex-col min-h-screen bg-white">
      {/* Navigation */}
      <header className="flex items-center justify-between px-6 py-4 border-b">
        <div className="font-bold text-xl text-primary">TransportHub</div>
        <div className="space-x-2">
          <Button variant="outline" onClick={() => navigate("/auth")}>
            Login
          </Button>
          <Button onClick={() => navigate("/auth?tab=register")}>
            Sign Up
          </Button>
        </div>
      </header>

      {/* Hero section */}
      <section className="flex flex-col items-center justify-center flex-grow px-6 pb-12 text-center mx-0 py-[48px]">
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-6 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
          All-in-one Transport Management System
        </h1>
        
        <p className="text-lg text-gray-600 max-w-3xl mb-10">
          Simplify your fleet operations, manage bookings, track vehicles, and improve customer experience
          with our comprehensive transport management solution.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
          <Button size="lg" className="w-full sm:w-auto" onClick={() => navigate("/auth")}>
            Get Started
          </Button>
          <Button size="lg" variant="outline" className="w-full sm:w-auto">
            Learn More
          </Button>
        </div>
      </section>

      {/* Feature highlights */}
      <section className="bg-gray-50 py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h3 className="font-semibold text-xl mb-3">Booking Management</h3>
              <p className="text-gray-600">Easily create, track, and manage bookings with our intuitive interface.</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h3 className="font-semibold text-xl mb-3">Fleet Tracking</h3>
              <p className="text-gray-600">Real-time tracking of your entire fleet for improved productivity.</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h3 className="font-semibold text-xl mb-3">Invoicing & Reporting</h3>
              <p className="text-gray-600">Generate invoices and comprehensive reports with a few clicks.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-10 px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-bold text-lg mb-4">TransportHub</h3>
            <p className="text-gray-300">The smarter way to manage your transport business.</p>
          </div>
          
          <div>
            <h3 className="font-bold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2 text-gray-300">
              <li><a href="#" className="hover:text-white">Features</a></li>
              <li><a href="#" className="hover:text-white">Pricing</a></li>
              <li><a href="#" className="hover:text-white">Documentation</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-bold text-lg mb-4">Contact</h3>
            <p className="text-gray-300">info@transporthub.example</p>
            <p className="text-gray-300">+1 (555) 123-4567</p>
          </div>
        </div>
        
        <div className="max-w-6xl mx-auto mt-8 pt-8 border-t border-gray-700 text-center text-gray-400">
          <p>© 2025 TransportHub. All rights reserved.</p>
        </div>
      </footer>
    </div>;
}