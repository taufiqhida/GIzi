import React from 'react';
import { Calendar, Clock, MapPin, Tag } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { agendaKegiatan } from '../data/mockData';

const Agenda = () => {
  const formatDate = (dateString) => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('id-ID', options);
  };

  const getTypeColor = (type) => {
    const colors = {
      'Pemeriksaan Rutin': 'bg-blue-100 text-blue-800 border-blue-200',
      'Edukasi': 'bg-green-100 text-green-800 border-green-200',
      'Workshop': 'bg-purple-100 text-purple-800 border-purple-200',
      'Konsultasi': 'bg-orange-100 text-orange-800 border-orange-200'
    };
    return colors[type] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-50">
      {/* Hero */}
      <section className="bg-gradient-to-r from-purple-600 to-purple-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Calendar size={64} className="mx-auto mb-6" />
            <h1 className="text-5xl font-bold mb-6">Agenda Kegiatan</h1>
            <p className="text-xl text-purple-100 max-w-3xl mx-auto">
              Jadwal kegiatan posyandu, seminar, workshop, dan konsultasi gizi di wilayah kami
            </p>
          </div>
        </div>
      </section>

      {/* Calendar View */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Jadwal Kegiatan</h2>
            <p className="text-xl text-gray-600">Desember 2024</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {agendaKegiatan.map((kegiatan) => (
              <Card key={kegiatan.id} className="border-2 hover:border-purple-600 hover:shadow-xl transition-all duration-300 group">
                <CardHeader>
                  <div className="flex items-start justify-between mb-2">
                    <Badge className={getTypeColor(kegiatan.type)}>
                      {kegiatan.type}
                    </Badge>
                    <div className="text-right">
                      <div className="text-3xl font-bold text-purple-600">
                        {new Date(kegiatan.date).getDate()}
                      </div>
                      <div className="text-sm text-gray-500">
                        {new Date(kegiatan.date).toLocaleDateString('id-ID', { month: 'short' })}
                      </div>
                    </div>
                  </div>
                  <CardTitle className="text-2xl group-hover:text-purple-600 transition-colors">
                    {kegiatan.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center space-x-3 text-gray-600">
                    <Calendar size={18} className="text-purple-600" />
                    <span>{formatDate(kegiatan.date)}</span>
                  </div>
                  <div className="flex items-center space-x-3 text-gray-600">
                    <Clock size={18} className="text-purple-600" />
                    <span>{kegiatan.time}</span>
                  </div>
                  <div className="flex items-center space-x-3 text-gray-600">
                    <MapPin size={18} className="text-purple-600" />
                    <span>{kegiatan.location}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Kegiatan Rutin */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Kegiatan Rutin</h2>
            <p className="text-xl text-gray-600">Program berkelanjutan sepanjang tahun</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-2 hover:shadow-xl transition-all">
              <CardHeader>
                <CardTitle className="text-xl">Posyandu Bulanan</CardTitle>
                <CardDescription>Setiap tanggal 15</CardDescription>
              </CardHeader>
              <CardContent className="text-gray-600">
                <p className="mb-4">Pemeriksaan kesehatan, penimbangan, pengukuran tinggi badan, imunisasi, dan konseling gizi untuk balita.</p>
                <Badge className="bg-blue-100 text-blue-800">08:00 - 12:00</Badge>
              </CardContent>
            </Card>

            <Card className="border-2 hover:shadow-xl transition-all">
              <CardHeader>
                <CardTitle className="text-xl">Kelas Ibu Hamil</CardTitle>
                <CardDescription>Setiap Rabu minggu ke-2</CardDescription>
              </CardHeader>
              <CardContent className="text-gray-600">
                <p className="mb-4">Edukasi nutrisi selama kehamilan, persiapan persalinan, dan ASI eksklusif untuk ibu hamil.</p>
                <Badge className="bg-green-100 text-green-800">13:00 - 15:00</Badge>
              </CardContent>
            </Card>

            <Card className="border-2 hover:shadow-xl transition-all">
              <CardHeader>
                <CardTitle className="text-xl">Konsultasi Online</CardTitle>
                <CardDescription>Setiap hari kerja</CardDescription>
              </CardHeader>
              <CardContent className="text-gray-600">
                <p className="mb-4">Layanan konsultasi gizi via chat WhatsApp atau video call dengan perjanjian terlebih dahulu.</p>
                <Badge className="bg-purple-100 text-purple-800">08:00 - 14:00</Badge>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-purple-600 to-purple-800 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Tag size={64} className="mx-auto mb-6" />
          <h2 className="text-4xl font-bold mb-6">Ikuti Kegiatan Kami</h2>
          <p className="text-xl text-purple-100 mb-8">
            Daftarkan diri Anda untuk mengikuti kegiatan-kegiatan kami. Gratis dan terbuka untuk umum!
          </p>
          <div className="space-y-4">
            <p className="text-lg">Hubungi kami untuk informasi lebih lanjut:</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Badge className="bg-white text-purple-600 px-6 py-3 text-base">📞 0856-198-1313</Badge>
              <Badge className="bg-white/10 border-2 border-white text-white px-6 py-3 text-base">✉️ info@sigizi.id</Badge>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Agenda;