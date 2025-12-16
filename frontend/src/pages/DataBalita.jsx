import React, { useState } from 'react';
import { Plus, Users, Calendar, MapPin, Baby, Scale, Ruler, FileText } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { useToast } from '../hooks/use-toast';

const DataBalita = () => {
  const { toast } = useToast();
  const [dataBalita, setDataBalita] = useState([]);
  const [showForm, setShowForm] = useState(false);
  
  const [formData, setFormData] = useState({
    namaBalita: '',
    jenisKelamin: '',
    tanggalLahir: '',
    nikBalita: '',
    beratBadan: '',
    tinggiBadan: '',
    namaOrangTua: '',
    anakKe: '',
    beratBadanLahir: '',
    panjangBadanLahir: '',
    rt: '',
    rw: '',
    kelurahan: '',
  });

  // Fungsi untuk menghitung usia dalam bulan
  const hitungUsia = (tanggalLahir) => {
    const lahir = new Date(tanggalLahir);
    const sekarang = new Date();
    const bulan = (sekarang.getFullYear() - lahir.getFullYear()) * 12 + 
                  (sekarang.getMonth() - lahir.getMonth());
    return bulan;
  };

  // Fungsi untuk menentukan status KMS berdasarkan BB dan Usia
  const tentukanStatusKMS = (beratBadan, usia) => {
    // Simplified WHO standards untuk demo
    // Asumsi median weight untuk usia (approximation)
    const medianWeight = 7.3 + (usia * 0.16); // simplified for demo
    
    const percentile = (parseFloat(beratBadan) / medianWeight) * 100;
    
    if (percentile < 70) {
      return { status: 'BGM', warna: 'Merah', color: 'red' };
    } else if (percentile < 80) {
      return { status: 'Gizi Kurang', warna: 'Kuning', color: 'yellow' };
    } else {
      return { status: 'Gizi Baik', warna: 'Hijau', color: 'green' };
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Hitung usia
    const usia = hitungUsia(formData.tanggalLahir);
    
    // Tentukan status KMS
    const statusKMS = tentukanStatusKMS(formData.beratBadan, usia);
    
    // Buat data balita baru
    const newData = {
      id: Date.now(),
      ...formData,
      usia: usia,
      statusKMS: statusKMS,
      tanggalPendaftaran: new Date().toLocaleDateString('id-ID')
    };
    
    // Simpan data (mock - di localStorage untuk demo)
    setDataBalita([...dataBalita, newData]);
    
    // Custom toast dengan styling sesuai status
    const getToastStyle = () => {
      if (statusKMS.color === 'green') {
        return {
          className: 'bg-green-50 border-2 border-green-500',
          title: '✅ Data Berhasil Disimpan!',
          description: (
            <div className="space-y-2">
              <div className="text-lg font-bold text-green-800">
                {formData.namaBalita}
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="font-semibold text-green-700">Status: {statusKMS.warna}</span>
              </div>
              <div className="text-sm text-green-600">
                {statusKMS.status} - Pertahankan pola makan sehat!
              </div>
            </div>
          )
        };
      } else if (statusKMS.color === 'yellow') {
        return {
          className: 'bg-yellow-50 border-2 border-yellow-500',
          title: '⚠️ Data Berhasil Disimpan!',
          description: (
            <div className="space-y-2">
              <div className="text-lg font-bold text-yellow-800">
                {formData.namaBalita}
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <span className="font-semibold text-yellow-700">Status: {statusKMS.warna}</span>
              </div>
              <div className="text-sm text-yellow-600">
                {statusKMS.status} - Perlu perhatian khusus pada nutrisi
              </div>
            </div>
          )
        };
      } else {
        return {
          className: 'bg-red-50 border-2 border-red-500',
          title: '🚨 Data Berhasil Disimpan!',
          description: (
            <div className="space-y-2">
              <div className="text-lg font-bold text-red-800">
                {formData.namaBalita}
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span className="font-semibold text-red-700">Status: {statusKMS.warna}</span>
              </div>
              <div className="text-sm text-red-600">
                {statusKMS.status} - Segera konsultasi dengan ahli gizi!
              </div>
            </div>
          )
        };
      }
    };
    
    const toastStyle = getToastStyle();
    toast({
      title: toastStyle.title,
      description: toastStyle.description,
      className: toastStyle.className,
    });
    
    // Reset form
    setFormData({
      namaBalita: '',
      jenisKelamin: '',
      tanggalLahir: '',
      nikBalita: '',
      beratBadan: '',
      tinggiBadan: '',
      namaOrangTua: '',
      anakKe: '',
      beratBadanLahir: '',
      panjangBadanLahir: '',
      rt: '',
      rw: '',
      kelurahan: '',
    });
    
    setShowForm(false);
  };

  const getStatusColor = (color) => {
    const colors = {
      red: 'bg-red-100 text-red-800 border-red-300',
      yellow: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      green: 'bg-green-100 text-green-800 border-green-300'
    };
    return colors[color] || '';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-50">
      {/* Hero */}
      <section className="bg-gradient-to-r from-purple-600 to-purple-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <FileText size={64} className="mx-auto mb-6" />
            <h1 className="text-5xl font-bold mb-6">Data Balita</h1>
            <p className="text-xl text-purple-100 max-w-3xl mx-auto">
              Kelola data balita dengan lengkap dan terintegrasi dengan status gizi KMS
            </p>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Tabs defaultValue="list" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="list" onClick={() => setShowForm(false)}>
              <Users className="mr-2" size={18} />
              Daftar Balita
            </TabsTrigger>
            <TabsTrigger value="form" onClick={() => setShowForm(true)}>
              <Plus className="mr-2" size={18} />
              Tambah Data Baru
            </TabsTrigger>
          </TabsList>

          {/* List Data */}
          <TabsContent value="list">
            <div className="space-y-6">
              {dataBalita.length === 0 ? (
                <Card className="border-2 border-dashed">
                  <CardContent className="py-12 text-center">
                    <Baby size={64} className="mx-auto mb-4 text-gray-400" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Belum Ada Data</h3>
                    <p className="text-gray-600 mb-6">Mulai tambahkan data balita dengan klik tab "Tambah Data Baru"</p>
                    <Button 
                      onClick={() => setShowForm(true)}
                      className="bg-purple-600 hover:bg-purple-700"
                    >
                      <Plus className="mr-2" size={18} />
                      Tambah Data
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {dataBalita.map((data) => (
                    <Card key={data.id} className={`border-2 hover:shadow-xl transition-all group ${
                      data.jenisKelamin === 'laki' 
                        ? 'hover:border-blue-500' 
                        : 'hover:border-pink-500'
                    }`}>
                      <CardContent className="pt-6 text-center">
                        <div className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform ${
                          data.jenisKelamin === 'laki'
                            ? 'bg-gradient-to-br from-blue-100 to-blue-200'
                            : 'bg-gradient-to-br from-pink-100 to-pink-200'
                        }`}>
                          <div className="text-5xl">
                            {data.jenisKelamin === 'laki' ? '👶' : '👧'}
                          </div>
                        </div>
                        
                        <h3 className="text-xl font-bold text-gray-900 mb-3">{data.namaBalita}</h3>
                        
                        <div className="mb-4">
                          <Badge variant="outline" className={
                            data.jenisKelamin === 'laki'
                              ? 'bg-blue-50 text-blue-700 border-blue-200'
                              : 'bg-pink-50 text-pink-700 border-pink-200'
                          }>
                            {data.jenisKelamin === 'laki' ? 'Laki-laki' : 'Perempuan'}
                          </Badge>
                        </div>

                        <div className="space-y-2">
                          <Badge className={`${getStatusColor(data.statusKMS.color)} border-2 text-base px-4 py-2 w-full`}>
                            {data.statusKMS.warna}
                          </Badge>

                          <div className="text-sm text-gray-600 font-medium">
                            {data.statusKMS.status}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

          {/* Form Input */}
          <TabsContent value="form">
            <Card className="border-2">
              <CardHeader>
                <CardTitle className="text-2xl">Form Pendaftaran Data Balita</CardTitle>
                <CardDescription>Isi data balita dengan lengkap. Status KMS akan otomatis terdeteksi.</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Data Balita */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                      <Baby className="mr-2 text-purple-600" size={20} />
                      Data Balita
                    </h3>
                    
                    <div className="space-y-2">
                      <Label htmlFor="namaBalita">Nama Balita *</Label>
                      <Input 
                        id="namaBalita"
                        value={formData.namaBalita}
                        onChange={(e) => setFormData({...formData, namaBalita: e.target.value})}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Jenis Kelamin *</Label>
                      <div className="grid grid-cols-2 gap-4">
                        <div
                          onClick={() => setFormData({...formData, jenisKelamin: 'laki'})}
                          className={`cursor-pointer border-2 rounded-xl p-6 text-center transition-all hover:shadow-lg ${
                            formData.jenisKelamin === 'laki' 
                              ? 'border-blue-500 bg-blue-50' 
                              : 'border-gray-200 hover:border-blue-300'
                          }`}
                        >
                          <div className="text-6xl mb-3">👶</div>
                          <div className={`font-semibold ${formData.jenisKelamin === 'laki' ? 'text-blue-600' : 'text-gray-700'}`}>
                            Laki-laki
                          </div>
                        </div>

                        <div
                          onClick={() => setFormData({...formData, jenisKelamin: 'perempuan'})}
                          className={`cursor-pointer border-2 rounded-xl p-6 text-center transition-all hover:shadow-lg ${
                            formData.jenisKelamin === 'perempuan' 
                              ? 'border-pink-500 bg-pink-50' 
                              : 'border-gray-200 hover:border-pink-300'
                          }`}
                        >
                          <div className="text-6xl mb-3">👧</div>
                          <div className={`font-semibold ${formData.jenisKelamin === 'perempuan' ? 'text-pink-600' : 'text-gray-700'}`}>
                            Perempuan
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="tanggalLahir">Tanggal Lahir *</Label>
                      <Input 
                        id="tanggalLahir"
                        type="date"
                        value={formData.tanggalLahir}
                        onChange={(e) => setFormData({...formData, tanggalLahir: e.target.value})}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="nikBalita">NIK Balita *</Label>
                      <Input 
                        id="nikBalita"
                        placeholder="16 digit NIK"
                        maxLength="16"
                        value={formData.nikBalita}
                        onChange={(e) => setFormData({...formData, nikBalita: e.target.value})}
                        required
                      />
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
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
                  </div>

                  {/* Data Lahir */}
                  <div className="space-y-4 pt-4 border-t">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                      <Scale className="mr-2 text-purple-600" size={20} />
                      Data Lahir
                    </h3>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="beratBadanLahir">Berat Badan Lahir (kg) *</Label>
                        <Input 
                          id="beratBadanLahir"
                          type="number"
                          step="0.1"
                          placeholder="Contoh: 3.2"
                          value={formData.beratBadanLahir}
                          onChange={(e) => setFormData({...formData, beratBadanLahir: e.target.value})}
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="panjangBadanLahir">Panjang Badan Lahir (cm) *</Label>
                        <Input 
                          id="panjangBadanLahir"
                          type="number"
                          step="0.1"
                          placeholder="Contoh: 48.5"
                          value={formData.panjangBadanLahir}
                          onChange={(e) => setFormData({...formData, panjangBadanLahir: e.target.value})}
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Data Orang Tua */}
                  <div className="space-y-4 pt-4 border-t">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                      <Users className="mr-2 text-purple-600" size={20} />
                      Data Orang Tua
                    </h3>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="namaOrangTua">Nama Orang Tua *</Label>
                        <Input 
                          id="namaOrangTua"
                          placeholder="Nama Ayah/Ibu"
                          value={formData.namaOrangTua}
                          onChange={(e) => setFormData({...formData, namaOrangTua: e.target.value})}
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="anakKe">Anak Ke *</Label>
                        <Input 
                          id="anakKe"
                          type="number"
                          placeholder="Contoh: 1"
                          value={formData.anakKe}
                          onChange={(e) => setFormData({...formData, anakKe: e.target.value})}
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Alamat */}
                  <div className="space-y-4 pt-4 border-t">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                      <MapPin className="mr-2 text-purple-600" size={20} />
                      Alamat
                    </h3>

                    <div className="grid md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="rt">RT *</Label>
                        <Input 
                          id="rt"
                          placeholder="001"
                          value={formData.rt}
                          onChange={(e) => setFormData({...formData, rt: e.target.value})}
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="rw">RW *</Label>
                        <Input 
                          id="rw"
                          placeholder="005"
                          value={formData.rw}
                          onChange={(e) => setFormData({...formData, rw: e.target.value})}
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="kelurahan">Kelurahan *</Label>
                        <Input 
                          id="kelurahan"
                          placeholder="Nama Kelurahan"
                          value={formData.kelurahan}
                          onChange={(e) => setFormData({...formData, kelurahan: e.target.value})}
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Info KMS */}
                  <div className="bg-blue-50 border-l-4 border-blue-600 p-4 rounded-lg">
                    <div className="flex items-start space-x-3">
                      <FileText className="text-blue-600 flex-shrink-0 mt-1" size={20} />
                      <div>
                        <h4 className="font-bold text-blue-900 mb-1">Status KMS Otomatis</h4>
                        <p className="text-blue-800 text-sm">
                          Status KMS (Berat Badan menurut Usia) akan otomatis terdeteksi berdasarkan data berat badan dan tanggal lahir yang Anda input. Status akan ditampilkan dengan warna:
                        </p>
                        <ul className="mt-2 space-y-1 text-sm">
                          <li className="flex items-center">
                            <span className="w-4 h-4 bg-red-500 rounded-full mr-2"></span>
                            <span className="text-blue-800"><b>Merah (BGM)</b> - Gizi Buruk</span>
                          </li>
                          <li className="flex items-center">
                            <span className="w-4 h-4 bg-yellow-500 rounded-full mr-2"></span>
                            <span className="text-blue-800"><b>Kuning</b> - Gizi Kurang</span>
                          </li>
                          <li className="flex items-center">
                            <span className="w-4 h-4 bg-green-500 rounded-full mr-2"></span>
                            <span className="text-blue-800"><b>Hijau</b> - Gizi Baik</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <Button 
                    type="submit" 
                    className="w-full bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 shadow-lg text-lg py-6"
                  >
                    <Plus className="mr-2" size={20} />
                    Simpan Data Balita
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default DataBalita;
