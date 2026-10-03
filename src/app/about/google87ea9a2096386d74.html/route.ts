export async function GET() {
  return new Response('google-site-verification: google87ea9a2096386d74.html', {
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'public, max-age=86400',
    },
  });
}
