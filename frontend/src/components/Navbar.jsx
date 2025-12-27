import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, ChevronDown, LogIn, LogOut, User } from 'lucide-react';
import { Button } from './ui/button';
import { useAuth } from '../contexts/AuthContext';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from './ui/navigation-menu';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-purple-800 rounded-xl flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300">
              <span className="text-xl font-bold text-white">SG</span>
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent">Sobat Giziku</span>
              <span className="text-xs text-gray-500 leading-tight max-w-[300px]">
                <span className="font-bold text-purple-600">S</span>osialisasi & <span className="font-bold text-purple-600">O</span>bservasi Tumbuh Kembang <span className="font-bold text-purple-600">B</span>erdayakan Keluarg<span className="font-bold text-purple-600">a</span> & <span className="font-bold text-purple-600">T</span>eknologi Tepat Guna sebagai <span className="font-bold text-purple-600">G</span>erakan <span className="font-bold text-purple-600">I</span>ntervensi Gi<span className="font-bold text-purple-600">zi</span> Terpad<span className="font-bold text-purple-600">u</span>
              </span>
            </div>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center space-x-1">
            <Link
              to="/"
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                isActive('/')
                  ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/50'
                  : 'text-gray-700 hover:bg-purple-50 hover:text-purple-600'
              }`}
            >
              Home
            </Link>

            {/* Layanan Dropdown */}
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-purple-50 hover:text-purple-600">
                    Layanan
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="w-48 p-2">
                      <li>
                        <Link to="/status-gizi">
                          <NavigationMenuLink className="block px-4 py-3 rounded-lg hover:bg-purple-50 hover:text-purple-600 transition-colors">
                            Cek Status Gizi
                          </NavigationMenuLink>
                        </Link>
                      </li>
                      <li>
                        <Link to="/konsultasi">
                          <NavigationMenuLink className="block px-4 py-3 rounded-lg hover:bg-purple-50 hover:text-purple-600 transition-colors">
                            Konsultasi
                          </NavigationMenuLink>
                        </Link>
                      </li>
                      <li>
                        <Link to="/agenda">
                          <NavigationMenuLink className="block px-4 py-3 rounded-lg hover:bg-purple-50 hover:text-purple-600 transition-colors">
                            Jadwal/Agenda
                          </NavigationMenuLink>
                        </Link>
                      </li>
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>

            {/* Edukasi Dropdown */}
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-purple-50 hover:text-purple-600">
                    Edukasi
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="w-48 p-2">
                      <li>
                        <Link to="/artikel">
                          <NavigationMenuLink className="block px-4 py-3 rounded-lg hover:bg-purple-50 hover:text-purple-600 transition-colors">
                            Artikel Kesehatan
                          </NavigationMenuLink>
                        </Link>
                      </li>
                      <li>
                        <Link to="/mpasi">
                          <NavigationMenuLink className="block px-4 py-3 rounded-lg hover:bg-purple-50 hover:text-purple-600 transition-colors">
                            Resep MPASI
                          </NavigationMenuLink>
                        </Link>
                      </li>
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>

            <Link
              to="/data-balita"
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                isActive('/data-balita')
                  ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/50'
                  : 'text-gray-700 hover:bg-purple-50 hover:text-purple-600'
              }`}
            >
              Data Balita
            </Link>

            <Link
              to="/informasi"
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                isActive('/informasi')
                  ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/50'
                  : 'text-gray-700 hover:bg-purple-50 hover:text-purple-600'
              }`}
            >
              Informasi
            </Link>

            <Link
              to="/e-data"
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                isActive('/e-data')
                  ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/50'
                  : 'text-gray-700 hover:bg-purple-50 hover:text-purple-600'
              }`}
            >
              E-Data
            </Link>
          </div>

          {/* CTA Button */}
          <div className="hidden lg:flex items-center space-x-2">
            {user ? (
              <>
                <Link to="/dashboard">
                  <Button variant="outline" className="border-purple-600 text-purple-600 hover:bg-purple-50">
                    <User size={18} className="mr-2" />
                    {user.nama}
                  </Button>
                </Link>
                <Button 
                  variant="ghost" 
                  onClick={handleLogout}
                  className="text-gray-600 hover:text-red-600"
                >
                  <LogOut size={18} />
                </Button>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="outline" className="border-purple-600 text-purple-600 hover:bg-purple-50">
                    <LogIn size={18} className="mr-2" />
                    Masuk
                  </Button>
                </Link>
                <Link to="/konsultasi">
                  <Button className="bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 shadow-lg shadow-purple-600/50 transition-all duration-300 transform hover:scale-105 text-base px-6">
                    Konsultasi Sekarang
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 rounded-lg text-gray-700 hover:bg-purple-50 transition-colors"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="lg:hidden bg-white border-t border-gray-200">
          <div className="px-4 py-4 space-y-2">
            <Link
              to="/"
              onClick={() => setIsOpen(false)}
              className={`block px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                isActive('/')
                  ? 'bg-purple-600 text-white'
                  : 'text-gray-700 hover:bg-purple-50 hover:text-purple-600'
              }`}
            >
              Home
            </Link>

            {/* Mobile Layanan */}
            <div className="space-y-1">
              <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase">Layanan</div>
              <Link
                to="/status-gizi"
                onClick={() => setIsOpen(false)}
                className="block px-4 py-3 rounded-lg text-sm font-medium text-gray-700 hover:bg-purple-50 hover:text-purple-600 transition-all"
              >
                Cek Status Gizi
              </Link>
              <Link
                to="/konsultasi"
                onClick={() => setIsOpen(false)}
                className="block px-4 py-3 rounded-lg text-sm font-medium text-gray-700 hover:bg-purple-50 hover:text-purple-600 transition-all"
              >
                Konsultasi
              </Link>
              <Link
                to="/agenda"
                onClick={() => setIsOpen(false)}
                className="block px-4 py-3 rounded-lg text-sm font-medium text-gray-700 hover:bg-purple-50 hover:text-purple-600 transition-all"
              >
                Jadwal/Agenda
              </Link>
            </div>

            {/* Mobile Edukasi */}
            <div className="space-y-1">
              <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase">Edukasi</div>
              <Link
                to="/artikel"
                onClick={() => setIsOpen(false)}
                className="block px-4 py-3 rounded-lg text-sm font-medium text-gray-700 hover:bg-purple-50 hover:text-purple-600 transition-all"
              >
                Artikel Kesehatan
              </Link>
              <Link
                to="/mpasi"
                onClick={() => setIsOpen(false)}
                className="block px-4 py-3 rounded-lg text-sm font-medium text-gray-700 hover:bg-purple-50 hover:text-purple-600 transition-all"
              >
                Resep MPASI
              </Link>
            </div>

            <Link
              to="/data-balita"
              onClick={() => setIsOpen(false)}
              className={`block px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                isActive('/data-balita')
                  ? 'bg-purple-600 text-white'
                  : 'text-gray-700 hover:bg-purple-50 hover:text-purple-600'
              }`}
            >
              Data Balita
            </Link>

            <Link
              to="/informasi"
              onClick={() => setIsOpen(false)}
              className={`block px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                isActive('/informasi')
                  ? 'bg-purple-600 text-white'
                  : 'text-gray-700 hover:bg-purple-50 hover:text-purple-600'
              }`}
            >
              Informasi
            </Link>

            <Link to="/e-data" onClick={() => setIsOpen(false)}>
              <Button className={`w-full justify-start ${isActive('/e-data') ? 'bg-purple-600 text-white' : 'bg-transparent text-gray-700 hover:bg-purple-50 hover:text-purple-600'}`}>
                E-Data
              </Button>
            </Link>

            {/* Auth buttons for mobile */}
            <div className="pt-4 border-t mt-4 space-y-2">
              {user ? (
                <>
                  <Link to="/dashboard" onClick={() => setIsOpen(false)}>
                    <Button className="w-full bg-purple-100 text-purple-700 hover:bg-purple-200">
                      <User size={18} className="mr-2" />
                      Dashboard ({user.nama})
                    </Button>
                  </Link>
                  <Button 
                    onClick={() => { handleLogout(); setIsOpen(false); }}
                    variant="outline"
                    className="w-full border-red-300 text-red-600 hover:bg-red-50"
                  >
                    <LogOut size={18} className="mr-2" />
                    Keluar
                  </Button>
                </>
              ) : (
                <>
                  <Link to="/login" onClick={() => setIsOpen(false)}>
                    <Button variant="outline" className="w-full border-purple-600 text-purple-600">
                      <LogIn size={18} className="mr-2" />
                      Masuk
                    </Button>
                  </Link>
                  <Link to="/konsultasi" onClick={() => setIsOpen(false)}>
                    <Button className="w-full bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900">
                      Konsultasi Sekarang
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;