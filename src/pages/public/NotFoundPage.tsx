import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPinOff, Home, ArrowLeft } from 'lucide-react';

export function NotFoundPage() {
  return (
    <div className="container flex items-center justify-center min-h-[calc(100vh-160px)] py-16 px-4">
      <Card className="w-full max-w-lg shadow-2xl border-muted text-center p-4 md:p-8 backdrop-blur-md">
        <CardHeader className="space-y-4">
          <div className="mx-auto w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center text-primary animate-bounce">
            <MapPinOff className="w-10 h-10" />
          </div>
          <div className="space-y-2">
            <span className="text-xs font-semibold uppercase tracking-widest text-primary bg-primary/10 px-3 py-1 rounded-full">
              404 - Page Not Found
            </span>
            <CardTitle className="text-3xl font-extrabold tracking-tight pt-2">
              Looks like you've taken a wrong turn
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4 text-muted-foreground">
          <p className="text-base">
            The page you are looking for doesn't exist, was moved, or is temporarily unavailable.
          </p>
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
          <Link to="/" className="w-full sm:w-auto">
            <Button variant="default" className="w-full gap-2">
              <Home className="w-4 h-4" /> Go to Home
            </Button>
          </Link>
          <Button variant="outline" className="w-full sm:w-auto gap-2" onClick={() => window.history.back()}>
            <ArrowLeft className="w-4 h-4" /> Go Back
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
