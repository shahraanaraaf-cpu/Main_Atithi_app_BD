import createIntlMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from 'next/server';
import { routing } from './i18n/routing';
import { updateSession } from './utils/supabase/middleware';

const intlMiddleware = createIntlMiddleware(routing);

export default async function proxy(req: NextRequest) {
  // Redirect /search to /en/search
  if (req.nextUrl.pathname === '/search') {
    const url = req.nextUrl.clone()
    url.pathname = '/en/search'
    return NextResponse.redirect(url)
  }

  // First run the next-intl middleware to get the localized response
  const res = intlMiddleware(req);
  
  // Then pass that response through Supabase to handle auth tokens
  return await updateSession(req, res);
}

export const config = {
  // Match only internationalized pathnames
  matcher: ['/', '/(bn|en)/:path*', '/search']
};
