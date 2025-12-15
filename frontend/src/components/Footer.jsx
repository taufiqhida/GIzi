import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Clock, Facebook, Instagram, Youtube } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-br from-purple-900 via-purple-800 to-purple-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center">
                <span className="text-lg font-bold">SG</span>
              </div>
              <div>
                <h3 className="text-xl font-bold">Sobat Giziku</h3>
                <p className="text-sm text-purple-200">Teman Kesehatan Keluarga</p>
              </div>
            </div>
            <p className="text-sm text-purple-200">
              Platform konsultasi gizi profesional untuk mendukung tumbuh kembang optimal anak Indonesia.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Menu Cepat</h4>
            <ul className="space-y-2">
              <li><Link to="/" className="text-purple-200 hover:text-white transition-colors">Home</Link></li>
              <li><Link to="/informasi" className="text-purple-200 hover:text-white transition-colors">Informasi</Link></li>
              <li><Link to="/konsultasi" className="text-purple-200 hover:text-white transition-colors">Konsul Gizi</Link></li>
              <li><Link to="/mpasi" className="text-purple-200 hover:text-white transition-colors">MPASI</Link></li>
              <li><Link to="/status-gizi" className="text-purple-200 hover:text-white transition-colors">Status Gizi</Link></li>
            </ul>
          </div>

          {/* Layanan */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Layanan</h4>
            <ul className="space-y-2">
              <li><Link to="/artikel" className="text-purple-200 hover:text-white transition-colors">Artikel Kesehatan</Link></li>
              <li><Link to="/mpasi" className="text-purple-200 hover:text-white transition-colors">MPASI & Resep</Link></li>
              <li><Link to="/agenda" className="text-purple-200 hover:text-white transition-colors">Agenda Kegiatan</Link></li>
              <li><Link to="/e-data" className="text-purple-200 hover:text-white transition-colors">E-Data</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Hubungi Kami</h4>
            <ul className="space-y-3">
              <li className="flex items-start space-x-3">
                <Phone size={18} className="mt-1 text-purple-300" />
                <span className="text-sm text-purple-200">0856-198-1313</span>
              </li>
              <li className="flex items-start space-x-3">
                <Mail size={18} className="mt-1 text-purple-300" />
                <span className="text-sm text-purple-200">info@sigizi.id</span>
              </li>
              <li className="flex items-start space-x-3">
                <MapPin size={18} className="mt-1 text-purple-300" />
                <span className="text-sm text-purple-200">Puskesmas Kecamatan, Jakarta Timur</span>
              </li>
              <li className="flex items-start space-x-3">
                <Clock size={18} className="mt-1 text-purple-300" />
                <span className="text-sm text-purple-200">Senin - Jumat: 08:00 - 14:00</span>
              </li>
            </ul>

            {/* Social Media */}
            <div className="flex space-x-3 mt-4">
              <a href="#" className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-lg flex items-center justify-center hover:bg-white/20 transition-all">
                <Facebook size={18} />
              </a>
              <a href="#" className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-lg flex items-center justify-center hover:bg-white/20 transition-all">
                <Instagram size={18} />
              </a>
              <a href="#" className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-lg flex items-center justify-center hover:bg-white/20 transition-all">
                <Youtube size={18} />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 mt-8 pt-8 text-center text-sm text-purple-200">
          <p>&copy; 2024 SiGizi. Platform Konsultasi Gizi Profesional. Dikembangkan dengan ❤️ untuk kesehatan keluarga Indonesia.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;