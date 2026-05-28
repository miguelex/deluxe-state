import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const BAD_URLS = [
  "https://images.unsplash.com/photo-1600566753086-00f18efc2291?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1600585154526-990dced4ea0d?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1505843513577-22bb7abd16ea?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1521021469032-15f16ff36be9?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1600607688969-a5bfcd64bd2b?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1605276374104-5d4fd73b4d8f?auto=format&fit=crop&w=800&q=80"
];

const GOOD_URLS = [
  "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?auto=format&fit=crop&w=800&q=80"
];

async function fix() {
  const { data: properties, error } = await supabase.from('properties').select('id, images');
  if (error) {
    console.error(error);
    return;
  }

  let updatedCount = 0;
  for (const p of properties) {
    let changed = false;
    const newImages = p.images.map(img => {
      if (BAD_URLS.includes(img)) {
        changed = true;
        return GOOD_URLS[Math.floor(Math.random() * GOOD_URLS.length)];
      }
      return img;
    });

    if (changed) {
      await supabase.from('properties').update({ images: newImages }).eq('id', p.id);
      updatedCount++;
    }
  }

  console.log(`Fixed ${updatedCount} properties with broken images.`);
}

fix();
