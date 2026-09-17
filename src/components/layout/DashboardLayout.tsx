import { Outlet, Link } from 'react-router-dom';
import { useAuth } from '@/features/auth/AuthContext';
import { Button } from '@/components/ui/button';
import {
  MapPin,
  LayoutDashboard,
  FileText,
  Settings,
  LogOut,
  Menu
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useState } from 'react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

export function DashboardLayout() {
  const { role, user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const NavLinks = () => (
    <nav className="flex-1 space-y-2 py-4 px-2">
      <Link
        to={role === 'admin' ? '/dashboard/admin' : '/dashboard'}
        className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors"
        onClick={() => setIsOpen(false)}
      >
        <LayoutDashboard className="h-4 w-4" />
        Dashboard
      </Link>
      {role === 'admin' && (
        <Link
          to="/dashboard/reports"
          className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors"
          onClick={() => setIsOpen(false)}
        >
          <FileText className="h-4 w-4" />
          Manage Reports
        </Link>
      )}
      <Link
        to="/dashboard/settings"
        className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors"
        onClick={() => setIsOpen(false)}
      >
        <Settings className="h-4 w-4" />
        Settings
      </Link>
    </nav>
  );

  return (
    <div className="flex min-h-screen bg-muted/40">
      {/* Desktop Sidebar */}
      <aside className="hidden border-r bg-background w-64 md:flex md:flex-col">
        <div className="flex h-16 items-center border-b px-6">
          <Link to="/" className="flex items-center gap-2 font-semibold">
            <MapPin className="h-6 w-6 text-primary" />
            <span>RoadWatch</span>
          </Link>
        </div>
        <NavLinks />
        <div className="border-t p-4">
          <Button variant="ghost" className="w-full justify-start gap-3" onClick={handleLogout}>
            <LogOut className="h-4 w-4" />
            Sign Out
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6 justify-between md:justify-end">
          {/* Mobile Menu */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger render={<Button variant="outline" size="icon" className="md:hidden" />}>
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle navigation menu</span>
            </SheetTrigger>
            <SheetContent side="left" className="flex flex-col p-0 w-64">
              <div className="flex h-16 items-center border-b px-6">
                <Link to="/" className="flex items-center gap-2 font-semibold" onClick={() => setIsOpen(false)}>
                  <MapPin className="h-6 w-6 text-primary" />
                  <span>RoadWatch</span>
                </Link>
              </div>
              <NavLinks />
              <div className="border-t p-4">
                <Button variant="ghost" className="w-full justify-start gap-3" onClick={handleLogout}>
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </Button>
              </div>
            </SheetContent>
          </Sheet>

          <div className="flex items-center gap-4">
            <div className="text-sm font-medium">
              {user?.email}
              <span className="ml-2 rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary capitalize">
                {role || 'user'}
              </span>
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 md:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
