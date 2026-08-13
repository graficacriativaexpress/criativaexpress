import { TRPCError } from "@trpc/server";
import { nanoid } from "nanoid";
import { z } from "zod";
import { catalogCategories } from "../../shared/catalog";
import {
  addProductImage,
  deleteProduct,
  getProductById,
  getStoreSettings,
  listProducts,
  removeProductImage,
  reorderProductImages,
  saveProduct,
  updateStoreSettings,
} from "../db";
import { storagePut } from "../storage";
import { adminProcedure } from "../adminProcedure";
import { router } from "../_core/trpc";
import { validateCatalogEntry } from "../catalogValidation";

const categoryInput = z.enum(catalogCategories.map(item => item.value) as ["tags", "dtf", "cartao_visita", "kits"]);
const productInput = z.object({
  id: z.number().int().positive().optional(),
  name: z.string().trim().min(2, "Informe o nome do produto.").max(180),
  description: z.string().trim().min(2, "Informe uma descrição.").max(5000),
  category: categoryInput,
  type: z.enum(["product", "kit"]),
  price: z.string().regex(/^\d+(\.\d{1,2})?$/, "Use um preço válido, como 49.90."),
  isActive: z.boolean(),
  isFeatured: z.boolean(),
  sortOrder: z.number().int().min(0).max(9999),
  kitItems: z.array(z.object({ itemProductId: z.number().int().positive(), quantity: z.number().int().min(1).max(9999) })),
});

function decodeImage(dataUrl: string) {
  const match = /^data:(image\/(?:jpeg|png|webp));base64,([A-Za-z0-9+/=]+)$/.exec(dataUrl);
  if (!match) throw new TRPCError({ code: "BAD_REQUEST", message: "Envie uma imagem JPG, PNG ou WEBP válida." });
  const contentType = match[1];
  const buffer = Buffer.from(match[2], "base64");
  if (buffer.length === 0 || buffer.length > 5 * 1024 * 1024) {
    throw new TRPCError({ code: "PAYLOAD_TOO_LARGE", message: "A imagem deve ter até 5 MB." });
  }
  const extension = contentType === "image/jpeg" ? "jpg" : contentType.split("/")[1];
  return { buffer, contentType, extension };
}

export const adminRouter = router({
  products: router({
    list: adminProcedure.query(() => listProducts({ includeInactive: true })),
    byId: adminProcedure.input(z.object({ id: z.number().int().positive() })).query(({ input }) => getProductById(input.id)),
    save: adminProcedure.input(productInput).mutation(async ({ input }) => {
      validateCatalogEntry(input);
      return saveProduct(input);
    }),
    delete: adminProcedure.input(z.object({ id: z.number().int().positive() })).mutation(async ({ input }) => {
      await deleteProduct(input.id);
      return { success: true } as const;
    }),
  }),
  photos: router({
    upload: adminProcedure
      .input(z.object({ productId: z.number().int().positive(), dataUrl: z.string().min(40), altText: z.string().trim().max(220).optional() }))
      .mutation(async ({ input }) => {
        const product = await getProductById(input.productId);
        if (!product) throw new TRPCError({ code: "NOT_FOUND", message: "Produto não encontrado." });
        const image = decodeImage(input.dataUrl);
        const key = `products/${input.productId}/${nanoid(16)}.${image.extension}`;
        const uploaded = await storagePut(key, image.buffer, image.contentType);
        return addProductImage({ productId: input.productId, storageKey: uploaded.key, url: uploaded.url, altText: input.altText });
      }),
    remove: adminProcedure
      .input(z.object({ productId: z.number().int().positive(), imageId: z.number().int().positive() }))
      .mutation(async ({ input }) => {
        await removeProductImage(input.productId, input.imageId);
        return { success: true } as const;
      }),
    reorder: adminProcedure
      .input(z.object({ productId: z.number().int().positive(), imageIds: z.array(z.number().int().positive()).min(1) }))
      .mutation(async ({ input }) => {
        await reorderProductImages(input.productId, input.imageIds);
        return { success: true } as const;
      }),
  }),
  settings: router({
    get: adminProcedure.query(() => getStoreSettings()),
    update: adminProcedure
      .input(z.object({ companyName: z.string().trim().min(2).max(140), whatsappNumber: z.string().trim().max(24).nullable(), whatsappGreeting: z.string().trim().max(500).nullable() }))
      .mutation(({ input }) => updateStoreSettings(input)),
  }),
});
