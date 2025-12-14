import React from 'react';
import { BarChart3, PieChart, TrendingUp, Users, Calendar } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { eDataStatistik } from '../data/mockData';

const EData = () => {
  const statCards = [
    { icon: Users, title: 'Total Balita Terdaftar', value: '1,245', trend: '+12%', color: 'purple' },
    { icon: TrendingUp, title: 'Konsultasi Bulan Ini', value: '210', trend: '+8%', color: 'blue' },
    { icon: BarChart3, title: 'Status Gizi Baik', value: '78%', trend: '+3%', color: 'green' },
    { icon: Calendar, title: 'Posyandu Aktif', value: '15', trend: 'Stabil', color: 'orange' }
  ];

  const colorMap = {
    purple: 'from-purple-500 to-purple-700',
    blue: 'from-blue-500 to-blue-700',
    green: 'from-green-500 to-green-700',
    orange: 'from-orange-500 to-orange-700'
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-50">
      {/* Hero */}
      <section className="bg-gradient-to-r from-purple-600 to-purple-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <BarChart3 size={64} className="mx-auto mb-6" />
            <h1 className="text-5xl font-bold mb-6">E-Data & Statistik</h1>
            <p className="text-xl text-purple-100 max-w-3xl mx-auto">
              Data dan statistik terkini seputar status gizi balita di wilayah layanan kami
            </p>
          </div>
        </div>
      </section>

      {/* Stats Cards */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {statCards.map((stat, index) => (
              <Card key={index} className="border-2 hover:border-purple-600 hover:shadow-xl transition-all duration-300 group">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-14 h-14 bg-gradient-to-br ${colorMap[stat.color]} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                      <stat.icon className="text-white" size={28} />
                    </div>
                    <Badge className="bg-green-100 text-green-800 border-green-200">{stat.trend}</Badge>
                  </div>
                  <div className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
                  <div className="text-sm text-gray-600">{stat.title}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Status Gizi Distribution */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Distribusi Status Gizi Balita</h2>
            <p className="text-xl text-gray-600">Data terkini periode Juni 2024</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Pie Chart Representation */}
            <Card className="border-2">
              <CardHeader>
                <CardTitle className="text-2xl">Status Gizi Balita</CardTitle>
                <CardDescription>Berdasarkan indikator BB/U</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {eDataStatistik[0].data.map((item, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-4 h-4 rounded" style={{ backgroundColor: item.color }}></div>
                          <span className="font-medium">{item.label}</span>
                        </div>
                        <span className="text-2xl font-bold" style={{ color: item.color }}>{item.value}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                        <div 
                          className="h-full rounded-full transition-all duration-500" 
                          style={{ width: `${item.value}%`, backgroundColor: item.color }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Bar Chart Representation */}
            <Card className="border-2">
              <CardHeader>
                <CardTitle className="text-2xl">Tren Konsultasi</CardTitle>
                <CardDescription>Jumlah konsultasi per bulan (2024)</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {eDataStatistik[1].data.map((item, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-gray-700">{item.bulan}</span>
                        <span className="text-xl font-bold text-purple-600">{item.jumlah}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                        <div 
                          className="h-full rounded-full bg-gradient-to-r from-purple-600 to-purple-800 transition-all duration-500" 
                          style={{ width: `${(item.jumlah / 210) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Insights */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Insight & Analisis</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <Card className="border-2 border-green-200 bg-green-50">
              <CardHeader>
                <CardTitle className="text-green-800">Pencapaian Positif</CardTitle>
              </CardHeader>
              <CardContent className="text-gray-700">
                <ul className="space-y-2">
                  <li>✓ 78% balita dengan status gizi baik</li>
                  <li>✓ Peningkatan konsultasi 8% dari bulan lalu</li>
                  <li>✓ Kasus gizi buruk menurun 2%</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-2 border-orange-200 bg-orange-50">
              <CardHeader>
                <CardTitle className="text-orange-800">Area Perhatian</CardTitle>
              </CardHeader>
              <CardContent className="text-gray-700">
                <ul className="space-y-2">
                  <li>⚠ 15% balita masih gizi kurang</li>
                  <li>⚠ Stunting di 3 posyandu masih tinggi</li>
                  <li>⚠ Perlu peningkatan edukasi MPASI</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-2 border-blue-200 bg-blue-50">
              <CardHeader>
                <CardTitle className="text-blue-800">Target Kedepan</CardTitle>
              </CardHeader>
              <CardContent className="text-gray-700">
                <ul className="space-y-2">
                  <li>→ Target gizi baik 85% di Q4 2024</li>
                  <li>→ Gizi buruk turun menjadi &lt;3%</li>
                  <li>→ Cakupan konsultasi 250/bulan</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Transparansi Data */}
      <section className="py-20 bg-gradient-to-r from-purple-600 to-purple-800 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <PieChart size={64} className="mx-auto mb-6" />
          <h2 className="text-4xl font-bold mb-6">Komitmen Transparansi Data</h2>
          <p className="text-xl text-purple-100 mb-8">
            Kami berkomitmen untuk menyajikan data yang akurat, transparan, dan terkini sebagai bentuk akuntabilitas kepada masyarakat. Data ini diperbarui setiap bulan dan dapat diakses publik.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Badge className="bg-white text-purple-600 px-6 py-3 text-base">Update Terakhir: Juni 2024</Badge>
            <Badge className="bg-white/10 border-2 border-white text-white px-6 py-3 text-base">Sumber: Puskesmas Kecamatan</Badge>
          </div>
        </div>
      </section>
    </div>
  );
};

export default EData;