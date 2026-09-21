export function normalizeForSearch(value: string): string {
  return value.trim().toLocaleLowerCase('pt-BR')
}
