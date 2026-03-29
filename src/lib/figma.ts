const FIGMA_CLIENT_ID = import.meta.env.VITE_FIGMA_CLIENT_ID;
const FIGMA_REDIRECT_URI = import.meta.env.VITE_FIGMA_REDIRECT_URI;
const STORAGE_KEY = "figma_connection";

export interface FigmaConnection {
  access_token: string;
  refresh_token: string;
  expires_at: number;
  user_id: string;
  handle: string;
  email: string;
}

export function getFigmaAuthUrl(state: string): string {
  const params = new URLSearchParams({
    client_id: FIGMA_CLIENT_ID,
    redirect_uri: FIGMA_REDIRECT_URI,
    scope: "files:read,file_dev_resources:write",
    state,
    response_type: "code",
  });
  return `https://www.figma.com/oauth?${params.toString()}`;
}

export function saveFigmaConnection(connection: FigmaConnection): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(connection));
}

export function getFigmaConnection(): FigmaConnection | null {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return null;
  try {
    const connection: FigmaConnection = JSON.parse(stored);
    if (connection.expires_at && Date.now() > connection.expires_at) {
      return null;
    }
    return connection;
  } catch {
    return null;
  }
}

export function clearFigmaConnection(): void {
  localStorage.removeItem(STORAGE_KEY);
}
