"use client";
import { useState } from "react";

export default function Home() {
  const [content, setContent] = useState("");
  const [ttl, setTtl] = useState("");
  const [views, setViews] = useState("");
  const [link, setLink] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const MAX_TTL = 604800; // 7 days
  const MAX_VIEWS = 100;

  async function create() {
    setError(null);
    setLink("");

    // ---- UI VALIDATION ----
    if (!content.trim()) return setError("Content is required");

    let ttlVal: number | undefined = undefined;
    let viewsVal: number | undefined = undefined;

    if (ttl.trim()) {
      ttlVal = Number(ttl);
      if (isNaN(ttlVal) || ttlVal <= 0)
        return setError("TTL must be a positive number");
      if (ttlVal > MAX_TTL)
        return setError("Max TTL is 7 days (604800 seconds)");
    }

    if (views.trim()) {
      viewsVal = Number(views);
      if (isNaN(viewsVal) || viewsVal <= 0)
        return setError("Max views must be a positive number");
      if (viewsVal > MAX_VIEWS)
        return setError("Max views cannot exceed 100");
    }

    setLoading(true);

    try {
      const res = await fetch("/api/pastes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content,
          ttl_seconds: ttlVal,
          max_views: viewsVal,
        }),
      });

      const data = await res.json();

      if (!res.ok) return setError(data.error || "Failed to create paste");

      setLink(data.url);
      setContent("");
      setTtl("");
      setViews("");
    } catch {
      setError("Network error — try again");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main
      className="min-h-screen flex flex-col items-center justify-center px-4"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=1470&q=80')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="bg-black/60 p-8 rounded-2xl shadow-2xl max-w-3xl w-full backdrop-blur-sm text-white">
        <h1 className="text-4xl font-bold mb-4 text-center">
          Pastebin Lite
        </h1>
        <p className="text-center text-gray-300 mb-6">
          Quickly share code snippets, notes, and more. Set TTL and view limits.
        </p>

        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full h-40 p-4 rounded-lg bg-black/40 border border-gray-700 outline-none placeholder-gray-400 mb-4"
          placeholder="Write your paste here..."
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <input
            className="bg-black/40 border border-gray-700 p-2 rounded-lg placeholder-gray-400"
            placeholder="TTL seconds (optional, max 604800)"
            value={ttl}
            onChange={(e) => setTtl(e.target.value)}
          />
          <input
            className="bg-black/40 border border-gray-700 p-2 rounded-lg placeholder-gray-400"
            placeholder="Max views (optional, max 100)"
            value={views}
            onChange={(e) => setViews(e.target.value)}
          />
        </div>

        {error && (
          <div className="bg-red-800/40 border border-red-600 text-red-300 p-2 rounded-lg mb-4">
            {error}
          </div>
        )}

        <button
          onClick={create}
          disabled={loading}
          className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-purple-600 hover:to-blue-500 transition-colors py-3 rounded-xl font-semibold text-lg disabled:opacity-50 mb-4"
        >
          {loading ? "Creating..." : "Create Paste"}
        </button>

        {link && (
          <p className="text-center mb-6">
            Your link:{" "}
            <a
              className="text-blue-400 underline"
              href={link}
              target="_blank"
            >
              {link}
            </a>
          </p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center text-gray-300">
          <div className="p-4 bg-black/30 rounded-lg shadow-md">
            <h2 className="font-bold text-lg">Fast & Simple</h2>
            <p>Create and share pastes in seconds.</p>
          </div>
          <div className="p-4 bg-black/30 rounded-lg shadow-md">
            <h2 className="font-bold text-lg">Set Expiry & Limits</h2>
            <p>Choose expiration time and view limits.</p>
          </div>
          <div className="p-4 bg-black/30 rounded-lg shadow-md">
            <h2 className="font-bold text-lg">Secure & Private</h2>
            <p>Your pastes are safe and private.</p>
          </div>
        </div>
      </div>
    </main>
  );
}
