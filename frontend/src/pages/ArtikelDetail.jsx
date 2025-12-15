import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Calendar, User, ArrowLeft, Tag, Clock } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Card, CardContent } from '../components/ui/card';
import { artikelKesehatan } from '../data/mockData';

const ArtikelDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  
  const artikel = artikelKesehatan.find(a => a.slug === slug);

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

  // Mock full article content
  const fullContent = {
    introduction: `${artikel.excerpt} Dalam artikel ini, kita akan membahas secara mendalam tentang topik penting ini yang sangat berkaitan dengan kesehatan dan nutrisi anak-anak kita.`,
    sections: [
      {
        title: 'Mengapa Ini Penting?',
        content: 'Nutrisi yang tepat di masa pertumbuhan sangat krusial untuk perkembangan fisik dan kognitif anak. Penelitian menunjukkan bahwa 1000 hari pertama kehidupan (sejak konsepsi hingga usia 2 tahun) adalah periode emas yang menentukan kualitas kesehatan anak di masa depan. Kekurangan nutrisi di periode ini dapat berdampak jangka panjang yang sulit diperbaiki.'
      },
      {
        title: 'Tips Praktis untuk Orang Tua',
        content: 'Berikut adalah beberapa tips yang dapat diterapkan sehari-hari:\n\n1. **Variasi Makanan**: Berikan beragam jenis makanan dari berbagai kelompok nutrisi. Jangan hanya fokus pada satu jenis makanan saja.\n\n2. **Porsi yang Tepat**: Sesuaikan porsi dengan usia dan aktivitas anak. Jangan memaksakan anak untuk menghabiskan makanan jika sudah kenyang.\n\n3. **Jadwal Makan Teratur**: Buat rutinitas makan yang konsisten. Ini membantu mengatur metabolisme dan nafsu makan anak.\n\n4. **Suasana Menyenangkan**: Ciptakan suasana makan yang positif tanpa tekanan atau distraksi gadget.'
      },
      {
        title: 'Nutrisi yang Dibutuhkan',
        content: 'Anak-anak memerlukan berbagai nutrisi penting untuk tumbuh kembang optimal:\n\n**Protein**: Penting untuk pertumbuhan dan perbaikan jaringan. Sumber: daging, ikan, telur, tahu, tempe.\n\n**Karbohidrat**: Sumber energi utama. Pilih karbohidrat kompleks seperti nasi merah, roti gandum, oatmeal.\n\n**Lemak Sehat**: Penting untuk perkembangan otak. Sumber: alpukat, minyak zaitun, ikan salmon.\n\n**Vitamin & Mineral**: Untuk sistem imun dan berbagai fungsi tubuh. Dapatkan dari buah dan sayur berwarna-warni.\n\n**Kalsium & Vitamin D**: Untuk pertumbuhan tulang yang kuat. Sumber: susu, keju, yogurt, paparan sinar matahari pagi.'
      },
      {
        title: 'Kesalahan yang Sering Dilakukan',
        content: 'Beberapa kesalahan umum yang perlu dihindari:\n\n❌ **Memaksakan anak makan**: Ini dapat menyebabkan trauma dan mengganggu nafsu makan alami anak.\n\n❌ **Terlalu banyak gula**: Makanan dan minuman manis berlebihan dapat menyebabkan obesitas dan masalah gigi.\n\n❌ **Mengabaikan sarapan**: Sarapan penting untuk energi dan konsentrasi anak di sekolah.\n\n❌ **Memberikan junk food terlalu sering**: Makanan cepat saji rendah nutrisi dan tinggi kalori kosong.'
      },
      {
        title: 'Kapan Harus Konsultasi ke Ahli?',
        content: 'Segera konsultasi dengan ahli gizi atau dokter anak jika:\n\n• Anak tidak menunjukkan pertambahan berat atau tinggi badan yang signifikan\n• Menolak makan dalam waktu lama\n• Menunjukkan tanda-tanda alergi makanan\n• Memiliki masalah kesehatan khusus seperti diabetes atau alergi\n• Anda memerlukan panduan diet khusus untuk kondisi tertentu\n\nKonsultasi dini dapat mencegah masalah yang lebih serius di kemudian hari.'
      }
    ],
    conclusion: 'Nutrisi yang baik adalah investasi terbaik untuk masa depan anak. Dengan pemahaman yang tepat dan konsistensi dalam menerapkan pola makan sehat, kita dapat memastikan anak tumbuh dengan optimal. Jangan ragu untuk berkonsultasi dengan ahli gizi jika Anda memiliki pertanyaan atau kekhawatiran khusus mengenai nutrisi anak Anda.'
  };

  const relatedArticles = artikelKesehatan.filter(a => a.id !== artikel.id && a.category === artikel.category).slice(0, 2);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Button 
            variant="ghost" 
            onClick={() => navigate(-1)}
            className="hover:bg-purple-50"
          >
            <ArrowLeft className="mr-2" size={20} />
            Kembali
          </Button>
        </div>
      </div>

      {/* Article Content */}
      <article className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Category Badge */}
          <Badge className="bg-purple-100 text-purple-800 mb-6">
            {artikel.category}
          </Badge>

          {/* Title */}
          <h1 className="text-5xl font-bold text-gray-900 mb-6 leading-tight">
            {artikel.title}
          </h1>

          {/* Meta Info */}
          <div className="flex flex-wrap items-center gap-6 text-gray-600 mb-8 pb-8 border-b">
            <div className="flex items-center space-x-2">
              <User size={18} className="text-purple-600" />
              <span>{artikel.author}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Calendar size={18} className="text-purple-600" />
              <span>{new Date(artikel.date).toLocaleDateString('id-ID', { 
                day: 'numeric', 
                month: 'long', 
                year: 'numeric' 
              })}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock size={18} className="text-purple-600" />
              <span>8 menit baca</span>
            </div>
          </div>

          {/* Featured Image */}
          <div className="mb-12 rounded-2xl overflow-hidden shadow-2xl">
            <img 
              src={artikel.image} 
              alt={artikel.title}
              className="w-full h-96 object-cover"
            />
          </div>

          {/* Introduction */}
          <div className="prose prose-lg max-w-none mb-8">
            <p className="text-xl text-gray-700 leading-relaxed">
              {fullContent.introduction}
            </p>
          </div>

          {/* Article Sections */}
          <div className="space-y-12">
            {fullContent.sections.map((section, index) => (
              <section key={index} className="scroll-mt-20">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  {section.title}
                </h2>
                <div className="prose prose-lg max-w-none">
                  {section.content.split('\n\n').map((paragraph, pIndex) => (
                    <p key={pIndex} className="text-gray-700 leading-relaxed mb-4 whitespace-pre-line">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </section>
            ))}
          </div>

          {/* Conclusion */}
          <div className="mt-12 p-8 bg-gradient-to-r from-purple-50 to-blue-50 rounded-2xl border-l-4 border-purple-600">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Kesimpulan</h3>
            <p className="text-gray-700 text-lg leading-relaxed">
              {fullContent.conclusion}
            </p>
          </div>

          {/* CTA Section */}
          <Card className="mt-12 bg-gradient-to-r from-purple-600 to-purple-800 text-white border-0">
            <CardContent className="p-8 text-center">
              <h3 className="text-2xl font-bold mb-4">Butuh Konsultasi Lebih Lanjut?</h3>
              <p className="text-purple-100 mb-6 text-lg">
                Tim ahli gizi kami siap membantu Anda dengan konsultasi personal
              </p>
              <Link to="/konsultasi">
                <Button size="lg" className="bg-white text-purple-600 hover:bg-gray-100">
                  Konsultasi Sekarang
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Related Articles */}
          {relatedArticles.length > 0 && (
            <div className="mt-16">
              <h3 className="text-3xl font-bold text-gray-900 mb-8">Artikel Terkait</h3>
              <div className="grid md:grid-cols-2 gap-8">
                {relatedArticles.map((related) => (
                  <Link key={related.id} to={`/artikel/${related.id}`}>
                    <Card className="border-2 hover:border-purple-600 hover:shadow-xl transition-all duration-300 overflow-hidden group cursor-pointer h-full">
                      <div className="h-48 overflow-hidden">
                        <img 
                          src={related.image} 
                          alt={related.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      </div>
                      <CardContent className="p-6">
                        <Badge className="bg-purple-100 text-purple-800 mb-3">
                          {related.category}
                        </Badge>
                        <h4 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors line-clamp-2">
                          {related.title}
                        </h4>
                        <p className="text-gray-600 line-clamp-3">{related.excerpt}</p>
                        <div className="flex items-center justify-between mt-4 text-sm text-gray-500">
                          <div className="flex items-center space-x-2">
                            <User size={14} />
                            <span className="text-xs">{related.author}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Calendar size={14} />
                            <span className="text-xs">
                              {new Date(related.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </article>
    </div>
  );
};

export default ArtikelDetail;
