-- Trending elegant dresses (Kenya, women 18-35) — 20 products
--
-- Source: current 2026 Kenyan fashion-trend research (midi/satin slip dresses,
-- Ankara & batik prints, corset and off-shoulder silhouettes — see e.g. Jumia
-- Kenya's dress catalog and general 2026 trend coverage) informed the names,
-- styles and descriptions below. Prices (price_kes), stock, units_sold and
-- created_at are randomized placeholders so the catalog looks populated —
-- adjust them to real inventory numbers before this goes live.
--
-- IMAGES: these are NOT scraped from any retailer or boutique — that would
-- reuse photos that don't belong to Feminine Flair and wouldn't depict the
-- actual item in stock. Each `images` value below is a direct hot-link to a
-- freely-licensed Unsplash photo (Unsplash License: free for commercial use,
-- no attribution required) matched to the dress style by description, as a
-- stand-in until Faith has real product photography. Swap every `images`
-- array for real photos of the actual piece as soon as they're available —
-- treat this file as seed/demo data, not a final catalog.
--
-- Usage: run against the local/linked Supabase project after 0001_schema.sql
-- and seed.sql have already been applied (this file only inserts into
-- `products`, which needs the `categories` row for 'Dresses' to already exist).
--   supabase db execute -f supabase/seed_trending_dresses.sql   (local)
--   or paste into the Supabase SQL editor for a hosted project.

insert into products (slug, name, category, price_kes, images, colors, sizes, stock, units_sold, created_at, description) values
  ('zawadi-satin-slip-dress', 'Zawadi Satin Slip Dress', 'Dresses', 4200, '{"https://images.unsplash.com/photo-1533659828870-95ee305cee3e?auto=format&fit=crop&w=1200&q=80"}', '{"#241417","#630625"}', '{"S","M","L","XL"}', 5, 0, '2026-08-17', 'Cowl-neckline satin slip, cut on the bias for a fluid, elegant drape.'),
  ('wanjiru-floral-wrap-dress', 'Wanjiru Floral Wrap Dress', 'Dresses', 2900, '{"https://images.unsplash.com/photo-1616313253719-c46514cddee1?auto=format&fit=crop&w=1200&q=80"}', '{"#241417","#ffffff"}', '{"XS","S","M","L"}', 9, 4, '2026-08-16', 'Long-sleeve floral wrap dress with a tie waist — office-to-evening ready.'),
  ('achieng-corset-bodycon-dress', 'Achieng Corset Bodycon Dress', 'Dresses', 4300, '{"https://images.unsplash.com/photo-1589212987511-4a924cb9d8ac?auto=format&fit=crop&w=1200&q=80"}', '{"#241417"}', '{"XS","S","M","L","XL"}', 19, 2, '2026-08-15', 'Structured corset-seam bodycon in a smooth stretch fabric.'),
  ('neema-little-black-dress', 'Neema Little Black Dress', 'Dresses', 2300, '{"https://images.unsplash.com/photo-1779398968962-b3ad149b57b6?auto=format&fit=crop&w=1200&q=80"}', '{"#241417"}', '{"S","M","L"}', 2, 2, '2026-08-14', 'The classic LBD — fitted silhouette that works for every occasion.'),
  ('mumbi-off-shoulder-evening-gown', 'Mumbi Off-Shoulder Evening Gown', 'Dresses', 2900, '{"https://images.unsplash.com/photo-1765229276796-c93c73cc3f3b?auto=format&fit=crop&w=1200&q=80"}', '{"#630625","#F5B7BD"}', '{"S","M","L"}', 18, 0, '2026-08-13', 'Off-shoulder floor-length gown for weddings and gala nights.'),
  ('baraka-wrap-midi-dress', 'Baraka Wrap Midi Dress', 'Dresses', 4400, '{"https://images.unsplash.com/photo-1637690048998-1e41c61c254d?auto=format&fit=crop&w=1200&q=80"}', '{"#a3401d"}', '{"S","M","L"}', 22, 13, '2026-08-12', 'Sun-warm wrap midi with a flattering asymmetric hem.'),
  ('njeri-pleated-satin-midi-dress', 'Njeri Pleated Satin Midi Dress', 'Dresses', 3600, '{"https://images.unsplash.com/photo-1765229277058-177cd0dead2c?auto=format&fit=crop&w=1200&q=80"}', '{"#241417","#630625"}', '{"XS","S","M","L"}', 20, 8, '2026-08-10', 'Micro-pleated satin midi that catches the light as you move.'),
  ('adhiambo-velvet-cocktail-dress', 'Adhiambo Velvet Cocktail Dress', 'Dresses', 4600, '{"https://images.unsplash.com/photo-1765229278873-edd7918dd31d?auto=format&fit=crop&w=1200&q=80"}', '{"#630625"}', '{"S","M","L","XL"}', 7, 13, '2026-08-09', 'Deep-hued velvet cocktail dress with a fitted bodice.'),
  ('waithera-high-slit-evening-dress', 'Waithera High-Slit Evening Dress', 'Dresses', 3000, '{"https://images.unsplash.com/photo-1765229279946-f265fa703385?auto=format&fit=crop&w=1200&q=80"}', '{"#8a1230"}', '{"S","M","L","XL"}', 6, 6, '2026-08-08', 'Column gown with a dramatic thigh-high slit for red-carpet moments.'),
  ('nyokabi-tiered-maxi-sundress', 'Nyokabi Tiered Maxi Sundress', 'Dresses', 2500, '{"https://images.unsplash.com/photo-1562182856-e39faab686d7?auto=format&fit=crop&w=1200&q=80"}', '{"#ffffff","#a3401d"}', '{"XS","S","M","L"}', 4, 12, '2026-08-06', 'Breezy tiered-ruffle maxi in breathable cotton.'),
  ('chebet-corset-evening-dress', 'Chebet Corset Evening Dress', 'Dresses', 3300, '{"https://images.unsplash.com/photo-1765229277878-954ca3041d90?auto=format&fit=crop&w=1200&q=80"}', '{"#5a3a99"}', '{"XS","S","M","L"}', 13, 8, '2026-08-05', 'Corseted bodice evening dress with a thigh-high slit.'),
  ('moraa-asymmetric-midi-dress', 'Moraa Asymmetric Midi Dress', 'Dresses', 4500, '{"https://images.unsplash.com/photo-1765229282730-0c5cfd5c8575?auto=format&fit=crop&w=1200&q=80"}', '{"#630625","#241417"}', '{"XS","S","M","L","XL"}', 16, 3, '2026-08-03', 'Asymmetric hemline midi, tailored through the waist.'),
  ('kerubo-printed-wrap-dress', 'Kerubo Printed Wrap Dress', 'Dresses', 2400, '{"https://images.unsplash.com/photo-1765229288423-0013fdc66d9f?auto=format&fit=crop&w=1200&q=80"}', '{"#a3401d","#241417"}', '{"S","M","L","XL"}', 19, 9, '2026-08-01', 'Printed wrap dress with a self-tie waist, restaurant-to-rooftop ready.'),
  ('cherotich-cowl-neck-slip-dress', 'Cherotich Cowl Neck Slip Dress', 'Dresses', 4000, '{"https://images.unsplash.com/photo-1765229277389-3a4a0de325c2?auto=format&fit=crop&w=1200&q=80"}', '{"#5a3a99"}', '{"XS","S","M","L"}', 8, 2, '2026-07-30', 'Cowl-neck slip with a thigh-high slit, minimal and modern.'),
  ('akinyi-ankara-wrap-maxi-dress', 'Akinyi Ankara Wrap Maxi Dress', 'Dresses', 4300, '{"https://images.unsplash.com/photo-1628144029346-8a98676311b6?auto=format&fit=crop&w=1200&q=80"}', '{"#a3401d","#ffffff"}', '{"XS","S","M","L"}', 9, 9, '2026-07-28', 'Ankara-print wrap maxi — heritage print, contemporary cut.'),
  ('malaika-ankara-bodycon-dress', 'Malaika Ankara Bodycon Dress', 'Dresses', 4900, '{"https://images.unsplash.com/photo-1709809081557-78f803ce93a0?auto=format&fit=crop&w=1200&q=80"}', '{"#5a3a99","#a3401d"}', '{"XS","S","M","L","XL"}', 9, 3, '2026-07-26', 'Bold Ankara-print bodycon for weddings and Sunday best.'),
  ('jendayi-batik-print-maxi-dress', 'Jendayi Batik Print Maxi Dress', 'Dresses', 3000, '{"https://images.unsplash.com/photo-1784160053635-424cf07f567c?auto=format&fit=crop&w=1200&q=80"}', '{"#630625","#F5B7BD"}', '{"S","M","L"}', 16, 11, '2026-07-24', 'Batik-print maxi with a relaxed, flowing silhouette.'),
  ('amani-ankara-attire-dress', 'Amani Ankara Attire Dress', 'Dresses', 3300, '{"https://images.unsplash.com/photo-1766107349403-673a73ad5cb3?auto=format&fit=crop&w=1200&q=80"}', '{"#a3401d","#630625"}', '{"S","M","L","XL"}', 13, 6, '2026-07-21', 'Traditional-inspired Ankara attire dressed up with statement jewelry.'),
  ('anyango-puff-sleeve-ankara-dress', 'Anyango Puff-Sleeve Ankara Dress', 'Dresses', 4400, '{"https://images.unsplash.com/photo-1778517436072-17faa6f57ca7?auto=format&fit=crop&w=1200&q=80"}', '{"#8a1230","#241417"}', '{"S","M","L"}', 22, 2, '2026-07-19', 'Puff-sleeve Ankara midi — a 2026 runway favourite.'),
  ('nafula-kimono-wrap-dress', 'Nafula Kimono Wrap Dress', 'Dresses', 3900, '{"https://images.unsplash.com/photo-1696962678565-bee84e6b9cb6?auto=format&fit=crop&w=1200&q=80"}', '{"#a3401d","#241417"}', '{"XS","S","M","L","XL"}', 9, 5, '2026-07-17', 'Kimono-sleeve wrap dress, effortlessly elegant.')
on conflict (slug) do nothing;
