import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function cleanup() {
  const { data: properties, error } = await supabase.from('properties').select('id, title, images, is_featured');
  if (error) {
    console.error(error);
    return;
  }

  const toDelete = [];
  for (const p of properties) {
    let bad = false;
    for (const img of p.images) {
      if (img.includes('picsum.photos')) {
        bad = true;
      }
    }
    if (bad) {
      toDelete.push(p.id);
    }
  }

  console.log(`Found ${toDelete.length} properties with picsum images to delete.`);
  
  if (toDelete.length > 0) {
    // Delete in batches or one by one
    for (const id of toDelete) {
      await supabase.from('properties').delete().eq('id', id);
    }
    console.log("Deleted picsum properties.");
  }
}

cleanup();
