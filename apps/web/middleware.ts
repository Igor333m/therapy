import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { isSupportedLocale } from './src/lib/i18n'

export function middleware(request: NextRequest) {
  const { nextUrl } = request
  const pathname = nextUrl.pathname

  if (pathname === '/') {
    const locale = request.cookies.get('therapy-locale')?.value
    const preferredLocale = isSupportedLocale(locale ?? '') ? locale : 'en'
    return NextResponse.redirect(new URL(`/${preferredLocale}`, request.url))
  }

  const [, maybeLocale] = pathname.split('/')
  const response = NextResponse.next()

  if (isSupportedLocale(maybeLocale)) {
    response.cookies.set('therapy-locale', maybeLocale, {
      sameSite: 'lax',
      path: '/'
    })
  }

  const selectedCountry = nextUrl.searchParams.get('country')

  if (selectedCountry) {
    response.cookies.set('therapy-country', selectedCountry.toUpperCase(), {
      sameSite: 'lax',
      path: '/'
    })
  }

  return response
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)']
}