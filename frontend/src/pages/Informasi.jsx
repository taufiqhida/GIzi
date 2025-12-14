import React from 'react';
import { Target, Heart, Users, Award, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';

const Informasi = () => {
  const visiMisi = [
    {
      icon: Target,
      title: 'Visi Kami',
      desc: 'Menjadi platform konsultasi gizi terdepan yang mendukung terciptanya generasi Indonesia yang sehat, cerdas, dan berkualitas melalui intervensi gizi yang tepat.'
    },
    {
      icon: Heart,
      title: 'Misi Kami',
      desc: 'Memberikan layanan konsultasi gizi profesional, edukasi berkelanjutan, dan pendampingan holistik untuk keluarga Indonesia dalam mencegah dan menangani masalah gizi.'
    }
  ];

  const nilaiKami = [
    { icon: Award, title: 'Profesional', desc: 'Tim ahli gizi bersertifikat dan berpengalaman' },
    { icon: Heart, title: 'Peduli', desc: 'Mengutamakan kesehatan dan kesejahteraan keluarga' },
    { icon: Users, title: 'Kolaboratif', desc: 'Bekerja sama dengan berbagai stakeholder kesehatan' },
    { icon: CheckCircle, title: 'Terpercaya', desc: 'Berbasis evidens dan standar WHO' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-50">
      {/* Hero */}
      <section className="bg-gradient-to-r from-purple-600 to-purple-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl font-bold mb-6">Tentang SiGizi</h1>
            <p className="text-xl text-purple-100 max-w-3xl mx-auto">
              Platform konsultasi gizi profesional yang didirikan untuk mendukung program pemerintah dalam pencegahan dan penanggulangan stunting di Indonesia.
            </p>
          </div>
        </div>
      </section>

      {/* Visi Misi */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8">
            {visiMisi.map((item, index) => (
              <Card key={index} className="border-2 hover:border-purple-600 hover:shadow-xl transition-all duration-300">
                <CardHeader>
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-purple-800 rounded-2xl flex items-center justify-center mb-4">
                    <item.icon className="text-white" size={32} />
                  </div>
                  <CardTitle className="text-2xl">{item.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-lg leading-relaxed">{item.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Program */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Program Kami</h2>
            <p className="text-xl text-gray-600">Upaya nyata untuk Indonesia lebih sehat</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="p-6 bg-gradient-to-br from-purple-50 to-white rounded-2xl border-2 border-purple-100 hover:border-purple-600 transition-all">
              <h3 className="text-xl font-bold text-gray-900 mb-3">Pencegahan Stunting</h3>
              <p className="text-gray-600">Intervensi gizi sejak 1000 hari pertama kehidupan untuk mencegah stunting dan wasting.</p>
            </div>
            <div className="p-6 bg-gradient-to-br from-purple-50 to-white rounded-2xl border-2 border-purple-100 hover:border-purple-600 transition-all">
              <h3 className="text-xl font-bold text-gray-900 mb-3">Edukasi MPASI</h3>
              <p className="text-gray-600">Workshop dan konsultasi praktis tentang pemberian makanan pendamping ASI yang tepat.</p>
            </div>
            <div className="p-6 bg-gradient-to-br from-purple-50 to-white rounded-2xl border-2 border-purple-100 hover:border-purple-600 transition-all">
              <h3 className="text-xl font-bold text-gray-900 mb-3">Monitoring Pertumbuhan</h3>
              <p className="text-gray-600">Pemantauan berkala status gizi balita dengan standar WHO untuk deteksi dini masalah gizi.</p>
            </div>
            <div className="p-6 bg-gradient-to-br from-purple-50 to-white rounded-2xl border-2 border-purple-100 hover:border-purple-600 transition-all">
              <h3 className="text-xl font-bold text-gray-900 mb-3">Konseling Keluarga</h3>
              <p className="text-gray-600">Pendampingan holistik untuk keluarga dengan anak bermasalah gizi.</p>
            </div>
            <div className="p-6 bg-gradient-to-br from-purple-50 to-white rounded-2xl border-2 border-purple-100 hover:border-purple-600 transition-all">
              <h3 className="text-xl font-bold text-gray-900 mb-3">Posyandu Digital</h3>
              <p className="text-gray-600">Digitalisasi layanan posyandu untuk akses yang lebih mudah dan efisien.</p>
            </div>
            <div className="p-6 bg-gradient-to-br from-purple-50 to-white rounded-2xl border-2 border-purple-100 hover:border-purple-600 transition-all">
              <h3 className="text-xl font-bold text-gray-900 mb-3">Penyuluhan Masyarakat</h3>
              <p className="text-gray-600">Seminar dan event edukasi untuk meningkatkan awareness gizi di masyarakat.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Nilai */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Nilai-Nilai Kami</h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {nilaiKami.map((nilai, index) => (
              <div key={index} className="text-center p-6 bg-white rounded-2xl border-2 border-gray-100 hover:border-purple-600 hover:shadow-xl transition-all group">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-purple-200 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <nilai.icon className="text-purple-600" size={28} />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{nilai.title}</h3>
                <p className="text-sm text-gray-600">{nilai.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tim */}
      <section className="py-20 bg-gradient-to-r from-purple-600 to-purple-800 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6">Tim Ahli Kami</h2>
          <p className="text-xl text-purple-100 mb-8">
            Didukung oleh tim ahli gizi profesional bersertifikat, dokter spesialis anak, dan tenaga kesehatan berpengalaman yang siap membantu keluarga Indonesia.
          </p>
          <div className="grid md:grid-cols-3 gap-6 mt-12">
            <div className="text-center">
              <div className="text-3xl font-bold mb-2">15+</div>
              <div className="text-purple-200">Ahli Gizi</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold mb-2">8+</div>
              <div className="text-purple-200">Dokter Anak</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold mb-2">20+</div>
              <div className="text-purple-200">Tenaga Kesehatan</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Informasi;