"use client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function PastePage() {
  const { id } = useParams<{ id: string }>();

  const [content, setContent] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [remainingViews, setRemainingViews] = useState<number | null>(null);
  const [expiresAt, setExpiresAt] = useState<string | null>(null);

  useEffect(() => {
    async function loadPaste() {
      setLoading(true);
      try {
        const res = await fetch(`/api/pastes/${id}`);
        const data = await res.json();

        if (!res.ok) {
          if (data.error === "expired")
            setError("⏰ Paste expired — TTL exceeded");
          else if (data.error === "view_limit_reached")
            setError("👀 View limit exceeded — paste no longer available");
          else setError("❌ Paste not found");
        } else {
          setContent(data.content);
          setRemainingViews(data.remaining_views ?? null);
          setExpiresAt(data.expires_at ?? null);
        }
      } catch {
        setError("Network error — try again.");
      } finally {
        setLoading(false);
      }
    }

    if (id) loadPaste();
  }, [id]);

  if (loading)
    return (
      <main className="min-h-screen flex items-center justify-center text-gray-800">
        Loading...
      </main>
    );

  return (
    <main
      className="min-h-screen flex flex-col items-center justify-center px-4"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1470&q=80')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="bg-white/90 p-8 rounded-2xl shadow-2xl max-w-3xl w-full backdrop-blur-sm text-gray-900 space-y-4">
        <h1 className="text-3xl font-bold mb-2 text-center">Paste</h1>

        {/* TTL and remaining views using emojis */}
        <div className="flex justify-center gap-6 text-gray-700">
          {expiresAt && (
            <div className="flex items-center gap-1">
              <span>⏰</span>
              <span>{new Date(expiresAt).toLocaleString()}</span>
            </div>
          )}
          {remainingViews !== null && (
            <div className="flex items-center gap-1">
              <span>👀</span>
              <span>{remainingViews} views left</span>
            </div>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 p-3 rounded-lg text-center">
            {error}
          </div>
        )}

        {/* Paste Content */}
        {!error && content && (
          <pre className="bg-gray-100 border border-gray-300 p-6 rounded-lg text-gray-900 whitespace-pre-wrap overflow-x-auto">
            {content}
          </pre>
        )}
      </div>
    </main>
  );
}
