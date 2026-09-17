# Road Condition Reporting Web System

This project is an academic implementation for Niger State Polytechnic, Zungeru. It provides a central digital platform for citizens to report road problems across Niger State and Abuja, and for authorized road agencies to verify, manage, and resolve those reports.

## Tech Stack
- Frontend: React (Vite), TypeScript, Tailwind CSS v4, shadcn/ui
- Backend: Supabase (Auth, PostgreSQL, Row Level Security, Realtime)
- Mapping: React-Leaflet
- Charts: Recharts

## Test Accounts

The following test accounts have been pre-configured in the database to test the various dashboards and role-based permissions.

**The password for ALL of these accounts is exactly:** `password123`

- **Admin Dashboard**: `admin@road.ng`
- **Citizen Dashboard**: `citizen@gmail.com`

## Running Locally
1. Run `npm install`
2. Configure `.env` with your Supabase credentials
3. Run `npm run dev` to start the local development server
