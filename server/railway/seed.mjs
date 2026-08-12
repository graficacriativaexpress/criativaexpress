import "dotenv/config";
import { readFile } from "node:fs/promises";
import mysql from "mysql2/promise";

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) throw new Error("DATABASE_URL é obrigatório para executar a semente do Railway.");

const seed = JSON.parse(await readFile(new URL("./catalog.seed.json", import.meta.url), "utf8"));
const legacyOrigin = (process.env.RAILWAY_LEGACY_IMAGE_ORIGIN || "").replace(/\/$/, "");
const pool = await mysql.createPool(databaseUrl);

await pool.query(`CREATE TABLE IF NOT EXISTS products (
  id INT AUTO_INCREMENT PRIMARY KEY, slug VARCHAR(180) NOT NULL UNIQUE, name VARCHAR(180) NOT NULL,
  description TEXT NOT NULL, category ENUM('tags','dtf','cartao_visita','kits') NOT NULL,
  type ENUM('product','kit') NOT NULL DEFAULT 'product', price DECIMAL(10,2) NOT NULL,
  isActive BOOLEAN NOT NULL DEFAULT TRUE, isFeatured BOOLEAN NOT NULL DEFAULT FALSE,
  sortOrder INT NOT NULL DEFAULT 0, createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX products_category_active_idx (category, isActive), INDEX products_sort_idx (sortOrder)
)`);
await pool.query(`CREATE TABLE IF NOT EXISTS product_images (
  id INT AUTO_INCREMENT PRIMARY KEY, productId INT NOT NULL, storageKey VARCHAR(512) NOT NULL,
  url VARCHAR(1024) NOT NULL, altText VARCHAR(220), position INT NOT NULL DEFAULT 0,
  createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX product_images_product_position_idx (productId, position),
  CONSTRAINT product_images_product_fk FOREIGN KEY (productId) REFERENCES products(id) ON DELETE CASCADE
)`);
await pool.query(`CREATE TABLE IF NOT EXISTS kit_items (
  id INT AUTO_INCREMENT PRIMARY KEY, kitProductId INT NOT NULL, itemProductId INT NOT NULL, quantity INT NOT NULL,
  INDEX kit_items_kit_idx (kitProductId),
  CONSTRAINT kit_items_kit_fk FOREIGN KEY (kitProductId) REFERENCES products(id) ON DELETE CASCADE,
  CONSTRAINT kit_items_item_fk FOREIGN KEY (itemProductId) REFERENCES products(id) ON DELETE CASCADE
)`);
await pool.query(`CREATE TABLE IF NOT EXISTS store_settings (
  id INT AUTO_INCREMENT PRIMARY KEY, companyName VARCHAR(140) NOT NULL DEFAULT 'Criativa Express',
  whatsappNumber VARCHAR(24), whatsappGreeting TEXT,
  updatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
)`);

await pool.query("SET FOREIGN_KEY_CHECKS = 0");
await pool.query("TRUNCATE TABLE kit_items");
await pool.query("TRUNCATE TABLE product_images");
await pool.query("TRUNCATE TABLE products");
await pool.query("TRUNCATE TABLE store_settings");
await pool.query("SET FOREIGN_KEY_CHECKS = 1");

for (const product of seed.products) {
  await pool.execute("INSERT INTO products (id, slug, name, description, category, type, price, isActive, isFeatured, sortOrder, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", [product.id, product.slug, product.name, product.description, product.category, product.type, product.price, product.isActive, product.isFeatured, product.sortOrder, product.createdAt, product.updatedAt]);
}
for (const image of seed.images) {
  const url = image.url.startsWith("/") && legacyOrigin ? `${legacyOrigin}${image.url}` : image.url;
  await pool.execute("INSERT INTO product_images (id, productId, storageKey, url, altText, position, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?)", [image.id, image.productId, image.storageKey, url, image.altText, image.position, image.createdAt]);
}
for (const item of seed.kitItems) {
  await pool.execute("INSERT INTO kit_items (id, kitProductId, itemProductId, quantity) VALUES (?, ?, ?, ?)", [item.id, item.kitProductId, item.itemProductId, item.quantity]);
}
for (const setting of seed.settings) {
  await pool.execute("INSERT INTO store_settings (id, companyName, whatsappNumber, whatsappGreeting, updatedAt) VALUES (?, ?, ?, ?, ?)", [setting.id, setting.companyName, setting.whatsappNumber, setting.whatsappGreeting, setting.updatedAt]);
}

await pool.end();
console.log(`Catálogo Railway inicializado: ${seed.products.length} produtos e ${seed.images.length} imagens.`);
