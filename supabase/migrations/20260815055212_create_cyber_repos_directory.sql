/*
# Cyber Security Repository Directory

Creates a public directory of curated GitHub repositories focused on
cyber security, ethical hacking, and cyber forensics.

## New Tables

### categories
- `id` (uuid, PK)
- `name` (text, not null) — display name e.g. "Penetration Testing"
- `slug` (text, unique, not null) — URL-safe key e.g. "penetration-testing"
- `description` (text) — short description of the category
- `icon` (text) — lucide-react icon name for the category
- `color` (text) — tailwind color theme for the category accent
- `sort_order` (int, default 0) — display ordering

### repositories
- `id` (uuid, PK)
- `category_id` (uuid, FK -> categories.id)
- `name` (text, not null) — repository name
- `owner` (text, not null) — GitHub owner/org
- `full_name` (text, not null) — "owner/repo"
- `description` (text) — repo description
- `url` (text, not null) — full GitHub URL
- `stars` (bigint, default 0) — star count
- `language` (text) — primary language
- `topics` (text[]) — tags/topics
- `sort_order` (int, default 0)
- `created_at` (timestamptz, default now())

## Security
- RLS enabled on both tables.
- This is a public, no-auth directory — anon + authenticated can read.
- Writes are also open to anon/authenticated since this is a shared public catalog.
*/

CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text,
  icon text NOT NULL DEFAULT 'Folder',
  color text NOT NULL DEFAULT 'blue',
  sort_order int NOT NULL DEFAULT 0
);

ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_categories" ON categories;
CREATE POLICY "anon_select_categories" ON categories FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_categories" ON categories;
CREATE POLICY "anon_insert_categories" ON categories FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_categories" ON categories;
CREATE POLICY "anon_update_categories" ON categories FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_categories" ON categories;
CREATE POLICY "anon_delete_categories" ON categories FOR DELETE
  TO anon, authenticated USING (true);

CREATE TABLE IF NOT EXISTS repositories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id uuid REFERENCES categories(id) ON DELETE CASCADE,
  name text NOT NULL,
  owner text NOT NULL,
  full_name text NOT NULL,
  description text,
  url text NOT NULL,
  stars bigint NOT NULL DEFAULT 0,
  language text,
  topics text[] DEFAULT '{}',
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE repositories ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_repositories" ON repositories;
CREATE POLICY "anon_select_repositories" ON repositories FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_repositories" ON repositories;
CREATE POLICY "anon_insert_repositories" ON repositories FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_repositories" ON repositories;
CREATE POLICY "anon_update_repositories" ON repositories FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_repositories" ON repositories;
CREATE POLICY "anon_delete_repositories" ON repositories FOR DELETE
  TO anon, authenticated USING (true);

CREATE INDEX IF NOT EXISTS idx_repositories_category_id ON repositories(category_id);
CREATE INDEX IF NOT EXISTS idx_repositories_stars ON repositories(stars DESC);
CREATE INDEX IF NOT EXISTS idx_repositories_full_name ON repositories(full_name);
