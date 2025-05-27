const API_BASE =  import.meta.env.VITE_APP_API_BASE || "http://localhost:4000";

export async function createShortUrl(orgUrl, expiresIn) {
  const res = await fetch(`${API_BASE}/create`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ orgUrl, expiresIn })
  });
  const { shortUrl } = await res.json();
  return shortUrl;
}

export async function getClickCount(shortUrl) {
  const slug = shortUrl.split('/').pop();
  const res  = await fetch(`${API_BASE}/analytics/${slug}`);
  const { clicks } = await res.json();
  return clicks;
}
