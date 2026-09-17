import { Link } from 'react-router-dom';
import { MapPin } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t glass">
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <MapPin className="h-6 w-6 text-primary" />
              <span className="font-bold text-lg">RoadWatch Niger & FCT</span>
            </Link>
            <p className="text-sm text-muted-foreground max-w-sm leading-relaxed">
              A central digital platform for citizens to report road conditions and for authorized agencies to verify, prioritize, and resolve road issues across Niger State and Abuja.
            </p>
          </div>
          
          <div>
            <h3 className="font-medium mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/map" className="hover:text-foreground transition-colors">Live Map</Link></li>
              <li><Link to="/reports" className="hover:text-foreground transition-colors">Public Reports</Link></li>
              <li><Link to="/report" className="hover:text-foreground transition-colors">Report an Issue</Link></li>
              <li><Link to="/login" className="hover:text-foreground transition-colors">Sign In</Link></li>
            </ul>
          </div>
          

        </div>
        
        <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} Road Condition Reporting Web System. Academic Project.</p>
        </div>
      </div>
    </footer>
  );
}
