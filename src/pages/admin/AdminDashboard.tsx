import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Building2, FileText, Activity } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';

export function AdminDashboard() {
  const [stats, setStats] = useState({
    users: 0,
    agencies: 0,
    reports: 0,
    activeIssues: 0
  });
  
  const [recentUsers, setRecentUsers] = useState<any[]>([]);

  useEffect(() => {
    async function fetchSystemData() {
      // Note: In a real environment, you'd probably fetch this via an edge function or secure view
      // since the admin needs elevated privileges to count users in auth.users or profiles if RLS blocks it.
      // Here we assume RLS allows admin to read profiles and agencies.
      
      const { count: userCount } = await supabase.from('profiles').select('*', { count: 'exact', head: true });
      const { count: agencyCount } = await supabase.from('road_agencies').select('*', { count: 'exact', head: true });
      const { data: reports } = await supabase.from('road_reports').select('status');
      
      const { data: users } = await supabase.from('profiles').select('*').order('created_at', { ascending: false }).limit(500);

      if (reports) {
        setStats({
          users: userCount || 0,
          agencies: agencyCount || 0,
          reports: reports.length,
          activeIssues: reports.filter(r => !['resolved', 'closed', 'rejected', 'duplicate'].includes(r.status)).length
        });
      }
      
      if (users) {
        setRecentUsers(users);
      }
    }
    
    fetchSystemData();
  }, []);

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">System Administration</h1>
        <p className="text-muted-foreground mt-1">Platform-wide analytics, user management, and configuration.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="transition-all duration-300 hover:shadow-md hover:-translate-y-1 border-l-4 border-l-blue-500">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.users}</div>
          </CardContent>
        </Card>
        <Card className="transition-all duration-300 hover:shadow-md hover:-translate-y-1 border-l-4 border-l-purple-500">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Road Agencies</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.agencies}</div>
          </CardContent>
        </Card>
        <Card className="transition-all duration-300 hover:shadow-md hover:-translate-y-1 border-l-4 border-l-amber-500">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Reports</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.reports}</div>
          </CardContent>
        </Card>
        <Card className="transition-all duration-300 hover:shadow-md hover:-translate-y-1 border-l-4 border-l-rose-500">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active Issues</CardTitle>
            <Activity className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeIssues}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Platform Users</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative w-full overflow-auto">
            <table className="w-full caption-bottom text-sm">
              <thead className="[&_tr]:border-b">
                <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Name</th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Email</th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Role</th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Joined</th>
                </tr>
              </thead>
              <tbody className="[&_tr:last-child]:border-0">
                {recentUsers.map(user => (
                  <tr key={user.id} className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                    <td className="p-4 align-middle font-medium">{user.full_name || 'N/A'}</td>
                    <td className="p-4 align-middle">{user.email}</td>
                    <td className="p-4 align-middle">
                      <Badge variant={user.role === 'admin' ? 'default' : 'secondary'} className="capitalize">
                        {user.role.replace('_', ' ')}
                      </Badge>
                    </td>
                    <td className="p-4 align-middle text-muted-foreground">{format(new Date(user.created_at), 'MMM d, yyyy')}</td>
                  </tr>
                ))}
                {recentUsers.length === 0 && (
                  <tr>
                    <td colSpan={4} className="p-4 text-center text-muted-foreground">No users found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
