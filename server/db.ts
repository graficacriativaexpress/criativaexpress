import { and, asc, desc, eq, inArray, like, or } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { nanoid } from "nanoid";
import {
  type InsertUser,
  type Product,
  type ProductImage,
  type StoreSettings,
  kitItems,
  productImages,
  products,
  storeSettings,
  users,
} from "../drizzle/schema";
import { slugFromName, type CatalogCategory } from "../shared/catalog";
import { ENV } from "./_core/env";

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) throw new Error("User openId is required for upsert");
  const db = await getDb();
  if (!db) throw new Error("Banco de dados indisponível");

  const values: InsertUser = { openId: user.openId, lastSignedIn: user.lastSignedIn ?? new Date() };
  const updateSet: Record<string, unknown> = { lastSignedIn: values.lastSignedIn };
  for (const field of ["name", "email", "loginMethod"] as const) {
    if (user[field] !== undefined) {
      values[field] = user[field] ?? null;
      updateSet[field] = user[field] ?? null;
    }
  }
  values.role = user.role ?? (user.openId === ENV.ownerOpenId ? "admin" : "user");
  updateSet.role = values.role;
  await db.insert(users).values(values).onDuplicateKeyUpdate({ set: updateSet });
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result[0];
}

export type CatalogProduct = Product & {
  images: ProductImage[];
  kitItems: Array<{ id: number; itemProductId: number; quantity: number; itemName: string; itemPrice: string }>;
};

type ListOptions = { includeInactive?: boolean; category?: CatalogCategory; query?: string };

async function hydrateProducts(rows: Product[]): Promise<CatalogProduct[]> {
  const db = await getDb();
  if (!db || rows.length === 0) return [];
  const ids = rows.map(row => row.id);
  const images = await db
    .select()
    .from(productImages)
    .where(inArray(productImages.productId, ids))
    .orderBy(asc(productImages.position), asc(productImages.id));
  const composition = await db
    .select({
      id: kitItems.id,
      kitProductId: kitItems.kitProductId,
      itemProductId: kitItems.itemProductId,
      quantity: kitItems.quantity,
      itemName: products.name,
      itemPrice: products.price,
    })
    .from(kitItems)
    .innerJoin(products, eq(kitItems.itemProductId, products.id))
    .where(inArray(kitItems.kitProductId, ids));

  return rows.map(product => ({
    ...product,
    images: images.filter(image => image.productId === product.id),
    kitItems: composition
      .filter(item => item.kitProductId === product.id)
      .map(({ kitProductId: _kitProductId, ...item }) => item),
  }));
}

export async function listProducts(options: ListOptions = {}): Promise<CatalogProduct[]> {
  const db = await getDb();
  if (!db) return [];
  const conditions = [];
  if (!options.includeInactive) conditions.push(eq(products.isActive, true));
  if (options.category) conditions.push(eq(products.category, options.category));
  if (options.query?.trim()) {
    const term = `%${options.query.trim()}%`;
    conditions.push(or(like(products.name, term), like(products.description, term)));
  }
  const rows = conditions.length
    ? await db.select().from(products).where(and(...conditions)).orderBy(desc(products.isFeatured), asc(products.sortOrder), desc(products.createdAt))
    : await db.select().from(products).orderBy(desc(products.isFeatured), asc(products.sortOrder), desc(products.createdAt));
  return hydrateProducts(rows);
}

export async function getProductById(id: number, includeInactive = true) {
  const db = await getDb();
  if (!db) return undefined;
  const conditions = [eq(products.id, id)];
  if (!includeInactive) conditions.push(eq(products.isActive, true));
  const rows = await db.select().from(products).where(and(...conditions)).limit(1);
  return (await hydrateProducts(rows))[0];
}

export async function getProductBySlug(slug: string) {
  const db = await getDb();
  if (!db) return undefined;
  const rows = await db
    .select()
    .from(products)
    .where(and(eq(products.slug, slug), eq(products.isActive, true)))
    .limit(1);
  return (await hydrateProducts(rows))[0];
}

