import { db } from "../client";
import { events, products, sponsors } from "../schema";

async function seed() {
  console.log("Seeding events...");
  await db.insert(events).values([
    { title: "Spring Rodeo Jackpot", date: "2026-05-16", rawDate: "2026-05-16", rawTime: "09:00", location: "CCRA Arena, Calgary, AB", description: "Season-opening jackpot event, all ages welcome.", category: "jackpot", entriesOpen: true },
    { title: "Summer Championship Rodeo", date: "2026-07-20", rawDate: "2026-07-20", rawTime: "10:00", location: "CCRA Arena, Calgary, AB", description: "Championship qualifying event.", category: "championship", entriesOpen: false },
  ]);

  console.log("Seeding products...");
  await db.insert(products).values([
    { name: "CCRA Logo Cap", price: "24.99", category: "apparel", description: "Adjustable cap with embroidered CCRA logo." },
    { name: "CCRA Hoodie", price: "54.99", category: "apparel", description: "Fleece-lined hoodie, unisex sizing." },
  ]);

  console.log("Seeding sponsors...");
  await db.insert(sponsors).values([
    { name: "Prairie Feed & Supply", website: "https://example.com", visible: true },
    { name: "Rocky Mountain Trailers", website: "https://example.com", visible: true },
  ]);

  console.log("Seed complete.");
}

seed().then(() => process.exit(0)).catch((err) => { console.error("Seed failed:", err); process.exit(1); });