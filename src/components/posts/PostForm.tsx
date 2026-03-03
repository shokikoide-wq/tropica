"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";

export default function PostForm({
  onPostCreated,
}: {
  onPostCreated: () => void;
}) {
  const { data: session } = useSession();
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  const charCount = content.length;
  const isOverLimit = charCount > 280;
  const isEmpty = content.trim().length === 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isEmpty || isOverLimit || loading) return;

    setLoading(true);
    try {
      const res = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });

      if (res.ok) {
        setContent("");
        onPostCreated();
      }
    } catch {
      // エラー時は何もしない
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="glass-card p-4">
      <div className="flex gap-3">
        {/* アバター */}
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-sunset-400 to-coral-400 flex items-center justify-center text-white font-bold flex-shrink-0">
          {session?.user?.name?.[0] || "?"}
        </div>

        {/* 入力エリア */}
        <div className="flex-1">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="いま何してる？ 🌊"
            rows={3}
            className="w-full resize-none bg-transparent text-gray-800 placeholder-ocean-300 focus:outline-none text-lg"
          />

          {/* 下部バー */}
          <div className="flex items-center justify-between pt-2 border-t border-ocean-100">
            {/* 文字数カウンター */}
            <span
              className={`text-sm ${
                isOverLimit
                  ? "text-coral-500 font-semibold"
                  : charCount > 250
                  ? "text-sunset-500"
                  : "text-ocean-400"
              }`}
            >
              {charCount}/280
            </span>

            {/* 投稿ボタン */}
            <button
              type="submit"
              disabled={isEmpty || isOverLimit || loading}
              className="tropical-button px-6 py-2 text-sm disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
            >
              {loading ? "投稿中..." : "投稿する"}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}