type ProductInput = {
  id?: number;
  name: string;
  description: string;
  category: CatalogCategory;
  type: "product" | "kit";
  price: string;
  isActive: boolean;
  isFeatured: boolean;
  sortOrder: number;
  kitItems: Array<{ itemProductId: number; quantity: number }>;
};

export async function saveProduct(input: ProductInput) {
  const db = await getDb();
  if (!db) throw new Error("Banco de dados indisponível");
  const values = {
    name: input.name.trim(),
    description: input.description.trim(),
    category: input.category,
    type: input.type,
    price: input.price,
    isActive: input.isActive,
    isFeatured: input.isFeatured,
    sortOrder: input.sortOrder,
  } as const;
  let productId = input.id;

  if (productId) {
    await db.update(products).set(values).where(eq(products.id, productId));
  } else {
    const slug = `${slugFromName(values.name) || "produto"}-${nanoid(7).toLowerCase()}`;
    const result = await db.insert(products).values({ ...values, slug });
    productId = Number((result as unknown as [{ insertId: number }])[0].insertId);
  }

  await db.delete(kitItems).where(eq(kitItems.kitProductId, productId));
  if (input.type === "kit" && input.kitItems.length > 0) {
    await db.insert(kitItems).values(
      input.kitItems.map(item => ({
        kitProductId: productId,
        itemProductId: item.itemProductId,
        quantity: item.quantity,
      }))
    );
  }
  return getProductById(productId);
}

export async function deleteProduct(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Banco de dados indisponível");
  await db.delete(products).where(eq(products.id, id));
}

export async function addProductImage(input: {
  productId: number;
  storageKey: string;
  url: string;
  altText?: string;
}) {
  const db = await getDb();
  if (!db) throw new Error("Banco de dados indisponível");
  const current = await db.select().from(productImages).where(eq(productImages.productId, input.productId));
  const result = await db.insert(productImages).values({
    ...input,
    position: current.length,
  });
  const id = Number((result as unknown as [{ insertId: number }])[0].insertId);
  const rows = await db.select().from(productImages).where(eq(productImages.id, id)).limit(1);
  return rows[0];
}

export async function removeProductImage(productId: number, imageId: number) {
  const db = await getDb();
  if (!db) throw new Error("Banco de dados indisponível");
  await db.delete(productImages).where(and(eq(productImages.id, imageId), eq(productImages.productId, productId)));
}

export async function reorderProductImages(productId: number, imageIds: number[]) {
  const db = await getDb();
  if (!db) throw new Error("Banco de dados indisponível");
  await Promise.all(
    imageIds.map((imageId, position) =>
      db
        .update(productImages)
        .set({ position })
        .where(and(eq(productImages.id, imageId), eq(productImages.productId, productId)))
    )
  );
}

type StoreSettingsInput = {
  companyName: string;
  whatsappNumber: string | null;
  whatsappGreeting: string | null;
};

const defaultSettings: StoreSettingsInput = {
  companyName: "Criativa Express",
  whatsappNumber: null,
  whatsappGreeting: "Olá! Gostaria de fazer um pedido.",
};

export async function getStoreSettings(): Promise<StoreSettingsInput> {
  const db = await getDb();
  if (!db) return defaultSettings;
  const rows = await db.select().from(storeSettings).orderBy(asc(storeSettings.id)).limit(1);
  return rows[0] ?? defaultSettings;
}

export async function updateStoreSettings(input: StoreSettingsInput) {
  const db = await getDb();
  if (!db) throw new Error("Banco de dados indisponível");
  const current = await db.select().from(storeSettings).orderBy(asc(storeSettings.id)).limit(1);
  if (current[0]) {
    await db.update(storeSettings).set(input).where(eq(storeSettings.id, current[0].id));
  } else {
    await db.insert(storeSettings).values(input);
  }
  return getStoreSettings();
}
