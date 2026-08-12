/**
 * Normaliza a seção de configurações do catálogo para a inserção no MySQL.
 * A exportação atual possui um único objeto, mas a semente também aceita listas.
 */
export function listSettings(settings) {
  if (!settings) return [];
  return Array.isArray(settings) ? settings : [settings];
}
