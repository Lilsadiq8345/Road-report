import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/features/auth/AuthContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const CATEGORIES = [
  'pothole', 'flooding', 'blockage', 'accident', 'damaged_surface', 
  'erosion', 'bridge_damage', 'drainage_problem', 'fallen_obstacle', 
  'traffic_hazard', 'streetlight_problem', 'construction_issue', 'other'
];

const SEVERITIES = ['low', 'medium', 'high', 'critical'];

function LocationPicker({ position, setPosition }: { position: [number, number], setPosition: any }) {
  useMapEvents({
    click(e) {
      setPosition([e.latlng.lat, e.latlng.lng]);
    },
  });
  return position ? <Marker position={position}></Marker> : null;
}

export function SubmitReportPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // Form State
  const [category, setCategory] = useState('');
  const [severity, setSeverity] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [stateTerritory, setStateTerritory] = useState('');
  const [lga, setLga] = useState('');
  const [roadName, setRoadName] = useState('');
  const [landmark, setLandmark] = useState('');
  const [position, setPosition] = useState<[number, number]>([9.0820, 8.6753]);

  const handleSubmit = async () => {
    if (!user) {
      toast.error('You must be logged in to submit a report.');
      navigate('/login');
      return;
    }

    setLoading(true);
    try {
      const year = new Date().getFullYear();
      const randomNum = Math.floor(10000 + Math.random() * 90000);
      const reference_number = `RCR-${year}-${randomNum}`; // Basic placeholder until Edge Function is ready

      const { error } = await supabase.from('road_reports').insert({
        reference_number,
        reporter_id: user.id,
        category,
        severity,
        title,
        description,
        state_or_territory: stateTerritory,
        lga_or_area_council: lga,
        road_name: roadName,
        landmark,
        latitude: position[0],
        longitude: position[1],
        is_public: true,
      });

      if (error) throw error;
      
      toast.success(`Report submitted successfully! Reference: ${reference_number}`);
      navigate('/dashboard');
    } catch (err: any) {
      toast.error(err.message || 'Failed to submit report');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container max-w-2xl mx-auto py-12 px-4">
      <Card>
        <CardHeader>
          <CardTitle>Report a Road Issue</CardTitle>
          <CardDescription>Step {step} of 4</CardDescription>
        </CardHeader>
        <CardContent>
          {step === 1 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Issue Category</Label>
                <Select value={category} onValueChange={(v) => v && setCategory(v)}>
                  <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map(c => <SelectItem key={c} value={c} className="capitalize">{c.replace('_', ' ')}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Severity</Label>
                <Select value={severity} onValueChange={(v) => v && setSeverity(v)}>
                  <SelectTrigger><SelectValue placeholder="Select severity" /></SelectTrigger>
                  <SelectContent>
                    {SEVERITIES.map(s => <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Title</Label>
                <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Massive pothole on Main St" />
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Describe the issue in detail..." rows={4} />
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>State or Territory</Label>
                <Select value={stateTerritory} onValueChange={(v) => v && setStateTerritory(v)}>
                  <SelectTrigger><SelectValue placeholder="Select State/FCT" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Niger">Niger State</SelectItem>
                    <SelectItem value="FCT">Abuja FCT</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>LGA / Area Council</Label>
                <Input value={lga} onChange={(e) => setLga(e.target.value)} placeholder="e.g. Chanchaga" />
              </div>
              <div className="space-y-2">
                <Label>Road Name</Label>
                <Input value={roadName} onChange={(e) => setRoadName(e.target.value)} placeholder="e.g. Bosso Road" />
              </div>
              <div className="space-y-2">
                <Label>Landmark</Label>
                <Input value={landmark} onChange={(e) => setLandmark(e.target.value)} placeholder="e.g. Near the Central Mosque" />
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4">
              <Label>Pinpoint Location on Map</Label>
              <div className="h-[300px] w-full rounded-md overflow-hidden border">
                <MapContainer center={position} zoom={13} className="h-full w-full">
                  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                  <LocationPicker position={position} setPosition={setPosition} />
                </MapContainer>
              </div>
              <p className="text-sm text-muted-foreground">Click on the map to place the marker exactly where the issue is.</p>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button 
            variant="outline" 
            onClick={() => step === 1 ? navigate(-1) : setStep(s => Math.max(1, s - 1))} 
            disabled={loading}
          >
            {step === 1 ? 'Cancel' : 'Back'}
          </Button>
          {step < 4 ? (
            <Button onClick={() => setStep(s => Math.min(4, s + 1))}>Next</Button>
          ) : (
            <Button onClick={handleSubmit} disabled={loading}>{loading ? 'Submitting...' : 'Submit Report'}</Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
