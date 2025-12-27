import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { adminAPI } from '../../api';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Users, FileText, Utensils, Plus, Trash2 } from 'lucide-react';
import { useToast } from '../../hooks/use-toast';

const AdminDashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [users, setUsers] = useState([]);
  const [artikel, setArtikel] = useState([]);
  const [resep, setResep] = useState([]);
  const [showUserForm, setShowUserForm] = useState(false);
  const [userForm, setUserForm] = useState({ email: '', password: '', nama: '', role: 'pasien', nohp: '' });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
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
      console.error('Load data error:', error);
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    try {
      await adminAPI.createUser(userForm);
      toast({ title: 'User berhasil dibuat!' });
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Dashboard Admin</h1>
          <p className="text-gray-600">Selamat datang, {user.nama}</p>
        </div>

        <Tabs defaultValue="users" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="users"><Users className="mr-2" size={18} />Users</TabsTrigger>
            <TabsTrigger value="artikel"><FileText className="mr-2" size={18} />Artikel</TabsTrigger>
            <TabsTrigger value="resep"><Utensils className="mr-2" size={18} />Resep</TabsTrigger>
          </TabsList>

          <TabsContent value="users" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Manage Users</h2>
              <Button onClick={() => setShowUserForm(!showUserForm)} className="bg-purple-600">
                <Plus size={18} className="mr-2" />Tambah User
              </Button>
            </div>

            {showUserForm && (
              <Card>
                <CardHeader><CardTitle>Tambah User Baru</CardTitle></CardHeader>
                <CardContent>
                  <form onSubmit={handleCreateUser} className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div><Label>Nama</Label><Input value={userForm.nama} onChange={e => setUserForm({...userForm, nama: e.target.value})} required /></div>
                      <div><Label>Email</Label><Input type="email" value={userForm.email} onChange={e => setUserForm({...userForm, email: e.target.value})} required /></div>
                      <div><Label>Password</Label><Input type="password" value={userForm.password} onChange={e => setUserForm({...userForm, password: e.target.value})} required /></div>
                      <div><Label>No HP</Label><Input value={userForm.nohp} onChange={e => setUserForm({...userForm, nohp: e.target.value})} /></div>
                      <div>
                        <Label>Role</Label>
                        <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2" value={userForm.role} onChange={e => setUserForm({...userForm, role: e.target.value})}>
                          <option value="pasien">Pasien</option>
                          <option value="dokter">Dokter</option>
                          <option value="admin">Admin</option>
                        </select>
                      </div>
                    </div>
                    <Button type="submit" className="bg-purple-600">Simpan</Button>
                  </form>
                </CardContent>
              </Card>
            )}

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {users.map(u => (
                <Card key={u.id}>
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="font-bold text-lg">{u.nama}</h3>
                        <p className="text-sm text-gray-600">{u.email}</p>
                        <span className="inline-block mt-2 px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-semibold">{u.role}</span>
                      </div>
                      <Button variant="ghost" size="sm" onClick={() => handleDeleteUser(u.id)}><Trash2 size={16} className="text-red-600" /></Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="artikel">
            <div className="text-center py-12">
              <FileText size={64} className="mx-auto text-gray-400 mb-4" />
              <p className="text-gray-600 mb-4">{artikel.length} Artikel tersedia</p>
              <p className="text-sm text-gray-500">Fitur CRUD Artikel akan dikembangkan</p>
            </div>
          </TabsContent>

          <TabsContent value="resep">
            <div className="text-center py-12">
              <Utensils size={64} className="mx-auto text-gray-400 mb-4" />
              <p className="text-gray-600 mb-4">{resep.length} Resep tersedia</p>
              <p className="text-sm text-gray-500">Fitur CRUD Resep akan dikembangkan</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;