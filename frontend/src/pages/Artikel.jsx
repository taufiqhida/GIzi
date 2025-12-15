import React, { useState } from 'react';
import { Search, Calendar, User, ArrowRight, BookOpen } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { artikelKesehatan } from '../data/mockData';

const Artikel = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Semua');

  const categories = ['Semua', 'Nutrisi', 'MPASI', 'Tips Parenting', 'Kesehatan Anak'];

  const filteredArtikel = artikelKesehatan.filter(artikel => {
    const matchSearch = artikel.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        artikel.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCategory = selectedCategory === 'Semua' || artikel.category === selectedCategory;
    return matchSearch && matchCategory;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-50">
      {/* Hero */}
      <section className="bg-gradient-to-r from-purple-600 to-purple-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <BookOpen size={64} className="mx-auto mb-6" />
            <h1 className="text-5xl font-bold mb-6">Artikel Kesehatan</h1>
            <p className="text-xl text-purple-100 max-w-3xl mx-auto">
              Informasi terpercaya seputar gizi, kesehatan anak, dan tips parenting dari para ahli
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
                placeholder="Cari artikel..." 
                className="pl-10 h-12"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Category Filter */}
            <div className="flex gap-2 overflow-x-auto w-full md:w-auto">
              {categories.map((category) => (
                <Badge
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`cursor-pointer whitespace-nowrap transition-all ${
                    selectedCategory === category
                      ? 'bg-purple-600 text-white hover:bg-purple-700'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {category}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Featured Article */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Artikel Pilihan</h2>
            <p className="text-gray-600">Artikel paling populer minggu ini</p>
          </div>

          <Card className="border-2 hover:border-purple-600 transition-all duration-300 overflow-hidden group cursor-pointer">
            <Link to={`/artikel/${artikelKesehatan[0].id}`}>
              <div className="grid md:grid-cols-2">
                <div className="h-80 overflow-hidden">
                  <img 
                    src={artikelKesehatan[0].image} 
                    alt={artikelKesehatan[0].title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <div className="p-8 flex flex-col justify-center">
                  <Badge className="bg-purple-100 text-purple-800 w-fit mb-4">{artikelKesehatan[0].category}</Badge>
                  <h3 className="text-3xl font-bold text-gray-900 mb-4 group-hover:text-purple-600 transition-colors">
                    {artikelKesehatan[0].title}
                  </h3>
                  <p className="text-gray-600 text-lg mb-6">{artikelKesehatan[0].excerpt}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <div className="flex items-center space-x-2">
                        <User size={16} />
                        <span>{artikelKesehatan[0].author}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Calendar size={16} />
                        <span>{new Date(artikelKesehatan[0].date).toLocaleDateString('id-ID')}</span>
                      </div>
                    </div>
                    <Button className="bg-purple-600 hover:bg-purple-700 group-hover:translate-x-2 transition-transform">
                      Baca Selengkapnya
                      <ArrowRight className="ml-2" size={16} />
                    </Button>
                  </div>
                </div>
              </div>
            </Link>
          </Card>
        </div>
      </section>

      {/* Article Grid */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Artikel Terbaru</h2>
            <p className="text-gray-600">{filteredArtikel.length} artikel ditemukan</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredArtikel.map((artikel) => (
              <Card key={artikel.id} className="border-2 hover:border-purple-600 hover:shadow-xl transition-all duration-300 overflow-hidden group cursor-pointer">
                <div className="h-48 overflow-hidden">
                  <img 
                    src={artikel.image} 
                    alt={artikel.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <CardHeader>
                  <Badge className="bg-purple-100 text-purple-800 w-fit mb-2">{artikel.category}</Badge>
                  <CardTitle className="text-xl group-hover:text-purple-600 transition-colors line-clamp-2">
                    {artikel.title}
                  </CardTitle>
                  <CardDescription className="line-clamp-3">{artikel.excerpt}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center space-x-2">
                      <User size={14} />
                      <span className="text-xs">{artikel.author}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Calendar size={14} />
                      <span className="text-xs">{new Date(artikel.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-20 bg-gradient-to-r from-purple-600 to-purple-800 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6">Dapatkan Artikel Terbaru</h2>
          <p className="text-xl text-purple-100 mb-8">
            Subscribe newsletter kami untuk mendapatkan artikel kesehatan terbaru langsung ke email Anda
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <Input 
              placeholder="Email Anda" 
              className="h-12 bg-white text-gray-900"
            />
            <Button size="lg" className="bg-white text-purple-600 hover:bg-gray-100 whitespace-nowrap">
              Subscribe
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Artikel;