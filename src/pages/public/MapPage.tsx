import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { supabase } from '@/lib/supabase';

import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

// Fix for default marker icon in react-leaflet
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

const NIGER_FCT_CENTER = [9.0820, 8.6753] as [number, number]; // Approx center

export function MapPage() {
  const [reports, setReports] = useState<any[]>([]);

  useEffect(() => {
    async function fetchReports() {
      const { data, error } = await supabase
        .from('road_reports')
        .select('id, title, category, severity, status, latitude, longitude, created_at, state_or_territory')
        .eq('is_public', true)
        .order('created_at', { ascending: false });

      if (data && !error) {
        setReports(data);
      }
    }
    fetchReports();
  }, []);

  return (
    <div className="flex flex-col h-[calc(100vh-64px)]">
      <div className="bg-muted p-4 border-b flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold">Live Road Map</h1>
          <p className="text-sm text-muted-foreground">View all reported road issues across Niger State and Abuja.</p>
        </div>
        <Button asChild>
          <Link to="/report">Report Issue here</Link>
        </Button>
      </div>
      <div className="flex-1 w-full relative z-0">
        <MapContainer center={NIGER_FCT_CENTER} zoom={8} scrollWheelZoom={true} className="h-full w-full">
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {reports.map((report) => (
            <Marker key={report.id} position={[report.latitude, report.longitude]}>
              <Popup>
                <div className="min-w-[200px]">
                  <h3 className="font-semibold mb-1">{report.title}</h3>
                  <div className="flex gap-2 mb-2">
                    <Badge variant="outline" className="capitalize text-xs">{report.category.replace('_', ' ')}</Badge>
                    <Badge className="capitalize text-xs" variant={report.severity === 'critical' ? 'destructive' : 'default'}>{report.severity}</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mb-3">
                    {format(new Date(report.created_at), 'PPP')} • {report.state_or_territory}
                  </p>
                  <Button size="sm" className="w-full h-8 text-xs" asChild>
                    <Link to={`/reports/${report.id}`}>View Details</Link>
                  </Button>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
}
