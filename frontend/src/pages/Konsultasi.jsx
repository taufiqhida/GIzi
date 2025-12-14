import React from 'react';
import { Phone, MessageCircle, Clock, Award, CheckCircle } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { daftarDokter } from '../data/mockData';

const Konsultasi = () => {
  const handleWhatsApp = (noHP, nama) => {
    const message = encodeURIComponent(`Halo ${nama}, saya ingin konsultasi gizi. Terima kasih.`);
    window.open(`https://wa.me/${noHP}?text=${message}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-50">
      {/* Hero */}
      <section className="bg-gradient-to-r from-purple-600 to-purple-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <MessageCircle size={64} className="mx-auto mb-6" />
            <h1 className="text-5xl font-bold mb-6">Konsultasi dengan Dokter</h1>
            <p className="text-xl text-purple-100 max-w-3xl mx-auto">
              Tim dokter ahli gizi dan spesialis anak siap membantu Anda via WhatsApp
            </p>
          </div>
        </div>
      </section>

      {/* Daftar Dokter */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Tim Dokter Kami</h2>
            <p className="text-xl text-gray-600">Pilih dokter sesuai kebutuhan Anda</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {daftarDokter.map((dokter) => (
              <Card key={dokter.id} className="border-2 hover:border-purple-600 hover:shadow-xl transition-all duration-300 group overflow-hidden">
                <div className="h-64 overflow-hidden bg-gradient-to-br from-purple-100 to-purple-200">
                  <img 
                    src={dokter.foto} 
                    alt={dokter.nama}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <CardHeader>
                  <CardTitle className="text-xl group-hover:text-purple-600 transition-colors">
                    {dokter.nama}
                  </CardTitle>
                  <CardDescription className="text-base font-medium text-purple-600">
                    {dokter.spesialisasi}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-2 text-gray-600">
                    <Award size={18} className="text-purple-600" />
                    <span className="text-sm">Pengalaman {dokter.pengalaman}</span>
                  </div>
                  
                  <div className="flex items-center space-x-2 text-gray-600">
                    <Clock size={18} className="text-purple-600" />
                    <span className="text-sm">{dokter.jadwal}</span>
                  </div>

                  <div>
                    <div className="text-sm text-gray-600 mb-2">Keahlian:</div>
                    <div className="flex flex-wrap gap-2">
                      {dokter.keahlian.map((skill, index) => (
                        <Badge key={index} variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <Button 
                    onClick={() => handleWhatsApp(dokter.noHP, dokter.nama)}
                    className="w-full bg-green-600 hover:bg-green-700 text-white shadow-lg group/btn"
                  >
                    <MessageCircle className="mr-2 group-hover/btn:scale-110 transition-transform" size={20} />
                    Chat WhatsApp
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Info Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Kenapa Konsultasi dengan Kami?</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-2 border-purple-200 text-center">
              <CardContent className="pt-8">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-purple-800 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="text-white" size={32} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Ahli Bersertifikat</h3>
                <p className="text-gray-600">Tim dokter dan ahli gizi profesional dengan sertifikasi resmi</p>
              </CardContent>
            </Card>

            <Card className="border-2 border-purple-200 text-center">
              <CardContent className="pt-8">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-purple-800 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Phone className="text-white" size={32} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Respon Cepat</h3>
                <p className="text-gray-600">Konsultasi langsung via WhatsApp tanpa antri</p>
              </CardContent>
            </Card>

            <Card className="border-2 border-purple-200 text-center">
              <CardContent className="pt-8">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-purple-800 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="text-white" size={32} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Fleksibel</h3>
                <p className="text-gray-600">Konsultasi kapan saja sesuai jadwal dokter</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-purple-600 to-purple-800 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6">Siap Konsultasi?</h2>
          <p className="text-xl text-purple-100 mb-8">
            Pilih dokter yang sesuai dan mulai chat via WhatsApp sekarang juga!
          </p>
          <Badge className="bg-white text-purple-600 px-6 py-3 text-base">
            📱 Gratis Konsultasi Pertama
          </Badge>
        </div>
      </section>
    </div>
  );
};

export default Konsultasi;