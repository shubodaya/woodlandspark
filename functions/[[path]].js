export async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);

  if (request.method !== "GET" && request.method !== "HEAD") {
    return env.ASSETS.fetch(request);
  }

  const accept = request.headers.get("Accept") || "";
  if (!looksLikeFile(url.pathname) && acceptsHtml(accept)) {
    return fetchIndex(request, env);
  }

  const assetResponse = await env.ASSETS.fetch(request);
  if (assetResponse.status !== 404) {
    return assetResponse;
  }

  if (acceptsHtml(accept)) {
    return fetchIndex(request, env);
  }

  return assetResponse;
}

function fetchIndex(request, env) {
  const indexUrl = new URL(request.url);
  indexUrl.pathname = "/index.html";
  indexUrl.search = "";
  return env.ASSETS.fetch(new Request(indexUrl, request));
}

function acceptsHtml(accept) {
  return accept.includes("text/html") || accept.includes("*/*");
}

function looksLikeFile(pathname) {
  const lastSegment = pathname.split("/").filter(Boolean).pop() || "";
  return /\.[a-z0-9]{2,8}$/i.test(lastSegment);
}
