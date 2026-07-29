import { NextRequest, NextResponse } from 'next/server';

const PIN_HASH = process.env.PIN_HASH;

// In-memory rate limiting (resets on server restart)
const attemptStore: Record<string, { count: number; lockedUntil?: number }> = {};

function getClientIp(request: NextRequest): string {
  return request.headers.get('x-forwarded-for') || 
         request.headers.get('x-real-ip') || 
         'unknown';
}

function calculatePenalty(failedAttempts: number): number {
  if (failedAttempts <= 1) return 30;
  return 30 * Math.pow(2, failedAttempts - 1);
}

export async function POST(request: NextRequest) {
  if (!PIN_HASH) {
    return NextResponse.json(
      { error: 'PIN not configured' },
      { status: 500 }
    );
  }

  const clientIp = getClientIp(request);
  const now = Date.now();
  
  // Check if locked
  if (attemptStore[clientIp]?.lockedUntil && now < attemptStore[clientIp].lockedUntil) {
    const remaining = Math.ceil((attemptStore[clientIp].lockedUntil! - now) / 1000);
    return NextResponse.json(
      { error: 'Too many attempts', retryAfter: remaining },
      { status: 429 }
    );
  }

  const body = await request.json();
  const { pin } = body;

  if (!pin || pin.length !== 6) {
    return NextResponse.json(
      { error: 'Invalid PIN' },
      { status: 400 }
    );
  }

  const encoder = new TextEncoder();
  const pinBuffer = encoder.encode(pin);
  
  const hashBuffer = await crypto.subtle.digest('SHA-256', pinBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

  if (hashHex === PIN_HASH) {
    // Reset attempts on success
    delete attemptStore[clientIp];
    
    // Just return success - client will store in sessionStorage
    return NextResponse.json({ success: true });
  }

  // Track failed attempt
  const attempt = attemptStore[clientIp] || { count: 0 };
  attempt.count += 1;
  
  if (attempt.count >= 3) {
    const penalty = calculatePenalty(attempt.count);
    attempt.lockedUntil = now + (penalty * 1000);
  }
  
  attemptStore[clientIp] = attempt;

  if (attempt.lockedUntil) {
    const remaining = Math.ceil((attempt.lockedUntil - now) / 1000);
    return NextResponse.json(
      { error: 'Too many attempts', retryAfter: remaining },
      { status: 429 }
    );
  }

  return NextResponse.json(
    { error: 'Invalid PIN' },
    { status: 401 }
  );
}
