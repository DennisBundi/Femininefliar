-- Seed data / dev-only setup for the local Supabase stack.
-- pgTAP is required by supabase/tests/database/*.test.sql (run via `supabase
-- test db`) but is not installed by any migration, since it has no place in
-- the production schema. Installing it here keeps it local-dev-only.
create extension if not exists pgtap with schema extensions;
