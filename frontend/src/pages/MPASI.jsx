import React from 'react';
import { Clock, Users, ChefHat, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { panduanMPASI } from '../data/mockData';

const MPASI = () => {
  const tipsUmum = [
    'Mulai MPASI saat usia 6 bulan, bukan sebelumnya',
    'Berikan ASI terlebih dahulu sebelum MPASI',
    'Perkenalkan satu jenis makanan baru setiap 3-5 hari',
    'Pantau reaksi alergi setiap makanan baru',
    'Jangan tambahkan gula atau garam di tahun pertama',
    'Buat suasana makan menyenangkan dan tanpa paksaan'
  ];

  const makananPantangan = [
    'Madu (risiko botulisme)',
    'Susu sapi murni sebelum 1 tahun',
    'Makanan keras yang berisiko tersedak',
    'Makanan tinggi sodium/gula',
    'Seafood mentah',
    'Putih telur mentah'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-50">
      {/* Hero */}
      <section className="bg-gradient-to-r from-purple-600 to-purple-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl font-bold mb-6">Panduan MPASI</h1>
            <p className="text-xl text-purple-100 max-w-3xl mx-auto">
              Makanan Pendamping ASI yang tepat adalah kunci tumbuh kembang optimal si kecil
            </p>
          </div>
        </div>
      </section>

      {/* Apa itu MPASI */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="border-2 border-purple-200">
            <CardHeader>
              <CardTitle className="text-3xl">Apa itu MPASI?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-gray-600 text-lg">
              <p>
                MPASI (Makanan Pendamping ASI) adalah makanan atau minuman yang mengandung nutrisi, diberikan kepada bayi mulai usia 6 bulan sebagai pendamping ASI untuk memenuhi kebutuhan gizi yang tidak bisa dipenuhi dari ASI saja.
              </p>
              <p>
                MPASI penting karena pada usia 6 bulan, kebutuhan energi dan nutrisi bayi meningkat dan tidak dapat dipenuhi hanya dari ASI. Pemberian MPASI yang tepat akan mendukung pertumbuhan dan perkembangan optimal bayi.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Panduan Usia */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Panduan MPASI Berdasarkan Usia</h2>
            <p className="text-xl text-gray-600">Sesuaikan tekstur dan porsi dengan tahap perkembangan bayi</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {panduanMPASI.map((panduan, index) => (
              <Card key={index} className="border-2 hover:border-purple-600 hover:shadow-xl transition-all duration-300">
                <CardHeader>
                  <div className="flex items-center justify-between mb-4">
                    <Badge className="bg-gradient-to-r from-purple-600 to-purple-800 text-white text-lg px-4 py-2">
                      {panduan.usia}
                    </Badge>
                  </div>
                  <CardTitle className="text-2xl">Tahap {index + 1}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm text-gray-500 mb-1">Tekstur</div>
                      <div className="font-semibold text-purple-600">{panduan.tekstur}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500 mb-1">Frekuensi</div>
                      <div className="font-semibold text-purple-600">{panduan.frekuensi}</div>
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500 mb-1">Porsi per makan</div>
                    <div className="font-semibold text-purple-600">{panduan.porsi}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500 mb-2">Contoh Menu</div>
                    <div className="flex flex-wrap gap-2">
                      {panduan.contoh.map((menu, idx) => (
                        <Badge key={idx} variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                          {menu}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Tips & Pantangan */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Tips */}
            <Card className="border-2 border-green-200">
              <CardHeader>
                <div className="flex items-center space-x-3 mb-2">
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                    <CheckCircle2 className="text-green-600" size={28} />
                  </div>
                  <CardTitle className="text-2xl">Tips Pemberian MPASI</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {tipsUmum.map((tip, index) => (
                    <li key={index} className="flex items-start space-x-3">
                      <CheckCircle2 className="text-green-600 mt-1 flex-shrink-0" size={20} />
                      <span className="text-gray-700">{tip}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Pantangan */}
            <Card className="border-2 border-red-200">
              <CardHeader>
                <div className="flex items-center space-x-3 mb-2">
                  <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                    <AlertCircle className="text-red-600" size={28} />
                  </div>
                  <CardTitle className="text-2xl">Makanan yang Harus Dihindari</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {makananPantangan.map((pantangan, index) => (
                    <li key={index} className="flex items-start space-x-3">
                      <AlertCircle className="text-red-600 mt-1 flex-shrink-0" size={20} />
                      <span className="text-gray-700">{pantangan}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Prinsip MPASI */}
      <section className="py-20 bg-gradient-to-r from-purple-600 to-purple-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Prinsip MPASI yang Baik</h2>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <Clock size={48} className="mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Tepat Waktu</h3>
              <p className="text-purple-100">Dimulai saat bayi berusia 6 bulan</p>
            </div>
            <div className="text-center">
              <ChefHat size={48} className="mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Adekuat</h3>
              <p className="text-purple-100">Mengandung cukup energi, protein, dan mikronutrien</p>
            </div>
            <div className="text-center">
              <Users size={48} className="mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Aman & Higienis</h3>
              <p className="text-purple-100">Disiapkan dan disajikan dengan cara yang aman</p>
            </div>
            <div className="text-center">
              <CheckCircle2 size={48} className="mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Responsif</h3>
              <p className="text-purple-100">Diberikan sesuai sinyal lapar dan kenyang bayi</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default MPASI;