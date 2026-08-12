import { mkdir, stat, writeFile } from "node:fs/promises";
import { basename, dirname, join } from "node:path";

function safeFilename(value) {
  return value.normalize("NFD").replace(/\p{Diacritic}/gu, "").replace(/[^a-zA-Z0-9._-]/g, "-");
}

export function buildSeedAsset(id, storageKey) {
  const filename = safeFilename(basename(storageKey || `asset-${id}`).replace(/_[0-9a-f]{8}(?=\.[^.]+$)/i, ""));
  return {
    relativePath: join("seed", filename),
    publicUrl: `/uploads/seed/${encodeURIComponent(filename)}`,
  };
}

export function resolveLegacyAssetUrl(url, legacyOrigin) {
  if (/^https?:\/\//i.test(url)) return url;
  const origin = (legacyOrigin || "").replace(/\/$/, "");
  if (!origin) throw new Error(`RAILWAY_LEGACY_IMAGE_ORIGIN é obrigatório para copiar o ativo ${url}.`);
  return `${origin}${url.startsWith("/") ? url : `/${url}`}`;
}

export async function persistSeedAsset({ sourceUrl, destinationPath, fetchImpl = fetch }) {
  await mkdir(dirname(destinationPath), { recursive: true });
  try {
    await stat(destinationPath);
    return false;
  } catch {
    const response = await fetchImpl(sourceUrl);
    if (!response.ok) throw new Error(`Não foi possível copiar o ativo ${sourceUrl}: HTTP ${response.status}.`);
    await writeFile(destinationPath, Buffer.from(await response.arrayBuffer()));
    return true;
  }
}
