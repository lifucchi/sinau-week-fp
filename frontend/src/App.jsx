import "./App.css";

import Cookies from "js-cookie";

import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "../src/context/AuthContext";
import ProtectedRoute from "../src/context/ProtectedRoute";
import RedirectRoute from "../src/context/RedirectRoute";

import AuthPage from "./pages/AuthPage";
import SideBar from "./components/sidebar/sideBar";
import MainPage from "./pages/mainPage";
import Header from "./components/header/Header";
import OrderSummary from "./components/content/OrderSummary";
import MyBarChart from "./components/chart/MyBarChart";
import ListMenu from "./components/content/ListMenu";
import SettingForm from "./components/forms/SettingForm";
import SalesReportable from "./components/table/SalesReportable";
import ListMenuPos from "./components/content/ListMenuPos";
import PaymentPage from "./pages/PaymentPage";
import SalesReportCashier from "./components/content/SalesReportCashier";
import Unauthorized from "./pages/Unauthorized";

function App() {
  const getRedirectPath = () => {
    const role = Cookies.get("role");
    if (role === "Admin") {
      return "/admin-dashboard";
    } else if (role === "Cashier") {
      return "/pos";
    } else {
      return "/login";
    }
  };
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/payment-success" element={<PaymentPage />} />
          <Route path="/unauthorized" element={<Unauthorized />} />
          <Route path="/" element={<Navigate to={getRedirectPath()} />} />
          <Route
            path="/login"
            element={
              <RedirectRoute>
                <AuthPage />
              </RedirectRoute>
            }
          />
          <Route
            path="/reset"
            element={
              <RedirectRoute>
                <AuthPage />
              </RedirectRoute>
            }
          />
          <Route
            path="/register"
            element={
              <RedirectRoute>
                <AuthPage />
              </RedirectRoute>
            }
          />

          <Route
            path="/admin-dashboard"
            element={
              <ProtectedRoute allowedRoles={["Admin"]}>
                <div className="flex h-full">
                  <SideBar />
                  <div className="flex flex-col w-full">
                    <Header />
                    <div className="flex-1 m-5">
                      <MainPage setTitle="Dashboard" setDate="Date">
                        <OrderSummary role="admin"></OrderSummary>
                        <MyBarChart />
                      </MainPage>
                    </div>
                  </div>
                </div>
              </ProtectedRoute>
            }
          />

          <Route
            path="/catalog"
            element={
              <ProtectedRoute allowedRoles={["Admin"]}>
                <div className="flex h-full">
                  <SideBar />
                  <div className="flex flex-col flex-1">
                    <Header />
                    <div className="flex-1 m-5">
                      <MainPage setTitle="List Menu">
                        <ListMenu></ListMenu>
                      </MainPage>
                    </div>
                  </div>
                </div>
              </ProtectedRoute>
            }
          />

          <Route
            path="/salesreport"
            element={
              <ProtectedRoute allowedRoles={["Admin"]}>
                <div className="flex h-full">
                  <SideBar />
                  <div className="flex flex-col w-full">
                    <Header />
                    <div className="flex-1 p-5">
                      <MainPage setTitle="Sales Report" setDate="Date" />
                      <SalesReportable role="admin"></SalesReportable>
                    </div>
                  </div>
                </div>
              </ProtectedRoute>
            }
          />

          <Route
            path="/pos"
            element={
              <ProtectedRoute allowedRoles={["Cashier"]}>
                <div className="flex h-full">
                  <SideBar />
                  <div className="flex flex-col flex-1 w-full">
                    <Header />
                    <div className="flex-1 m-5">
                      <MainPage setTitle="List Menu">
                        <ListMenuPos></ListMenuPos>
                      </MainPage>
                    </div>
                  </div>
                </div>
              </ProtectedRoute>
            }
          />

          <Route
            path="/cashier-salesreport"
            element={
              <ProtectedRoute allowedRoles={["Cashier"]}>
                <div className="flex h-full">
                  <SideBar />
                  <div className="flex flex-col w-full">
                    <Header />
                    <div className="flex-1 p-5">
                      <MainPage setTitle="Sales Report" setDate="Date" />
                      <SalesReportCashier></SalesReportCashier>
                    </div>
                  </div>
                </div>
              </ProtectedRoute>
            }
          />

          <Route
            path="/settings"
            element={
              <ProtectedRoute allowedRoles={["Admin", "Cashier"]}>
                <div className="flex h-full">
                  <SideBar />
                  <div className="flex flex-col w-full">
                    <Header />
                    <div className="flex-1 p-5">
                      <MainPage setTitle="Settings" />
                      <SettingForm></SettingForm>
                    </div>
                  </div>
                </div>
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
