import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  icon: string;
  color: string;
  sort_order: number;
}

export interface Repository {
  id: string;
  category_id: string;
  name: string;
  owner: string;
  full_name: string;
  description: string | null;
  url: string;
  stars: number;
  language: string | null;
  topics: string[];
  sort_order: number;
  created_at: string;
}

export interface CategoryWithCount extends Category {
  repo_count: number;
}
