import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials in environment variables");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const generateSlug = (title) => title.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Math.floor(Math.random() * 10000);

const propertyTypes = ["SALE", "RENT"];
const amenities = ["Pool", "Gym", "Parking", "Air Conditioning", "High-speed Wifi", "Patio / Terrace"];
const locations = [
  "Miami, FL", "Los Angeles, CA", "Seattle, WA", "Austin, TX", 
  "Chicago, IL", "New York, NY", "San Francisco, CA", "Denver, CO",
  "Boston, MA", "Portland, OR"
];
const prefixes = ["Modern", "Luxury", "Cozy", "Spacious", "Elegant", "Beautiful", "Stunning", "Charming"];
const propertyKinds = ["Villa", "Apartment", "House", "Condo", "Penthouse", "Townhouse"];

const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const getRandomItems = (arr, num) => {
  const shuffled = [...arr].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, num);
};

const REAL_ESTATE_IMAGES = [
  "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1600566753086-00f18efc2291?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1600585154526-990dced4ea0d?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1600573472591-ee6b68d14c68?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1512915922686-57c11dde9b6b?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1572120360610-d971b9d7767c?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1448630360428-65456885c650?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1480074568708-e7b720bb3f09?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1449844908441-8829872d2607?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1510627489930-0c1b0bfb6785?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1505843513577-22bb7abd16ea?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1521021469032-15f16ff36be9?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1600607688969-a5bfcd64bd2b?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1598228723793-52759bba239c?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1605276374104-5d4fd73b4d8f?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80"
];

const properties = Array.from({ length: 40 }).map((_, i) => {
  const title = `${prefixes[Math.floor(Math.random() * prefixes.length)]} ${propertyKinds[Math.floor(Math.random() * propertyKinds.length)]} in ${locations[Math.floor(Math.random() * locations.length)].split(',')[0]}`;
  const isRent = Math.random() > 0.5;
  const price = isRent ? getRandomInt(1500, 10000) : getRandomInt(250000, 5000000);
  
  return {
    title,
    location: locations[Math.floor(Math.random() * locations.length)],
    price,
    price_suffix: isRent ? "/month" : null,
    bedrooms: getRandomInt(1, 6),
    bathrooms: getRandomInt(1, 5),
    area: getRandomInt(500, 5000),
    images: getRandomItems(REAL_ESTATE_IMAGES, 3),
    image_alt: title,
    tags: getRandomItems(amenities, getRandomInt(2, 5)),
    type: isRent ? "RENT" : "SALE",
    is_featured: i < 4, // Make 4 properties featured so we have featured properties!
    slug: generateSlug(title),
    description: `A stunning property offering luxury and comfort. Features include ${getRandomItems(amenities, 3).join(", ")}.`,
    latitude: 37.7749 + (Math.random() - 0.5) * 0.1,
    longitude: -122.4194 + (Math.random() - 0.5) * 0.1,
  };
});

async function seed() {
  console.log("Deleting ONLY previously seeded mock properties (if any)...");
  // Only delete properties that look like mock data. We'll identify them by matching our mock titles, but it's safer to just delete all where is_featured=false or just TRUNCATE, BUT wait, user said I wiped their db.
  // Actually, let's just delete the ones that have our specific mock prefixes.
  // Or just don't delete at all! I will just insert 40 new ones so they populate the feed.
  // I won't delete anything to preserve user data.
  
  console.log("Inserting 40 properties with real estate images...");
  const { data, error } = await supabase.from('properties').insert(properties);
  if (error) {
    console.error("Error inserting properties:", error);
  } else {
    console.log("Successfully inserted properties!");
  }
}

seed();
