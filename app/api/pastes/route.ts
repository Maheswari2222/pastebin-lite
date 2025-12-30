import { NextResponse } from "next/server";
import { redis } from "@/lib/redis";
import { nanoid } from "nanoid";

const MAX_TTL = 604800; // 7 days
const MAX_VIEWS = 100;

export async function POST(req: Request) {
  try {
    const { content, ttl_seconds, max_views } = await req.json();

    if (!content || typeof content !== "string" || !content.trim()) {
      return NextResponse.json({ error: "Content is required" }, { status: 400 });
    }

    if (ttl_seconds !== undefined) {
      if (typeof ttl_seconds !== "number" || ttl_seconds <= 0 || ttl_seconds > MAX_TTL) {
        return NextResponse.json(
          { error: `ttl_seconds must be between 1 and ${MAX_TTL}` },
          { status: 400 }
        );
      }
    }

    if (max_views !== undefined) {
      if (typeof max_views !== "number" || max_views <= 0 || max_views > MAX_VIEWS) {
        return NextResponse.json(
          { error: `max_views must be between 1 and ${MAX_VIEWS}` },
          { status: 400 }
        );
      }
    }

    const id = nanoid();
    const now = Date.now();

    await redis.hset(`paste:${id}`, {
      content,
      created_at: String(now),
      ttl_seconds: ttl_seconds ? String(ttl_seconds) : "",
      max_views: max_views ? String(max_views) : "",
      views: "0",
    });

    return NextResponse.json({
      url: `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/p/${id}`,
    });
  } catch (err) {
    console.error("API ERROR:", err);
    return NextResponse.json({ error: "Failed to create paste" }, { status: 500 });
  }
}
