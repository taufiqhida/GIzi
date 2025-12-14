import React from 'react';
import { Link } from 'react-router-dom';
import { Users, Video, BookOpen, Calculator, FileText, Utensils, ArrowRight, Heart, Shield, Award } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { heroImages, layananKami } from '../data/mockData';

const Home = () => {
  const iconMap = {
    Users: Users,
    Video: Video,
    BookOpen: BookOpen
  };

  const fiturUnggulan = [
    { icon: Calculator, title: 'Kalkulator Gizi', desc: 'Cek status gizi anak secara instan', link: '/status-gizi' },
    { icon: FileText, title: 'Artikel Kesehatan', desc: 'Informasi terpercaya seputar gizi', link: '/artikel' },
    { icon: Utensils, title: 'Resep MPASI', desc: 'Resep bergizi untuk si kecil', link: '/mpasi' }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-purple-50 via-white to-purple-50 overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8 animate-fade-in">
              <div className="inline-flex items-center space-x-2 bg-purple-100 text-purple-800 px-4 py-2 rounded-full text-sm font-medium">
                <Heart size={16} className="fill-current" />
                <span>Konsultasi Gizi Profesional</span>
              </div>
              
              <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                <span className="bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent">Teman Terpercaya</span>
                <br />
                <span className="text-gray-900">Kesehatan Keluarga Anda</span>
              </h1>
              
              <p className="text-xl text-gray-600 leading-relaxed">
                Platform konsultasi gizi terpadu untuk mendukung tumbuh kembang optimal anak Indonesia dengan pendampingan ahli gizi profesional.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/konsultasi">
                  <Button size="lg" className="bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 shadow-lg shadow-purple-600/50 group">
                    Mulai Konsultasi
                    <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
                  </Button>
                </Link>
                <Link to="/status-gizi">
                  <Button size="lg" variant="outline" className="border-2 border-purple-600 text-purple-600 hover:bg-purple-50">
                    Cek Status Gizi
                  </Button>
                </Link>
              </div>

              {/* Stats */}
              <div className="flex gap-8 pt-8 border-t border-gray-200">
                <div>
                  <div className="text-3xl font-bold text-purple-600">500+</div>
                  <div className="text-sm text-gray-600">Keluarga Terlayani</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-purple-600">98%</div>
                  <div className="text-sm text-gray-600">Kepuasan Klien</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-purple-600">24/7</div>
                  <div className="text-sm text-gray-600">Support Online</div>
                </div>
              </div>
            </div>

            {/* Hero Image */}
            <div className="relative">
              <div className="relative z-10 rounded-3xl overflow-hidden shadow-2xl transform hover:scale-105 transition-transform duration-500">
                <img 
                  src={heroImages[0]} 
                  alt="Keluarga Sehat" 
                  className="w-full h-[500px] object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 w-72 h-72 bg-purple-200 rounded-full blur-3xl opacity-50"></div>
              <div className="absolute -top-6 -left-6 w-72 h-72 bg-purple-300 rounded-full blur-3xl opacity-30"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Layanan Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Layanan Kami</h2>
            <p className="text-xl text-gray-600">Pilihan fleksibel untuk konsultasi gizi keluarga</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {layananKami.map((layanan) => {
              const IconComponent = iconMap[layanan.icon];
              return (
                <Card key={layanan.id} className="border-2 hover:border-purple-600 hover:shadow-xl transition-all duration-300 group">
                  <CardHeader>
                    <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-purple-200 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <IconComponent className="text-purple-600" size={32} />
                    </div>
                    <CardTitle className="text-xl">{layanan.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base">{layanan.description}</CardDescription>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Fitur Unggulan */}
      <section className="py-20 bg-gradient-to-br from-purple-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Fitur Unggulan</h2>
            <p className="text-xl text-gray-600">Tools dan konten untuk mendukung kesehatan keluarga</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {fiturUnggulan.map((fitur, index) => (
              <Link key={index} to={fitur.link}>
                <Card className="h-full hover:shadow-xl transition-all duration-300 border-2 hover:border-purple-600 group cursor-pointer">
                  <CardContent className="pt-6 text-center">
                    <div className="w-20 h-20 bg-gradient-to-br from-purple-600 to-purple-800 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                      <fitur.icon className="text-white" size={40} />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">{fitur.title}</h3>
                    <p className="text-gray-600">{fitur.desc}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-purple-600 to-purple-800 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Shield size={64} className="mx-auto mb-6 opacity-90" />
          <h2 className="text-4xl font-bold mb-6">Siap Memulai Perjalanan Sehat?</h2>
          <p className="text-xl mb-8 text-purple-100">
            Dapatkan konsultasi gratis dengan ahli gizi profesional kami dan mulai perjalanan menuju keluarga yang lebih sehat.
          </p>
          <Link to="/konsultasi">
            <Button size="lg" className="bg-white text-purple-600 hover:bg-gray-100 shadow-lg transform hover:scale-105 transition-all">
              Konsultasi Gratis Sekarang
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;