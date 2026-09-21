import { useRouteError, isRouteErrorResponse, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, Home, RotateCcw } from 'lucide-react';

export function RouteErrorBoundary() {
  const error = useRouteError();

  let title = 'An unexpected error occurred';
  let message = 'Something went wrong while rendering this page.';

  if (isRouteErrorResponse(error)) {
    if (error.status === 404) {
      title = '404 - Page Not Found';
      message = 'The requested route does not exist.';
    } else {
      title = `${error.status} - ${error.statusText}`;
      message = error.data?.message || 'An error occurred while loading this page.';
    }
  } else if (error instanceof Error) {
    message = error.message;
  }

  return (
    <div className="container flex items-center justify-center min-h-screen py-16 px-4 bg-background">
      <Card className="w-full max-w-lg shadow-2xl border-destructive/20 text-center p-4 md:p-8">
        <CardHeader className="space-y-4">
          <div className="mx-auto w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center text-destructive">
            <AlertTriangle className="w-8 h-8" />
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight text-foreground">
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-muted-foreground text-sm">
          <p>{message}</p>
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
          <Link to="/" className="w-full sm:w-auto">
            <Button variant="default" className="w-full gap-2">
              <Home className="w-4 h-4" /> Go to Home Page
            </Button>
          </Link>
          <Button
            variant="outline"
            className="w-full sm:w-auto gap-2"
            onClick={() => window.location.reload()}
          >
            <RotateCcw className="w-4 h-4" /> Reload Page
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
