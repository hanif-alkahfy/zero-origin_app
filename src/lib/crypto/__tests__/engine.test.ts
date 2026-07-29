import { describe, it, expect } from 'vitest';
import {
  validateOriginKey,
  validateSite,
  validateUsername,
  validateAll,
} from '../engine';

describe('validateOriginKey', () => {
  it('should reject empty origin key', () => {
    const result = validateOriginKey('');
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('Origin Key is required');
  });

  it('should reject short origin key', () => {
    const result = validateOriginKey('abc');
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('Origin Key must be at least 8 characters');
  });

  it('should accept valid origin key', () => {
    const result = validateOriginKey('mySecretKey123');
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });
});

describe('validateSite', () => {
  it('should reject empty site', () => {
    const result = validateSite('');
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('Site is required');
  });

  it('should accept valid site', () => {
    const result = validateSite('github.com');
    expect(result.valid).toBe(true);
  });
});

describe('validateUsername', () => {
  it('should reject empty username', () => {
    const result = validateUsername('');
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('Username is required');
  });

  it('should accept valid username', () => {
    const result = validateUsername('user@example.com');
    expect(result.valid).toBe(true);
  });
});

describe('validateAll', () => {
  it('should reject when all fields empty', () => {
    const result = validateAll({ originKey: '', site: '', username: '' });
    expect(result.valid).toBe(false);
    expect(result.errors.length).toBe(3);
  });

  it('should accept valid input', () => {
    const result = validateAll({
      originKey: 'mySecretKey123',
      site: 'github.com',
      username: 'user@example.com',
    });
    expect(result.valid).toBe(true);
  });
});
