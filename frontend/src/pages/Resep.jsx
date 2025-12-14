import React, { useState } from 'react';
import { Search, Clock, Users, ChefHat, Utensils } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { resepSehat } from '../data/mockData';

const Resep = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAgeGroup, setSelectedAgeGroup] = useState('Semua');

  const ageGroups = ['Semua', '6-8 bulan', '9-12 bulan', '12+ bulan'];

  const filteredResep = resepSehat.filter(resep => {
    const matchSearch = resep.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        resep.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchAge = selectedAgeGroup === 'Semua' || resep.ageGroup === selectedAgeGroup;
    return matchSearch && matchAge;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-50">
      {/* Hero */}
      <section className="bg-gradient-to-r from-purple-600 to-purple-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <ChefHat size={64} className="mx-auto mb-6" />
            <h1 className="text-5xl font-bold mb-6">Resep Sehat</h1>
            <p className="text-xl text-purple-100 max-w-3xl mx-auto">
              Kumpulan resep MPASI dan makanan sehat untuk tumbuh kembang optimal si kecil
            </p>
          </div>
        </div>
      </section>

      {/* Search & Filter */}
      <section className="py-12 bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            {/* Search */}
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <Input 
                placeholder="Cari resep..." 
                className="pl-10 h-12"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Age Group Filter */}
            <div className="flex gap-2 overflow-x-auto w-full md:w-auto">
              {ageGroups.map((age) => (
                <Badge
                  key={age}
                  onClick={() => setSelectedAgeGroup(age)}
                  className={`cursor-pointer whitespace-nowrap transition-all ${
                    selectedAgeGroup === age
                      ? 'bg-purple-600 text-white hover:bg-purple-700'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {age}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Recipe Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Resep Pilihan</h2>
            <p className="text-gray-600">{filteredResep.length} resep ditemukan</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredResep.map((resep) => (
              <Card key={resep.id} className="border-2 hover:border-purple-600 hover:shadow-xl transition-all duration-300 overflow-hidden group cursor-pointer">
                <div className="h-56 overflow-hidden relative">
                  <img 
                    src={resep.image} 
                    alt={resep.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-4 right-4">
                    <Badge className="bg-purple-600 text-white">{resep.ageGroup}</Badge>
                  </div>
                </div>
                <CardHeader>
                  <CardTitle className="text-xl group-hover:text-purple-600 transition-colors">
                    {resep.title}
                  </CardTitle>
                  <CardDescription className="text-base">{resep.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Prep Time */}
                  <div className="flex items-center space-x-2 text-gray-600">
                    <Clock size={18} className="text-purple-600" />
                    <span className="text-sm">{resep.prepTime}</span>
                  </div>

                  {/* Ingredients */}
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
                      <Utensils size={18} className="mr-2 text-purple-600" />
                      Bahan-bahan:
                    </h4>
                    <ul className="space-y-1">
                      {resep.ingredients.slice(0, 3).map((ingredient, index) => (
                        <li key={index} className="text-sm text-gray-600 flex items-start">
                          <span className="text-purple-600 mr-2">•</span>
                          {ingredient}
                        </li>
                      ))}
                      {resep.ingredients.length > 3 && (
                        <li className="text-sm text-purple-600 font-medium">+{resep.ingredients.length - 3} bahan lainnya</li>
                      )}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Tips Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Tips Memasak MPASI</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-2 border-purple-200">
              <CardHeader>
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
                  <ChefHat className="text-purple-600" size={24} />
                </div>
                <CardTitle>Kebersihan Utama</CardTitle>
              </CardHeader>
              <CardContent className="text-gray-600">
                Pastikan semua peralatan dan bahan makanan bersih. Cuci tangan sebelum memasak dan gunakan air bersih untuk mencuci bahan.
              </CardContent>
            </Card>

            <Card className="border-2 border-purple-200">
              <CardHeader>
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
                  <Utensils className="text-purple-600" size={24} />
                </div>
                <CardTitle>Tekstur Sesuai Usia</CardTitle>
              </CardHeader>
              <CardContent className="text-gray-600">
                Sesuaikan tekstur makanan dengan kemampuan makan bayi. Mulai dari puree halus hingga makanan cincang sesuai tahapan.
              </CardContent>
            </Card>

            <Card className="border-2 border-purple-200">
              <CardHeader>
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
                  <Clock className="text-purple-600" size={24} />
                </div>
                <CardTitle>Sajikan Fresh</CardTitle>
              </CardHeader>
              <CardContent className="text-gray-600">
                MPASI paling baik disajikan fresh. Jika ingin menyimpan, gunakan wadah tertutup di kulkas maksimal 24 jam.
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-purple-600 to-purple-800 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Users size={64} className="mx-auto mb-6" />
          <h2 className="text-4xl font-bold mb-6">Butuh Resep Khusus?</h2>
          <p className="text-xl text-purple-100 mb-8">
            Konsultasikan dengan ahli gizi kami untuk mendapatkan rekomendasi resep yang sesuai dengan kondisi spesifik anak Anda
          </p>
          <Badge className="bg-white text-purple-600 px-6 py-3 text-base cursor-pointer hover:bg-gray-100 transition-colors">
            Konsultasi Sekarang
          </Badge>
        </div>
      </section>
    </div>
  );
};

export default Resep;