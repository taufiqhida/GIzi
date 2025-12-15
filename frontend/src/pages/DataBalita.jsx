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
    
    toast({
      title: "Data Berhasil Disimpan!",
      description: `Data ${formData.namaBalita} telah tersimpan dengan status KMS: ${statusKMS.warna}`,
    });
    
    // Reset form
    setFormData({
      namaBalita: '',
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
                <div className="grid md:grid-cols-2 gap-6">
                  {dataBalita.map((data) => (
                    <Card key={data.id} className="border-2 hover:shadow-xl transition-all">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle className="text-2xl text-purple-600">{data.namaBalita}</CardTitle>
                            <CardDescription>NIK: {data.nikBalita}</CardDescription>
                          </div>
                          <Badge className={`${getStatusColor(data.statusKMS.color)} border-2`}>
                            {data.statusKMS.warna}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <div className="text-sm text-gray-500">Usia</div>
                            <div className="font-semibold">{data.usia} bulan</div>
                          </div>
                          <div>
                            <div className="text-sm text-gray-500">Anak Ke</div>
                            <div className="font-semibold">{data.anakKe}</div>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <div className="text-sm text-gray-500">Berat Badan</div>
                            <div className="font-semibold">{data.beratBadan} kg</div>
                          </div>
                          <div>
                            <div className="text-sm text-gray-500">Tinggi Badan</div>
                            <div className="font-semibold">{data.tinggiBadan} cm</div>
                          </div>
                        </div>

                        <div className="pt-3 border-t">
                          <div className="text-sm text-gray-500 mb-1">Orang Tua</div>
                          <div className="font-semibold">{data.namaOrangTua}</div>
                        </div>

                        <div className="pt-3 border-t">
                          <div className="text-sm text-gray-500 mb-1">Alamat</div>
                          <div className="text-sm">{data.kelurahan}, RT {data.rt}/RW {data.rw}</div>
                        </div>

                        <div className="pt-3 border-t">
                          <div className="text-sm text-gray-500 mb-1">Data Lahir</div>
                          <div className="text-sm">BB: {data.beratBadanLahir} kg | PB: {data.panjangBadanLahir} cm</div>
                        </div>

                        <div className="pt-3 border-t text-xs text-gray-500">
                          Terdaftar: {data.tanggalPendaftaran}
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
                    
                    <div className="grid md:grid-cols-2 gap-4">
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
                        <Label htmlFor="tanggalLahir">Tanggal Lahir *</Label>
                        <Input 
                          id="tanggalLahir"
                          type="date"
                          value={formData.tanggalLahir}
                          onChange={(e) => setFormData({...formData, tanggalLahir: e.target.value})}
                          required
                        />
                      </div>
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
