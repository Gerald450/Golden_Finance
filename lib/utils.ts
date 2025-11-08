
export function cleanFirestoreString(str: string | undefined | null) {
  if (!str) return "";
  // Remove any surrounding or internal double quotes and trim whitespace
  return str.replace(/"/g, "").trim();
}
