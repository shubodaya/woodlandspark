export async function onRequestGet({ request, env, params }) {
  if (!env.MEDIA_BUCKET) return new Response("Media bucket is not configured.", { status: 503 });
  const key = Array.isArray(params.path) ? params.path.join("/") : String(params.path || "");
  const object = await env.MEDIA_BUCKET.get(key);
  if (!object) return new Response("Not found", { status: 404 });

  const headers = new Headers();
  object.writeHttpMetadata(headers);
  headers.set("etag", object.httpEtag);
  headers.set("Cache-Control", "public, max-age=31536000, immutable");
  return new Response(object.body, { headers });
}
