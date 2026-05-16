import React, { useState, useEffect, useMemo } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { X, Plus, TrendingUp, Trash2 } from 'lucide-react';
import { pasienAPI } from '../api';
import { useToast } from '../hooks/use-toast';
import { buildWhoSeries, getZCategory } from '../data/whoStandards';

const GrowthCurveModal = ({ balita, onClose, onUpdate }) => {
  const { toast } = useToast();
  const [riwayat, setRiwayat] = useState(balita.riwayat || []);
  const [form, setForm] = useState({
    tanggal: new Date().toISOString().slice(0, 10),
    berat_badan: '',
    tinggi_badan: '',
  });
  const [showEdit, setShowEdit] = useState(false);
  const [editForm, setEditForm] = useState({
    nama_balita: balita.nama_balita,
    tanggal_lahir: balita.tanggal_lahir,
    nama_orang_tua: balita.nama_orang_tua || '',
    kelurahan: balita.kelurahan || '',
    rt: balita.rt || '',
    rw: balita.rw || '',
  });

  useEffect(() => {
    setRiwayat(balita.riwayat || []);
  }, [balita]);

  const whoBeratSeries = useMemo(
    () => buildWhoSeries(balita.jenis_kelamin, 'berat'),
    [balita.jenis_kelamin]
  );
  const whoTinggiSeries = useMemo(
    () => buildWhoSeries(balita.jenis_kelamin, 'tinggi'),
    [balita.jenis_kelamin]
  );

  // Merge data: for each WHO point, attach actual measurement if exists for that month
  const chartDataBerat = useMemo(() => {
    return whoBeratSeries.map((w) => {
      const found = riwayat.find((r) => r.usia_bulan === w.usia_bulan);
      return { ...w, anak: found ? found.berat_badan : null };
    });
  }, [whoBeratSeries, riwayat]);

  const chartDataTinggi = useMemo(() => {
    return whoTinggiSeries.map((w) => {
      const found = riwayat.find((r) => r.usia_bulan === w.usia_bulan);
      return { ...w, anak: found ? found.tinggi_badan : null };
    });
  }, [whoTinggiSeries, riwayat]);

  const handleAddPengukuran = async (e) => {
    e.preventDefault();
    try {
      const res = await pasienAPI.addPengukuran(balita.id, {
        tanggal: form.tanggal,
        berat_badan: parseFloat(form.berat_badan),
        tinggi_badan: parseFloat(form.tinggi_badan),
      });
      setRiwayat(res.data.riwayat || []);
      setForm({ tanggal: new Date().toISOString().slice(0, 10), berat_badan: '', tinggi_badan: '' });
      toast({ title: 'Pengukuran ditambahkan!', className: 'bg-green-50 border-green-500' });
      onUpdate && onUpdate();
    } catch (err) {
      toast({ title: 'Gagal', description: 'Tidak bisa menambah pengukuran', variant: 'destructive' });
    }
  };

  const handleDeletePengukuran = async (idx) => {
    if (!window.confirm('Hapus pengukuran ini?')) return;
    try {
      await pasienAPI.deletePengukuran(balita.id, idx);
      const newRiwayat = [...riwayat];
      newRiwayat.splice(idx, 1);
      setRiwayat(newRiwayat);
      toast({ title: 'Pengukuran dihapus' });
      onUpdate && onUpdate();
    } catch (err) {
      toast({ title: 'Gagal', variant: 'destructive' });
    }
  };

  const handleUpdateBalita = async (e) => {
    e.preventDefault();
    try {
      await pasienAPI.updateBalita(balita.id, editForm);
      toast({ title: 'Data anak diperbarui', className: 'bg-green-50 border-green-500' });
      setShowEdit(false);
      onUpdate && onUpdate();
    } catch (err) {
      toast({ title: 'Gagal update', variant: 'destructive' });
    }
  };

  const latest = riwayat.length > 0 ? riwayat[riwayat.length - 1] : null;
  const zBerat = latest
    ? getZCategory(latest.berat_badan, balita.jenis_kelamin, 'berat', latest.usia_bulan)
    : null;
  const zTinggi = latest
    ? getZCategory(latest.tinggi_badan, balita.jenis_kelamin, 'tinggi', latest.usia_bulan)
    : null;

  return (
    <div
      className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 overflow-y-auto"
      data-testid="growth-curve-modal"
    >
      <div className="bg-white rounded-2xl max-w-5xl w-full my-8 max-h-[95vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center z-10">
          <div>
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <TrendingUp className="text-purple-600" />
              Kurva Pertumbuhan: {balita.nama_balita}
            </h2>
            <p className="text-sm text-gray-500">
              {balita.jenis_kelamin === 'laki' ? 'Laki-laki' : 'Perempuan'} • {balita.usia} bulan • {balita.kelurahan}
            </p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} data-testid="close-growth-modal">
            <X />
          </Button>
        </div>

        <div className="p-6 space-y-6">
          {/* Quick stats */}
          {latest && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <Card>
                <CardContent className="pt-4">
                  <p className="text-xs text-gray-500">BB Terakhir</p>
                  <p className="text-2xl font-bold">{latest.berat_badan} kg</p>
                  {zBerat && (
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-semibold bg-${zBerat.color}-100 text-${zBerat.color}-800`}
                      style={{
                        backgroundColor: zBerat.color === 'red' ? '#fee2e2' : zBerat.color === 'blue' ? '#dbeafe' : '#dcfce7',
                        color: zBerat.color === 'red' ? '#991b1b' : zBerat.color === 'blue' ? '#1e40af' : '#166534',
                      }}
                    >
                      {zBerat.label}
                    </span>
                  )}
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-4">
                  <p className="text-xs text-gray-500">TB Terakhir</p>
                  <p className="text-2xl font-bold">{latest.tinggi_badan} cm</p>
                  {zTinggi && (
                    <span
                      className="text-xs px-2 py-0.5 rounded-full font-semibold"
                      style={{
                        backgroundColor: zTinggi.color === 'red' ? '#fee2e2' : zTinggi.color === 'blue' ? '#dbeafe' : '#dcfce7',
                        color: zTinggi.color === 'red' ? '#991b1b' : zTinggi.color === 'blue' ? '#1e40af' : '#166534',
                      }}
                    >
                      {zTinggi.label}
                    </span>
                  )}
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-4">
                  <p className="text-xs text-gray-500">Usia</p>
                  <p className="text-2xl font-bold">{latest.usia_bulan} bln</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-4">
                  <p className="text-xs text-gray-500">Total Pengukuran</p>
                  <p className="text-2xl font-bold">{riwayat.length}</p>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Add new pengukuran */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Tambah Pengukuran Baru</CardTitle>
            </CardHeader>
            <CardContent>
              <form
                onSubmit={handleAddPengukuran}
                className="grid grid-cols-1 md:grid-cols-4 gap-3"
                data-testid="add-pengukuran-form"
              >
                <div>
                  <Label>Tanggal</Label>
                  <Input
                    type="date"
                    value={form.tanggal}
                    onChange={(e) => setForm({ ...form, tanggal: e.target.value })}
                    required
                    data-testid="pengukuran-tanggal"
                  />
                </div>
                <div>
                  <Label>Berat (kg)</Label>
                  <Input
                    type="number"
                    step="0.1"
                    value={form.berat_badan}
                    onChange={(e) => setForm({ ...form, berat_badan: e.target.value })}
                    required
                    data-testid="pengukuran-berat"
                  />
                </div>
                <div>
                  <Label>Tinggi (cm)</Label>
                  <Input
                    type="number"
                    step="0.1"
                    value={form.tinggi_badan}
                    onChange={(e) => setForm({ ...form, tinggi_badan: e.target.value })}
                    required
                    data-testid="pengukuran-tinggi"
                  />
                </div>
                <div className="flex items-end">
                  <Button type="submit" className="w-full bg-purple-600" data-testid="submit-pengukuran">
                    <Plus size={16} className="mr-1" />
                    Simpan
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Charts */}
          <Tabs defaultValue="berat" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="berat" data-testid="tab-bb">Berat Badan (BB/U)</TabsTrigger>
              <TabsTrigger value="tinggi" data-testid="tab-tb">Tinggi Badan (TB/U)</TabsTrigger>
              <TabsTrigger value="riwayat" data-testid="tab-riwayat">Riwayat ({riwayat.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="berat">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Kurva Berat Badan vs Standar WHO</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={380}>
                    <LineChart data={chartDataBerat} margin={{ top: 10, right: 20, left: -10, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis
                        dataKey="usia_bulan"
                        label={{ value: 'Usia (bulan)', position: 'insideBottom', offset: -5, fontSize: 12 }}
                        tick={{ fontSize: 11 }}
                      />
                      <YAxis
                        label={{ value: 'Berat (kg)', angle: -90, position: 'insideLeft', fontSize: 12 }}
                        tick={{ fontSize: 11 }}
                      />
                      <Tooltip />
                      <Legend wrapperStyle={{ fontSize: 12 }} />
                      <Line type="monotone" dataKey="who_low" name="-2SD (Bawah)" stroke="#ef4444" dot={false} strokeDasharray="4 4" />
                      <Line type="monotone" dataKey="who_median" name="Median WHO" stroke="#10b981" dot={false} strokeWidth={2} />
                      <Line type="monotone" dataKey="who_up" name="+2SD (Atas)" stroke="#3b82f6" dot={false} strokeDasharray="4 4" />
                      <Line
                        type="monotone"
                        dataKey="anak"
                        name={balita.nama_balita}
                        stroke="#a855f7"
                        strokeWidth={3}
                        connectNulls
                        dot={{ r: 5, fill: '#a855f7' }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="tinggi">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Kurva Tinggi Badan vs Standar WHO</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={380}>
                    <LineChart data={chartDataTinggi} margin={{ top: 10, right: 20, left: -10, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis dataKey="usia_bulan" label={{ value: 'Usia (bulan)', position: 'insideBottom', offset: -5, fontSize: 12 }} tick={{ fontSize: 11 }} />
                      <YAxis label={{ value: 'Tinggi (cm)', angle: -90, position: 'insideLeft', fontSize: 12 }} tick={{ fontSize: 11 }} />
                      <Tooltip />
                      <Legend wrapperStyle={{ fontSize: 12 }} />
                      <Line type="monotone" dataKey="who_low" name="-2SD (Pendek)" stroke="#ef4444" dot={false} strokeDasharray="4 4" />
                      <Line type="monotone" dataKey="who_median" name="Median WHO" stroke="#10b981" dot={false} strokeWidth={2} />
                      <Line type="monotone" dataKey="who_up" name="+2SD (Tinggi)" stroke="#3b82f6" dot={false} strokeDasharray="4 4" />
                      <Line type="monotone" dataKey="anak" name={balita.nama_balita} stroke="#a855f7" strokeWidth={3} connectNulls dot={{ r: 5, fill: '#a855f7' }} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="riwayat">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Riwayat Pengukuran</CardTitle>
                </CardHeader>
                <CardContent>
                  {riwayat.length === 0 ? (
                    <p className="text-center text-gray-500 py-8">Belum ada riwayat. Tambah pengukuran di atas.</p>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead className="bg-gray-50 text-gray-700">
                          <tr>
                            <th className="text-left px-3 py-2">Tanggal</th>
                            <th className="text-left px-3 py-2">Usia (bln)</th>
                            <th className="text-left px-3 py-2">BB (kg)</th>
                            <th className="text-left px-3 py-2">TB (cm)</th>
                            <th className="text-left px-3 py-2">Status</th>
                            <th className="px-3 py-2"></th>
                          </tr>
                        </thead>
                        <tbody>
                          {riwayat.map((r, i) => (
                            <tr key={`${r.tanggal}-${r.usia_bulan}-${i}`} className="border-t hover:bg-gray-50">
                              <td className="px-3 py-2">{r.tanggal}</td>
                              <td className="px-3 py-2">{r.usia_bulan}</td>
                              <td className="px-3 py-2">{r.berat_badan}</td>
                              <td className="px-3 py-2">{r.tinggi_badan}</td>
                              <td className="px-3 py-2">
                                <span
                                  className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                                    r.status_kms.color === 'green'
                                      ? 'bg-green-100 text-green-800'
                                      : r.status_kms.color === 'yellow'
                                      ? 'bg-yellow-100 text-yellow-800'
                                      : 'bg-red-100 text-red-800'
                                  }`}
                                >
                                  {r.status_kms.status}
                                </span>
                              </td>
                              <td className="px-3 py-2">
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  onClick={() => handleDeletePengukuran(i)}
                                  data-testid={`delete-pengukuran-${i}`}
                                >
                                  <Trash2 size={14} className="text-red-500" />
                                </Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Edit data anak */}
          <Card>
            <CardHeader className="flex flex-row justify-between items-center">
              <CardTitle className="text-lg">Data Anak</CardTitle>
              <Button variant="outline" size="sm" onClick={() => setShowEdit(!showEdit)} data-testid="toggle-edit-balita">
                {showEdit ? 'Tutup' : 'Edit'}
              </Button>
            </CardHeader>
            {showEdit && (
              <CardContent>
                <form onSubmit={handleUpdateBalita} className="grid grid-cols-1 md:grid-cols-2 gap-3" data-testid="edit-balita-form">
                  <div>
                    <Label>Nama</Label>
                    <Input value={editForm.nama_balita} onChange={(e) => setEditForm({ ...editForm, nama_balita: e.target.value })} />
                  </div>
                  <div>
                    <Label>Tanggal Lahir</Label>
                    <Input type="date" value={editForm.tanggal_lahir} onChange={(e) => setEditForm({ ...editForm, tanggal_lahir: e.target.value })} />
                  </div>
                  <div>
                    <Label>Nama Orang Tua</Label>
                    <Input value={editForm.nama_orang_tua} onChange={(e) => setEditForm({ ...editForm, nama_orang_tua: e.target.value })} />
                  </div>
                  <div>
                    <Label>Kelurahan</Label>
                    <Input value={editForm.kelurahan} onChange={(e) => setEditForm({ ...editForm, kelurahan: e.target.value })} />
                  </div>
                  <div>
                    <Label>RT</Label>
                    <Input value={editForm.rt} onChange={(e) => setEditForm({ ...editForm, rt: e.target.value })} />
                  </div>
                  <div>
                    <Label>RW</Label>
                    <Input value={editForm.rw} onChange={(e) => setEditForm({ ...editForm, rw: e.target.value })} />
                  </div>
                  <div className="md:col-span-2">
                    <Button type="submit" className="bg-purple-600" data-testid="submit-edit-balita">
                      Simpan Perubahan
                    </Button>
                  </div>
                </form>
              </CardContent>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default GrowthCurveModal;
