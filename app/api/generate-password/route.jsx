import { NextResponse } from 'next/server';
import crypto from 'crypto';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const length = Math.max(8, Math.min(128, parseInt(searchParams.get('length')) || 12));
    const hasNumbers = searchParams.get('hasNumbers') === 'true';
    const hasSymbols = searchParams.get('hasSymbols') === 'true';
    const hasUppercase = searchParams.get('hasUppercase') === 'true';
    const customSymbols = searchParams.get('customSymbols') || '!@#$%^&*()_+-=[]{};:,.<>?/';

    const lowercaseChars = 'abcdefghijklmnopqrstuvwxyz';
    const uppercaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numberChars = '0123456789';
    
    let charset = lowercaseChars;
    if (hasUppercase) charset += uppercaseChars;
    if (hasNumbers) charset += numberChars;
    if (hasSymbols) charset += customSymbols;

    let password = '';
    let meetsRequirements = false;

    while (!meetsRequirements) {
      password = Array.from(crypto.getRandomValues(new Uint8Array(length)))
        .map((x) => charset[x % charset.length])
        .join('');

      meetsRequirements = 
        (!hasUppercase || /[A-Z]/.test(password)) &&
        (!hasNumbers || /\d/.test(password)) &&
        (!hasSymbols || new RegExp(`[${customSymbols.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&')}]`).test(password));
    }

    return NextResponse.json({ password }, { status: 200 });
  } catch (error) {
    console.error('Error generating password:', error);
    return NextResponse.json({ error: 'Failed to generate password' }, { status: 500 });
  }
}