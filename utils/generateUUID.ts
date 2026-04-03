// Fallback using crypto.getRandomValues (broader support)
export function generateUUID(): string {
  if (crypto.randomUUID) {
    return crypto.randomUUID();
  }

  // Fallback for older browsers
  return "10000000-1000-4000-8000-100000000000".replace(/[018]/g, c =>
    (parseInt(c) ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> parseInt(c) / 4).toString(16)
  );
}