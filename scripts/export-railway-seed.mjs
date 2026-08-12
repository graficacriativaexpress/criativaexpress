import fs from "node:fs/promises";
import mysql from "mysql2/promise";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL não está configurada.");
}

const connection = await mysql.createConnection(process.env.DATABASE_URL);
try {
  const [products] = await connection.query(
    "SELECT id, name, slug, description, category, type, price, isActive, isFeatured, sortOrder, createdAt, updatedAt FROM products ORDER BY id"
  );
  const [images] = await connection.query(
    "SELECT id, productId, storageKey, url, altText, position, createdAt FROM product_images ORDER BY productId, position, id"
  );
  const [kitItems] = await connection.query(
    "SELECT id, kitProductId, itemProductId, quantity FROM kit_items ORDER BY id"
  );
  const [settings] = await connection.query(
    "SELECT id, companyName, whatsappNumber, whatsappGreeting, updatedAt FROM store_settings ORDER BY id"
  );

  const seed = {
    exportedAt: new Date().toISOString(),
    products,
    images,
    kitItems,
    settings: settings[0] ?? null,
  };

  await fs.writeFile("server/railway/catalog.seed.json", `${JSON.stringify(seed, null, 2)}\n`, "utf8");
  console.log(`Exportados ${products.length} produtos, ${images.length} imagens e ${kitItems.length} itens de kit.`);
} finally {
  await connection.end();
}
