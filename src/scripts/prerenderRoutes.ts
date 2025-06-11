import { createClient } from '@supabase/supabase-js'
import fs from 'fs'

const supabaseUrl = process.env.VITE_SUPABASE_ANON_KEY
const supabaseKey = process.env.VITE_SUPABASE_URL // use secret service key here
const supabase = createClient(supabaseUrl, supabaseKey)

async function generateRoutes() {
  const { data: posts, error } = await supabase.from('posts').select('slug')

  if (error) {
    console.error('Error fetching posts:', error)
    process.exit(1)
  }

  const routes = posts.map(post => `/blog/${post.slug}`)
  fs.writeFileSync('prerender-routes.json', JSON.stringify(routes, null, 2))
  console.log(`✔ Generated ${routes.length} pre-render routes`)
}

generateRoutes()