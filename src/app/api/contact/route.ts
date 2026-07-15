import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

type ContactBody = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

function validate(body: unknown): { valid: true; data: ContactBody } | { valid: false; errors: string[] } {
  if (!body || typeof body !== 'object') {
    return { valid: false, errors: ['Request body must be a JSON object'] };
  }
  const { name, email, subject, message } = body as Record<string, unknown>;
  const errors: string[] = [];

  if (typeof name !== 'string' || name.trim().length < 2) {
    errors.push('Name must be at least 2 characters');
  }
  if (typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.push('A valid email address is required');
  }
  if (typeof subject !== 'string' || subject.trim().length < 3) {
    errors.push('Subject must be at least 3 characters');
  }
  if (typeof message !== 'string' || message.trim().length < 10) {
    errors.push('Message must be at least 10 characters');
  }
  if (message && typeof message === 'string' && message.length > 5000) {
    errors.push('Message must be under 5000 characters');
  }

  if (errors.length > 0) return { valid: false, errors };
  return {
    valid: true,
    data: {
      name: (name as string).trim(),
      email: (email as string).trim().toLowerCase(),
      subject: (subject as string).trim(),
      message: (message as string).trim(),
    },
  };
}

const submissions: { ip: string; count: number; resetAt: number }[] = [];
function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const idx = submissions.findIndex((s) => s.ip === ip);

  if (idx === -1) {
    submissions.push({ ip, count: 1, resetAt: now + 60_000 });
    return true;
  }

  const entry = submissions[idx];
  if (now > entry.resetAt) {
    submissions.splice(idx, 1);
    submissions.push({ ip, count: 1, resetAt: now + 60_000 });
    return true;
  }

  if (entry.count >= 3) {
    return false;
  }

  entry.count++;
  return true;
}

export async function POST(request: NextRequest) {
  const ip =
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    'unknown';

  if (!checkRateLimit(ip)) {
    return NextResponse.json(
      { success: false, error: 'Too many requests. Please wait a minute and try again.' },
      { status: 429 }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { success: false, error: 'Invalid JSON in request body' },
      { status: 400 }
    );
  }

  const validation = validate(body);
  if (!validation.valid) {
    return NextResponse.json(
      { success: false, errors: validation.errors },
      { status: 422 }
    );
  }

  const { data } = validation;

  const entry = {
    ...data,
    ip,
    timestamp: new Date().toISOString(),
    userAgent: request.headers.get('user-agent') || 'unknown',
  };

  try {
    const dir = path.join(process.cwd(), '.submissions');
    await fs.mkdir(dir, { recursive: true });
    const filePath = path.join(dir, `${Date.now()}-${Math.random().toString(36).slice(2, 9)}.json`);
    await fs.writeFile(filePath, JSON.stringify(entry, null, 2), 'utf-8');
  } catch (err) {
    console.error('[contact] Failed to persist submission:', err);
  }

  console.log('[contact] New submission:', {
    name: data.name,
    email: data.email,
    subject: data.subject,
    timestamp: entry.timestamp,
  });

  const response = NextResponse.json(
    {
      success: true,
      message: `Thanks ${data.name}! I'll get back to you within 24 hours.`,
    },
    { status: 201 }
  );

  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type');

  return response;
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Max-Age': '86400',
    },
  });
}
