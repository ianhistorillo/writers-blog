import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';
import fs from 'node:fs/promises';

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error('Missing Supabase URL or Anon Key');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function generate() {
  const { data: posts, error } = await supabase.from('posts').select('slug');

  if (error) {
    console.error('Error fetching posts:', error.message);
    process.exit(1);
  }

  const routes = posts.map(post => `/blog/${post.slug}/`);
  routes.unshift('/'); // add homepage

  await fs.writeFile('react-snap-routes.json', JSON.stringify(routes, null, 2));

  console.log(`Generated ${routes.length} routes for React Snap.`);
}

generate();
