export function isRailwayRuntime() {
  return process.env.DEPLOYMENT_TARGET === "railway" || Boolean(process.env.RAILWAY_ENVIRONMENT);
}

export function isLocalAuthEnabled() {
  return isRailwayRuntime() && process.env.RAILWAY_AUTH_MODE === "local";
}
