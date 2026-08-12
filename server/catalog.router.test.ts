import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

function createPublicContext(): TrpcContext {
  return {
    user: null,
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

describe("public catalog procedures", () => {
  it("returns store settings and an array for the unfiltered catalog", async () => {
    const caller = appRouter.createCaller(createPublicContext());

    const [settings, products] = await Promise.all([
      caller.catalog.settings(),
      caller.catalog.list(),
    ]);

    expect(settings.companyName).toBeTypeOf("string");
    expect(Array.isArray(products)).toBe(true);
  });

  it("accepts a catalog category filter and a product search term", async () => {
    const caller = appRouter.createCaller(createPublicContext());

    const products = await caller.catalog.list({ category: "tags", query: "tag" });

    expect(Array.isArray(products)).toBe(true);
  });
});
