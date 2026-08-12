/**
 * Converte datas ISO do arquivo JSON de catálogo no formato DATETIME aceito pelo MySQL.
 */
export function toMySqlDateTime(value) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    throw new Error(`Data inválida na semente Railway: ${String(value)}`);
  }

  return date.toISOString().slice(0, 19).replace("T", " ");
}
