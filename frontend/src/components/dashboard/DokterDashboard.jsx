import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { dokterAPI } from '../../api';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { MessageSquare, CheckCircle, XCircle, BarChart3 } from 'lucide-react';
import { useToast } from '../../hooks/use-toast';
import ChatWindow from '../ChatWindow';
import StatistikKelurahan from '../StatistikKelurahan';

const DokterDashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [konsultasi, setKonsultasi] = useState([]);
  const [selectedKonsultasi, setSelectedKonsultasi] = useState(null);

  const loadKonsultasi = useCallback(async () => {
    try {
      const res = await dokterAPI.getKonsultasi();
      setKonsultasi(res.data);
    } catch (error) {
      if (process.env.NODE_ENV === 'development') console.error('Load konsultasi error:', error);
    }
  }, []);

  useEffect(() => {
    loadKonsultasi();
  }, [loadKonsultasi]);

  const handleAccept = async (id) => {
    try {
      await dokterAPI.acceptKonsultasi(id);
      toast({ title: 'Konsultasi diterima!', className: 'bg-green-50 border-green-500' });
      loadKonsultasi();
    } catch (error) {
      toast({ title: 'Error', description: 'Gagal terima konsultasi', variant: 'destructive' });
    }
  };

  const handleReject = async (id) => {
    if (!window.confirm('Yakin tolak konsultasi?')) return;
    try {
      await dokterAPI.rejectKonsultasi(id);
      toast({ title: 'Konsultasi ditolak', className: 'bg-red-50 border-red-500' });
      loadKonsultasi();
    } catch (error) {
      toast({ title: 'Error', description: 'Gagal tolak konsultasi', variant: 'destructive' });
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      pending: 'bg-yellow-100 text-yellow-800',
      accepted: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
      completed: 'bg-blue-100 text-blue-800'
    };
    return <Badge className={styles[status] || ''}>{status}</Badge>;
  };

  if (selectedKonsultasi) {
    return <ChatWindow konsultasi={selectedKonsultasi} onClose={() => setSelectedKonsultasi(null)} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Dashboard Dokter</h1>
          <p className="text-gray-600">Selamat datang, {user.nama}</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="text-3xl font-bold text-yellow-600">{konsultasi.filter(k => k.status === 'pending').length}</div>
              <div className="text-sm text-gray-600">Pending</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-3xl font-bold text-green-600">{konsultasi.filter(k => k.status === 'accepted').length}</div>
              <div className="text-sm text-gray-600">Diterima</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-3xl font-bold text-blue-600">{konsultasi.filter(k => k.status === 'completed').length}</div>
              <div className="text-sm text-gray-600">Selesai</div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader><CardTitle>Daftar Konsultasi</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-4">
              {konsultasi.length === 0 ? (
                <p className="text-center text-gray-500 py-8">Belum ada konsultasi</p>
              ) : (
                konsultasi.map(k => (
                  <Card key={k.id} className="border-2">
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="font-bold">Konsultasi #{k.id.slice(0, 8)}</h3>
                            {getStatusBadge(k.status)}
                          </div>
                          <p className="text-sm text-gray-600 mb-2">Pasien ID: {k.pasien_id}</p>
                          <p className="text-gray-700">{k.keluhan}</p>
                          <p className="text-xs text-gray-500 mt-2">{new Date(k.created_at).toLocaleString('id-ID')}</p>
                        </div>
                        <div className="flex flex-col space-y-2 ml-4">
                          {k.status === 'pending' && (
                            <>
                              <Button size="sm" className="bg-green-600" onClick={() => handleAccept(k.id)}><CheckCircle size={16} className="mr-2" />Terima</Button>
                              <Button size="sm" variant="outline" className="border-red-600 text-red-600" onClick={() => handleReject(k.id)}><XCircle size={16} className="mr-2" />Tolak</Button>
                            </>
                          )}
                          {k.status === 'accepted' && (
                            <Button size="sm" className="bg-purple-600" onClick={() => setSelectedKonsultasi(k)}><MessageSquare size={16} className="mr-2" />Chat</Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        <div className="mt-8">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="text-purple-600" size={22} />
            <h2 className="text-2xl font-bold">Statistik Gizi Kelurahan</h2>
          </div>
          <StatistikKelurahan compact />
        </div>
      </div>
    </div>
  );
};

export default DokterDashboard;