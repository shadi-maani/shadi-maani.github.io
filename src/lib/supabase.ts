import { createClient } from "@supabase/supabase-js";

export const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase environment variables!");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface DatabaseBlog {
  id: string;
  slug: string;
  title: string;
  description: string;
  content: string;
  tags: string[];
  date: string;
  read_time: string;
  is_published: boolean;
  image_url?: string;
  created_at: string;
}

export interface DatabaseProject {
  id: string;
  slug: string;
  name: string;
  description: string;
  about: string;
  img_src?: string;
  live_link?: string;
  github_link?: string;
  features: string[];
  tech_stack: { name: string; icon: string }[];
  created_at: string;
}
