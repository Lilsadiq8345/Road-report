-- Run this to delete the manually inserted test accounts that cause the 500 error
DELETE FROM auth.users WHERE email IN ('admin@road.ng', 'agency@nsmw.gov.ng', 'field@nsmw.gov.ng', 'citizen@gmail.com');
