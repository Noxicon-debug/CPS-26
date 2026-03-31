import "@/App.css";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { Toaster } from "sonner";
import { AuthProvider } from "./context/AuthContext";

// Components
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";

// Pages
import { Home } from "./pages/Home";
import { About } from "./pages/About";
import { Gallery } from "./pages/Gallery";
import { Events } from "./pages/Events";
import { News } from "./pages/News";
import { Contact } from "./pages/Contact";
import { Login } from "./pages/Login";
import { AuthCallback } from "./pages/AuthCallback";
import { AdminDashboard } from "./pages/AdminDashboard";

// App Router component to handle auth callback detection
function AppRouter() {
  const location = useLocation();

  // Check URL fragment for session_id (OAuth callback)
  if (location.hash?.includes('session_id=')) {
    return <AuthCallback />;
  }

  // Check if we're on admin routes
  const isAdminRoute = location.pathname.startsWith('/admin') || location.pathname === '/login';

  return (
    <>
      {!isAdminRoute && <Navbar />}
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/events" element={<Events />} />
          <Route path="/news" element={<News />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
      </main>
      {!isAdminRoute && <Footer />}
    </>
  );
}

function App() {
  return (
    <div className="App min-h-screen bg-[#F8F5F0]">
      <AuthProvider>
        <BrowserRouter>
          <AppRouter />
        </BrowserRouter>
      </AuthProvider>
      <Toaster 
        position="top-right"
        toastOptions={{
          style: {
            background: '#1C2522',
            color: '#F8F5F0',
            border: 'none',
          },
        }}
      />
    </div>
  );
}

export default App;
