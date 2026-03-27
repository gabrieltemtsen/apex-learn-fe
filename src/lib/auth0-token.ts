let accessTokenGetter: (() => Promise<string | null>) | null = null;

export function registerAccessTokenGetter(fn: () => Promise<string | null>) {
  accessTokenGetter = fn;
}

export async function getAccessToken(): Promise<string | null> {
  if (!accessTokenGetter) return null;
  try {
    return await accessTokenGetter();
  } catch {
    return null;
  }
}
