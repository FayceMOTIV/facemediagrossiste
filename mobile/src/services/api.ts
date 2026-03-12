// Base URL of the Next.js web app
const API_BASE = process.env.EXPO_PUBLIC_API_URL ?? 'https://facemediagrossiste.web.app';

export async function sendNotification(payload: {
  token: string;
  title: string;
  body: string;
  data?: Record<string, string>;
}) {
  const res = await fetch(`${API_BASE}/api/notifications/send`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return res.json();
}
