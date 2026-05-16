import React, { useState, useEffect } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { publicAPI } from '../api';
import { MapPin, Users, TrendingUp } from 'lucide-react';

const COLORS = { gizi_baik: '#10b981', gizi_kurang: '#f59e0b', bgm: '#ef4444' };

const StatistikKelurahan = ({ compact = false }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    publicAPI
      .getStatistikKelurahan()
      .then((res) => setData(res.data || []))
      .catch(() => setData([]))
      .finally(() => setLoading(false));
  }, []);

  const totalBalita = data.reduce((sum, k) => sum + k.total, 0);
  const totalBaik = data.reduce((sum, k) => sum + k.gizi_baik, 0);
  const totalKurang = data.reduce((sum, k) => sum + k.gizi_kurang, 0);
  const totalBGM = data.reduce((sum, k) => sum + k.bgm, 0);

  const pieData = [
    { name: 'Gizi Baik', value: totalBaik, color: COLORS.gizi_baik },
    { name: 'Gizi Kurang', value: totalKurang, color: COLORS.gizi_kurang },
    { name: 'BGM', value: totalBGM, color: COLORS.bgm },
  ].filter((d) => d.value > 0);

  if (loading) {
    return <div className="text-center py-12 text-gray-500" data-testid="stat-loading">Memuat statistik...</div>;
  }

  if (data.length === 0) {
    return (
      <Card data-testid="stat-empty">
        <CardContent className="text-center py-12">
          <MapPin className="mx-auto text-gray-400 mb-3" size={48} />
          <p className="text-gray-500">Belum ada data balita yang tercatat.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className={compact ? 'space-y-4' : 'space-y-6'} data-testid="statistik-kelurahan">
      {!compact && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Card className="border-l-4 border-purple-500">
            <CardContent className="pt-4">
              <div className="flex items-center gap-2 text-gray-500 text-xs mb-1">
                <Users size={14} /> Total Balita
              </div>
              <p className="text-2xl font-bold">{totalBalita}</p>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-green-500">
            <CardContent className="pt-4">
              <p className="text-xs text-gray-500 mb-1">Gizi Baik</p>
              <p className="text-2xl font-bold text-green-700">{totalBaik}</p>
              <p className="text-xs text-gray-500">{totalBalita ? Math.round((totalBaik / totalBalita) * 100) : 0}%</p>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-yellow-500">
            <CardContent className="pt-4">
              <p className="text-xs text-gray-500 mb-1">Gizi Kurang</p>
              <p className="text-2xl font-bold text-yellow-700">{totalKurang}</p>
              <p className="text-xs text-gray-500">{totalBalita ? Math.round((totalKurang / totalBalita) * 100) : 0}%</p>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-red-500">
            <CardContent className="pt-4">
              <p className="text-xs text-gray-500 mb-1">BGM</p>
              <p className="text-2xl font-bold text-red-700">{totalBGM}</p>
              <p className="text-xs text-gray-500">{totalBalita ? Math.round((totalBGM / totalBalita) * 100) : 0}%</p>
            </CardContent>
          </Card>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <MapPin size={18} className="text-purple-600" /> Distribusi Status Gizi per Kelurahan
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={Math.max(280, data.length * 40)}>
            <BarChart
              data={data}
              layout="vertical"
              margin={{ top: 10, right: 20, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis type="number" tick={{ fontSize: 11 }} />
              <YAxis dataKey="kelurahan" type="category" width={130} tick={{ fontSize: 11 }} />
              <Tooltip />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Bar dataKey="gizi_baik" name="Gizi Baik" stackId="a" fill={COLORS.gizi_baik} />
              <Bar dataKey="gizi_kurang" name="Gizi Kurang" stackId="a" fill={COLORS.gizi_kurang} />
              <Bar dataKey="bgm" name="BGM" stackId="a" fill={COLORS.bgm} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {!compact && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <TrendingUp size={18} className="text-purple-600" /> Komposisi Status Gizi
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={90}
                    label={(d) => `${d.name}: ${d.value}`}
                  >
                    {pieData.map((entry) => (
                      <Cell key={entry.name} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Rincian per Kelurahan</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto max-h-72 overflow-y-auto">
                <table className="w-full text-sm" data-testid="stat-table">
                  <thead className="bg-gray-50 sticky top-0">
                    <tr className="text-left text-gray-700">
                      <th className="px-3 py-2">Kelurahan</th>
                      <th className="px-3 py-2">Total</th>
                      <th className="px-3 py-2">% Baik</th>
                      <th className="px-3 py-2">Rata BB</th>
                      <th className="px-3 py-2">Rata TB</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.map((k) => (
                      <tr key={k.kelurahan} className="border-t hover:bg-purple-50">
                        <td className="px-3 py-2 font-medium">{k.kelurahan}</td>
                        <td className="px-3 py-2">{k.total}</td>
                        <td className="px-3 py-2">
                          <span
                            className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                              k.persen_gizi_baik >= 80
                                ? 'bg-green-100 text-green-800'
                                : k.persen_gizi_baik >= 60
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {k.persen_gizi_baik}%
                          </span>
                        </td>
                        <td className="px-3 py-2">{k.rata_bb} kg</td>
                        <td className="px-3 py-2">{k.rata_tb} cm</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default StatistikKelurahan;
