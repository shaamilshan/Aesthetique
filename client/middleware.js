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
      
      // Dynamically resolve the backend API URL relative to the active domain (since both are hosted on Vercel)
      const apiBaseUrl = `${url.origin}/api`;
      
      // Redirect crawler to backend share preview route with the frontend origin as a parameter
      return Response.redirect(`${apiBaseUrl}/public/share/product/${productId}?frontend=${encodeURIComponent(url.origin)}`, 302);
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
