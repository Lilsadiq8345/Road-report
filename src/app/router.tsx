import { createBrowserRouter, Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/features/auth/AuthContext';
import { PublicLayout } from '@/components/layout/PublicLayout';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { LandingPage } from '@/pages/public/LandingPage';
import { LoginPage } from '@/pages/auth/LoginPage';
import { MapPage } from '@/pages/public/MapPage';
import { ReportsPage } from '@/pages/public/ReportsPage';
import { SubmitReportPage } from '@/pages/citizen/SubmitReportPage';
import { CitizenDashboard } from '@/pages/citizen/CitizenDashboard';
import { ManageReports } from '@/pages/officer/ManageReports';
import { ReportDetailsManagement } from '@/pages/officer/ReportDetailsManagement';
import { AdminDashboard } from '@/pages/admin/AdminDashboard';
import { SettingsPage } from '@/pages/citizen/SettingsPage';

const RootLayout = () => <Outlet />;

const ProtectedRoute = ({ allowedRoles }: { allowedRoles?: string[] }) => {
  const { user, loading, role } = useAuth();
  
  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;
  if (allowedRoles && role && !allowedRoles.includes(role)) {
    return <Navigate to="/" replace />;
  }
  
  return <Outlet />;
};

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      {
        element: <PublicLayout />,
        children: [
          { index: true, element: <LandingPage /> },
          { path: 'login', element: <LoginPage /> },
          { path: 'map', element: <MapPage /> },
          { path: 'reports', element: <ReportsPage /> },
          { path: 'reports/:id', element: <ReportDetailsManagement /> },
        ]
      },
      {
        element: <DashboardLayout />,
        children: [
          {
            element: <ProtectedRoute allowedRoles={['citizen', 'admin']} />,
            children: [
              { path: 'dashboard', element: <CitizenDashboard /> },
              { path: 'dashboard/settings', element: <SettingsPage /> },
              { path: 'report', element: <SubmitReportPage /> },
              { path: 'dashboard/reports/:id', element: <ReportDetailsManagement /> },
            ]
          },
          {
            element: <ProtectedRoute allowedRoles={['admin']} />,
            children: [
              { path: 'dashboard/admin', element: <AdminDashboard /> },
              { path: 'dashboard/reports', element: <ManageReports /> },
            ]
          }
        ]
      }
    ]
  }
]);
