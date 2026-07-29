export async function deriveKey(
  rootKey: ArrayBuffer,
  identity: string
): Promise<ArrayBuffer> {
  const encoder = new TextEncoder();
  const infoBuffer = encoder.encode(identity);
  
  const key = await crypto.subtle.importKey(
    'raw',
    rootKey,
    { name: 'HKDF' },
    false,
    ['deriveBits']
  );
  
  const derivedBits = await crypto.subtle.deriveBits(
    {
      name: 'HKDF',
      salt: new Uint8Array(0),
      info: infoBuffer,
      hash: 'SHA-256',
    },
    key,
    256
  );
  
  return derivedBits;
}
