import {
  boolean,
  decimal,
  index,
  int,
  mysqlEnum,
  mysqlTable,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/mysql-core";

export const categoryValues = ["tags", "dtf", "cartao_visita", "kits"] as const;
export const productTypeValues = ["product", "kit"] as const;

export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export const products = mysqlTable(
  "products",
  {
    id: int("id").autoincrement().primaryKey(),
    slug: varchar("slug", { length: 180 }).notNull().unique(),
    name: varchar("name", { length: 180 }).notNull(),
    description: text("description").notNull(),
    category: mysqlEnum("category", categoryValues).notNull(),
    type: mysqlEnum("type", productTypeValues).default("product").notNull(),
    price: decimal("price", { precision: 10, scale: 2 }).notNull(),
    isActive: boolean("isActive").default(true).notNull(),
    isFeatured: boolean("isFeatured").default(false).notNull(),
    sortOrder: int("sortOrder").default(0).notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  },
  table => [
    index("products_category_active_idx").on(table.category, table.isActive),
    index("products_sort_idx").on(table.sortOrder),
  ]
);

export const productImages = mysqlTable(
  "product_images",
  {
    id: int("id").autoincrement().primaryKey(),
    productId: int("productId")
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),
    storageKey: varchar("storageKey", { length: 512 }).notNull(),
    url: varchar("url", { length: 1024 }).notNull(),
    altText: varchar("altText", { length: 220 }),
    position: int("position").default(0).notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
  },
  table => [index("product_images_product_position_idx").on(table.productId, table.position)]
);

export const kitItems = mysqlTable(
  "kit_items",
  {
    id: int("id").autoincrement().primaryKey(),
    kitProductId: int("kitProductId")
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),
    itemProductId: int("itemProductId")
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),
    quantity: int("quantity").notNull(),
  },
  table => [index("kit_items_kit_idx").on(table.kitProductId)]
);

export const storeSettings = mysqlTable("store_settings", {
  id: int("id").autoincrement().primaryKey(),
  companyName: varchar("companyName", { length: 140 }).default("Criativa Express").notNull(),
  whatsappNumber: varchar("whatsappNumber", { length: 24 }),
  whatsappGreeting: text("whatsappGreeting"),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
export type Product = typeof products.$inferSelect;
export type ProductImage = typeof productImages.$inferSelect;
export type KitItem = typeof kitItems.$inferSelect;
export type StoreSettings = typeof storeSettings.$inferSelect;
