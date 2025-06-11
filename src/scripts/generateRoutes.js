import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// ESM __dirname workaround
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env vars
const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY;

// Safety check
if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error('❌ Missing Supabase URL or Anon Key in .env');
  process.exit(1);
}

// Initialize Supabase client
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Query slugs from posts table
const { data: posts, error } = await supabase
  .from('posts') // ← adjust if your table is named differently
  .select('slug');

if (error) {
  console.error('❌ Error fetching posts:', error.message);
  process.exit(1);
}

// Create routes array
const routes = posts.map(post => `/blog/${post.slug}`);

// Write to prerender-routes.json
const outputPath = path.resolve(__dirname, '../../prerender-routes.json');
await fs.writeFile(outputPath, JSON.stringify(routes, null, 2), 'utf-8');

console.log(`✅ Generated ${routes.length} routes to prerender-routes.json`);
