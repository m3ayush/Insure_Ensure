import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import ForgotPassword from "./pages/ForgotPassword";
import Home from "./pages/Home";
import Recommendation from "./pages/Recommendation";
import Chatbot from "./pages/Chatbot";
import Reimbursement from "./pages/Reimbursement";

function AppRoutes() {
  const { currentUser } = useAuth();

  return (
    <Routes>
      <Route
        path="/"
        element={<Navigate to={currentUser ? "/home" : "/signin"} />}
      />
      <Route
        path="/signin"
        element={currentUser ? <Navigate to="/home" /> : <SignIn />}
      />
      <Route
        path="/signup"
        element={currentUser ? <Navigate to="/home" /> : <SignUp />}
      />
      <Route
        path="/forgot-password"
        element={currentUser ? <Navigate to="/home" /> : <ForgotPassword />}
      />
      <Route
        path="/home"
        element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        }
      />
      <Route
        path="/recommendation"
        element={
          <ProtectedRoute>
            <Recommendation />
          </ProtectedRoute>
        }
      />
      <Route
        path="/chatbot"
        element={
          <ProtectedRoute>
            <Chatbot />
          </ProtectedRoute>
        }
      />
      <Route
        path="/reimbursement"
        element={
          <ProtectedRoute>
            <Reimbursement />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
}
