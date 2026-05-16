import React, { useState, useEffect } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import {
  BarChart3, Baby, TrendingUp, MapPin, Activity, Database,
  ShieldCheck, Sparkles, ArrowUpRight
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { publicAPI } from '../api';

const STATUS_COLORS = { gizi_baik: '#10b981', gizi_kurang: '#f59e0b', bgm: '#ef4444' };

const EData = () => {
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    publicAPI
      .getStatistikKelurahan()
      .then((res) => setStats(res.data || []))
      .catch(() => setStats([]))
      .finally(() => setLoading(false));
  }, []);

  const totalBalita = stats.reduce((s, k) => s + k.total, 0);
  const totalBaik = stats.reduce((s, k) => s + k.gizi_baik, 0);
  const totalKurang = stats.reduce((s, k) => s + k.gizi_kurang, 0);
  const totalBGM = stats.reduce((s, k) => s + k.bgm, 0);
  const totalKelurahan = stats.length;
  const persenBaik = totalBalita ? Math.round((totalBaik / totalBalita) * 100) : 0;

  const pieData = [
    { name: 'Gizi Baik', value: totalBaik, color: STATUS_COLORS.gizi_baik },
    { name: 'Gizi Kurang', value: totalKurang, color: STATUS_COLORS.gizi_kurang },
    { name: 'BGM', value: totalBGM, color: STATUS_COLORS.bgm },
  ].filter((d) => d.value > 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50">
      {/* Hero with decorative grid */}
      <section className="relative overflow-hidden bg-gradient-to-br from-purple-700 via-purple-800 to-indigo-900 text-white">
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.4) 1px, transparent 0)',
            backgroundSize: '32px 32px',
          }}
          aria-hidden
        />
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-pink-400/20 rounded-full blur-3xl" aria-hidden />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-cyan-400/20 rounded-full blur-3xl" aria-hidden />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge className="bg-white/15 backdrop-blur text-white border-white/20 mb-6 px-3 py-1.5">
                <Sparkles size={14} className="mr-1.5" /> Live Data Posyandu
              </Badge>
              <h1 className="text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                E-Data <span className="bg-gradient-to-r from-pink-300 to-amber-200 bg-clip-text text-transparent">Gizi Balita</span>
              </h1>
              <p className="text-xl text-purple-100 mb-8 max-w-xl">
                Transparansi data status gizi balita di setiap kelurahan.
                Real-time, terverifikasi, dan dapat diakses publik.
              </p>
              <div className="flex flex-wrap gap-3">
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur rounded-xl px-4 py-2 border border-white/20">
                  <ShieldCheck size={18} className="text-emerald-300" />
                  <span className="text-sm">Data Terverifikasi</span>
                </div>
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur rounded-xl px-4 py-2 border border-white/20">
                  <Activity size={18} className="text-pink-300" />
                  <span className="text-sm">Update Real-time</span>
                </div>
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur rounded-xl px-4 py-2 border border-white/20">
                  <Database size={18} className="text-cyan-300" />
                  <span className="text-sm">Open Data Publik</span>
                </div>
              </div>
            </div>

            {/* Hero metric card */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-pink-400 to-amber-300 rounded-3xl blur-2xl opacity-30" aria-hidden />
              <div className="relative bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <p className="text-purple-100 text-sm">Total Balita Terdata</p>
                    <p className="text-6xl font-bold mt-2" data-testid="hero-total-balita">{totalBalita}</p>
                  </div>
                  <div className="w-20 h-20 bg-gradient-to-br from-pink-400 to-rose-500 rounded-2xl flex items-center justify-center shadow-2xl">
                    <Baby size={40} className="text-white" />
                  </div>
                </div>
                <div className="h-px bg-white/20 my-4" />
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-purple-200 uppercase tracking-wide">Cakupan</p>
                    <p className="text-2xl font-bold flex items-center gap-1">
                      {totalKelurahan} <span className="text-sm font-normal text-purple-200">kelurahan</span>
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-purple-200 uppercase tracking-wide">Status Baik</p>
                    <p className="text-2xl font-bold flex items-center gap-1 text-emerald-300">
                      {persenBaik}% <ArrowUpRight size={20} />
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
        {/* Status overview cards */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Ringkasan Status Gizi</h2>
              <p className="text-gray-600 mt-1">Distribusi status gizi seluruh balita yang terdaftar</p>
            </div>
            <Badge className="bg-purple-100 text-purple-700 hover:bg-purple-100 text-sm px-3 py-1.5">
              <Activity size={14} className="mr-1.5" /> Update otomatis
            </Badge>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="overflow-hidden group hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
              <div className="h-1.5 bg-gradient-to-r from-purple-500 to-indigo-500" />
              <CardContent className="pt-6">
                <div className="flex items-start justify-between mb-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Baby className="text-white" size={24} />
                  </div>
                  <BarChart3 className="text-gray-300" size={20} />
                </div>
                <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Total Balita</p>
                <p className="text-4xl font-bold text-gray-900">{totalBalita}</p>
              </CardContent>
            </Card>

            <Card className="overflow-hidden group hover:shadow-2xl hover:-translate-y-1 transition-all duration-300" data-testid="stat-gizi-baik">
              <div className="h-1.5 bg-gradient-to-r from-emerald-500 to-green-600" />
              <CardContent className="pt-6">
                <div className="flex items-start justify-between mb-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <TrendingUp className="text-white" size={24} />
                  </div>
                  <span className="text-xs bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full font-semibold">
                    {persenBaik}%
                  </span>
                </div>
                <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Gizi Baik</p>
                <p className="text-4xl font-bold text-emerald-600">{totalBaik}</p>
              </CardContent>
            </Card>

            <Card className="overflow-hidden group hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
              <div className="h-1.5 bg-gradient-to-r from-amber-400 to-yellow-500" />
              <CardContent className="pt-6">
                <div className="flex items-start justify-between mb-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-yellow-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Activity className="text-white" size={24} />
                  </div>
                  <span className="text-xs bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full font-semibold">
                    {totalBalita ? Math.round((totalKurang / totalBalita) * 100) : 0}%
                  </span>
                </div>
                <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Gizi Kurang</p>
                <p className="text-4xl font-bold text-amber-600">{totalKurang}</p>
              </CardContent>
            </Card>

            <Card className="overflow-hidden group hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
              <div className="h-1.5 bg-gradient-to-r from-rose-500 to-red-600" />
              <CardContent className="pt-6">
                <div className="flex items-start justify-between mb-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-rose-500 to-red-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Activity className="text-white" size={24} />
                  </div>
                  <span className="text-xs bg-rose-50 text-rose-700 px-2 py-0.5 rounded-full font-semibold">
                    {totalBalita ? Math.round((totalBGM / totalBalita) * 100) : 0}%
                  </span>
                </div>
                <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">BGM (Bawah Garis Merah)</p>
                <p className="text-4xl font-bold text-rose-600">{totalBGM}</p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Charts grid */}
        <section className="grid lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2 border-2 border-purple-100 hover:border-purple-300 transition-colors">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-xl">
                <MapPin className="text-purple-600" size={20} />
                Distribusi Status Gizi per Kelurahan
              </CardTitle>
              <p className="text-sm text-gray-500">Stacked bar — hover untuk detail</p>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="h-80 flex items-center justify-center text-gray-400">Memuat...</div>
              ) : stats.length === 0 ? (
                <div className="h-80 flex flex-col items-center justify-center text-gray-400">
                  <Database size={48} className="mb-3 opacity-40" />
                  <p>Belum ada data tercatat</p>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={Math.max(320, stats.length * 50)}>
                  <BarChart data={stats} layout="vertical" margin={{ top: 10, right: 20, left: 10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis type="number" tick={{ fontSize: 11 }} />
                    <YAxis dataKey="kelurahan" type="category" width={130} tick={{ fontSize: 11 }} />
                    <Tooltip
                      contentStyle={{
                        borderRadius: 12,
                        border: '1px solid #e9d5ff',
                        boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
                      }}
                    />
                    <Legend wrapperStyle={{ fontSize: 12, paddingTop: 8 }} />
                    <Bar dataKey="gizi_baik" name="Gizi Baik" stackId="a" fill={STATUS_COLORS.gizi_baik} radius={[0, 0, 0, 0]} />
                    <Bar dataKey="gizi_kurang" name="Gizi Kurang" stackId="a" fill={STATUS_COLORS.gizi_kurang} />
                    <Bar dataKey="bgm" name="BGM" stackId="a" fill={STATUS_COLORS.bgm} radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>

          <Card className="border-2 border-purple-100 hover:border-purple-300 transition-colors">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-xl">
                <TrendingUp className="text-purple-600" size={20} />
                Komposisi
              </CardTitle>
              <p className="text-sm text-gray-500">Persentase status gizi keseluruhan</p>
            </CardHeader>
            <CardContent>
              {pieData.length === 0 ? (
                <div className="h-72 flex items-center justify-center text-gray-400">Belum ada data</div>
              ) : (
                <>
                  <ResponsiveContainer width="100%" height={240}>
                    <PieChart>
                      <Pie
                        data={pieData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={90}
                        paddingAngle={2}
                      >
                        {pieData.map((entry) => (
                          <Cell key={entry.name} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          borderRadius: 12,
                          border: '1px solid #e9d5ff',
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="space-y-2 mt-2">
                    {pieData.map((p) => (
                      <div key={p.name} className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <span className="w-3 h-3 rounded-full" style={{ background: p.color }} />
                          <span className="text-gray-700">{p.name}</span>
                        </div>
                        <span className="font-semibold text-gray-900">
                          {p.value} <span className="text-gray-400 text-xs">({totalBalita ? Math.round((p.value / totalBalita) * 100) : 0}%)</span>
                        </span>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </section>

        {/* Kelurahan ranking table */}
        <section>
          <Card className="border-2 border-purple-100 overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-purple-50 to-indigo-50 border-b">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <MapPin className="text-purple-600" size={20} />
                    Peringkat Kelurahan
                  </CardTitle>
                  <p className="text-sm text-gray-500 mt-1">Urut berdasarkan jumlah balita terdata</p>
                </div>
                <Badge className="bg-purple-600 hover:bg-purple-700 text-white">
                  {totalKelurahan} Kelurahan
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {stats.length === 0 ? (
                <div className="py-12 text-center text-gray-400">
                  <Database size={48} className="mx-auto mb-3 opacity-40" />
                  <p>Belum ada data kelurahan</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm" data-testid="kelurahan-table">
                    <thead className="bg-gray-50 text-gray-600">
                      <tr>
                        <th className="text-left px-4 py-3 font-semibold">#</th>
                        <th className="text-left px-4 py-3 font-semibold">Kelurahan</th>
                        <th className="text-center px-4 py-3 font-semibold">Total</th>
                        <th className="text-center px-4 py-3 font-semibold">Gizi Baik</th>
                        <th className="text-center px-4 py-3 font-semibold">Gizi Kurang</th>
                        <th className="text-center px-4 py-3 font-semibold">BGM</th>
                        <th className="text-center px-4 py-3 font-semibold">% Baik</th>
                        <th className="text-center px-4 py-3 font-semibold">Rata BB</th>
                        <th className="text-center px-4 py-3 font-semibold">Rata TB</th>
                      </tr>
                    </thead>
                    <tbody>
                      {stats.map((k, idx) => (
                        <tr key={k.kelurahan} className="border-t hover:bg-purple-50/50 transition-colors">
                          <td className="px-4 py-3">
                            <span className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold ${
                              idx === 0 ? 'bg-amber-100 text-amber-700' :
                              idx === 1 ? 'bg-gray-100 text-gray-700' :
                              idx === 2 ? 'bg-orange-100 text-orange-700' :
                              'bg-purple-50 text-purple-700'
                            }`}>
                              {idx + 1}
                            </span>
                          </td>
                          <td className="px-4 py-3 font-semibold text-gray-900">{k.kelurahan}</td>
                          <td className="px-4 py-3 text-center font-medium">{k.total}</td>
                          <td className="px-4 py-3 text-center text-emerald-700">{k.gizi_baik}</td>
                          <td className="px-4 py-3 text-center text-amber-700">{k.gizi_kurang}</td>
                          <td className="px-4 py-3 text-center text-rose-700">{k.bgm}</td>
                          <td className="px-4 py-3 text-center">
                            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${
                              k.persen_gizi_baik >= 80 ? 'bg-emerald-100 text-emerald-700' :
                              k.persen_gizi_baik >= 60 ? 'bg-amber-100 text-amber-700' :
                              'bg-rose-100 text-rose-700'
                            }`}>
                              {k.persen_gizi_baik}%
                            </span>
                          </td>
                          <td className="px-4 py-3 text-center text-gray-700">{k.rata_bb} kg</td>
                          <td className="px-4 py-3 text-center text-gray-700">{k.rata_tb} cm</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </section>

        {/* Info footer */}
        <section className="bg-gradient-to-br from-purple-600 to-indigo-700 rounded-3xl p-8 lg:p-12 text-white relative overflow-hidden">
          <div className="absolute -top-20 -right-20 w-72 h-72 bg-pink-400/20 rounded-full blur-3xl" aria-hidden />
          <div className="relative grid md:grid-cols-3 gap-6 items-center">
            <div className="md:col-span-2">
              <h3 className="text-2xl lg:text-3xl font-bold mb-3">Tentang Data Ini</h3>
              <p className="text-purple-100 leading-relaxed">
                Data E-Data Sobat Giziku dikumpulkan secara terstruktur dari laporan posyandu setiap kelurahan.
                Klasifikasi status gizi mengacu pada standar pertumbuhan WHO (Gizi Baik, Gizi Kurang, BGM).
                Data diperbarui setiap kali pengukuran baru tercatat di sistem.
              </p>
            </div>
            <div className="flex md:justify-end">
              <div className="bg-white/15 backdrop-blur rounded-2xl p-5 border border-white/20">
                <ShieldCheck size={40} className="text-emerald-300 mb-2" />
                <p className="font-bold">Open Data</p>
                <p className="text-sm text-purple-100">Bebas diakses publik</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default EData;
