import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Calendar, User, ArrowRight, BookOpen, Loader2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { publicAPI } from '../api';
import { artikelKesehatan as mockArtikel } from '../data/mockData';

const Artikel = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Semua');
  const [artikelList, setArtikelList] = useState([]);
  const [loading, setLoading] = useState(true);

  const categories = ['Semua', 'Gizi Anak', 'Tumbuh Kembang', 'Kesehatan', 'Tips & Trik', 'MPASI'];

  useEffect(() => {
    loadArtikel();
  }, []);

  const loadArtikel = async () => {
    try {
      const res = await publicAPI.getArtikel();
      // Combine API data with mock data
      const apiData = res.data.map(a => ({
        ...a,
        author: a.author_name || 'Admin',
        date: a.created_at
      }));
      // If API has data, use it; otherwise fallback to mock
      if (apiData.length > 0) {
        setArtikelList([...apiData, ...mockArtikel]);
      } else {
        setArtikelList(mockArtikel);
      }
    } catch (error) {
      console.error('Load artikel error:', error);
      setArtikelList(mockArtikel);
    } finally {
      setLoading(false);
    }
  };

  const filteredArtikel = artikelList.filter(artikel => {
    const matchSearch = artikel.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        artikel.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCategory = selectedCategory === 'Semua' || artikel.category === selectedCategory;
    return matchSearch && matchCategory;
  });

  const featuredArtikel = filteredArtikel[0];

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
      {featuredArtikel && (
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Artikel Pilihan</h2>
              <p className="text-gray-600">Artikel paling populer minggu ini</p>
            </div>

            <Card className="border-2 hover:border-purple-600 transition-all duration-300 overflow-hidden group cursor-pointer">
              <Link to={`/artikel/${featuredArtikel.slug}`}>
                <div className="grid md:grid-cols-2">
                  <div className="h-80 overflow-hidden bg-purple-100">
                    {featuredArtikel.image ? (
                      <img 
                        src={featuredArtikel.image} 
                        alt={featuredArtikel.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        onError={(e) => { e.target.style.display = 'none'; }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <BookOpen size={64} className="text-purple-300" />
                      </div>
                    )}
                  </div>
                  <div className="p-8 flex flex-col justify-center">
                    <Badge className="bg-purple-100 text-purple-800 w-fit mb-4">{featuredArtikel.category}</Badge>
                    <h3 className="text-3xl font-bold text-gray-900 mb-4 group-hover:text-purple-600 transition-colors">
                      {featuredArtikel.title}
                    </h3>
                    <p className="text-gray-600 text-lg mb-6">{featuredArtikel.excerpt}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <div className="flex items-center space-x-2">
                          <User size={16} />
                          <span>{featuredArtikel.author || 'Admin'}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Calendar size={16} />
                          <span>{new Date(featuredArtikel.date || featuredArtikel.created_at).toLocaleDateString('id-ID')}</span>
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
      )}

      {/* Article Grid */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Artikel Terbaru</h2>
            <p className="text-gray-600">{filteredArtikel.length} artikel ditemukan</p>
          </div>

          {filteredArtikel.length === 0 ? (
            <div className="text-center py-12">
              <BookOpen size={64} className="mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500">Tidak ada artikel ditemukan</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredArtikel.map((artikel) => (
                <Link key={artikel.id} to={`/artikel/${artikel.slug}`}>
                  <Card className="border-2 hover:border-purple-600 hover:shadow-xl transition-all duration-300 overflow-hidden group cursor-pointer h-full">
                    <div className="h-48 overflow-hidden bg-purple-50">
                      {artikel.image ? (
                        <img 
                          src={artikel.image} 
                          alt={artikel.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          onError={(e) => { e.target.parentElement.innerHTML = '<div class="w-full h-full flex items-center justify-center"><svg class="text-purple-200" width="48" height="48"><use href="#book-icon"/></svg></div>'; }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <BookOpen size={48} className="text-purple-200" />
                        </div>
                      )}
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
                          <span className="text-xs">{artikel.author || 'Admin'}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Calendar size={14} />
                          <span className="text-xs">{new Date(artikel.date || artikel.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
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
