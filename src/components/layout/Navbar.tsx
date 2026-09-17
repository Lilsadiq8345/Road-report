import { Link } from 'react-router-dom';
import { useAuth } from '@/features/auth/AuthContext';
import { buttonVariants } from '@/components/ui/button';
import { MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Navbar() {
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-50 w-full border-b glass">
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        <Link to="/" className="flex items-center gap-2">
          <MapPin className="h-6 w-6 text-primary" />
          <span className="font-bold text-lg hidden sm:inline-block">
            RoadWatch Niger & FCT
          </span>
        </Link>

        <nav className="hidden md:flex gap-6">
          <Link to="/" className="text-sm font-medium hover:text-primary transition-colors">Home</Link>
          <Link to="/map" className="text-sm font-medium hover:text-primary transition-colors">Live Map</Link>
          <Link to="/reports" className="text-sm font-medium hover:text-primary transition-colors">Public Reports</Link>
        </nav>

        <div className="flex items-center gap-4">
          <Link to="/report" className={cn(buttonVariants({ variant: "default" }), "hidden sm:flex")}>
            Report an Issue
          </Link>

          {user ? (
            <Link to="/dashboard" className={buttonVariants({ variant: "outline" })}>
              Dashboard
            </Link>
          ) : (
            <Link to="/login" className={buttonVariants({ variant: "ghost" })}>
              Sign In
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
