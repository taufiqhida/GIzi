import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";
import { Toaster } from "./components/ui/toaster";
import { AuthProvider } from "./contexts/AuthContext";

// Pages
import Home from "./pages/Home";
import Informasi from "./pages/Informasi";
import Konsultasi from "./pages/Konsultasi";
import MPASI from "./pages/MPASI";
import StatusGizi from "./pages/StatusGizi";
import EData from "./pages/EData";
import Agenda from "./pages/Agenda";
import Artikel from "./pages/Artikel";
import ArtikelDetail from "./pages/ArtikelDetail";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";

function App() {
  return (
    <div className="App">
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Auth Pages - No Navbar/Footer */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected Dashboard - No Navbar/Footer */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />

            {/* Public Pages with Navbar/Footer */}
            <Route
              path="/*"
              element={
                <>
                  <Navbar />
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/informasi" element={<Informasi />} />
                    <Route path="/konsultasi" element={<Konsultasi />} />
                    <Route path="/mpasi" element={<MPASI />} />
                    <Route path="/status-gizi" element={<StatusGizi />} />
                    <Route path="/e-data" element={<EData />} />
                    <Route path="/agenda" element={<Agenda />} />
                    <Route path="/artikel" element={<Artikel />} />
                    <Route path="/artikel/:slug" element={<ArtikelDetail />} />
                  </Routes>
                  <Footer />
                </>
              }
            />
          </Routes>
          <Toaster />
        </BrowserRouter>
      </AuthProvider>
    </div>
  );
}

export default App;
