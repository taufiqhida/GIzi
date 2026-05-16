import React, { useState, useEffect, useCallback } from 'react';
import { Clock, ChefHat, Utensils, Info, CheckCircle2, Loader2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { publicAPI } from '../api';
import { resepMPASI as mockResep } from '../data/mockData';

const MPASI = () => {
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [resepData, setResepData] = useState({
    '6-8': [],
    '9-11': [],
    '12-23': [],
    'snack': []
  });
  const [loading, setLoading] = useState(true);

  const loadResep = useCallback(async () => {
    try {
      const res = await publicAPI.getResep();
      const apiResep = res.data;
      const grouped = { '6-8': [], '9-11': [], '12-23': [], 'snack': [] };
      apiResep.forEach(r => {
        if (grouped[r.kategori]) grouped[r.kategori].push(r);
      });
      const combined = {
        '6-8': [...grouped['6-8'], ...mockResep['6-8']],
        '9-11': [...grouped['9-11'], ...mockResep['9-11']],
        '12-23': [...grouped['12-23'], ...mockResep['12-23']],
        'snack': [...grouped['snack'], ...mockResep['snack']]
      };
      setResepData(combined);
    } catch (error) {
      if (process.env.NODE_ENV === 'development') console.error('Load resep error:', error);
      setResepData(mockResep);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadResep();
  }, [loadResep]);

  const ResepCard = ({ resep }) => (
    <Card 
      className="border-2 hover:border-purple-600 hover:shadow-xl transition-all duration-300 cursor-pointer group"
      onClick={() => setSelectedRecipe(resep)}
    >
      <div className="h-48 overflow-hidden bg-purple-50">
        {resep.gambar ? (
          <img 
            src={resep.gambar} 
            alt={resep.nama}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            onError={(e) => { e.target.style.display = 'none'; }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <ChefHat size={48} className="text-purple-200" />
          </div>
        )}
      </div>
      <CardHeader>
        <CardTitle className="text-lg group-hover:text-purple-600 transition-colors">
          {resep.nama}
        </CardTitle>
        <CardDescription>{resep.deskripsi}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-2 text-gray-600">
            <Clock size={16} className="text-purple-600" />
            <span>{resep.waktu}</span>
          </div>
          <Badge className="bg-purple-100 text-purple-800">
            {resep.porsi}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );

  const ResepDetail = ({ resep }) => (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" onClick={() => setSelectedRecipe(null)}>
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="sticky top-0 bg-white border-b z-10 p-6 flex items-center justify-between">
          <h2 className="text-3xl font-bold text-gray-900">{resep.nama}</h2>
          <button 
            onClick={() => setSelectedRecipe(null)}
            className="text-gray-500 hover:text-gray-700 text-3xl font-light"
          >
            ×
          </button>
        </div>

        <div className="p-6">
          {resep.gambar && (
            <img 
              src={resep.gambar} 
              alt={resep.nama}
              className="w-full h-80 object-cover rounded-xl mb-6"
              onError={(e) => { e.target.style.display = 'none'; }}
            />
          )}

          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <div className="flex items-center space-x-3 p-4 bg-purple-50 rounded-lg">
              <Clock className="text-purple-600" size={24} />
              <div>
                <div className="text-sm text-gray-600">Waktu Memasak</div>
                <div className="font-semibold text-gray-900">{resep.waktu || '-'}</div>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-4 bg-purple-50 rounded-lg">
              <Utensils className="text-purple-600" size={24} />
              <div>
                <div className="text-sm text-gray-600">Porsi</div>
                <div className="font-semibold text-gray-900">{resep.porsi || '-'}</div>
              </div>
            </div>
          </div>

          <p className="text-gray-600 text-lg mb-6 p-4 bg-purple-50 rounded-lg">
            {resep.deskripsi}
          </p>

          <div className="grid md:grid-cols-2 gap-6 mb-6">
            {resep.alat && resep.alat.length > 0 && (
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                  <ChefHat className="mr-2 text-purple-600" size={24} />
                  Alat yang Dibutuhkan
                </h3>
                <ul className="space-y-2">
                  {resep.alat.map((item, index) => (
                    <li key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <CheckCircle2 className="text-green-600 flex-shrink-0" size={20} />
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {resep.bahan && resep.bahan.length > 0 && (
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                  <Utensils className="mr-2 text-purple-600" size={24} />
                  Bahan-bahan
                </h3>
                <ul className="space-y-2">
                  {resep.bahan.map((item, index) => (
                    <li key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                      <span className="text-purple-600 font-bold flex-shrink-0">•</span>
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {resep.cara && resep.cara.length > 0 && (
            <div className="mb-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Cara Membuat</h3>
              <ol className="space-y-3">
                {resep.cara.map((step, index) => (
                  <li key={index} className="flex items-start space-x-4 p-4 bg-gradient-to-r from-purple-50 to-white rounded-lg border-l-4 border-purple-600">
                    <div className="w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
                      {index + 1}
                    </div>
                    <span className="text-gray-700 pt-1">{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          )}

          {resep.tips && (
            <div className="bg-blue-50 border-l-4 border-blue-600 p-4 rounded-lg">
              <div className="flex items-start space-x-3">
                <Info className="text-blue-600 flex-shrink-0 mt-1" size={20} />
                <div>
                  <h4 className="font-bold text-blue-900 mb-1">Tips:</h4>
                  <p className="text-blue-800">{resep.tips}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-purple-600" size={48} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-50">
      {/* Hero */}
      <section className="bg-gradient-to-r from-purple-600 to-purple-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <ChefHat size={64} className="mx-auto mb-6" />
            <h1 className="text-5xl font-bold mb-6">Panduan & Resep MPASI</h1>
            <p className="text-xl text-purple-100 max-w-3xl mx-auto">
              Resep lengkap MPASI sesuai tahapan usia dengan tutorial memasak yang mudah diikuti
            </p>
          </div>
        </div>
      </section>

      {/* Info MPASI */}
      <section className="py-12 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="border-2 border-purple-200">
            <CardHeader>
              <CardTitle className="text-2xl">Tentang MPASI</CardTitle>
            </CardHeader>
            <CardContent className="text-gray-600 leading-relaxed">
              <p className="mb-4">
                MPASI (Makanan Pendamping ASI) adalah makanan atau minuman yang mengandung nutrisi, diberikan kepada bayi mulai usia 6 bulan sebagai pendamping ASI untuk memenuhi kebutuhan gizi yang tidak bisa dipenuhi dari ASI saja.
              </p>
              <p>
                Di bawah ini kami sajikan resep MPASI lengkap berdasarkan tahapan usia, dilengkapi dengan alat, bahan, dan tutorial memasak yang mudah diikuti.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Resep per Kategori */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Tabs defaultValue="6-8" className="w-full">
            <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 h-auto mb-12">
              <TabsTrigger value="6-8" className="text-base py-3">
                6-8 Bulan ({resepData['6-8'].length})
              </TabsTrigger>
              <TabsTrigger value="9-11" className="text-base py-3">
                9-11 Bulan ({resepData['9-11'].length})
              </TabsTrigger>
              <TabsTrigger value="12-23" className="text-base py-3">
                12-23 Bulan ({resepData['12-23'].length})
              </TabsTrigger>
              <TabsTrigger value="snack" className="text-base py-3">
                Snack ({resepData['snack'].length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="6-8" className="space-y-8">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-3">MPASI 6-8 Bulan</h2>
                <p className="text-lg text-gray-600">Tekstur puree halus, 2-3 kali sehari</p>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {resepData['6-8'].map((resep, idx) => (
                  <ResepCard key={resep.id || idx} resep={resep} />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="9-11" className="space-y-8">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-3">MPASI 9-11 Bulan</h2>
                <p className="text-lg text-gray-600">Tekstur mashed/cincang, 3-4 kali sehari</p>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {resepData['9-11'].map((resep, idx) => (
                  <ResepCard key={resep.id || idx} resep={resep} />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="12-23" className="space-y-8">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-3">MPASI 12-23 Bulan</h2>
                <p className="text-lg text-gray-600">Makanan keluarga, 3-4 kali sehari + snack</p>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {resepData['12-23'].map((resep, idx) => (
                  <ResepCard key={resep.id || idx} resep={resep} />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="snack" className="space-y-8">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-3">Snack Sehat</h2>
                <p className="text-lg text-gray-600">Camilan bergizi untuk anak 9+ bulan</p>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {resepData['snack'].map((resep, idx) => (
                  <ResepCard key={resep.id || idx} resep={resep} />
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Tips Umum */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Tips Umum MPASI</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-2 border-green-200 bg-green-50">
              <CardHeader>
                <div className="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center mb-3">
                  <CheckCircle2 className="text-white" size={24} />
                </div>
                <CardTitle className="text-green-900">Prinsip Pemberian</CardTitle>
              </CardHeader>
              <CardContent className="text-green-800">
                <ul className="space-y-2 text-sm">
                  <li>✓ Mulai MPASI usia 6 bulan</li>
                  <li>✓ Berikan ASI sebelum MPASI</li>
                  <li>✓ Tekstur bertahap sesuai usia</li>
                  <li>✓ Variasi menu bergizi</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-2 border-blue-200 bg-blue-50">
              <CardHeader>
                <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mb-3">
                  <ChefHat className="text-white" size={24} />
                </div>
                <CardTitle className="text-blue-900">Kebersihan</CardTitle>
              </CardHeader>
              <CardContent className="text-blue-800">
                <ul className="space-y-2 text-sm">
                  <li>✓ Cuci tangan sebelum memasak</li>
                  <li>✓ Sterilkan peralatan</li>
                  <li>✓ Gunakan bahan segar</li>
                  <li>✓ Sajikan segera/simpan benar</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-2 border-orange-200 bg-orange-50">
              <CardHeader>
                <div className="w-12 h-12 bg-orange-600 rounded-xl flex items-center justify-center mb-3">
                  <Info className="text-white" size={24} />
                </div>
                <CardTitle className="text-orange-900">Pantangan</CardTitle>
              </CardHeader>
              <CardContent className="text-orange-800">
                <ul className="space-y-2 text-sm">
                  <li>✗ Madu (sebelum 1 tahun)</li>
                  <li>✗ Garam & gula berlebih</li>
                  <li>✗ Makanan keras</li>
                  <li>✗ Seafood mentah</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Modal Detail Resep */}
      {selectedRecipe && <ResepDetail resep={selectedRecipe} />}
    </div>
  );
};

export default MPASI;
