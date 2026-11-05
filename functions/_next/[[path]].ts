import { proxyGiscusRequest } from '../_lib/giscus-proxy';

/** webpack 动态 chunk 可能仍请求 /_next/*，在此兜底反代。 */
export async function onRequest(context: { request: Request }): Promise<Response> {
  const incoming = new URL(context.request.url);
  return proxyGiscusRequest(context.request, incoming.pathname);
}
