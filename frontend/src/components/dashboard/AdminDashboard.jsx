import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { adminAPI } from '../../api';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Users, FileText, Utensils, Plus, Trash2, X, Edit, BarChart3 } from 'lucide-react';
import { useToast } from '../../hooks/use-toast';
import StatistikKelurahan from '../StatistikKelurahan';

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const [users, setUsers] = useState([]);
  const [artikel, setArtikel] = useState([]);
  const [resep, setResep] = useState([]);
  const [showUserForm, setShowUserForm] = useState(false);
  const [showArtikelForm, setShowArtikelForm] = useState(false);
  const [showResepForm, setShowResepForm] = useState(false);
  const [editingArtikel, setEditingArtikel] = useState(null);
  const [editingResep, setEditingResep] = useState(null);
  const [userForm, setUserForm] = useState({ email: '', password: '', nama: '', role: 'pasien', nohp: '' });
  const [artikelForm, setArtikelForm] = useState({
    title: '', excerpt: '', content: '', image: '', category: 'Gizi Anak'
  });
  const [resepForm, setResepForm] = useState({
    kategori: '6-8', nama: '', gambar: '', deskripsi: '', waktu: '', porsi: '',
    alat: '', bahan: '', cara: '', tips: ''
  });

  const loadData = useCallback(async () => {
    try {
      const [usersRes, artikelRes, resepRes] = await Promise.all([
        adminAPI.getUsers(),
        adminAPI.getArtikel(),
        adminAPI.getResep()
      ]);
      setUsers(usersRes.data);
      setArtikel(artikelRes.data);
      setResep(resepRes.data);
    } catch (error) {
      if (process.env.NODE_ENV === 'development') console.error('Load data error:', error);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleCreateUser = async (e) => {
    e.preventDefault();
    try {
      await adminAPI.createUser(userForm);
      toast({ title: 'User berhasil dibuat!', className: 'bg-green-50 border-green-500' });
      setShowUserForm(false);
      setUserForm({ email: '', password: '', nama: '', role: 'pasien', nohp: '' });
      loadData();
    } catch (error) {
      toast({ title: 'Error', description: error.response?.data?.detail || 'Gagal membuat user', variant: 'destructive' });
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Yakin hapus user?')) return;
    try {
      await adminAPI.deleteUser(userId);
      toast({ title: 'User berhasil dihapus!' });
      loadData();
    } catch (error) {
      toast({ title: 'Error', description: 'Gagal hapus user', variant: 'destructive' });
    }
  };

  // ARTIKEL HANDLERS
  const handleEditArtikel = (a) => {
    setEditingArtikel(a);
    setArtikelForm({
      title: a.title,
      excerpt: a.excerpt,
      content: a.content,
      image: a.image || '',
      category: a.category
    });
    setShowArtikelForm(true);
  };

  const handleSaveArtikel = async (e) => {
    e.preventDefault();
    try {
      if (editingArtikel) {
        await adminAPI.updateArtikel(editingArtikel.id, artikelForm);
        toast({ title: 'Artikel berhasil diupdate!', className: 'bg-green-50 border-green-500' });
      } else {
        await adminAPI.createArtikel(artikelForm);
        toast({ title: 'Artikel berhasil dibuat!', className: 'bg-green-50 border-green-500' });
      }
      setShowArtikelForm(false);
      setEditingArtikel(null);
      setArtikelForm({ title: '', excerpt: '', content: '', image: '', category: 'Gizi Anak' });
      loadData();
    } catch (error) {
      toast({ title: 'Error', description: error.response?.data?.detail || 'Gagal menyimpan artikel', variant: 'destructive' });
    }
  };

  const handleDeleteArtikel = async (artikelId) => {
    if (!window.confirm('Yakin hapus artikel?')) return;
    try {
      await adminAPI.deleteArtikel(artikelId);
      toast({ title: 'Artikel berhasil dihapus!' });
      loadData();
    } catch (error) {
      toast({ title: 'Error', description: 'Gagal hapus artikel', variant: 'destructive' });
    }
  };

  const closeArtikelForm = () => {
    setShowArtikelForm(false);
    setEditingArtikel(null);
    setArtikelForm({ title: '', excerpt: '', content: '', image: '', category: 'Gizi Anak' });
  };

  // RESEP HANDLERS
  const handleEditResep = (r) => {
    setEditingResep(r);
    setResepForm({
      kategori: r.kategori,
      nama: r.nama,
      gambar: r.gambar || '',
      deskripsi: r.deskripsi,
      waktu: r.waktu || '',
      porsi: r.porsi || '',
      alat: Array.isArray(r.alat) ? r.alat.join('\n') : '',
      bahan: Array.isArray(r.bahan) ? r.bahan.join('\n') : '',
      cara: Array.isArray(r.cara) ? r.cara.join('\n') : '',
      tips: r.tips || ''
    });
    setShowResepForm(true);
  };

  const handleSaveResep = async (e) => {
    e.preventDefault();
    try {
      const resepData = {
        ...resepForm,
        alat: resepForm.alat.split('\n').filter(a => a.trim()),
        bahan: resepForm.bahan.split('\n').filter(b => b.trim()),
        cara: resepForm.cara.split('\n').filter(c => c.trim())
      };
      
      if (editingResep) {
        await adminAPI.updateResep(editingResep.id, resepData);
        toast({ title: 'Resep berhasil diupdate!', className: 'bg-green-50 border-green-500' });
      } else {
        await adminAPI.createResep(resepData);
        toast({ title: 'Resep berhasil dibuat!', className: 'bg-green-50 border-green-500' });
      }
      setShowResepForm(false);
      setEditingResep(null);
      setResepForm({
        kategori: '6-8', nama: '', gambar: '', deskripsi: '', waktu: '', porsi: '',
        alat: '', bahan: '', cara: '', tips: ''
      });
      loadData();
    } catch (error) {
      toast({ title: 'Error', description: error.response?.data?.detail || 'Gagal menyimpan resep', variant: 'destructive' });
    }
  };

  const handleDeleteResep = async (resepId) => {
    if (!window.confirm('Yakin hapus resep?')) return;
    try {
      await adminAPI.deleteResep(resepId);
      toast({ title: 'Resep berhasil dihapus!' });
      loadData();
    } catch (error) {
      toast({ title: 'Error', description: 'Gagal hapus resep', variant: 'destructive' });
    }
  };

  const closeResepForm = () => {
    setShowResepForm(false);
    setEditingResep(null);
    setResepForm({
      kategori: '6-8', nama: '', gambar: '', deskripsi: '', waktu: '', porsi: '',
      alat: '', bahan: '', cara: '', tips: ''
    });
  };

  const kategoris = [
    { value: '6-8', label: '6-8 Bulan' },
    { value: '9-11', label: '9-11 Bulan' },
    { value: '12-23', label: '12-23 Bulan' },
    { value: 'snack', label: 'Snack' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Dashboard Admin</h1>
            <p className="text-gray-600">Selamat datang, {user?.nama}</p>
          </div>
          <Button variant="outline" onClick={logout} className="text-red-600 border-red-300 hover:bg-red-50">
            Logout
          </Button>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
            <CardContent className="pt-6">
              <Users size={32} className="mb-2" />
              <div className="text-3xl font-bold">{users.length}</div>
              <div className="text-blue-100">Total Users</div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
            <CardContent className="pt-6">
              <FileText size={32} className="mb-2" />
              <div className="text-3xl font-bold">{artikel.length}</div>
              <div className="text-purple-100">Total Artikel</div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white">
            <CardContent className="pt-6">
              <Utensils size={32} className="mb-2" />
              <div className="text-3xl font-bold">{resep.length}</div>
              <div className="text-orange-100">Total Resep MPASI</div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="users" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="users"><Users className="mr-2" size={18} />Users</TabsTrigger>
            <TabsTrigger value="artikel"><FileText className="mr-2" size={18} />Artikel</TabsTrigger>
            <TabsTrigger value="resep"><Utensils className="mr-2" size={18} />Resep MPASI</TabsTrigger>
            <TabsTrigger value="statistik" data-testid="admin-tab-statistik"><BarChart3 className="mr-2" size={18} />Statistik</TabsTrigger>
          </TabsList>

          {/* USERS TAB */}
          <TabsContent value="users" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Manage Users</h2>
              <Button onClick={() => setShowUserForm(!showUserForm)} className="bg-purple-600">
                {showUserForm ? <X size={18} className="mr-2" /> : <Plus size={18} className="mr-2" />}
                {showUserForm ? 'Tutup' : 'Tambah User'}
              </Button>
            </div>

            {showUserForm && (
              <Card className="border-2 border-purple-200">
                <CardHeader><CardTitle>Tambah User Baru</CardTitle></CardHeader>
                <CardContent>
                  <form onSubmit={handleCreateUser} className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div><Label>Nama *</Label><Input value={userForm.nama} onChange={e => setUserForm({...userForm, nama: e.target.value})} required /></div>
                      <div><Label>Email *</Label><Input type="email" value={userForm.email} onChange={e => setUserForm({...userForm, email: e.target.value})} required /></div>
                      <div><Label>Password *</Label><Input type="password" value={userForm.password} onChange={e => setUserForm({...userForm, password: e.target.value})} required /></div>
                      <div><Label>No HP</Label><Input value={userForm.nohp} onChange={e => setUserForm({...userForm, nohp: e.target.value})} /></div>
                      <div>
                        <Label>Role *</Label>
                        <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2" value={userForm.role} onChange={e => setUserForm({...userForm, role: e.target.value})}>
                          <option value="pasien">Pasien</option>
                          <option value="dokter">Dokter</option>
                          <option value="admin">Admin</option>
                        </select>
                      </div>
                    </div>
                    <Button type="submit" className="bg-purple-600">Simpan User</Button>
                  </form>
                </CardContent>
              </Card>
            )}

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {users.map(u => (
                <Card key={u.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="font-bold text-lg">{u.nama}</h3>
                        <p className="text-sm text-gray-600">{u.email}</p>
                        <span className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-semibold ${
                          u.role === 'admin' ? 'bg-red-100 text-red-800' :
                          u.role === 'dokter' ? 'bg-blue-100 text-blue-800' :
                          'bg-green-100 text-green-800'
                        }`}>{u.role}</span>
                      </div>
                      <Button variant="ghost" size="sm" onClick={() => handleDeleteUser(u.id)}><Trash2 size={16} className="text-red-600" /></Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* ARTIKEL TAB */}
          <TabsContent value="artikel" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Manage Artikel Kesehatan</h2>
              <Button onClick={() => { closeArtikelForm(); setShowArtikelForm(true); }} className="bg-purple-600">
                <Plus size={18} className="mr-2" />
                Tambah Artikel
              </Button>
            </div>

            {showArtikelForm && (
              <Card className="border-2 border-purple-200">
                <CardHeader>
                  <CardTitle>{editingArtikel ? 'Edit Artikel' : 'Tambah Artikel Baru'}</CardTitle>
                  <CardDescription>Isi semua field untuk {editingArtikel ? 'mengupdate' : 'membuat'} artikel</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSaveArtikel} className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="md:col-span-2">
                        <Label>Judul Artikel *</Label>
                        <Input value={artikelForm.title} onChange={e => setArtikelForm({...artikelForm, title: e.target.value})} placeholder="Contoh: Pentingnya Gizi Seimbang untuk Balita" required />
                      </div>
                      <div>
                        <Label>Kategori *</Label>
                        <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2" value={artikelForm.category} onChange={e => setArtikelForm({...artikelForm, category: e.target.value})}>
                          <option value="Gizi Anak">Gizi Anak</option>
                          <option value="Tumbuh Kembang">Tumbuh Kembang</option>
                          <option value="Kesehatan">Kesehatan</option>
                          <option value="Tips & Trik">Tips & Trik</option>
                          <option value="MPASI">MPASI</option>
                        </select>
                      </div>
                      <div>
                        <Label>URL Gambar</Label>
                        <Input value={artikelForm.image} onChange={e => setArtikelForm({...artikelForm, image: e.target.value})} placeholder="https://example.com/image.jpg" />
                      </div>
                      <div className="md:col-span-2">
                        <Label>Ringkasan (Excerpt) *</Label>
                        <Textarea value={artikelForm.excerpt} onChange={e => setArtikelForm({...artikelForm, excerpt: e.target.value})} placeholder="Ringkasan singkat artikel..." rows={2} required />
                      </div>
                      <div className="md:col-span-2">
                        <Label>Isi Artikel *</Label>
                        <Textarea value={artikelForm.content} onChange={e => setArtikelForm({...artikelForm, content: e.target.value})} placeholder="Tulis isi artikel lengkap di sini..." rows={8} required />
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button type="submit" className="bg-purple-600">
                        {editingArtikel ? 'Update Artikel' : 'Publikasikan Artikel'}
                      </Button>
                      <Button type="button" variant="outline" onClick={closeArtikelForm}>Batal</Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            )}

            {artikel.length === 0 ? (
              <Card className="border-2 border-dashed">
                <CardContent className="py-12 text-center">
                  <FileText size={64} className="mx-auto text-gray-400 mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Belum Ada Artikel</h3>
                  <p className="text-gray-600">Klik "Tambah Artikel" untuk membuat artikel baru</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid md:grid-cols-2 gap-4">
                {artikel.map(a => (
                  <Card key={a.id} className="hover:shadow-lg transition-shadow">
                    <CardContent className="pt-6">
                      <div className="flex gap-4">
                        {a.image && (
                          <img src={a.image} alt={a.title} className="w-24 h-24 object-cover rounded-lg" onError={(e) => e.target.style.display='none'} />
                        )}
                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <div>
                              <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">{a.category}</span>
                              <h3 className="font-bold text-lg mt-2">{a.title}</h3>
                            </div>
                            <div className="flex gap-1">
                              <Button variant="ghost" size="sm" onClick={() => handleEditArtikel(a)}>
                                <Edit size={16} className="text-blue-600" />
                              </Button>
                              <Button variant="ghost" size="sm" onClick={() => handleDeleteArtikel(a.id)}>
                                <Trash2 size={16} className="text-red-600" />
                              </Button>
                            </div>
                          </div>
                          <p className="text-sm text-gray-600 mt-2 line-clamp-2">{a.excerpt}</p>
                          <p className="text-xs text-gray-400 mt-2">Slug: {a.slug}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* RESEP TAB */}
          <TabsContent value="resep" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Manage Resep MPASI</h2>
              <Button onClick={() => { closeResepForm(); setShowResepForm(true); }} className="bg-purple-600">
                <Plus size={18} className="mr-2" />
                Tambah Resep
              </Button>
            </div>

            {showResepForm && (
              <Card className="border-2 border-purple-200">
                <CardHeader>
                  <CardTitle>{editingResep ? 'Edit Resep' : 'Tambah Resep MPASI Baru'}</CardTitle>
                  <CardDescription>Isi semua field. Untuk alat, bahan, dan cara, tulis satu item per baris.</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSaveResep} className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label>Nama Resep *</Label>
                        <Input value={resepForm.nama} onChange={e => setResepForm({...resepForm, nama: e.target.value})} placeholder="Contoh: Bubur Ayam Wortel" required />
                      </div>
                      <div>
                        <Label>Kategori Usia *</Label>
                        <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2" value={resepForm.kategori} onChange={e => setResepForm({...resepForm, kategori: e.target.value})}>
                          {kategoris.map(k => <option key={k.value} value={k.value}>{k.label}</option>)}
                        </select>
                      </div>
                      <div>
                        <Label>Waktu Memasak</Label>
                        <Input value={resepForm.waktu} onChange={e => setResepForm({...resepForm, waktu: e.target.value})} placeholder="Contoh: 30 menit" />
                      </div>
                      <div>
                        <Label>Porsi</Label>
                        <Input value={resepForm.porsi} onChange={e => setResepForm({...resepForm, porsi: e.target.value})} placeholder="Contoh: 2 porsi" />
                      </div>
                      <div className="md:col-span-2">
                        <Label>URL Gambar</Label>
                        <Input value={resepForm.gambar} onChange={e => setResepForm({...resepForm, gambar: e.target.value})} placeholder="https://example.com/image.jpg" />
                      </div>
                      <div className="md:col-span-2">
                        <Label>Deskripsi *</Label>
                        <Textarea value={resepForm.deskripsi} onChange={e => setResepForm({...resepForm, deskripsi: e.target.value})} placeholder="Deskripsi singkat resep..." rows={2} required />
                      </div>
                      <div>
                        <Label>Alat (satu per baris)</Label>
                        <Textarea value={resepForm.alat} onChange={e => setResepForm({...resepForm, alat: e.target.value})} placeholder="Panci&#10;Blender&#10;Sendok" rows={4} />
                      </div>
                      <div>
                        <Label>Bahan (satu per baris) *</Label>
                        <Textarea value={resepForm.bahan} onChange={e => setResepForm({...resepForm, bahan: e.target.value})} placeholder="50gr beras&#10;30gr ayam cincang&#10;1 buah wortel" rows={4} required />
                      </div>
                      <div className="md:col-span-2">
                        <Label>Cara Memasak (satu langkah per baris) *</Label>
                        <Textarea value={resepForm.cara} onChange={e => setResepForm({...resepForm, cara: e.target.value})} placeholder="Cuci beras hingga bersih&#10;Rebus beras dengan air hingga menjadi bubur&#10;Tumis ayam dan wortel hingga matang" rows={5} required />
                      </div>
                      <div className="md:col-span-2">
                        <Label>Tips</Label>
                        <Textarea value={resepForm.tips} onChange={e => setResepForm({...resepForm, tips: e.target.value})} placeholder="Tips memasak..." rows={2} />
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button type="submit" className="bg-purple-600">
                        {editingResep ? 'Update Resep' : 'Simpan Resep'}
                      </Button>
                      <Button type="button" variant="outline" onClick={closeResepForm}>Batal</Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            )}

            {resep.length === 0 ? (
              <Card className="border-2 border-dashed">
                <CardContent className="py-12 text-center">
                  <Utensils size={64} className="mx-auto text-gray-400 mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Belum Ada Resep</h3>
                  <p className="text-gray-600">Klik "Tambah Resep" untuk membuat resep MPASI baru</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {resep.map(r => (
                  <Card key={r.id} className="hover:shadow-lg transition-shadow">
                    <CardContent className="pt-6">
                      {r.gambar && (
                        <img src={r.gambar} alt={r.nama} className="w-full h-32 object-cover rounded-lg mb-4" onError={(e) => e.target.style.display='none'} />
                      )}
                      <div className="flex justify-between items-start">
                        <div>
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            r.kategori === '6-8' ? 'bg-green-100 text-green-700' :
                            r.kategori === '9-11' ? 'bg-blue-100 text-blue-700' :
                            r.kategori === '12-23' ? 'bg-orange-100 text-orange-700' :
                            'bg-pink-100 text-pink-700'
                          }`}>
                            {kategoris.find(k => k.value === r.kategori)?.label || r.kategori}
                          </span>
                          <h3 className="font-bold text-lg mt-2">{r.nama}</h3>
                        </div>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="sm" onClick={() => handleEditResep(r)}>
                            <Edit size={16} className="text-blue-600" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleDeleteResep(r.id)}>
                            <Trash2 size={16} className="text-red-600" />
                          </Button>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mt-2 line-clamp-2">{r.deskripsi}</p>
                      <div className="flex gap-4 mt-3 text-xs text-gray-500">
                        {r.waktu && <span>⏱️ {r.waktu}</span>}
                        {r.porsi && <span>🍽️ {r.porsi}</span>}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="statistik" className="space-y-4">
            <h2 className="text-2xl font-bold">Statistik Gizi per Kelurahan</h2>
            <StatistikKelurahan />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;
