import React, { useState, useEffect } from 'react';
import { BarChart3, Baby, Filter, TrendingUp, Calendar } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';

const EData = () => {
  const [dataBalita, setDataBalita] = useState([]);
  const [selectedPasien, setSelectedPasien] = useState('semua');
  const [filteredData, setFilteredData] = useState([]);

  // Load data from localStorage (mock)
  useEffect(() => {
    // Simulate loading from localStorage or state management
    const mockData = [
      {
        id: 1,
        namaBalita: 'Maya Cantika',
        jenisKelamin: 'perempuan',
        usia: 30,
        beratBadan: '12.5',
        tinggiBadan: '86.0',
        statusKMS: { status: 'Gizi Baik', warna: 'Hijau', color: 'green' },
        tanggalPendaftaran: '10 Des 2024',
        history: [
          { tanggal: '10 Nov 2024', bb: 12.0, tb: 85.0, status: 'Hijau' },
          { tanggal: '10 Des 2024', bb: 12.5, tb: 86.0, status: 'Hijau' }
        ]
      },
      {
        id: 2,
        namaBalita: 'Andi Wijaya',
        jenisKelamin: 'laki',
        usia: 23,
        beratBadan: '9.8',
        tinggiBadan: '79.0',
        statusKMS: { status: 'Gizi Kurang', warna: 'Kuning', color: 'yellow' },
        tanggalPendaftaran: '08 Des 2024',
        history: [
          { tanggal: '08 Nov 2024', bb: 9.5, tb: 78.0, status: 'Kuning' },
          { tanggal: '08 Des 2024', bb: 9.8, tb: 79.0, status: 'Kuning' }
        ]
      },
      {
        id: 3,
        namaBalita: 'Putri Rahayu',
        jenisKelamin: 'perempuan',
        usia: 20,
        beratBadan: '7.5',
        tinggiBadan: '72.0',
        statusKMS: { status: 'Gizi Buruk', warna: 'Merah', color: 'red' },
        tanggalPendaftaran: '05 Des 2024',
        history: [
          { tanggal: '05 Nov 2024', bb: 7.2, tb: 71.0, status: 'Merah' },
          { tanggal: '05 Des 2024', bb: 7.5, tb: 72.0, status: 'Merah' }
        ]
      }
    ];
    
    setDataBalita(mockData);
    setFilteredData(mockData);
  }, []);

  useEffect(() => {
    if (selectedPasien === 'semua') {
      setFilteredData(dataBalita);
    } else {
      const filtered = dataBalita.filter(data => data.id === parseInt(selectedPasien));
      setFilteredData(filtered);
    }
  }, [selectedPasien, dataBalita]);

  const getStatusColor = (color) => {
    const colors = {
      red: 'bg-red-100 text-red-800 border-red-300',
      yellow: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      green: 'bg-green-100 text-green-800 border-green-300'
    };
    return colors[color] || '';
  };

  const statistik = {
    total: dataBalita.length,
    giziBaik: dataBalita.filter(d => d.statusKMS.color === 'green').length,
    giziKurang: dataBalita.filter(d => d.statusKMS.color === 'yellow').length,
    giziBuruk: dataBalita.filter(d => d.statusKMS.color === 'red').length
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-50">
      {/* Hero */}
      <section className="bg-gradient-to-r from-purple-600 to-purple-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <BarChart3 size={64} className="mx-auto mb-6" />
            <h1 className="text-5xl font-bold mb-6">E-Data Pasien</h1>
            <p className="text-xl text-purple-100 max-w-3xl mx-auto">
              Data dan riwayat perkembangan gizi balita per pasien
            </p>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Filter */}
        <Card className="mb-8 border-2 border-purple-200">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Filter className="text-purple-600" size={24} />
                <CardTitle>Filter Data Pasien</CardTitle>
              </div>
              <Badge className="bg-purple-100 text-purple-800">
                {filteredData.length} Data
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4">
              <label className="text-sm font-medium text-gray-700">Pilih Pasien:</label>
              <Select value={selectedPasien} onValueChange={setSelectedPasien}>
                <SelectTrigger className="w-64">
                  <SelectValue placeholder="Semua Pasien" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="semua">Semua Pasien</SelectItem>
                  {dataBalita.map((data) => (
                    <SelectItem key={data.id} value={data.id.toString()}>
                      {data.namaBalita} ({data.jenisKelamin === 'laki' ? 'L' : 'P'})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Stats Overview */}
        {selectedPasien === 'semua' && (
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <Card className="border-2 hover:shadow-xl transition-all">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-700 rounded-2xl flex items-center justify-center">
                    <Baby className="text-white" size={28} />
                  </div>
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-1">{statistik.total}</div>
                <div className="text-sm text-gray-600">Total Pasien</div>
              </CardContent>
            </Card>

            <Card className="border-2 hover:shadow-xl transition-all">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-green-700 rounded-2xl flex items-center justify-center">
                    <TrendingUp className="text-white" size={28} />
                  </div>
                </div>
                <div className="text-3xl font-bold text-green-600 mb-1">{statistik.giziBaik}</div>
                <div className="text-sm text-gray-600">Gizi Baik</div>
              </CardContent>
            </Card>

            <Card className="border-2 hover:shadow-xl transition-all">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-yellow-500 to-yellow-700 rounded-2xl flex items-center justify-center">
                    <TrendingUp className="text-white" size={28} />
                  </div>
                </div>
                <div className="text-3xl font-bold text-yellow-600 mb-1">{statistik.giziKurang}</div>
                <div className="text-sm text-gray-600">Gizi Kurang</div>
              </CardContent>
            </Card>

            <Card className="border-2 hover:shadow-xl transition-all">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-red-500 to-red-700 rounded-2xl flex items-center justify-center">
                    <TrendingUp className="text-white" size={28} />
                  </div>
                </div>
                <div className="text-3xl font-bold text-red-600 mb-1">{statistik.giziBuruk}</div>
                <div className="text-sm text-gray-600">Gizi Buruk</div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Data Pasien */}
        <div className="space-y-6">
          {filteredData.length === 0 ? (
            <Card className="border-2 border-dashed">
              <CardContent className="py-12 text-center">
                <Baby size={64} className="mx-auto mb-4 text-gray-400" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Belum Ada Data</h3>
                <p className="text-gray-600">Silakan pilih pasien untuk melihat data</p>
              </CardContent>
            </Card>
          ) : (
            filteredData.map((data) => (
              <Card key={data.id} className="border-2 hover:shadow-xl transition-all">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-4">
                      <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
                        data.jenisKelamin === 'laki'
                          ? 'bg-gradient-to-br from-blue-100 to-blue-200'
                          : 'bg-gradient-to-br from-pink-100 to-pink-200'
                      }`}>
                        <div className="text-3xl">
                          {data.jenisKelamin === 'laki' ? '👶' : '👧'}
                        </div>
                      </div>
                      <div>
                        <CardTitle className="text-2xl text-purple-600">{data.namaBalita}</CardTitle>
                        <CardDescription>
                          Pasien {data.jenisKelamin === 'laki' ? 'Laki-laki' : 'Perempuan'} • Usia {data.usia} bulan
                        </CardDescription>
                      </div>
                    </div>
                    <Badge className={`${getStatusColor(data.statusKMS.color)} border-2 text-base px-4 py-2`}>
                      {data.statusKMS.warna}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Data Terkini */}
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Data Terkini</h4>
                    <div className="grid md:grid-cols-3 gap-4">
                      <div className="p-4 bg-purple-50 rounded-lg">
                        <div className="text-sm text-gray-600 mb-1">Berat Badan</div>
                        <div className="text-2xl font-bold text-purple-600">{data.beratBadan} kg</div>
                      </div>
                      <div className="p-4 bg-purple-50 rounded-lg">
                        <div className="text-sm text-gray-600 mb-1">Tinggi Badan</div>
                        <div className="text-2xl font-bold text-purple-600">{data.tinggiBadan} cm</div>
                      </div>
                      <div className="p-4 bg-purple-50 rounded-lg">
                        <div className="text-sm text-gray-600 mb-1">Status</div>
                        <div className="text-lg font-bold text-gray-900">{data.statusKMS.status}</div>
                      </div>
                    </div>
                  </div>

                  {/* Riwayat Perkembangan */}
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <Calendar className="mr-2 text-purple-600" size={20} />
                      Riwayat Perkembangan
                    </h4>
                    <div className="space-y-3">
                      {data.history.map((record, index) => (
                        <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border">
                          <div className="flex items-center space-x-4">
                            <div className="text-sm font-medium text-gray-900">{record.tanggal}</div>
                            <div className="text-sm text-gray-600">BB: {record.bb} kg</div>
                            <div className="text-sm text-gray-600">TB: {record.tb} cm</div>
                          </div>
                          <Badge className={`${
                            record.status === 'Hijau' ? 'bg-green-100 text-green-800' :
                            record.status === 'Kuning' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {record.status}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="text-sm text-gray-500 pt-4 border-t">
                    Terdaftar sejak: {data.tanggalPendaftaran}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default EData;
