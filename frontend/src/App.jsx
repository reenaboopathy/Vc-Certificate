import {
  HashRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import { AuthProvider, useAuth } from "./context/AuthContext";
import { DataProvider } from "./context/DataContext";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Customers from "./pages/Customers";
import Scales from "./pages/Scales";
import Certificates from "./pages/Certificates";
import Renewals from "./pages/Renewals";
import FollowUps from "./pages/FollowUps";
import Payments from "./pages/Payments";
import Invoices from "./pages/Invoices";
import Reports from "./pages/Reports";
import Users from "./pages/Users";

function ProtectedRoutes() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) return <div>Loading...</div>;

  if (!isAuthenticated) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  return (
    <DataProvider>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/login" element={<Navigate to="/" replace />} />
        <Route path="/customers" element={<Customers />} />
        <Route path="/scales" element={<Scales />} />
        <Route path="/certificates" element={<Certificates />} />
        <Route path="/renewals" element={<Renewals />} />
        <Route path="/followups" element={<FollowUps />} />
        <Route path="/payments" element={<Payments />} />
        <Route path="/invoices" element={<Invoices />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/users" element={<Users />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </DataProvider>
  );
}

export default function App() {
  return (
    <HashRouter>
      <AuthProvider>
        <ProtectedRoutes />
      </AuthProvider>
    </HashRouter>
  );
}