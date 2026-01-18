import { useEffect, useRef, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate, useLocation, useNavigate } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { Toaster } from "./components/ui/sonner";

// Pages
import SplashPage from "./pages/SplashPage";
import LoginPage from "./pages/LoginPage";
import BrowsePage from "./pages/BrowsePage";
import AliExpressPage from "./pages/AliExpressPage";
import CartPage from "./pages/CartPage";
import AddressesPage from "./pages/AddressesPage";
import PaymentPage from "./pages/PaymentPage";
import PaymentConfirmPage from "./pages/PaymentConfirmPage";
import OrdersPage from "./pages/OrdersPage";
import ProfilePage from "./pages/ProfilePage";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminOrders from "./pages/admin/AdminOrders";
import AdminOrderDetail from "./pages/admin/AdminOrderDetail";
import AdminSettings from "./pages/admin/AdminSettings";

const API_URL = process.env.REACT_APP_BACKEND_URL + "/api";

// REMINDER: DO NOT HARDCODE THE URL, OR ADD ANY FALLBACKS OR REDIRECT URLS, THIS BREAKS THE AUTH
const AuthCallback = () => {
  const navigate = useNavigate();
  const hasProcessed = useRef(false);

  useEffect(() => {
    if (hasProcessed.current) return;
    hasProcessed.current = true;

    const hash = window.location.hash;
    const sessionIdMatch = hash.match(/session_id=([^&]+)/);
    
    if (sessionIdMatch) {
      const sessionId = sessionIdMatch[1];
      
      fetch(`${API_URL}/auth/session`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ session_id: sessionId })
      })
        .then(res => res.json())
        .then(user => {
          window.history.replaceState(null, "", "/browse");
          navigate("/browse", { state: { user }, replace: true });
        })
        .catch(err => {
          console.error("Auth error:", err);
          navigate("/login", { replace: true });
        });
    } else {
      navigate("/login", { replace: true });
    }
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-purple-100 to-white">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-600 font-medium">جاري تسجيل الدخول...</p>
      </div>
    </div>
  );
};

const ProtectedRoute = ({ children }) => {
  const [authState, setAuthState] = useState({ loading: true, user: null });
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.state?.user) {
      setAuthState({ loading: false, user: location.state.user });
      return;
    }

    fetch(`${API_URL}/auth/me`, { credentials: "include" })
      .then(res => {
        if (!res.ok) throw new Error("Not authenticated");
        return res.json();
      })
      .then(user => setAuthState({ loading: false, user }))
      .catch(() => {
        setAuthState({ loading: false, user: null });
        navigate("/login", { replace: true });
      });
  }, [location.state, navigate]);

  if (authState.loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-purple-100 to-white">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!authState.user) return null;

  return children;
};

const AdminRoute = ({ children }) => {
  const [authState, setAuthState] = useState({ loading: true, user: null });
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${API_URL}/auth/me`, { credentials: "include" })
      .then(res => {
        if (!res.ok) throw new Error("Not authenticated");
        return res.json();
      })
      .then(user => {
        if (user.role !== "admin") {
          navigate("/browse", { replace: true });
          return;
        }
        setAuthState({ loading: false, user });
      })
      .catch(() => {
        navigate("/login", { replace: true });
      });
  }, [navigate]);

  if (authState.loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-purple-100 to-white">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return children;
};

function AppRouter() {
  const location = useLocation();

  // Check URL fragment for session_id synchronously during render
  if (location.hash?.includes("session_id=")) {
    return <AuthCallback />;
  }

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<SplashPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/browse" element={<ProtectedRoute><BrowsePage /></ProtectedRoute>} />
        <Route path="/aliexpress" element={<ProtectedRoute><AliExpressPage /></ProtectedRoute>} />
        <Route path="/cart" element={<ProtectedRoute><CartPage /></ProtectedRoute>} />
        <Route path="/addresses" element={<ProtectedRoute><AddressesPage /></ProtectedRoute>} />
        <Route path="/payment/:orderId" element={<ProtectedRoute><PaymentPage /></ProtectedRoute>} />
        <Route path="/payment/:orderId/confirm" element={<ProtectedRoute><PaymentConfirmPage /></ProtectedRoute>} />
        <Route path="/orders" element={<ProtectedRoute><OrdersPage /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
        <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
        <Route path="/admin/orders" element={<AdminRoute><AdminOrders /></AdminRoute>} />
        <Route path="/admin/orders/:orderId" element={<AdminRoute><AdminOrderDetail /></AdminRoute>} />
        <Route path="/admin/settings" element={<AdminRoute><AdminSettings /></AdminRoute>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  return (
    <div className="App" dir="rtl">
      <BrowserRouter>
        <AppRouter />
      </BrowserRouter>
      <Toaster position="top-center" richColors />
    </div>
  );
}

export default App;
