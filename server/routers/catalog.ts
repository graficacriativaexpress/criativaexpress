import { z } from "zod";
import { catalogCategories } from "../../shared/catalog";
import { getProductBySlug, getStoreSettings, listProducts } from "../db";
import { publicProcedure, router } from "../_core/trpc";

const categoryInput = z.enum(catalogCategories.map(item => item.value) as ["tags", "dtf", "cartao_visita", "kits"]);

export const catalogRouter = router({
  settings: publicProcedure.query(() => getStoreSettings()),
  list: publicProcedure
    .input(z.object({ category: categoryInput.optional(), query: z.string().max(100).optional() }).optional())
    .query(({ input }) => listProducts({ category: input?.category, query: input?.query })),
  bySlug: publicProcedure.input(z.object({ slug: z.string().min(1).max(180) })).query(({ input }) => getProductBySlug(input.slug)),
});
