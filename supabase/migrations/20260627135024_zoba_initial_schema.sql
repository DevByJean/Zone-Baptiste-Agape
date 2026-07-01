/*
# Zone Baptiste Agapé (ZOBA) — Initial Schema

## Overview
Creates all tables needed for the ZOBA public website: leadership members,
activities/events, news, gallery photos, contact messages, newsletter subscribers,
activity registrations, and site settings.

## New Tables

### members
Stores bureau members (CBT president, zone moderator, other leaders).
- id, name, role, photo_url, bio, organization (CBT | Zone), display_order

### activities
Events organised by the zone or a local church, optionally scoped to a department.
- id, title, description, image_url, event_date, location
- department: Tous | Hommes | Femmes | Jeunesse | Enfants
- organizer: Zone | Église

### news
News articles / announcements.
- id, title, excerpt, content, image_url, published_at

### gallery
Photo gallery items, optionally tagged to a department.
- id, image_url, caption, department

### contacts
Messages submitted via the contact form.
- id, name, email, phone, message, created_at, is_read

### subscribers
Newsletter e-mail subscriptions.
- id, email, is_active, created_at

### registrations
Attendee sign-ups for activities.
- id, activity_id (FK → activities), name, email, phone, status, created_at

### donations
Donation records.
- id, amount, currency, payment_method (PayPal | Mixx | Moov), donor_name, donor_email, status, created_at

## Security
- RLS enabled on every table.
- Public site has no sign-in: all policies use TO anon, authenticated so the
  anon-key client can read public data and submit forms.
- contacts, subscribers, registrations, donations allow anon INSERT only.
- members, activities, news, gallery allow anon SELECT only (read-only public).
*/

-- ─── members ─────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS members (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name          text NOT NULL,
  role          text NOT NULL,
  photo_url     text,
  bio           text,
  organization  text NOT NULL DEFAULT 'Zone', -- CBT | Zone
  display_order integer NOT NULL DEFAULT 0,
  created_at    timestamptz DEFAULT now()
);

ALTER TABLE members ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_members" ON members;
CREATE POLICY "public_read_members" ON members FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "admin_insert_members" ON members;
CREATE POLICY "admin_insert_members" ON members FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "admin_update_members" ON members;
CREATE POLICY "admin_update_members" ON members FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "admin_delete_members" ON members;
CREATE POLICY "admin_delete_members" ON members FOR DELETE
  TO authenticated USING (true);

-- ─── activities ───────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS activities (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title       text NOT NULL,
  description text,
  image_url   text,
  event_date  date,
  location    text,
  department  text NOT NULL DEFAULT 'Tous', -- Tous | Hommes | Femmes | Jeunesse | Enfants
  organizer   text NOT NULL DEFAULT 'Zone', -- Zone | Église
  created_at  timestamptz DEFAULT now()
);

ALTER TABLE activities ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_activities" ON activities;
CREATE POLICY "public_read_activities" ON activities FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "admin_insert_activities" ON activities;
CREATE POLICY "admin_insert_activities" ON activities FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "admin_update_activities" ON activities;
CREATE POLICY "admin_update_activities" ON activities FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "admin_delete_activities" ON activities;
CREATE POLICY "admin_delete_activities" ON activities FOR DELETE
  TO authenticated USING (true);

-- ─── news ─────────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS news (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title        text NOT NULL,
  excerpt      text,
  content      text,
  image_url    text,
  published_at timestamptz DEFAULT now(),
  created_at   timestamptz DEFAULT now()
);

ALTER TABLE news ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_news" ON news;
CREATE POLICY "public_read_news" ON news FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "admin_insert_news" ON news;
CREATE POLICY "admin_insert_news" ON news FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "admin_update_news" ON news;
CREATE POLICY "admin_update_news" ON news FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "admin_delete_news" ON news;
CREATE POLICY "admin_delete_news" ON news FOR DELETE
  TO authenticated USING (true);

