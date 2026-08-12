import { TRPCError } from "@trpc/server";
import { protectedProcedure } from "./_core/trpc";

export const adminProcedure = protectedProcedure.use(async ({ ctx, next }) => {
  if (ctx.user.role !== "admin") {
    throw new TRPCError({ code: "FORBIDDEN", message: "Acesso administrativo necessário." });
  }

  return next({ ctx });
});
