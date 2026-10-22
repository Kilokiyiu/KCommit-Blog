/** 未设置时走本地 Content Collections + site.ts */
export function getApiBaseUrl(): string | undefined {
  const base = import.meta.env.PUBLIC_API_BASE_URL as string | undefined;
  if (!base || !base.trim()) return undefined;
  return base.replace(/\/$/, '');
}

export function useRemoteApi(): boolean {
  return Boolean(getApiBaseUrl());
}
