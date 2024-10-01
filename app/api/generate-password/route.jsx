export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const length = parseInt(searchParams.get('length')) || 12;
    const hasNumbers = searchParams.get('hasNumbers') === 'true';
    const hasSymbols = searchParams.get('hasSymbols') === 'true';
  
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ" +
      (hasNumbers ? "0123456789" : "") +
      (hasSymbols ? "!@#$%^&*()_+-=[]{};':,.<>?/" : "");
  
    let password = '';
    for (let i = 0; i < length; i++) {
      password += charset[Math.floor(Math.random() * charset.length)];
    }
  
    return new Response(JSON.stringify({ password }), {
      headers: { 'Content-Type': 'application/json' },
    });
  }
  