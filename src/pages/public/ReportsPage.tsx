import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { format } from 'date-fns';
import { Search, MapPin, Calendar, AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export function ReportsPage() {
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterState, setFilterState] = useState('all');

  useEffect(() => {
    async function fetchReports() {
      setLoading(true);
      let query = supabase
        .from('road_reports')
        .select('*')
        .eq('is_public', true)
        .order('created_at', { ascending: false });

      if (filterState !== 'all') {
        query = query.eq('state_or_territory', filterState);
      }

      if (search) {
        query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%,road_name.ilike.%${search}%`);
      }

      const { data, error } = await query;
      if (data && !error) {
        setReports(data);
      }
      setLoading(false);
    }
    fetchReports();
  }, [search, filterState]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Public Road Reports</h1>
          <p className="text-muted-foreground mt-1">View and track road conditions reported by the community.</p>
        </div>
        <Button asChild>
          <Link to="/report">Submit a New Report</Link>
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search by title, description, or road name..." 
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Select value={filterState} onValueChange={(v) => v && setFilterState(v)}>
          <SelectTrigger className="w-full sm:w-[200px]">
            <SelectValue placeholder="Filter by State" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Locations</SelectItem>
            <SelectItem value="Niger">Niger State</SelectItem>
            <SelectItem value="FCT">Abuja FCT</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {loading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <Card key={i} className="animate-pulse">
              <CardContent className="h-48"></CardContent>
            </Card>
          ))}
        </div>
      ) : reports.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reports.map((report) => (
            <Card key={report.id} className="overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300 border-border/60">
              <div className="h-40 bg-gradient-to-br from-primary/10 via-muted to-secondary flex flex-col items-center justify-center relative group">
                <MapPin className="h-12 w-12 text-primary/30 group-hover:scale-110 transition-transform duration-500" />
                {/* Image will go here if available */}
              </div>
              <CardContent className="p-5">
                <div className="flex justify-between items-start mb-2">
                  <Badge variant="outline" className="capitalize">{report.category.replace('_', ' ')}</Badge>
                  <Badge variant={report.status === 'resolved' ? 'default' : report.status === 'submitted' ? 'secondary' : 'destructive'} className="capitalize">
                    {report.status.replace('_', ' ')}
                  </Badge>
                </div>
                <h3 className="font-semibold text-lg line-clamp-1 mb-2" title={report.title}>{report.title}</h3>
                
                <div className="space-y-2 text-sm text-muted-foreground mb-4">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    <span className="line-clamp-1">{report.road_name || 'No road specified'}, {report.lga_or_area_council}, {report.state_or_territory}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>{format(new Date(report.created_at), 'PPP')}</span>
                  </div>
                </div>

                <Button variant="secondary" className="w-full" asChild>
                  <Link to={`/reports/${report.id}`}>View Details</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-muted/30 rounded-lg border border-dashed">
          <AlertTriangle className="mx-auto h-10 w-10 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-1">No reports found</h3>
          <p className="text-muted-foreground">Try adjusting your search or filters.</p>
        </div>
      )}
    </div>
  );
}