-- ─── gallery ──────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS gallery (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  image_url  text NOT NULL,
  caption    text,
  department text DEFAULT 'Tous',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE gallery ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_gallery" ON gallery;
CREATE POLICY "public_read_gallery" ON gallery FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "admin_insert_gallery" ON gallery;
CREATE POLICY "admin_insert_gallery" ON gallery FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "admin_update_gallery" ON gallery;
CREATE POLICY "admin_update_gallery" ON gallery FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "admin_delete_gallery" ON gallery;
CREATE POLICY "admin_delete_gallery" ON gallery FOR DELETE
  TO authenticated USING (true);

-- ─── contacts ─────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS contacts (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name       text NOT NULL,
  email      text NOT NULL,
  phone      text,
  message    text NOT NULL,
  is_read    boolean NOT NULL DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_insert_contacts" ON contacts;
CREATE POLICY "anon_insert_contacts" ON contacts FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "admin_read_contacts" ON contacts;
CREATE POLICY "admin_read_contacts" ON contacts FOR SELECT
  TO authenticated USING (true);

DROP POLICY IF EXISTS "admin_update_contacts" ON contacts;
CREATE POLICY "admin_update_contacts" ON contacts FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

-- ─── subscribers ──────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS subscribers (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email      text UNIQUE NOT NULL,
  is_active  boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE subscribers ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_insert_subscribers" ON subscribers;
CREATE POLICY "anon_insert_subscribers" ON subscribers FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "admin_read_subscribers" ON subscribers;
CREATE POLICY "admin_read_subscribers" ON subscribers FOR SELECT
  TO authenticated USING (true);

DROP POLICY IF EXISTS "admin_update_subscribers" ON subscribers;
CREATE POLICY "admin_update_subscribers" ON subscribers FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "admin_delete_subscribers" ON subscribers;
CREATE POLICY "admin_delete_subscribers" ON subscribers FOR DELETE
  TO authenticated USING (true);

-- ─── registrations ────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS registrations (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  activity_id uuid NOT NULL REFERENCES activities(id) ON DELETE CASCADE,
  name        text NOT NULL,
  email       text NOT NULL,
  phone       text,
  status      text NOT NULL DEFAULT 'pending', -- pending | confirmed | cancelled
  created_at  timestamptz DEFAULT now()
);

ALTER TABLE registrations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_insert_registrations" ON registrations;
CREATE POLICY "anon_insert_registrations" ON registrations FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "admin_read_registrations" ON registrations;
CREATE POLICY "admin_read_registrations" ON registrations FOR SELECT
  TO authenticated USING (true);

DROP POLICY IF EXISTS "admin_update_registrations" ON registrations;
CREATE POLICY "admin_update_registrations" ON registrations FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "admin_delete_registrations" ON registrations;
CREATE POLICY "admin_delete_registrations" ON registrations FOR DELETE
  TO authenticated USING (true);

-- ─── donations ────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS donations (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  amount         numeric(10,2) NOT NULL,
  currency       text NOT NULL DEFAULT 'XOF',
  payment_method text NOT NULL DEFAULT 'PayPal', -- PayPal | Mixx | Moov
  donor_name     text,
  donor_email    text,
  status         text NOT NULL DEFAULT 'pending', -- pending | completed | failed
  created_at     timestamptz DEFAULT now()
);

ALTER TABLE donations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_insert_donations" ON donations;
CREATE POLICY "anon_insert_donations" ON donations FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "admin_read_donations" ON donations;
CREATE POLICY "admin_read_donations" ON donations FOR SELECT
  TO authenticated USING (true);

DROP POLICY IF EXISTS "admin_update_donations" ON donations;
CREATE POLICY "admin_update_donations" ON donations FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

-- ─── seed data ────────────────────────────────────────────────────────────────

INSERT INTO members (name, role, organization, bio, display_order) VALUES
  ('Pasteur Jean-Pierre Kokou', 'Président CBT', 'CBT', 'Pasteur principal de la Convention Baptiste du Togo, visionnaire et serviteur de Dieu depuis plus de 20 ans.', 1),
  ('Pasteur Emmanuel Agbessi', 'Modérateur de Zone', 'Zone', 'Responsable de la Zone Baptiste Agapé, coordinateur des activités zonales et des relations inter-églises.', 2),
  ('Frère Samuel Mensah', 'Secrétaire de Zone', 'Zone', 'Administrateur principal de la zone, garant de la bonne organisation et du suivi des activités.', 3),
  ('Sœur Marie Akpan', 'Trésorière', 'Zone', 'Responsable de la gestion financière et de la transparence des ressources de la zone.', 4)
ON CONFLICT DO NOTHING;

INSERT INTO activities (title, description, event_date, location, department, organizer) VALUES
  ('Culte d''Adoration Zonale', 'Un temps fort de louange et d''adoration réunissant toutes les églises de la zone pour un culte mémorable.', CURRENT_DATE + 7, 'Église Centrale de la Zone', 'Tous', 'Zone'),
  ('Retraite des Hommes', 'Retraite spirituelle dédiée aux hommes de la zone pour un approfondissement de la foi et de la fraternité.', CURRENT_DATE + 14, 'Centre de Retraite Getsémané', 'Hommes', 'Zone'),
  ('Conférence des Femmes', 'Conférence annuelle des femmes baptistes, thème: "Femmes d''influence pour Dieu".', CURRENT_DATE + 21, 'Salle Polyvalente de la Zone', 'Femmes', 'Zone'),
  ('Camp des Jeunes', 'Camp annuel de la jeunesse baptiste avec ateliers, sports et enseignements bibliques.', CURRENT_DATE + 30, 'Campus Agapé', 'Jeunesse', 'Zone')
ON CONFLICT DO NOTHING;

INSERT INTO news (title, excerpt, content, published_at) VALUES
  ('Bilan de l''Assemblée Générale Annuelle', 'La Zone Baptiste Agapé a tenu avec succès son assemblée générale annuelle sous la direction du Modérateur de Zone.', 'L''assemblée générale annuelle de la Zone Baptiste Agapé s''est tenue dans une atmosphère fraternelle et spirituelle. Les membres du bureau ont présenté les bilans financiers et moraux de l''exercice écoulé...', NOW() - INTERVAL '5 days'),
  ('Inauguration du Nouveau Local de la Zone', 'La zone dispose désormais d''un espace de travail moderne pour mieux servir les églises membres.', 'Avec la grâce de Dieu et le soutien fidèle des membres, la Zone Baptiste Agapé a inauguré son nouveau local administratif...', NOW() - INTERVAL '15 days'),
  ('Appel aux Dons pour le Projet d''École', 'La zone lance une campagne de collecte de fonds pour la construction d''une école chrétienne dans la communauté.', 'Dans le cadre de son engagement social et éducatif, la Zone Baptiste Agapé lance une campagne de dons pour construire une école...', NOW() - INTERVAL '25 days')
ON CONFLICT DO NOTHING;

INSERT INTO gallery (image_url, caption, department) VALUES
  ('https://images.pexels.com/photos/8468470/pexels-photo-8468470.jpeg', 'Culte de louange zonale', 'Tous'),
  ('https://images.pexels.com/photos/8468473/pexels-photo-8468473.jpeg', 'Réunion de prière des femmes', 'Femmes'),
  ('https://images.pexels.com/photos/1666816/pexels-photo-1666816.jpeg', 'Camp des jeunes 2024', 'Jeunesse'),
  ('https://images.pexels.com/photos/3184416/pexels-photo-3184416.jpeg', 'Retraite des hommes', 'Hommes'),
  ('https://images.pexels.com/photos/8468471/pexels-photo-8468471.jpeg', 'Assemblée générale', 'Tous'),
  ('https://images.pexels.com/photos/3184432/pexels-photo-3184432.jpeg', 'Équipe de direction', 'Tous')
ON CONFLICT DO NOTHING;
