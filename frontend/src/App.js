import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { Toaster } from "./components/ui/toaster";

// Pages
import Home from "./pages/Home";
import Informasi from "./pages/Informasi";
import Konsultasi from "./pages/Konsultasi";
import MPASI from "./pages/MPASI";
import StatusGizi from "./pages/StatusGizi";
import EData from "./pages/EData";
import Agenda from "./pages/Agenda";
import Artikel from "./pages/Artikel";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
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
        </Routes>
        <Footer />
        <Toaster />
      </BrowserRouter>
    </div>
  );
}

export default App;
