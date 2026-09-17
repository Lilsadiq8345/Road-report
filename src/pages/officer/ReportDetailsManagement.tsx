import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/features/auth/AuthContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { format } from 'date-fns';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { toast } from 'sonner';
import { ArrowLeft, Calendar, User as UserIcon, Tag, AlertTriangle } from 'lucide-react';

export function ReportDetailsManagement() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, role } = useAuth();
  
  const [report, setReport] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  // Update state
  const [newStatus, setNewStatus] = useState('');
  const [newPriority, setNewPriority] = useState('');
  const [newSeverity, setNewSeverity] = useState('');
  const [updateMessage, setUpdateMessage] = useState('');
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    async function fetchReportDetails() {
      setLoading(true);
      const { data, error } = await supabase
        .from('road_reports')
        .select('*')
        .eq('id', id)
        .single();

      if (data && !error) {
        setReport(data);
        setNewStatus(data.status);
        setNewPriority(data.priority);
        setNewSeverity(data.severity);
      } else {
        toast.error("Could not load report details.");
        navigate('/dashboard/reports');
      }
      setLoading(false);
    }
    if (id) fetchReportDetails();
  }, [id, navigate]);

  const handleUpdate = async () => {
    if (!report || !user) return;
    setUpdating(true);
    try {
      const { error: updateError } = await supabase
        .from('road_reports')
        .update({
          status: newStatus,
          priority: newPriority,
          severity: newSeverity,
        })
        .eq('id', report.id);

      if (updateError) throw updateError;

      if (updateMessage.trim()) {
        const { error: msgError } = await supabase
          .from('report_updates')
          .insert({
            report_id: report.id,
            author_id: user.id,
            previous_status: report.status,
            new_status: newStatus,
            message: updateMessage,
          });
        if (msgError) throw msgError;
      }

      toast.success("Report updated successfully");
      setTimeout(() => {
        navigate(-1);
      }, 500);
    } catch (err: any) {
      toast.error(err.message || 'Failed to update report');
    } finally {
      setUpdating(false);
    }
  };

  const handleConfirmResolution = async (isFixed: boolean) => {
    if (!report || !user) return;
    setUpdating(true);
    try {
      const newStatus = isFixed ? 'closed' : 'in_progress';
      const { error } = await supabase
        .from('road_reports')
        .update({
          is_issue_fixed_confirmed: isFixed,
          status: newStatus,
        })
        .eq('id', report.id);

      if (error) throw error;

      if (!isFixed) {
        await supabase.from('report_updates').insert({
          report_id: report.id,
          author_id: user.id,
          previous_status: 'resolved',
          new_status: 'in_progress',
          message: 'Citizen reported the issue is not fully fixed yet.',
        });
      }
      
      toast.success(isFixed ? "Thank you for confirming!" : "We've reopened the report for further action.");
      setTimeout(() => {
        navigate(-1);
      }, 500);
    } catch (err: any) {
      toast.error(err.message || 'Failed to update report');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <div className="p-8 text-center">Loading report details...</div>;
  if (!report) return null;

  const isOfficer = role === 'admin';
  const canUpdate = isOfficer; // Simplified permission check

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Report: {report.reference_number}</h1>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Details & Map */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-xl">{report.title}</CardTitle>
                  <CardDescription className="flex items-center gap-2 mt-1">
                    <Calendar className="h-4 w-4" />
                    {format(new Date(report.created_at), 'PPP at p')}
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Badge variant="outline" className="capitalize">{report.category.replace('_', ' ')}</Badge>
                  <Badge variant="secondary" className="capitalize">{report.status.replace('_', ' ')}</Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-medium text-sm text-muted-foreground mb-1">Description</h3>
                <p className="whitespace-pre-wrap">{report.description}</p>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t">
                <div>
                  <h3 className="font-medium text-sm text-muted-foreground flex items-center gap-1"><AlertTriangle className="h-4 w-4"/> Severity</h3>
                  <p className="capitalize font-medium">{report.severity}</p>
                </div>
                <div>
                  <h3 className="font-medium text-sm text-muted-foreground flex items-center gap-1"><Tag className="h-4 w-4"/> Priority</h3>
                  <p className="capitalize font-medium">{report.priority}</p>
                </div>
                <div className="col-span-2">
                  <h3 className="font-medium text-sm text-muted-foreground flex items-center gap-1"><UserIcon className="h-4 w-4"/> Location</h3>
                  <p className="font-medium truncate">{report.road_name || 'N/A'}, {report.lga_or_area_council}, {report.state_or_territory}</p>
                </div>
              </div>

              <div className="h-[300px] rounded-md overflow-hidden border mt-4">
                <MapContainer center={[report.latitude, report.longitude]} zoom={15} className="h-full w-full">
                  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                  <Marker position={[report.latitude, report.longitude]} />
                </MapContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Actions / Updates */}
        <div className="space-y-6">
          {canUpdate && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Update Report</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Status</label>
                  <Select value={newStatus} onValueChange={(v) => v && setNewStatus(v)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="submitted">Submitted</SelectItem>
                      <SelectItem value="under_review">Under Review</SelectItem>
                      <SelectItem value="verified">Verified</SelectItem>
                      <SelectItem value="assigned">Assigned</SelectItem>
                      <SelectItem value="in_progress">In Progress</SelectItem>
                      <SelectItem value="resolved">Resolved</SelectItem>
                      <SelectItem value="closed">Closed</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                      <SelectItem value="duplicate">Duplicate</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Severity</label>
                    <Select value={newSeverity} onValueChange={(v) => v && setNewSeverity(v)}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="critical">Critical</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Priority</label>
                    <Select value={newPriority} onValueChange={(v) => v && setNewPriority(v)}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="normal">Normal</SelectItem>
                        <SelectItem value="urgent">Urgent</SelectItem>
                        <SelectItem value="emergency">Emergency</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Official Update Note</label>
                  <Textarea 
                    placeholder="Add progress note or repair details..." 
                    value={updateMessage}
                    onChange={(e) => setUpdateMessage(e.target.value)}
                  />
                </div>
                
                <Button className="w-full" onClick={handleUpdate} disabled={updating}>
                  {updating ? 'Saving...' : 'Save Updates'}
                </Button>
              </CardContent>
            </Card>
          )}

          {report.status === 'resolved' && user?.id === report.reporter_id && !report.is_issue_fixed_confirmed && (
            <Card className="bg-green-500/10 border-green-500/20">
              <CardHeader>
                <CardTitle className="text-lg text-green-700 dark:text-green-500">Confirm Resolution</CardTitle>
                <CardDescription>The agency marked this issue as resolved. Is it fixed?</CardDescription>
              </CardHeader>
              <CardContent className="flex gap-2">
                <Button onClick={() => handleConfirmResolution(true)} disabled={updating} className="flex-1 bg-green-600 hover:bg-green-700">Yes, it's fixed</Button>
                <Button onClick={() => handleConfirmResolution(false)} disabled={updating} variant="outline" className="flex-1 text-destructive border-destructive hover:bg-destructive/10">No, not fixed</Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
