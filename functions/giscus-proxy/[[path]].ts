import { PROXY_PREFIX, proxyGiscusRequest } from '../_lib/giscus-proxy';

export async function onRequest(context: { request: Request }): Promise<Response> {
  const incoming = new URL(context.request.url);
  const suffix = incoming.pathname.slice(PROXY_PREFIX.length) || '/';
  return proxyGiscusRequest(context.request, suffix);
}
