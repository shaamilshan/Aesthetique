// Vercel Edge Middleware to handle crawler bots for SPAs
export default function middleware(request) {
  const userAgent = request.headers.get('user-agent') || '';
  const isBot = /WhatsApp|facebookexternalhit|twitterbot|discordbot|slackbot/i.test(userAgent);

  if (isBot) {
    const url = new URL(request.url);
    // Match /product/:id
    const match = url.pathname.match(/^\/product\/([a-zA-Z0-9_-]+)/);
    if (match) {
      const productId = match[1];
      
      // Read VITE_BASE_URL environment variable configured in Vercel settings
      let apiBaseUrl = process.env.VITE_BASE_URL || 'http://localhost:3000/api';
      
      // Strip trailing slash if any
      if (apiBaseUrl.endsWith('/')) {
        apiBaseUrl = apiBaseUrl.slice(0, -1);
      }

      // Redirect crawler to backend share preview route
      return Response.redirect(`${apiBaseUrl}/public/share/product/${productId}`, 302);
    }
  }

  // Pass request to react router for normal browsers
  return new Response(null, {
    headers: { 'x-middleware-next': '1' }
  });
}

export const config = {
  matcher: '/product/:path*',
};
