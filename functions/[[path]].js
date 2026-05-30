export async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);

  if (request.method !== "GET" && request.method !== "HEAD") {
    return env.ASSETS.fetch(request);
  }

  const assetResponse = await env.ASSETS.fetch(request);
  if (assetResponse.status !== 404 || looksLikeFile(url.pathname)) {
    return assetResponse;
  }

  const accept = request.headers.get("Accept") || "";
  if (!accept.includes("text/html") && !accept.includes("*/*")) {
    return assetResponse;
  }

  const indexUrl = new URL(request.url);
  indexUrl.pathname = "/index.html";
  indexUrl.search = "";
  return env.ASSETS.fetch(new Request(indexUrl, request));
}

function looksLikeFile(pathname) {
  const lastSegment = pathname.split("/").filter(Boolean).pop() || "";
  return /\.[a-z0-9]{2,8}$/i.test(lastSegment);
}
