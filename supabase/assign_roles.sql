-- Run this script AFTER you sign up through the website

-- 1. Make someone an Admin
UPDATE public.profiles
SET role = 'admin'
WHERE email = 'admin@road.ng';

-- 2. Make someone an Agency Officer
UPDATE public.profiles
SET role = 'agency_officer'
WHERE email = 'agency@nsmw.gov.ng';

-- 3. Make someone a Field Officer
UPDATE public.profiles
SET role = 'field_officer'
WHERE email = 'field@nsmw.gov.ng';
