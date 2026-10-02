import { readFileSync } from "node:fs";
import { join } from "node:path";
import { Pool } from "pg";
import { seedProducts } from "../lib/data";

async function main() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("Set DATABASE_URL first (see .env.example)");
  const pool = new Pool({ connectionString: url });
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    await client.query(readFileSync(join(__dirname, "..", "db", "schema.sql"), "utf8"));
    for (const p of seedProducts) {
      await client.query(
        `INSERT INTO products (id, slug, name, brand, category, subcategory, price, compare_at, rating, review_count,
           stock, tagline, description, benefits, how_to_use, ingredients, skin_types, shades, visual, tone, badge, popularity, created_at)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23)
         ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, compare_at = EXCLUDED.compare_at, stock = EXCLUDED.stock`,
        [p.id, p.slug, p.name, p.brand, p.category, p.subcategory, p.price, p.compareAt ?? null, p.rating, p.reviewCount,
          p.stock, p.tagline, p.description, JSON.stringify(p.benefits), p.howToUse, p.ingredients,
          JSON.stringify(p.skinTypes), JSON.stringify(p.shades), p.visual, JSON.stringify(p.tone), p.badge ?? null,
          p.popularity, p.createdAt],
      );
      const existing = await client.query("SELECT 1 FROM reviews WHERE product_id = $1 LIMIT 1", [p.id]);
      if (existing.rowCount === 0) {
        for (const r of p.reviews) {
          await client.query(
            "INSERT INTO reviews (product_id, author, skin, rating, title, body, verified, created_at) VALUES ($1,$2,$3,$4,$5,$6,$7,$8)",
            [p.id, r.author, r.skin, r.rating, r.title, r.body, r.verified, r.date],
          );
        }
      }
    }
    await client.query("COMMIT");
    console.log(`Schema applied and ${seedProducts.length} products seeded.`);
  } catch (e) {
    await client.query("ROLLBACK");
    throw e;
  } finally {
    client.release();
    await pool.end();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
