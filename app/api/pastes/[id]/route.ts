import { redis } from "@/lib/redis";

type PasteData = {
  content?: string;
  created_at?: string;
  ttl_seconds?: string;
  max_views?: string;
  views?: string;
};

function getNow(req: Request) {
  if (process.env.TEST_MODE === "1") {
    const fake = req.headers.get("x-test-now-ms");
    if (fake) return Number(fake);
  }
  return Date.now();
}

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> } // ✅ Must be a Promise
) {
  const { id } = await params; // ✅ unwrap promise
  const key = `paste:${id}`;

  const data = (await redis.hgetall(key)) as unknown as PasteData;

  if (!data || !data.content) {
    return Response.json({ error: "not_found" }, { status: 404 });
  }

  const now = getNow(req);
  const created = Number(data.created_at);
  const ttl = data.ttl_seconds ? Number(data.ttl_seconds) * 1000 : null;
  const maxViews = data.max_views ? Number(data.max_views) : null;
  const views = Number(data.views || "0");

  // TTL expired
  if (ttl && now >= created + ttl) {
    await redis.del(key);
    return Response.json({ error: "expired" }, { status: 404 });
  }

  // Max views exceeded
  if (maxViews && views >= maxViews) {
    await redis.del(key);
    return Response.json({ error: "view_limit_reached" }, { status: 404 });
  }

  // Increment view count
  await redis.hincrby(key, "views", 1);

  return Response.json({
    content: data.content,
    remaining_views: maxViews ? Math.max(maxViews - (views + 1), 0) : null,
    expires_at: ttl ? new Date(created + ttl).toISOString() : null,
  });
}
