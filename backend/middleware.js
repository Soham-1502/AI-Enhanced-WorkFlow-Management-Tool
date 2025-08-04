import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

// Routes that require authentication
const protectedRoutes = [
  '/api/protected',
  '/dashboard',
  '/projects',
  '/tasks',
  '/events',
  '/calendar',
  '/settings'
];

export async function middleware(request) {
  const path = request.nextUrl.pathname;
  
  // Add CORS headers for API routes
  if (path.startsWith('/api/')) {
    const response = NextResponse.next();
    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    
    // Handle preflight requests
    if (request.method === 'OPTIONS') {
      return new NextResponse(null, {
        status: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
          'Access-Control-Max-Age': '86400'
        }
      });
    }
  }
  
  // Check if the path is a protected route
  if (protectedRoutes.some(route => path.startsWith(route))) {
    // Get token from cookies or Authorization header
    const token = request.cookies.get('token')?.value || 
                  request.headers.get('Authorization')?.split(' ')[1];

    if (!token) {
      // For frontend routes, redirect to login
      if (!path.startsWith('/api/')) {
        return NextResponse.redirect(new URL('/login', request.url));
      }
      
      // For API routes, return 401 Unauthorized
      return new NextResponse(JSON.stringify({ error: 'Authentication required' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    try {
      // Verify the JWT token
      const secretKey = process.env.JWT_SECRET || 'your-secret-key';
      await jwtVerify(token, new TextEncoder().encode(secretKey));
      
      // Continue to the protected route
      return NextResponse.next();
    } catch (error) {
      // For frontend routes, redirect to login
      if (!path.startsWith('/api/')) {
        return NextResponse.redirect(new URL('/login', request.url));
      }
      
      // For API routes, return 401 Unauthorized
      return new NextResponse(JSON.stringify({ error: 'Invalid token' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }

  // Continue for non-protected routes
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/api/:path*',
    '/dashboard/:path*',
    '/projects/:path*',
    '/tasks/:path*',
    '/events/:path*',
    '/calendar/:path*',
    '/settings/:path*'
  ],
};