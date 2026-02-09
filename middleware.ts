import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // 1. Pega o token ou cookie de login (ajuste conforme seu sistema de auth)
  const token = request.cookies.get('auth_token')?.value;

  const isLoginPage = request.nextUrl.pathname.startsWith('/login');

  // 2. Se não estiver logado e tentar acessar algo que não seja o login, manda para o login
  if (!token && !isLoginPage) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // 3. Se já estiver logado e tentar ir para o login, manda para o dashboard
  if (token && isLoginPage) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!login|api|_next/static|_next/image|favicon.ico).*)',
  ],
};