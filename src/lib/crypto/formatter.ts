const LOWERCASE = 'abcdefghijklmnopqrstuvwxyz';
const UPPERCASE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const NUMBERS = '0123456789';
const SYMBOLS = '!@#$%^&*()-_=+';

const ALL_CHARS = LOWERCASE + UPPERCASE + NUMBERS + SYMBOLS;

export function formatPassword(seed: ArrayBuffer, length: number = 20): string {
  const entropy = new Uint8Array(seed);
  const password: string[] = [];
  
  const getByte = (index: number): number => {
    return entropy[index % entropy.length];
  };
  
  password.push(LOWERCASE[getByte(0) % LOWERCASE.length]);
  password.push(UPPERCASE[getByte(1) % UPPERCASE.length]);
  password.push(NUMBERS[getByte(2) % NUMBERS.length]);
  password.push(SYMBOLS[getByte(3) % SYMBOLS.length]);
  
  for (let i = 4; i < length; i++) {
    password.push(ALL_CHARS[getByte(i) % ALL_CHARS.length]);
  }
  
  for (let i = password.length - 1; i > 0; i--) {
    const j = getByte(i + entropy.length) % (i + 1);
    [password[i], password[j]] = [password[j], password[i]];
  }
  
  return password.join('');
}
