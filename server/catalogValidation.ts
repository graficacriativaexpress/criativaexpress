import { TRPCError } from "@trpc/server";

export type CatalogEntryValidationInput = {
  type: "product" | "kit";
  category: string;
  kitItems: Array<{ itemProductId: number }>;
};

export function validateCatalogEntry(input: CatalogEntryValidationInput) {
  if (input.type === "kit" && input.category !== "kits") {
    throw new TRPCError({ code: "BAD_REQUEST", message: "Kits devem usar a categoria Kits." });
  }

  if (input.type === "product" && input.category === "kits") {
    throw new TRPCError({ code: "BAD_REQUEST", message: "A categoria Kits é exclusiva para kits." });
  }

  if (new Set(input.kitItems.map(item => item.itemProductId)).size !== input.kitItems.length) {
    throw new TRPCError({ code: "BAD_REQUEST", message: "Não repita produtos na composição do kit." });
  }
}
