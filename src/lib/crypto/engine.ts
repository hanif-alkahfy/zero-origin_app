import { buildIdentity } from './sha256';
import { deriveKey } from './hkdf';
import { deriveRootKey, initArgon2 } from './argon2';
import { formatPassword } from './formatter';

export interface GeneratePasswordOptions {
  originKey: string;
  site: string;
  username: string;
}

export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

export function validateOriginKey(originKey: string): ValidationResult {
  const errors: string[] = [];
  
  if (!originKey || originKey.length === 0) {
    errors.push('Origin Key is required');
  } else if (originKey.length < 8) {
    errors.push('Origin Key must be at least 8 characters');
  }
  
  return { valid: errors.length === 0, errors };
}

export function validateSite(site: string): ValidationResult {
  const errors: string[] = [];
  
  if (!site || site.trim().length === 0) {
    errors.push('Site is required');
  }
  
  return { valid: errors.length === 0, errors };
}

export function validateUsername(username: string): ValidationResult {
  const errors: string[] = [];
  
  if (!username || username.trim().length === 0) {
    errors.push('Username is required');
  }
  
  return { valid: errors.length === 0, errors };
}

export function validateAll(options: GeneratePasswordOptions): ValidationResult {
  const allErrors: string[] = [];
  
  const originKeyResult = validateOriginKey(options.originKey);
  allErrors.push(...originKeyResult.errors);
  
  const siteResult = validateSite(options.site);
  allErrors.push(...siteResult.errors);
  
  const usernameResult = validateUsername(options.username);
  allErrors.push(...usernameResult.errors);
  
  return { valid: allErrors.length === 0, errors: allErrors };
}

export async function generatePassword(options: GeneratePasswordOptions): Promise<string> {
  const validation = validateAll(options);
  if (!validation.valid) {
    throw new Error(validation.errors.join(', '));
  }
  
  await initArgon2();
  
  const rootKey = await deriveRootKey(options.originKey);
  
  const identity = await buildIdentity(options.site, options.username);
  
  const seed = await deriveKey(rootKey, identity);
  
  const password = formatPassword(seed, 20);
  
  return password;
}
