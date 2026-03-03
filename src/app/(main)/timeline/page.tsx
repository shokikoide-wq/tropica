"use client";

import { useState } from "react";
import PostForm from "@/components/posts/PostForm";
import PostList from "@/components/posts/PostList";

export default function TimelinePage() {
  const [refreshKey, setRefreshKey] = useState(0);

  const handlePostCreated = () => {
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <div className="space-y-6">
      {/* ページヘッダー */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">
          🌊 タイムライン
        </h1>
      </div>

      {/* 投稿フォーム */}
      <PostForm onPostCreated={handlePostCreated} />

      {/* 投稿一覧 */}
      <PostList refreshKey={refreshKey} />
    </div>
  );
}
