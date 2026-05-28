import * as fs from 'fs';

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

const properties = Array.from({ length: 20 }).map((_, i) => {
  const title = `${prefixes[Math.floor(Math.random() * prefixes.length)]} ${propertyKinds[Math.floor(Math.random() * propertyKinds.length)]} in ${locations[Math.floor(Math.random() * locations.length)].split(',')[0]}`;
  const isRent = Math.random() > 0.5;
  const price = isRent ? getRandomInt(1500, 10000) : getRandomInt(250000, 5000000);
  
  return {
    title,
    location: locations[Math.floor(Math.random() * locations.length)],
    price,
    price_suffix: isRent ? "'/month'" : "NULL",
    bedrooms: getRandomInt(1, 6),
    bathrooms: getRandomInt(1, 5),
    area: getRandomInt(500, 5000),
    images: `ARRAY['https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80']`,
    image_alt: title,
    tags: `ARRAY[${getRandomItems(amenities, getRandomInt(2, 5)).map(a => `'${a}'`).join(", ")}]`,
    type: isRent ? "RENT" : "SALE",
    is_featured: "false",
    slug: generateSlug(title),
    description: `A stunning property offering luxury and comfort. Features include ${getRandomItems(amenities, 3).join(", ")}.`,
    latitude: 37.7749 + (Math.random() - 0.5) * 0.1,
    longitude: -122.4194 + (Math.random() - 0.5) * 0.1,
  };
});

let sql = `INSERT INTO properties (title, location, price, price_suffix, bedrooms, bathrooms, area, images, image_alt, tags, type, is_featured, slug, description, latitude, longitude) VALUES\n`;

const values = properties.map(p => {
  return `('${p.title.replace(/'/g, "''")}', '${p.location.replace(/'/g, "''")}', ${p.price}, ${p.price_suffix}, ${p.bedrooms}, ${p.bathrooms}, ${p.area}, ${p.images}, '${p.image_alt.replace(/'/g, "''")}', ${p.tags}, '${p.type}', ${p.is_featured}, '${p.slug}', '${p.description.replace(/'/g, "''")}', ${p.latitude}, ${p.longitude})`;
}).join(',\n');

sql += values + ';';

fs.writeFileSync('seed.sql', sql);
console.log('seed.sql created');
