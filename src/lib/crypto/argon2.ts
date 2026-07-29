import argon2 from 'argon2-wasm';

let argon2Instance: typeof argon2 | null = null;

export async function initArgon2(): Promise<void> {
  if (argon2Instance) return;
  
  argon2Instance = argon2;
  await argon2Instance.ready;
}

export async function deriveRootKey(originKey: string): Promise<ArrayBuffer> {
  await initArgon2();
  
  const result = await argon2Instance!.hash({
    pass: originKey,
    salt: 'ZeroOrigin-v1',
    mem: 256 * 1024,
    time: 3,
    parallelism: 4,
    hashLen: 32,
    type: argon2Instance!.ArgonType.Argon2id,
  });
  
  return result.hash.buffer as ArrayBuffer;
}
