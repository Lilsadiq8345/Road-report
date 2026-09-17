-- Create enums
CREATE TYPE user_role AS ENUM ('citizen', 'agency_officer', 'field_officer', 'admin');
CREATE TYPE report_category AS ENUM (
  'pothole', 'flooding', 'blockage', 'accident', 'damaged_surface', 
  'erosion', 'bridge_damage', 'drainage_problem', 'fallen_obstacle', 
  'traffic_hazard', 'streetlight_problem', 'construction_issue', 'other'
);
CREATE TYPE report_severity AS ENUM ('low', 'medium', 'high', 'critical');
CREATE TYPE report_priority AS ENUM ('normal', 'urgent', 'emergency');
CREATE TYPE report_status AS ENUM (
  'submitted', 'under_review', 'verified', 'assigned', 
  'in_progress', 'resolved', 'closed', 'rejected', 'duplicate'
);

-- Profiles Table
CREATE TABLE profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text NOT NULL,
  email text,
  phone text,
  avatar_url text,
  role user_role NOT NULL DEFAULT 'citizen',
  is_active boolean DEFAULT true,
  notification_email_enabled boolean DEFAULT true,
  notification_in_app_enabled boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Road Agencies Table
CREATE TABLE road_agencies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  code text UNIQUE,
  description text,
  email text,
  phone text,
  coverage_area text,
  state_or_territory text,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Agency Members Table
CREATE TABLE agency_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  agency_id uuid REFERENCES road_agencies(id) ON DELETE CASCADE,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  job_title text,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  UNIQUE(agency_id, user_id)
);

-- Road Reports Table
CREATE TABLE road_reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reference_number text UNIQUE NOT NULL,
  reporter_id uuid REFERENCES profiles(id) ON DELETE SET NULL,
  agency_id uuid REFERENCES road_agencies(id) ON DELETE SET NULL,
  assigned_officer_id uuid REFERENCES profiles(id) ON DELETE SET NULL,
  title text NOT NULL,
  description text NOT NULL,
  category report_category NOT NULL,
  severity report_severity NOT NULL DEFAULT 'medium',
  priority report_priority NOT NULL DEFAULT 'normal',
  status report_status NOT NULL DEFAULT 'submitted',
  state_or_territory text NOT NULL,
  lga_or_area_council text,
  road_name text,
  landmark text,
  latitude numeric(10,7) NOT NULL,
  longitude numeric(10,7) NOT NULL,
  location_accuracy numeric(10,2),
  is_public boolean DEFAULT true,
  is_anonymous boolean DEFAULT false,
  rejection_reason text,
  resolution_note text,
  resolved_at timestamptz,
  closed_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Report Images Table
CREATE TABLE report_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  report_id uuid REFERENCES road_reports(id) ON DELETE CASCADE,
  uploaded_by uuid REFERENCES profiles(id) ON DELETE SET NULL,
  image_url text NOT NULL,
  storage_path text NOT NULL,
  image_type text NOT NULL,
  caption text,
  created_at timestamptz DEFAULT now()
);

-- Report Updates Table
CREATE TABLE report_updates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  report_id uuid REFERENCES road_reports(id) ON DELETE CASCADE,
  author_id uuid REFERENCES profiles(id) ON DELETE SET NULL,
  previous_status report_status,
  new_status report_status,
  message text,
  is_public boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Report Assignments Table
CREATE TABLE report_assignments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  report_id uuid REFERENCES road_reports(id) ON DELETE CASCADE,
  agency_id uuid REFERENCES road_agencies(id) ON DELETE SET NULL,
  assigned_to uuid REFERENCES profiles(id) ON DELETE SET NULL,
  assigned_by uuid REFERENCES profiles(id) ON DELETE SET NULL,
  assignment_note text,
  created_at timestamptz DEFAULT now()
);

-- Comments Table
CREATE TABLE comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  report_id uuid REFERENCES road_reports(id) ON DELETE CASCADE,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  content text NOT NULL,
  is_public boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Notifications Table
CREATE TABLE notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  report_id uuid REFERENCES road_reports(id) ON DELETE CASCADE,
  title text NOT NULL,
  message text NOT NULL,
  type text NOT NULL,
  is_read boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Report Confirmations Table
CREATE TABLE report_confirmations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  report_id uuid REFERENCES road_reports(id) ON DELETE CASCADE,
  citizen_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  is_issue_fixed boolean,
  feedback text,
  created_at timestamptz DEFAULT now()
);

-- Audit Logs Table
CREATE TABLE audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id uuid REFERENCES profiles(id) ON DELETE SET NULL,
  action text NOT NULL,
  entity_type text NOT NULL,
  entity_id uuid,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now()
);

-- Indexes
CREATE INDEX idx_road_reports_status ON road_reports(status);
CREATE INDEX idx_road_reports_category ON road_reports(category);
CREATE INDEX idx_road_reports_severity ON road_reports(severity);
CREATE INDEX idx_road_reports_priority ON road_reports(priority);
CREATE INDEX idx_road_reports_state_territory ON road_reports(state_or_territory);
CREATE INDEX idx_road_reports_agency_id ON road_reports(agency_id);
CREATE INDEX idx_road_reports_reporter_id ON road_reports(reporter_id);
CREATE INDEX idx_road_reports_assigned_officer_id ON road_reports(assigned_officer_id);
CREATE INDEX idx_road_reports_created_at ON road_reports(created_at);
CREATE INDEX idx_report_updates_report_id ON report_updates(report_id);
CREATE INDEX idx_report_images_report_id ON report_images(report_id);
CREATE INDEX idx_notifications_user_id_is_read ON notifications(user_id, is_read);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE road_agencies ENABLE ROW LEVEL SECURITY;
ALTER TABLE agency_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE road_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE report_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE report_updates ENABLE ROW LEVEL SECURITY;
ALTER TABLE report_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE report_confirmations ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies Examples (Basic Structure, will refine further)
-- Profiles
CREATE POLICY "Public profiles are viewable by everyone." ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can insert their own profile." ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own profile." ON profiles FOR UPDATE USING (auth.uid() = id);

-- Road Reports
CREATE POLICY "Reports are viewable by everyone if public." ON road_reports FOR SELECT USING (is_public = true OR auth.uid() = reporter_id);
CREATE POLICY "Citizens can insert reports." ON road_reports FOR INSERT WITH CHECK (auth.uid() = reporter_id);
CREATE POLICY "Citizens can update own reports if submitted." ON road_reports FOR UPDATE USING (auth.uid() = reporter_id AND status = 'submitted');

-- Realtime Configuration
alter publication supabase_realtime add table road_reports;
alter publication supabase_realtime add table report_updates;
alter publication supabase_realtime add table notifications;
