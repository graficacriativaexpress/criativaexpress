import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

function createNonAdminContext(): TrpcContext {
  return {
    user: {
      id: 2,
      openId: "catalog-customer",
      email: "customer@example.com",
      name: "Catalog Customer",
      loginMethod: "manus",
      role: "user",
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSignedIn: new Date(),
    },
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

function createAdminContext(): TrpcContext {
  return {
    ...createNonAdminContext(),
    user: {
      id: 1,
      openId: "store-owner",
      email: "owner@example.com",
      name: "Store Owner",
      loginMethod: "manus",
      role: "admin",
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSignedIn: new Date(),
    },
  };
}

describe("admin access", () => {
  it("rejects product management requests from a non-admin user", async () => {
    const caller = appRouter.createCaller(createNonAdminContext());

    await expect(caller.admin.products.list()).rejects.toMatchObject({
      code: "FORBIDDEN",
      message: "Acesso administrativo necessário.",
    });
  });

  it("rejects store configuration requests from a non-admin user", async () => {
    const caller = appRouter.createCaller(createNonAdminContext());

    await expect(caller.admin.settings.get()).rejects.toMatchObject({
      code: "FORBIDDEN",
      message: "Acesso administrativo necessário.",
    });
  });

  it("rejects a kit outside the Kits category before persisting it", async () => {
    const caller = appRouter.createCaller(createAdminContext());

    await expect(caller.admin.products.save({
      name: "Kit especial",
      description: "Uma composição de produtos para a sua marca.",
      category: "tags",
      type: "kit",
      price: "49.90",
      isActive: true,
      isFeatured: false,
      sortOrder: 0,
      kitItems: [{ itemProductId: 1, quantity: 1 }],
    })).rejects.toMatchObject({
      code: "BAD_REQUEST",
      message: "Kits devem usar a categoria Kits.",
    });
  });

  it("rejects duplicated product composition in a kit before persisting it", async () => {
    const caller = appRouter.createCaller(createAdminContext());

    await expect(caller.admin.products.save({
      name: "Kit especial",
      description: "Uma composição de produtos para a sua marca.",
      category: "kits",
      type: "kit",
      price: "49.90",
      isActive: true,
      isFeatured: false,
      sortOrder: 0,
      kitItems: [{ itemProductId: 1, quantity: 1 }, { itemProductId: 1, quantity: 2 }],
    })).rejects.toMatchObject({
      code: "BAD_REQUEST",
      message: "Não repita produtos na composição do kit.",
    });
  });

  it("allows an administrator to read the current store configuration", async () => {
    const caller = appRouter.createCaller(createAdminContext());

    const settings = await caller.admin.settings.get();

    expect(settings.companyName).toBeTypeOf("string");
    expect(settings.whatsappNumber).toBeTypeOf("string");
  });
});
