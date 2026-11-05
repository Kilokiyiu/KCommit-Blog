/**
 * 共享：把 giscus.app 资源反代到本站，并改写绝对路径。
 */

export const UPSTREAM = 'https://giscus.app';
export const PROXY_PREFIX = '/giscus-proxy';

const LOGIN_PATCH = `<script data-giscus-proxy-patch>
(function () {
  var official = 'https://giscus.app';
  function fix() {
    document.querySelectorAll('a[href]').forEach(function (a) {
      try {
        var u = new URL(a.href, location.href);
        if (u.pathname.indexOf('/api/oauth/authorize') !== -1) {
          a.href = official + '/api/oauth/authorize' + u.search + u.hash;
        }
      } catch (e) {}
    });
  }
  fix();
  new MutationObserver(fix).observe(document.documentElement, { childList: true, subtree: true });
})();
</script>`;

function shouldRewrite(contentType: string | null): boolean {
  if (!contentType) return false;
  return /text\/html|text\/css|javascript|json|text\/plain|xml/i.test(contentType);
}

/** 把 /_next /api 等根路径指到 /giscus-proxy；authorize 仍回官方。 */
export function rewriteGiscusPaths(body: string, proxyOrigin: string): string {
  const base = `${proxyOrigin}${PROXY_PREFIX}`;
  let out = body.split('https://giscus.app').join(base);

  // webpack publicPath：.p="/_next/"
  out = out.split('.p="/_next/"').join(`.p="${PROXY_PREFIX}/_next/"`);
  out = out.split(".p='/_next/'").join(`.p='${PROXY_PREFIX}/_next/'`);

  // 尚未带前缀的绝对路径（避免把已改写的再加一层）
  out = out.replace(/(?<!\/giscus-proxy)\/_next\//g, `${PROXY_PREFIX}/_next/`);
  out = out.replace(/(?<!\/giscus-proxy)\/api\//g, `${PROXY_PREFIX}/api/`);
  out = out.replace(/(?<!\/giscus-proxy)\/themes\//g, `${PROXY_PREFIX}/themes/`);
  out = out.replace(/(?<!\/giscus-proxy)\/locales\//g, `${PROXY_PREFIX}/locales/`);

  const rooted = [
    '/favicon',
    '/apple-touch-icon',
    '/site.webmanifest',
    '/default.css',
    '/client.js',
  ];
  for (const path of rooted) {
    const prefixed = `${PROXY_PREFIX}${path}`;
    out = out.split(`"${path}`).join(`"${prefixed}`);
    out = out.split(`'${path}`).join(`'${prefixed}`);
    out = out.split(`\`${path}`).join(`\`${prefixed}`);
  }

  const authorizeOfficial = 'https://giscus.app/api/oauth/authorize';
  out = out.split(`${base}/api/oauth/authorize`).join(authorizeOfficial);
  out = out.split(`${PROXY_PREFIX}/api/oauth/authorize`).join(authorizeOfficial);
  out = out.split(`${base}/login`).join('https://giscus.app/login');

  return out;
}

/**
 * @param upstreamPath 发往 giscus.app 的路径，如 /_next/static/... 或 /zh-CN/widget
 */
export async function proxyGiscusRequest(
  request: Request,
  upstreamPath: string,
): Promise<Response> {
  const incoming = new URL(request.url);

  if (
    request.method === 'GET' &&
    (upstreamPath === '/api/oauth/authorize' || upstreamPath.startsWith('/api/oauth/authorize'))
  ) {
    return Response.redirect(`https://giscus.app/api/oauth/authorize${incoming.search}`, 302);
  }

  const target = new URL(upstreamPath + incoming.search, UPSTREAM);

  const reqHeaders = new Headers(request.headers);
  reqHeaders.set('Host', 'giscus.app');
  reqHeaders.delete('accept-encoding');
  reqHeaders.delete('cf-connecting-ip');
  reqHeaders.delete('cf-ipcountry');
  reqHeaders.delete('x-forwarded-for');
  reqHeaders.delete('x-real-ip');

  const upstream = await fetch(target.toString(), {
    method: request.method,
    headers: reqHeaders,
    body: request.method === 'GET' || request.method === 'HEAD' ? undefined : request.body,
    redirect: 'manual',
  });

  if (upstream.status >= 300 && upstream.status < 400) {
    const location = upstream.headers.get('location');
    if (location) {
      const headers = new Headers();
      headers.set('location', location);
      return new Response(null, { status: upstream.status, headers });
    }
  }

  const outHeaders = new Headers(upstream.headers);
  outHeaders.delete('content-security-policy');
  outHeaders.delete('content-security-policy-report-only');
  outHeaders.delete('x-frame-options');
  outHeaders.delete('strict-transport-security');
  outHeaders.delete('content-encoding');
  outHeaders.delete('content-length');

  const contentType = upstream.headers.get('content-type') || '';

  if (!shouldRewrite(contentType)) {
    return new Response(upstream.body, {
      status: upstream.status,
      statusText: upstream.statusText,
      headers: outHeaders,
    });
  }

  let body = await upstream.text();
  body = rewriteGiscusPaths(body, incoming.origin);

  if (contentType.includes('text/html')) {
    body = body.replace(/<base\b[^>]*>/gi, '');
    if (body.includes('</head>')) {
      body = body.replace('</head>', `${LOGIN_PATCH}</head>`);
    } else {
      body += LOGIN_PATCH;
    }
  }

  return new Response(body, {
    status: upstream.status,
    statusText: upstream.statusText,
    headers: outHeaders,
  });
}
