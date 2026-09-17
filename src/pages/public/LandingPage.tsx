import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { MapPin, AlertTriangle, CheckCircle2, Navigation, Activity } from 'lucide-react';

export function LandingPage() {
  const [stats, setStats] = useState({
    total: 0,
    resolved: 0,
    active: 0,
    states: 2
  });
  
  useEffect(() => {
    async function fetchStats() {
      const { data, error } = await supabase.from('road_reports').select('status, state_or_territory');
      if (data && !error) {
        const uniqueStates = new Set(data.map(r => r.state_or_territory).filter(Boolean));
        
        setStats({
          total: data.length,
          resolved: data.filter(r => ['resolved', 'closed'].includes(r.status)).length,
          active: data.filter(r => ['submitted', 'in_progress', 'under_review', 'verified'].includes(r.status)).length,
          states: Math.max(2, uniqueStates.size) // Defaults to 2 (Niger, FCT)
        });
      }
    }
    fetchStats();
  }, []);

  return (
    <div className="flex flex-col min-h-[calc(100vh-130px)]">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-background pt-16 md:pt-24 lg:pt-32 pb-16">
        <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] dark:bg-grid-slate-700/25 dark:[mask-image:linear-gradient(0deg,rgba(255,255,255,0.1),rgba(255,255,255,0.5))]" />
        <div className="container relative mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 max-w-4xl mx-auto text-foreground">
            Report Road Issues in <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-600">Niger State</span> & <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-600">FCT</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Help us maintain safer roads. Report potholes, flooding, accidents, and more to the authorized road agencies for prompt action.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button size="lg" asChild className="h-12 px-8 text-base">
              <Link to="/report">
                <AlertTriangle className="mr-2 h-5 w-5" />
                Report an Issue
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="h-12 px-8 text-base">
              <Link to="/map">
                <MapPin className="mr-2 h-5 w-5" />
                View Live Map
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-muted/50 border-y">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="flex flex-col items-center p-4">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Activity className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-3xl font-bold">{stats.total}</h3>
              <p className="text-sm text-muted-foreground mt-1">Total Reports</p>
            </div>
            <div className="flex flex-col items-center p-4">
              <div className="h-12 w-12 rounded-full bg-green-500/10 flex items-center justify-center mb-4">
                <CheckCircle2 className="h-6 w-6 text-green-600 dark:text-green-500" />
              </div>
              <h3 className="text-3xl font-bold">{stats.resolved}</h3>
              <p className="text-sm text-muted-foreground mt-1">Issues Resolved</p>
            </div>
            <div className="flex flex-col items-center p-4">
              <div className="h-12 w-12 rounded-full bg-amber-500/10 flex items-center justify-center mb-4">
                <AlertTriangle className="h-6 w-6 text-amber-600 dark:text-amber-500" />
              </div>
              <h3 className="text-3xl font-bold">{stats.active}</h3>
              <p className="text-sm text-muted-foreground mt-1">Active Alerts</p>
            </div>
            <div className="flex flex-col items-center p-4">
              <div className="h-12 w-12 rounded-full bg-blue-500/10 flex items-center justify-center mb-4">
                <Navigation className="h-6 w-6 text-blue-600 dark:text-blue-500" />
              </div>
              <h3 className="text-3xl font-bold">{stats.states}</h3>
              <p className="text-sm text-muted-foreground mt-1">States Covered</p>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card className="border-none shadow-none bg-transparent">
              <CardContent className="pt-6 text-center flex flex-col items-center">
                <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 text-2xl font-bold text-primary">1</div>
                <h3 className="text-xl font-semibold mb-3">Snap & Report</h3>
                <p className="text-muted-foreground">Take a photo of the road issue, select the category, and provide a brief description.</p>
              </CardContent>
            </Card>
            <Card className="border-none shadow-none bg-transparent">
              <CardContent className="pt-6 text-center flex flex-col items-center">
                <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 text-2xl font-bold text-primary">2</div>
                <h3 className="text-xl font-semibold mb-3">Pin the Location</h3>
                <p className="text-muted-foreground">Use your device's GPS or drop a pin on the interactive map to mark the exact spot.</p>
              </CardContent>
            </Card>
            <Card className="border-none shadow-none bg-transparent">
              <CardContent className="pt-6 text-center flex flex-col items-center">
                <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 text-2xl font-bold text-primary">3</div>
                <h3 className="text-xl font-semibold mb-3">Track Progress</h3>
                <p className="text-muted-foreground">Authorities are notified immediately. Track the repair progress from submission to resolution.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
