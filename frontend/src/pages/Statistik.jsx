import React from 'react';
import StatistikKelurahan from '../components/StatistikKelurahan';
import { BarChart3 } from 'lucide-react';

const Statistik = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8 text-center">
          <div className="inline-flex items-center gap-3 mb-3">
            <BarChart3 className="text-purple-600" size={36} />
            <h1 className="text-4xl font-bold text-gray-900">Statistik Gizi Kelurahan</h1>
          </div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Pantau distribusi status gizi balita di setiap kelurahan secara transparan.
            Data diperbarui secara real-time dari sistem Posyandu Sobat Giziku.
          </p>
        </div>
        <StatistikKelurahan />
      </div>
    </div>
  );
};

export default Statistik;
