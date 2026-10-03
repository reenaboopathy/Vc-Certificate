import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

import { AuthProvider, useAuth } from "./context/AuthContext";
import { DataProvider } from "./context/DataContext";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Customers from "./pages/Customers";
import CustomerDetails from "./pages/CustomerDetails";
import Scales from "./pages/Scales";
import ScaleDetails from "./pages/ScaleDetails";
import Certificate from "./pages/Certificates";
import CertificateDetails from "./pages/CertificateDetails";
import Renewals from "./pages/Renewals";
import FollowUps from "./pages/FollowUps";
import Payments from "./pages/Payments";
import Invoices from "./pages/Invoices";
import Reports from "./pages/Reports";
import Users from "./pages/Users";
import Settings from "./pages/Settings";

function AppLayout() {
  const { isAuthenticated, isLoading } = useAuth();

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  if (isLoading) {
    return (
      <div className="app-loading">
        <div className="loading-spinner" />
        <p>Loading VC Manager...</p>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route
        element={
          <ProtectedRoute
            isAuthenticated={isAuthenticated}
          />
        }
      >
        <Route
          path="*"
          element={
            <div
              className={`app-shell ${
                sidebarCollapsed
                  ? "sidebar-is-collapsed"
                  : ""
              }`}
            >
              <Sidebar
                activePath={window.location.pathname}
                isCollapsed={sidebarCollapsed}
                onToggle={() =>
                  setSidebarCollapsed(
                    (current) => !current
                  )
                }
              />

              <div className="app-main">
                <Navbar />

                <main className="app-content">
                  <Routes>
                    <Route
                      path="/"
                      element={<Dashboard />}
                    />

                    <Route
                      path="/customers"
                      element={<Customers />}
                    />

                    <Route
                      path="/customers/:id"
                      element={<CustomerDetails />}
                    />

                    <Route
                      path="/scales"
                      element={<Scales />}
                    />

                    <Route
                      path="/scales/:id"
                      element={<ScaleDetails />}
                    />

                    <Route
                      path="/certificates"
                      element={<Certificate />}
                    />

                    <Route
                      path="/certificates/:id"
                      element={<CertificateDetails />}
                    />

                    <Route
                      path="/renewals"
                      element={<Renewals />}
                    />

                    <Route
                      path="/follow-ups"
                      element={<FollowUps />}
                    />

                    <Route
                      path="/payments"
                      element={<Payments />}
                    />

                    <Route
                      path="/invoices"
                      element={<Invoices />}
                    />

                    <Route
                      path="/reports"
                      element={<Reports />}
                    />

                    <Route
                      path="/users"
                      element={<Users />}
                    />

                    <Route
                      path="/settings"
                      element={<Settings />}
                    />
                  </Routes>
                </main>
              </div>
            </div>
          }
        />
      </Route>
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <DataProvider>
          <AppLayout />
        </DataProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}