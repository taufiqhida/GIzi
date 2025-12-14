import React from 'react';
import { Phone, MessageCircle, Clock, Award, CheckCircle } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { daftarDokter } from '../data/mockData';

const Konsultasi = () => {
  const handleWhatsApp = (noHP, nama) => {
    const message = encodeURIComponent(`Halo ${nama}, saya ingin konsultasi gizi. Terima kasih.`);
    window.open(`https://wa.me/${noHP}?text=${message}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-50">
      {/* Hero */}
      <section className="bg-gradient-to-r from-purple-600 to-purple-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl font-bold mb-6">Konsultasi Gizi</h1>
            <p className="text-xl text-purple-100 max-w-3xl mx-auto">
              Dapatkan bimbingan profesional dari ahli gizi bersertifikat untuk kesehatan optimal keluarga Anda
            </p>
          </div>
        </div>
      </section>

      {/* Jenis Konsultasi */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Pilih Metode Konsultasi</h2>
            <p className="text-xl text-gray-600">Fleksibel sesuai kebutuhan Anda</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {jenisKonsultasi.map((jenis, index) => (
              <Card key={index} className="border-2 hover:border-purple-600 hover:shadow-xl transition-all duration-300 group">
                <CardHeader>
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-purple-200 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <jenis.icon className="text-purple-600" size={32} />
                  </div>
                  <CardTitle className="text-xl">{jenis.title}</CardTitle>
                  <CardDescription>{jenis.desc}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Durasi:</span>
                      <span className="font-semibold text-purple-600">{jenis.durasi}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Biaya:</span>
                      <span className="font-semibold text-green-600">{jenis.harga}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Form Pendaftaran */}
      <section className="py-20 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Daftar Konsultasi</h2>
            <p className="text-xl text-gray-600">Isi formulir di bawah untuk memulai konsultasi</p>
          </div>

          <Card className="border-2">
            <CardContent className="pt-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="nama">Nama Lengkap *</Label>
                    <Input 
                      id="nama" 
                      placeholder="Nama Anda" 
                      value={formData.nama}
                      onChange={(e) => setFormData({...formData, nama: e.target.value})}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="telepon">No. Telepon *</Label>
                    <Input 
                      id="telepon" 
                      type="tel" 
                      placeholder="0812XXXXXXXX" 
                      value={formData.telepon}
                      onChange={(e) => setFormData({...formData, telepon: e.target.value})}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="email@example.com" 
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    required
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="jenis">Jenis Konsultasi *</Label>
                    <Select value={formData.jenisKonsultasi} onValueChange={(value) => setFormData({...formData, jenisKonsultasi: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih metode" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="telepon">Telepon</SelectItem>
                        <SelectItem value="video">Video Call</SelectItem>
                        <SelectItem value="chat">Chat WhatsApp</SelectItem>
                        <SelectItem value="tatap-muka">Tatap Muka</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="usia">Usia Anak (bulan)</Label>
                    <Input 
                      id="usia" 
                      type="number" 
                      placeholder="Contoh: 12" 
                      value={formData.usiaAnak}
                      onChange={(e) => setFormData({...formData, usiaAnak: e.target.value})}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="keluhan">Keluhan / Pertanyaan *</Label>
                  <Textarea 
                    id="keluhan" 
                    placeholder="Ceritakan keluhan atau pertanyaan Anda..." 
                    rows={5}
                    value={formData.keluhan}
                    onChange={(e) => setFormData({...formData, keluhan: e.target.value})}
                    required
                  />
                </div>

                <Button type="submit" className="w-full bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 shadow-lg">
                  Kirim Pendaftaran
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Proses */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Alur Konsultasi</h2>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {prosesKonsultasi.map((proses, index) => (
              <div key={index} className="text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-600 to-purple-800 rounded-full flex items-center justify-center mx-auto mb-4 text-white text-2xl font-bold shadow-lg">
                  {proses.step}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{proses.title}</h3>
                <p className="text-gray-600">{proses.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Info */}
      <section className="py-20 bg-gradient-to-r from-purple-600 to-purple-800 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6">Butuh Bantuan Segera?</h2>
          <p className="text-xl text-purple-100 mb-8">Hubungi kami langsung untuk konsultasi darurat</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="tel:0856-198-1313">
              <Button size="lg" className="bg-white text-purple-600 hover:bg-gray-100">
                <Phone className="mr-2" size={20} />
                0856-198-1313
              </Button>
            </a>
            <a href="https://wa.me/6285619813" target="_blank" rel="noopener noreferrer">
              <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white/10">
                <MessageCircle className="mr-2" size={20} />
                WhatsApp
              </Button>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Konsultasi;