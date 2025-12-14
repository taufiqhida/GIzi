import React, { useState } from 'react';
import { Calculator, TrendingUp, AlertCircle, CheckCircle, Info } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Button } from '../components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Alert, AlertDescription, AlertTitle } from '../components/ui/alert';
import { Badge } from '../components/ui/badge';

const StatusGizi = () => {
  const [formData, setFormData] = useState({
    jenisKelamin: '',
    usia: '',
    beratBadan: '',
    tinggiBadan: ''
  });

  const [hasil, setHasil] = useState(null);

  const hitungStatusGizi = (e) => {
    e.preventDefault();
    
    const usia = parseInt(formData.usia);
    const bb = parseFloat(formData.beratBadan);
    const tb = parseFloat(formData.tinggiBadan);

    // Simplified WHO standards calculation
    let statusBBU = '';
    let statusTBU = '';
    let statusBBTB = '';
    let colorBBU = '';
    let colorTBU = '';
    let colorBBTB = '';

    // BB/U Classification (simplified)
    if (usia <= 60) {
      const expectedWeight = formData.jenisKelamin === 'laki' 
        ? 7.9 + (usia * 0.17) 
        : 7.3 + (usia * 0.16);
      
      const percentile = (bb / expectedWeight) * 100;
      
      if (percentile < 70) {
        statusBBU = 'Gizi Buruk';
        colorBBU = 'red';
      } else if (percentile < 80) {
        statusBBU = 'Gizi Kurang';
        colorBBU = 'orange';
      } else if (percentile <= 120) {
        statusBBU = 'Gizi Baik';
        colorBBU = 'green';
      } else {
        statusBBU = 'Gizi Lebih';
        colorBBU = 'yellow';
      }
    }

    // TB/U Classification
    const expectedHeight = formData.jenisKelamin === 'laki'
      ? 65.9 + (usia * 0.23)
      : 65.7 + (usia * 0.22);
    
    const heightPercentile = (tb / expectedHeight) * 100;
    
    if (heightPercentile < 85) {
      statusTBU = 'Sangat Pendek';
      colorTBU = 'red';
    } else if (heightPercentile < 90) {
      statusTBU = 'Pendek';
      colorTBU = 'orange';
    } else if (heightPercentile <= 110) {
      statusTBU = 'Normal';
      colorTBU = 'green';
    } else {
      statusTBU = 'Tinggi';
      colorTBU = 'blue';
    }

    // BB/TB Classification (IMT)
    const bmi = (bb / ((tb/100) ** 2)).toFixed(1);
    
    if (bmi < 14) {
      statusBBTB = 'Sangat Kurus';
      colorBBTB = 'red';
    } else if (bmi < 16) {
      statusBBTB = 'Kurus';
      colorBBTB = 'orange';
    } else if (bmi <= 18) {
      statusBBTB = 'Normal';
      colorBBTB = 'green';
    } else {
      statusBBTB = 'Gemuk';
      colorBBTB = 'yellow';
    }

    setHasil({
      statusBBU,
      statusTBU,
      statusBBTB,
      colorBBU,
      colorTBU,
      colorBBTB,
      bmi
    });
  };

  const getRekomendasi = () => {
    if (!hasil) return null;

    const rekomendasi = [];

    if (hasil.statusBBU === 'Gizi Buruk' || hasil.statusBBU === 'Gizi Kurang') {
      rekomendasi.push('Segera konsultasi dengan ahli gizi untuk intervensi nutrisi');
      rekomendasi.push('Tingkatkan asupan kalori dan protein');
      rekomendasi.push('Berikan makanan bergizi tinggi seperti telur, ikan, daging');
    } else if (hasil.statusBBU === 'Gizi Lebih') {
      rekomendasi.push('Atur pola makan seimbang dengan porsi yang tepat');
      rekomendasi.push('Kurangi makanan tinggi gula dan lemak jenuh');
      rekomendasi.push('Tingkatkan aktivitas fisik sesuai usia');
    }

    if (hasil.statusTBU === 'Sangat Pendek' || hasil.statusTBU === 'Pendek') {
      rekomendasi.push('Fokus pada nutrisi untuk mendukung pertumbuhan tinggi badan');
      rekomendasi.push('Pastikan asupan kalsium, vitamin D, dan protein mencukupi');
      rekomendasi.push('Monitoring rutin pertumbuhan setiap bulan');
    }

    if (rekomendasi.length === 0) {
      rekomendasi.push('Status gizi anak Anda baik! Pertahankan pola makan sehat');
      rekomendasi.push('Lanjutkan monitoring pertumbuhan secara berkala');
      rekomendasi.push('Berikan makanan bervariasi dan bergizi seimbang');
    }

    return rekomendasi;
  };

  const getColorClass = (color) => {
    const colors = {
      red: 'bg-red-100 text-red-800 border-red-300',
      orange: 'bg-orange-100 text-orange-800 border-orange-300',
      green: 'bg-green-100 text-green-800 border-green-300',
      yellow: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      blue: 'bg-blue-100 text-blue-800 border-blue-300'
    };
    return colors[color] || '';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-50">
      {/* Hero */}
      <section className="bg-gradient-to-r from-purple-600 to-purple-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Calculator size={64} className="mx-auto mb-6" />
            <h1 className="text-5xl font-bold mb-6">Kalkulator Status Gizi</h1>
            <p className="text-xl text-purple-100 max-w-3xl mx-auto">
              Cek status gizi anak Anda berdasarkan standar WHO secara instan
            </p>
          </div>
        </div>
      </section>

      {/* Calculator */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="border-2 border-purple-200 shadow-xl">
            <CardHeader>
              <CardTitle className="text-3xl">Input Data Anak</CardTitle>
              <CardDescription className="text-base">Masukkan data antropometri anak untuk menghitung status gizi</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={hitungStatusGizi} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="jenisKelamin">Jenis Kelamin *</Label>
                    <Select value={formData.jenisKelamin} onValueChange={(value) => setFormData({...formData, jenisKelamin: value})} required>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih jenis kelamin" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="laki">Laki-laki</SelectItem>
                        <SelectItem value="perempuan">Perempuan</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="usia">Usia (bulan) *</Label>
                    <Input 
                      id="usia" 
                      type="number" 
                      placeholder="Contoh: 24" 
                      min="0"
                      max="60"
                      value={formData.usia}
                      onChange={(e) => setFormData({...formData, usia: e.target.value})}
                      required
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="beratBadan">Berat Badan (kg) *</Label>
                    <Input 
                      id="beratBadan" 
                      type="number" 
                      step="0.1"
                      placeholder="Contoh: 12.5" 
                      value={formData.beratBadan}
                      onChange={(e) => setFormData({...formData, beratBadan: e.target.value})}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="tinggiBadan">Tinggi Badan (cm) *</Label>
                    <Input 
                      id="tinggiBadan" 
                      type="number" 
                      step="0.1"
                      placeholder="Contoh: 85.5" 
                      value={formData.tinggiBadan}
                      onChange={(e) => setFormData({...formData, tinggiBadan: e.target.value})}
                      required
                    />
                  </div>
                </div>

                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertTitle>Catatan Pengukuran</AlertTitle>
                  <AlertDescription>
                    Untuk bayi yang belum bisa berdiri, ukur tinggi badan dalam posisi berbaring (panjang badan)
                  </AlertDescription>
                </Alert>

                <Button type="submit" className="w-full bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 shadow-lg text-lg py-6">
                  <Calculator className="mr-2" size={20} />
                  Hitung Status Gizi
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Hasil */}
          {hasil && (
            <div className="mt-8 space-y-6">
              <Card className="border-2 border-purple-200 shadow-xl">
                <CardHeader>
                  <CardTitle className="text-3xl flex items-center">
                    <TrendingUp className="mr-3 text-purple-600" size={32} />
                    Hasil Analisis Status Gizi
                </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Indikator Status Gizi */}
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className={`p-4 rounded-xl border-2 ${getColorClass(hasil.colorBBU)}`}>
                      <div className="text-sm font-medium mb-1">Berat Badan / Umur (BB/U)</div>
                      <div className="text-2xl font-bold">{hasil.statusBBU}</div>
                    </div>
                    <div className={`p-4 rounded-xl border-2 ${getColorClass(hasil.colorTBU)}`}>
                      <div className="text-sm font-medium mb-1">Tinggi Badan / Umur (TB/U)</div>
                      <div className="text-2xl font-bold">{hasil.statusTBU}</div>
                    </div>
                    <div className={`p-4 rounded-xl border-2 ${getColorClass(hasil.colorBBTB)}`}>
                      <div className="text-sm font-medium mb-1">Berat Badan / Tinggi Badan</div>
                      <div className="text-2xl font-bold">{hasil.statusBBTB}</div>
                    </div>
                  </div>

                  {/* IMT */}
                  <div className="bg-purple-50 p-4 rounded-xl">
                    <div className="text-sm text-gray-600 mb-1">Indeks Massa Tubuh (IMT)</div>
                    <div className="text-3xl font-bold text-purple-600">{hasil.bmi}</div>
                  </div>

                  {/* Rekomendasi */}
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                      <CheckCircle className="mr-2 text-purple-600" size={24} />
                      Rekomendasi
                    </h3>
                    <ul className="space-y-3">
                      {getRekomendasi().map((rek, index) => (
                        <li key={index} className="flex items-start space-x-3 bg-white p-4 rounded-lg border">
                          <CheckCircle className="text-green-600 mt-1 flex-shrink-0" size={20} />
                          <span className="text-gray-700">{rek}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Alert className="border-purple-200 bg-purple-50">
                    <AlertCircle className="h-4 w-4 text-purple-600" />
                    <AlertTitle className="text-purple-900">Disclaimer</AlertTitle>
                    <AlertDescription className="text-purple-800">
                      Hasil ini adalah estimasi berdasarkan standar WHO. Untuk diagnosis dan penanganan yang akurat, silakan konsultasi dengan ahli gizi atau dokter.
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </section>

      {/* Info Standar */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Tentang Indikator Status Gizi</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>BB/U (Berat Badan/Umur)</CardTitle>
              </CardHeader>
              <CardContent className="text-gray-600">
                Menilai status gizi anak secara umum. Indikator ini sensitif terhadap perubahan berat badan jangka pendek.
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>TB/U (Tinggi Badan/Umur)</CardTitle>
              </CardHeader>
              <CardContent className="text-gray-600">
                Menilai pertumbuhan linear dan mengidentifikasi stunting (pendek) yang merupakan masalah gizi kronis.
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>BB/TB (Berat Badan/Tinggi Badan)</CardTitle>
              </CardHeader>
              <CardContent className="text-gray-600">
                Menilai apakah berat badan anak sesuai dengan tinggi badannya, mengidentifikasi wasting (kurus) atau obesitas.
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
};

export default StatusGizi;