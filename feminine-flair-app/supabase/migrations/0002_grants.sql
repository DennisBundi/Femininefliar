-- Table-level GRANTs for the API roles.
--
-- This Supabase CLI/platform version no longer auto-exposes newly created
-- public-schema tables to anon/authenticated/service_role via default
-- privileges (see `auto_expose_new_tables` in supabase/config.toml, which
-- documents that the legacy auto-grant behaviour is deprecated). RLS policies
-- alone do not grant access: Postgres requires the underlying table-level
-- GRANT before a role can touch a table at all, evaluated before row
-- security policies ever run. Without these grants every policy defined in
-- 0001_schema.sql is unreachable and anon/service_role get a bare
-- "permission denied" instead of the intended row-level behaviour.
--
-- Grants below mirror the policies in 0001_schema.sql exactly.

-- Catalog tables: public read, matching the "public read ..." policies.
grant select on categories, products, product_variants, reviews to anon, authenticated;

-- Orders/order_items: anon/authenticated can create only, matching the
-- "anyone can create ..." policies. No select/update/delete client-side.
grant insert on orders, order_items to anon, authenticated;

-- service_role has BYPASSRLS but is not a superuser or table owner, so it
-- still needs explicit table privileges to do anything at all. It is the
-- trusted server-side role (webhook, later admin) so gets full access
-- everywhere in this schema.
grant all on all tables in schema public to service_role;
