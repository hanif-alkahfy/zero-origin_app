declare module 'argon2-wasm' {
  interface Argon2Options {
    pass: string;
    salt: string;
    mem?: number;
    time?: number;
    parallelism?: number;
    hashLen?: number;
    type?: number;
    distPath?: string;
  }

  interface Argon2Result {
    hash: Uint8Array;
    hashHex: string;
    encoded: string;
  }

  interface Argon2Instance {
    ready: Promise<void>;
    hash(options: Argon2Options): Promise<Argon2Result>;
    ArgonType: {
      Argon2d: number;
      Argon2i: number;
      Argon2id: number;
      Argon2u: number;
    };
  }

  const argon2: Argon2Instance;
  export default argon2;
}
