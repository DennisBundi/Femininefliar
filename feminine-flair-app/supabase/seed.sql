-- Seed data / dev-only setup for the local Supabase stack.
-- pgTAP is required by supabase/tests/database/*.test.sql (run via `supabase
-- test db`) but is not installed by any migration, since it has no place in
-- the production schema. Installing it here keeps it local-dev-only.
create extension if not exists pgtap with schema extensions;

insert into categories (name, slug) values
  ('Dresses', 'dresses'),
  ('Tops & Blouses', 'tops-blouses'),
  ('Bottoms', 'bottoms'),
  ('Outerwear', 'outerwear'),
  ('Shoes & Bags', 'shoes-bags'),
  ('Jewelry', 'jewelry')
on conflict (name) do nothing;

insert into products (slug, name, category, price_kes, colors, sizes, stock, units_sold, created_at) values
  ('amara-wrap-dress', 'Amara Wrap Dress', 'Dresses', 3200, '{"#630625","#F5B7BD"}', '{"S","M","L"}', 12, 8, '2026-08-01'),
  ('zuri-ankara-top', 'Zuri Ankara Top', 'Tops & Blouses', 1900, '{"#241417"}', '{"XS","S","M","L","XL"}', 3, 5, '2026-07-30'),
  ('nia-beaded-clutch', 'Nia Beaded Clutch', 'Shoes & Bags', 1800, '{"#F5B7BD"}', '{}', 20, 3, '2026-07-29'),
  ('layla-palazzo-set', 'Layla Palazzo Set', 'Bottoms', 3600, '{"#241417","#ffffff"}', '{"S","M","L","XL"}', 2, 11, '2026-07-26'),
  ('imani-trench-coat', 'Imani Trench Coat', 'Outerwear', 5400, '{"#630625"}', '{"S","M","L","XL"}', 6, 4, '2026-07-24'),
  ('sana-block-heels', 'Sana Block Heels', 'Shoes & Bags', 2900, '{"#241417"}', '{}', 4, 6, '2026-07-20'),
  ('riziki-hoop-earrings', 'Riziki Hoop Earrings', 'Jewelry', 950, '{"#F5B7BD"}', '{}', 15, 9, '2026-07-18'),
  ('furaha-midi-skirt', 'Furaha Midi Skirt', 'Bottoms', 2400, '{"#ffffff","#241417"}', '{"S","M","L"}', 9, 2, '2026-07-15')
on conflict (slug) do nothing;
