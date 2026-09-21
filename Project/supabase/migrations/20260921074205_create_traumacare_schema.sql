/*
# TraumaCareVR — Profiles & Session History

## Purpose
Stores protected witness profiles (name, case reference) and a log of every
distress-triage check-in (voice or written) so the user can review their
intake history. Auth uses Supabase built-in auth.users; this table holds
the extra profile fields that aren't in auth.users.

## New Tables

1. `profiles`
   - `id` uuid PK, references auth.users, ON DELETE CASCADE
   - `full_name` text — display name / pseudonym
   - `case_id` text — assigned case reference (e.g. CR-2026-WB-092)
   - `created_at` timestamptz default now()

2. `sessions`
   - `id` uuid PK
   - `user_id` uuid FK -> profiles.id, ON DELETE CASCADE, default auth.uid()
   - `intake_mode` text — 'Voice Check-In' | 'Written Report'
   - `score` int — Dynamic Distress Score 0–100
   - `triage` text — triage band label
   - `transcript` text — the statement text evaluated
   - `features` jsonb — extracted bio-acoustic / NLP feature object
   - `created_at` timestamptz default now()

## Security (RLS)
- profiles: owner-scoped CRUD (auth.uid() = id)
- sessions: owner-scoped CRUD (auth.uid() = user_id)
- Both tables: 4 policies each (SELECT/INSERT/UPDATE/DELETE), TO authenticated
- user_id defaults to auth.uid() so inserts from the authenticated client succeed
*/

CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text NOT NULL,
  case_id text NOT NULL DEFAULT 'CR-2026-WB-092',
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_profile" ON profiles;
CREATE POLICY "select_own_profile" ON profiles
  FOR SELECT TO authenticated USING (auth.uid() = id);

DROP POLICY IF EXISTS "insert_own_profile" ON profiles;
CREATE POLICY "insert_own_profile" ON profiles
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "update_own_profile" ON profiles;
CREATE POLICY "update_own_profile" ON profiles
  FOR UPDATE TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "delete_own_profile" ON profiles;
CREATE POLICY "delete_own_profile" ON profiles
  FOR DELETE TO authenticated USING (auth.uid() = id);


CREATE TABLE IF NOT EXISTS sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES profiles(id) ON DELETE CASCADE,
  intake_mode text NOT NULL,
  score int NOT NULL DEFAULT 0,
  triage text NOT NULL,
  transcript text NOT NULL DEFAULT '',
  features jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_sessions" ON sessions;
CREATE POLICY "select_own_sessions" ON sessions
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_sessions" ON sessions;
CREATE POLICY "insert_own_sessions" ON sessions
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_sessions" ON sessions;
CREATE POLICY "update_own_sessions" ON sessions
  FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_sessions" ON sessions;
CREATE POLICY "delete_own_sessions" ON sessions
  FOR DELETE TO authenticated USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_sessions_user_created ON sessions(user_id, created_at DESC);