import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { adminRouter } from "./routers/admin";
import { catalogRouter } from "./routers/catalog";
import { createLocalSession, verifyLocalLogin } from "./railway/localAuth";
import { isLocalAuthEnabled } from "./railway/runtime";
import { z } from "zod";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    localLogin: publicProcedure.input(z.object({ email: z.string().email(), password: z.string().min(1).max(256) })).mutation(async ({ ctx, input }) => {
      if (!isLocalAuthEnabled()) throw new Error("Login local não está habilitado.");
      const user = await verifyLocalLogin(input.email, input.password);
      if (!user) throw new Error("Credenciais inválidas.");
      const token = await createLocalSession(user);
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.cookie(COOKIE_NAME, token, { ...cookieOptions, httpOnly: true, maxAge: 1000 * 60 * 60 * 12 });
      return user;
    }),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),
  catalog: catalogRouter,
  admin: adminRouter,
});

export type AppRouter = typeof appRouter;
