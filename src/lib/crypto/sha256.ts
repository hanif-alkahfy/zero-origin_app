export async function buildIdentity(site: string, username: string): Promise<string> {
  const normalizedSite = normalizeSite(site);
  const normalizedUsername = normalizeUsername(username);
  
  const data = `${normalizedSite}|${normalizedUsername}`;
  const encoder = new TextEncoder();
  const dataBuffer = encoder.encode(data);
  
  const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  
  return hashHex;
}

function normalizeSite(site: string): string {
  let normalized = site.toLowerCase().trim();
  
  normalized = normalized.replace(/^https?:\/\//, '');
  normalized = normalized.replace(/^www\./, '');
  normalized = normalized.replace(/\/.*$/, '');
  
  return normalized;
}

function normalizeUsername(username: string): string {
  return username.toLowerCase().trim();
}
