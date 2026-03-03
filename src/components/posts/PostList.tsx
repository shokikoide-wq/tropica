"use client";

import { useState, useEffect, useCallback } from "react";
import PostCard from "./PostCard";

type Post = {
  id: string;
  content: string;
  createdAt: string;
  likeCount: number;
  isLiked: boolean;
  commentCount: number;
  user: {
    id: string;
    name: string | null;
    username: string;
    image: string | null;
  };
};

export default function PostList({ refreshKey }: { refreshKey: number }) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPosts = useCallback(async () => {
    try {
      const res = await fetch("/api/posts");
      if (res.ok) {
        const data = await res.json();
        setPosts(data);
      }
    } catch {
      // エラー時は何もしない
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts, refreshKey]);

  const handleLikeToggle = async (postId: string) => {
    try {
      const res = await fetch(`/api/posts/${postId}/like`, {
        method: "POST",
      });
      if (res.ok) {
        const data = await res.json();
        setPosts((prev) =>
          prev.map((post) =>
            post.id === postId
              ? { ...post, isLiked: data.isLiked, likeCount: data.likeCount }
              : post
          )
        );
      }
    } catch {
      // エラー時は何もしない
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="glass-card p-4 animate-pulse">
            <div className="flex gap-3">
              <div className="w-10 h-10 rounded-full bg-ocean-200" />
              <div className="flex-1 space-y-3">
                <div className="h-4 bg-ocean-200 rounded w-1/3" />
                <div className="h-4 bg-ocean-100 rounded w-full" />
                <div className="h-4 bg-ocean-100 rounded w-2/3" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="glass-card p-12 text-center">
        <p className="text-4xl mb-4">🏝️</p>
        <p className="text-ocean-600 text-lg">まだ投稿がありません</p>
        <p className="text-ocean-400 mt-2">
          最初の投稿をしてみましょう！
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} onLikeToggle={handleLikeToggle} />
      ))}
    </div>
  );
}
