import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import AdminDashboard from '../components/dashboard/AdminDashboard';
import DokterDashboard from '../components/dashboard/DokterDashboard';
import PasienDashboard from '../components/dashboard/PasienDashboard';

const Dashboard = () => {
  const { user } = useAuth();

  if (!user) return null;

  const dashboards = {
    admin: <AdminDashboard />,
    dokter: <DokterDashboard />,
    pasien: <PasienDashboard />
  };

  return dashboards[user.role] || <div>Invalid role</div>;
};

export default Dashboard;
