"use client"

interface Argon2Module {
  hash: (params: {
    pass: string
    salt: string
    mem?: number
    time?: number
    parallelism?: number
    hashLen?: number
    type?: number
  }) => Promise<{
    hash: Uint8Array
    hashHex: string
    encoded: string
  }>
  ArgonType: {
    Argon2d: number
    Argon2i: number
    Argon2id: number
  }
}

interface Argon2Module {
  hash: (params: {
    pass: string
    salt: string
    mem?: number
    time?: number
    parallelism?: number
    hashLen?: number
    type?: number
  }) => Promise<{
    hash: Uint8Array
    hashHex: string
    encoded: string
  }>
  ArgonType: {
    Argon2d: number
    Argon2i: number
    Argon2id: number
  }
}

let argon2Module: Argon2Module | null = null
let loadPromise: Promise<Argon2Module> | null = null

async function loadArgon2(): Promise<Argon2Module> {
  if (argon2Module) return argon2Module
  if (loadPromise) return loadPromise
  
  loadPromise = new Promise((resolve, reject) => {
    const script = document.createElement("script")
    script.src = "/argon2/argon2-bundled.min.js"
    script.onload = () => {
      const argon2 = (window as unknown as { argon2: Argon2Module }).argon2
      argon2Module = argon2
      resolve(argon2)
    }
    script.onerror = () => reject(new Error("Failed to load argon2"))
    document.head.appendChild(script)
  })
  
  return loadPromise
}

export async function initArgon2(): Promise<void> {
  await loadArgon2()
}

export async function deriveRootKey(originKey: string): Promise<ArrayBuffer> {
  const argon2 = await loadArgon2()
  
  const result = await argon2.hash({
    pass: originKey,
    salt: 'ZeroOrigin-v1',
    mem: 256 * 1024,
    time: 3,
    parallelism: 4,
    hashLen: 32,
    type: argon2.ArgonType.Argon2id,
  })
  
  return result.hash.buffer as ArrayBuffer
}
