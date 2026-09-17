-- Seed Data for Road Condition Reporting Web System

-- Note: In a real app, users are created through Supabase Auth. 
-- For seeding, we'll insert a few mock users if needed, or rely on actual auth signup in demo.
-- Here we insert some Road Agencies.

INSERT INTO road_agencies (id, name, code, description, email, phone, coverage_area, state_or_territory) VALUES
('a1b2c3d4-e5f6-7890-1234-56789abcdef0', 'Niger State Ministry of Works', 'NSMW', 'Responsible for state roads in Niger State', 'contact@nsmw.gov.ng', '08000000001', 'Niger State', 'Niger'),
('b2c3d4e5-f6a7-8901-2345-6789abcdef01', 'FCT Road Maintenance Agency', 'FCT-RMA', 'Responsible for roads within the Federal Capital Territory', 'info@fcrma.gov.ng', '08000000002', 'Abuja', 'FCT'),
('c3d4e5f6-a7b8-9012-3456-789abcdef012', 'Federal Emergency Road Repair', 'FERMA', 'Federal roads maintenance', 'info@ferma.gov.ng', '08000000003', 'Federal Highways', 'National');

-- We can leave other tables empty to be filled by the application or demo Edge Function.
