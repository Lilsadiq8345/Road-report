-- Create extension if not exists for crypt()
CREATE EXTENSION IF NOT EXISTS pgcrypto;

DO $$ 
DECLARE
  admin_id UUID := gen_random_uuid();
  agency_id UUID := gen_random_uuid();
  field_id UUID := gen_random_uuid();
  citizen_id UUID := gen_random_uuid();
  pass_hash TEXT := crypt('password123', gen_salt('bf'));
BEGIN

  -- 1. Insert into auth.users (Admin)
  INSERT INTO auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at, raw_app_meta_data, raw_user_meta_data)
  VALUES (admin_id, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'admin@road.ng', pass_hash, now(), now(), now(), '{"provider":"email","providers":["email"]}', '{}');

  -- 2. Insert into auth.users (Agency Officer)
  INSERT INTO auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at, raw_app_meta_data, raw_user_meta_data)
  VALUES (agency_id, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'agency@nsmw.gov.ng', pass_hash, now(), now(), now(), '{"provider":"email","providers":["email"]}', '{}');

  -- 3. Insert into auth.users (Field Officer)
  INSERT INTO auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at, raw_app_meta_data, raw_user_meta_data)
  VALUES (field_id, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'field@nsmw.gov.ng', pass_hash, now(), now(), now(), '{"provider":"email","providers":["email"]}', '{}');

  -- 4. Insert into auth.users (Citizen)
  INSERT INTO auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at, raw_app_meta_data, raw_user_meta_data)
  VALUES (citizen_id, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'citizen@gmail.com', pass_hash, now(), now(), now(), '{"provider":"email","providers":["email"]}', '{}');


  -- Insert into public.profiles for each user with appropriate roles
  INSERT INTO public.profiles (id, full_name, email, phone, role) VALUES 
  (admin_id, 'Super Admin', 'admin@road.ng', '08000000000', 'admin'),
  (agency_id, 'NSMW Chief Officer', 'agency@nsmw.gov.ng', '08000000001', 'agency_officer'),
  (field_id, 'John Doe (Field Engineer)', 'field@nsmw.gov.ng', '08000000002', 'field_officer'),
  (citizen_id, 'Sadiq Local', 'citizen@gmail.com', '08000000003', 'citizen');

  -- Link the Agency Officer and Field Officer to the Niger State Ministry of Works agency 
  -- (Assuming the agency 'a1b2c3d4-e5f6-7890-1234-56789abcdef0' was created by your seed.sql)
  INSERT INTO public.agency_members (agency_id, user_id, job_title) VALUES 
  ('a1b2c3d4-e5f6-7890-1234-56789abcdef0', agency_id, 'Chief Road Inspector'),
  ('a1b2c3d4-e5f6-7890-1234-56789abcdef0', field_id, 'Maintenance Engineer');

END $$;
