import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { pasienAPI } from '../../api';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Baby, MessageSquare, Plus } from 'lucide-react';
import { useToast } from '../../hooks/use-toast';
import ChatWindow from '../ChatWindow';

const PasienDashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [balita, setBalita] = useState([]);
  const [konsultasi, setKonsultasi] = useState([]);
  const [showBalitaForm, setShowBalitaForm] = useState(false);
  const [showKonsulForm, setShowKonsulForm] = useState(false);
  const [selectedKonsultasi, setSelectedKonsultasi] = useState(null);
  const [balitaForm, setBalitaForm] = useState({
    nama_balita: '', jenis_kelamin: '', tanggal_lahir: '', nik_balita: '',
    berat_badan: '', tinggi_badan: '', nama_orang_tua: '', anak_ke: '',
    berat_badan_lahir: '', panjang_badan_lahir: '', rt: '', rw: '', kelurahan: ''
  });
  const [konsulForm, setKonsulForm] = useState({ balita_id: '', keluhan: '' });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [balitaRes, konsulRes] = await Promise.all([pasienAPI.getBalita(), pasienAPI.getKonsultasi()]);
      setBalita(balitaRes.data);
      setKonsultasi(konsulRes.data);
    } catch (error) {
      console.error('Load data error:', error);
    }
  };

  const handleCreateBalita = async (e) => {
    e.preventDefault();
    try {
      await pasienAPI.createBalita(balitaForm);
      toast({ title: 'Data balita berhasil disimpan!', className: 'bg-green-50 border-green-500' });
      setShowBalitaForm(false);
      loadData();
    } catch (error) {
      toast({ title: 'Error', description: 'Gagal simpan data', variant: 'destructive' });
    }
  };

  const handleRequestKonsul = async (e) => {
    e.preventDefault();
    try {
      await pasienAPI.requestKonsultasi(konsulForm);
      toast({ title: 'Permintaan konsultasi terkirim!', className: 'bg-green-50 border-green-500' });
      setShowKonsulForm(false);
      setKonsulForm({ balita_id: '', keluhan: '' });
      loadData();
    } catch (error) {
      toast({ title: 'Error', description: 'Gagal kirim permintaan', variant: 'destructive' });
    }
  };

  if (selectedKonsultasi) {
    return <ChatWindow konsultasi={selectedKonsultasi} onClose={() => setSelectedKonsultasi(null)} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Dashboard Pasien</h1>
          <p className="text-gray-600">Selamat datang, {user.nama}</p>
        </div>

        <Tabs defaultValue="balita" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="balita"><Baby className="mr-2" size={18} />Data Anak</TabsTrigger>
            <TabsTrigger value="konsultasi"><MessageSquare className="mr-2" size={18} />Konsultasi</TabsTrigger>
          </TabsList>

          <TabsContent value="balita" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Data Anak</h2>
              <Button onClick={() => setShowBalitaForm(!showBalitaForm)} className="bg-purple-600"><Plus size={18} className="mr-2" />Tambah Anak</Button>
            </div>

            {showBalitaForm && (
              <Card>
                <CardHeader><CardTitle>Tambah Data Anak</CardTitle></CardHeader>
                <CardContent>
                  <form onSubmit={handleCreateBalita} className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div><Label>Nama</Label><Input value={balitaForm.nama_balita} onChange={e => setBalitaForm({...balitaForm, nama_balita: e.target.value})} required /></div>
                      <div><Label>Jenis Kelamin</Label><select className="flex h-10 w-full rounded-md border px-3" value={balitaForm.jenis_kelamin} onChange={e => setBalitaForm({...balitaForm, jenis_kelamin: e.target.value})} required><option value="">Pilih</option><option value="laki">Laki-laki</option><option value="perempuan">Perempuan</option></select></div>
                      <div><Label>Tanggal Lahir</Label><Input type="date" value={balitaForm.tanggal_lahir} onChange={e => setBalitaForm({...balitaForm, tanggal_lahir: e.target.value})} required /></div>
                      <div><Label>NIK</Label><Input value={balitaForm.nik_balita} onChange={e => setBalitaForm({...balitaForm, nik_balita: e.target.value})} required /></div>
                      <div><Label>BB (kg)</Label><Input type="number" step="0.1" value={balitaForm.berat_badan} onChange={e => setBalitaForm({...balitaForm, berat_badan: e.target.value})} required /></div>
                      <div><Label>TB (cm)</Label><Input type="number" step="0.1" value={balitaForm.tinggi_badan} onChange={e => setBalitaForm({...balitaForm, tinggi_badan: e.target.value})} required /></div>
                    </div>
                    <Button type="submit" className="bg-purple-600">Simpan</Button>
                  </form>
                </CardContent>
              </Card>
            )}

            <div className="grid md:grid-cols-3 gap-4">
              {balita.map(b => (
                <Card key={b.id}>
                  <CardContent className="pt-6 text-center">
                    <div className="text-4xl mb-2">{b.jenis_kelamin === 'laki' ? '👶' : '👧'}</div>
                    <h3 className="font-bold text-lg">{b.nama_balita}</h3>
                    <div className={`inline-block mt-2 px-4 py-1 rounded-full text-sm font-semibold ${b.status_kms.color === 'green' ? 'bg-green-100 text-green-800' : b.status_kms.color === 'yellow' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>{b.status_kms.warna}</div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="konsultasi" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Konsultasi Saya</h2>
              <Button onClick={() => setShowKonsulForm(!showKonsulForm)} className="bg-purple-600" disabled={balita.length === 0}><Plus size={18} className="mr-2" />Request Konsultasi</Button>
            </div>

            {showKonsulForm && (
              <Card>
                <CardHeader><CardTitle>Request Konsultasi</CardTitle></CardHeader>
                <CardContent>
                  <form onSubmit={handleRequestKonsul} className="space-y-4">
                    <div><Label>Pilih Anak</Label><select className="flex h-10 w-full rounded-md border px-3" value={konsulForm.balita_id} onChange={e => setKonsulForm({...konsulForm, balita_id: e.target.value})} required><option value="">Pilih Anak</option>{balita.map(b => <option key={b.id} value={b.id}>{b.nama_balita}</option>)}</select></div>
                    <div><Label>Keluhan</Label><Textarea value={konsulForm.keluhan} onChange={e => setKonsulForm({...konsulForm, keluhan: e.target.value})} rows={4} required /></div>
                    <Button type="submit" className="bg-purple-600">Kirim Permintaan</Button>
                  </form>
                </CardContent>
              </Card>
            )}

            <div className="space-y-4">
              {konsultasi.map(k => (
                <Card key={k.id}>
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="font-bold">Konsultasi #{k.id.slice(0, 8)}</h3>
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${k.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : k.status === 'accepted' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>{k.status}</span>
                        </div>
                        <p className="text-gray-700">{k.keluhan}</p>
                        <p className="text-xs text-gray-500 mt-2">{new Date(k.created_at).toLocaleString('id-ID')}</p>
                      </div>
                      {k.status === 'accepted' && (
                        <Button size="sm" className="bg-purple-600 ml-4" onClick={() => setSelectedKonsultasi(k)}><MessageSquare size={16} className="mr-2" />Chat</Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default PasienDashboard;