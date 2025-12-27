import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Calendar, User, ArrowLeft, Tag, Clock, Loader2 } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Card, CardContent } from '../components/ui/card';
import { publicAPI } from '../api';
import { artikelKesehatan as mockArtikel } from '../data/mockData';

const ArtikelDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [artikel, setArtikel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [relatedArtikel, setRelatedArtikel] = useState([]);

  useEffect(() => {
    loadArtikel();
  }, [slug]);

  const loadArtikel = async () => {
    setLoading(true);
    try {
      // Try to fetch from API first
      const res = await publicAPI.getArtikelBySlug(slug);
      if (res.data) {
        setArtikel({
          ...res.data,
          author: res.data.author_name || 'Admin',
          date: res.data.created_at
        });
      }
    } catch (error) {
      // Fallback to mock data
      const mockData = mockArtikel.find(a => a.slug === slug);
      setArtikel(mockData);
    } finally {
      setLoading(false);
    }

    // Load related articles
    try {
      const allRes = await publicAPI.getArtikel();
      const related = allRes.data.filter(a => a.slug !== slug).slice(0, 3);
      if (related.length > 0) {
        setRelatedArtikel(related);
      } else {
        setRelatedArtikel(mockArtikel.filter(a => a.slug !== slug).slice(0, 3));
      }
    } catch {
      setRelatedArtikel(mockArtikel.filter(a => a.slug !== slug).slice(0, 3));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-purple-600" size={48} />
      </div>
    );
  }

  if (!artikel) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Artikel Tidak Ditemukan</h1>
          <Link to="/artikel">
            <Button className="bg-purple-600 hover:bg-purple-700">
              Kembali ke Artikel
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // For API articles, use the content field directly
  // For mock articles, generate sections
  const isApiArtikel = artikel.content && !artikel.sections;
  
  const mockSections = [
    {
      title: 'Mengapa Ini Penting?',
      content: 'Nutrisi yang tepat di masa pertumbuhan sangat krusial untuk perkembangan fisik dan kognitif anak. Penelitian menunjukkan bahwa 1000 hari pertama kehidupan (sejak konsepsi hingga usia 2 tahun) adalah periode emas yang menentukan kualitas kesehatan anak di masa depan.'
    },
    {
      title: 'Tips Praktis untuk Orang Tua',
      content: '1. **Variasi Makanan**: Berikan beragam jenis makanan dari berbagai kelompok nutrisi.\n\n2. **Porsi yang Tepat**: Sesuaikan porsi dengan usia dan aktivitas anak.\n\n3. **Jadwal Makan Teratur**: Buat rutinitas makan yang konsisten.\n\n4. **Suasana Menyenangkan**: Ciptakan suasana makan yang positif.'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-50">
      {/* Hero */}
      <section className="relative py-20 bg-gradient-to-r from-purple-600 to-purple-800 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Button
            variant="ghost"
            className="text-white hover:bg-white/20 mb-8"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="mr-2" size={20} />
            Kembali
          </Button>

          <Badge className="bg-white/20 text-white mb-4">{artikel.category}</Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">{artikel.title}</h1>
          
          <div className="flex flex-wrap items-center gap-6 text-purple-100">
            <div className="flex items-center space-x-2">
              <User size={20} />
              <span>{artikel.author || artikel.author_name || 'Admin'}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Calendar size={20} />
              <span>{new Date(artikel.date || artikel.created_at).toLocaleDateString('id-ID', { 
                day: 'numeric', 
                month: 'long', 
                year: 'numeric' 
              })}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock size={20} />
              <span>5 menit baca</span>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Image */}
      {artikel.image && (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10">
          <img 
            src={artikel.image} 
            alt={artikel.title}
            className="w-full h-[400px] object-cover rounded-2xl shadow-2xl"
            onError={(e) => { e.target.style.display = 'none'; }}
          />
        </div>
      )}

      {/* Content */}
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Introduction */}
        <div className="prose prose-lg max-w-none mb-12">
          <p className="text-xl text-gray-700 leading-relaxed">
            {artikel.excerpt}
          </p>
        </div>

        {/* Main Content */}
        {isApiArtikel ? (
          // API Article - show content directly
          <div className="prose prose-lg max-w-none">
            <div className="text-gray-700 whitespace-pre-wrap leading-relaxed">
              {artikel.content}
            </div>
          </div>
        ) : (
          // Mock Article - show sections
          <div className="space-y-12">
            {mockSections.map((section, index) => (
              <div key={index}>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">{section.title}</h2>
                <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {section.content}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tags */}
        <div className="mt-12 pt-8 border-t">
          <div className="flex items-center space-x-4">
            <Tag className="text-gray-400" size={20} />
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline" className="text-purple-600 border-purple-600">
                {artikel.category}
              </Badge>
              <Badge variant="outline" className="text-gray-600">
                Kesehatan Anak
              </Badge>
              <Badge variant="outline" className="text-gray-600">
                Nutrisi
              </Badge>
            </div>
          </div>
        </div>

        {/* Author Card */}
        <Card className="mt-12 border-2">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 rounded-full bg-purple-600 flex items-center justify-center text-white font-bold text-2xl">
                {(artikel.author || artikel.author_name || 'A')[0]}
              </div>
              <div>
                <h3 className="font-bold text-lg text-gray-900">{artikel.author || artikel.author_name || 'Admin'}</h3>
                <p className="text-gray-600">Tim Sobat Giziku</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </article>

      {/* Related Articles */}
      {relatedArtikel.length > 0 && (
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Artikel Terkait</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {relatedArtikel.map((item) => (
                <Link key={item.id} to={`/artikel/${item.slug}`}>
                  <Card className="border-2 hover:border-purple-600 hover:shadow-xl transition-all duration-300 overflow-hidden group cursor-pointer h-full">
                    <div className="h-48 overflow-hidden bg-purple-50">
                      {item.image ? (
                        <img 
                          src={item.image} 
                          alt={item.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          onError={(e) => { e.target.style.display = 'none'; }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-purple-200">
                          <Tag size={48} />
                        </div>
                      )}
                    </div>
                    <CardContent className="p-6">
                      <Badge className="bg-purple-100 text-purple-800 mb-3">{item.category}</Badge>
                      <h3 className="font-bold text-lg text-gray-900 group-hover:text-purple-600 transition-colors line-clamp-2">
                        {item.title}
                      </h3>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default ArtikelDetail;
