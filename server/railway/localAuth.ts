import { createHash, timingSafeEqual } from "node:crypto";
import { SignJWT, jwtVerify } from "jose";
import type { Request } from "express";
import { parse } from "cookie";
import type { User } from "../../drizzle/schema";
import { COOKIE_NAME } from "../../shared/const";
import { isLocalAuthEnabled } from "./runtime";

const SESSION_ISSUER = "criativa-express-railway";
const SESSION_TTL = "12h";

function getSecret() {
  const secret = process.env.RAILWAY_AUTH_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error("RAILWAY_AUTH_SECRET deve ter pelo menos 32 caracteres.");
  }
  return new TextEncoder().encode(secret);
}

function configuredAdmin() {
  const email = process.env.RAILWAY_ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.RAILWAY_ADMIN_PASSWORD;
  if (!email || !password) {
    throw new Error("Defina RAILWAY_ADMIN_EMAIL e RAILWAY_ADMIN_PASSWORD antes de ativar o painel.");
  }
  return { email, password };
}

function adminUser(email: string): User {
  const now = new Date();
  return {
    id: 0,
    openId: "railway-local-admin",
    name: "Administração Criativa Express",
    email,
    loginMethod: "local-password",
    role: "admin",
    createdAt: now,
    updatedAt: now,
    lastSignedIn: now,
  };
}

function secureEquals(left: string, right: string) {
  const leftHash = createHash("sha256").update(left).digest();
  const rightHash = createHash("sha256").update(right).digest();
  return timingSafeEqual(leftHash, rightHash);
}

export async function verifyLocalLogin(email: string, password: string) {
  if (!isLocalAuthEnabled()) return null;
  const configured = configuredAdmin();
  if (!secureEquals(email.trim().toLowerCase(), configured.email)) return null;
  if (!secureEquals(password, configured.password)) return null;
  return adminUser(configured.email);
}

export async function createLocalSession(user: User) {
  return new SignJWT({ role: user.role, email: user.email })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuer(SESSION_ISSUER)
    .setSubject(user.openId)
    .setIssuedAt()
    .setExpirationTime(SESSION_TTL)
    .sign(getSecret());
}

export async function authenticateLocalRequest(req: Request): Promise<User | null> {
  if (!isLocalAuthEnabled()) return null;
  const token = parse(req.headers.cookie ?? "")[COOKIE_NAME];
  if (!token) return null;
  try {
    const verified = await jwtVerify(token, getSecret(), { issuer: SESSION_ISSUER });
    if (verified.payload.sub !== "railway-local-admin" || verified.payload.role !== "admin") return null;
    const configured = configuredAdmin();
    return adminUser(configured.email);
  } catch {
    return null;
  }
}
