import { afterEach, describe, expect, it } from "vitest";
import { isLocalAuthEnabled, isRailwayRuntime } from "./runtime";

const originalTarget = process.env.DEPLOYMENT_TARGET;
const originalEnvironment = process.env.RAILWAY_ENVIRONMENT;
const originalAuthMode = process.env.RAILWAY_AUTH_MODE;

afterEach(() => {
  process.env.DEPLOYMENT_TARGET = originalTarget;
  process.env.RAILWAY_ENVIRONMENT = originalEnvironment;
  process.env.RAILWAY_AUTH_MODE = originalAuthMode;
});

describe("modo Railway", () => {
  it("habilita a execução externa somente quando o destino é Railway", () => {
    process.env.DEPLOYMENT_TARGET = "railway";
    process.env.RAILWAY_ENVIRONMENT = "";
    expect(isRailwayRuntime()).toBe(true);
  });

  it("habilita o login local apenas no Railway com modo local definido", () => {
    process.env.DEPLOYMENT_TARGET = "railway";
    process.env.RAILWAY_AUTH_MODE = "local";
    expect(isLocalAuthEnabled()).toBe(true);
  });
});
