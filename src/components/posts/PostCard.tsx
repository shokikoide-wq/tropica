"use client";

import Link from "next/link";
import { useState } from "react";

type Comment = {
  id: string;
  content: string;
  createdAt: string;
  user: {
    id: string;
    name: string | null;
    username: string;
    image: string | null;
  };
};

type PostCardProps = {
  post: {
    id: string;
    content: string;
    createdAt: string;
    likeCount: number;
    isLiked: boolean;
    commentCount?: number;
    user: {
      id: string;
      name: string | null;
      username: string;
      image: string | null;
    };
  };
  onLikeToggle?: (postId: string) => void;
};

function timeAgo(dateString: string): string {
  const now = new Date();
  const date = new Date(dateString);
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (seconds < 60) return "たった今";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}分前`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}時間前`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}日前`;
  return date.toLocaleDateString("ja-JP");
}

export default function PostCard({ post, onLikeToggle }: PostCardProps) {
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentText, setCommentText] = useState("");
  const [loadingComments, setLoadingComments] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [commentCount, setCommentCount] = useState(post.commentCount || 0);

  const toggleComments = async () => {
    if (!showComments) {
      // コメント欄を開くとき：コメントを読み込む
      setLoadingComments(true);
      try {
        const res = await fetch(`/api/posts/${post.id}/comments`);
        if (res.ok) {
          const data = await res.json();
          setComments(data);
        }
      } catch {
        // エラー時は空のまま
      } finally {
        setLoadingComments(false);
      }
    }
    setShowComments(!showComments);
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim() || submitting) return;

    setSubmitting(true);
    try {
      const res = await fetch(`/api/posts/${post.id}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: commentText.trim() }),
      });
      if (res.ok) {
        const data = await res.json();
        setComments((prev) => [...prev, data.comment]);
        setCommentCount(data.commentCount);
        setCommentText("");
      }
    } catch {
      // エラー時は何もしない
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="glass-card p-4 hover:bg-white/80 transition-colors">
      <div className="flex gap-3">
        {/* アバター */}
        <Link href={`/profile/${post.user.id}`} className="flex-shrink-0">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-ocean-400 to-ocean-600 flex items-center justify-center text-white font-bold">
            {post.user.name?.[0] || "?"}
          </div>
        </Link>

        {/* コンテンツ */}
        <div className="flex-1 min-w-0">
          {/* ヘッダー */}
          <div className="flex items-center gap-1 sm:gap-2 flex-wrap">
            <Link
              href={`/profile/${post.user.id}`}
              className="font-semibold text-gray-800 hover:text-ocean-600 truncate text-sm sm:text-base"
            >
              {post.user.name}
            </Link>
            <span className="text-ocean-400 text-xs sm:text-sm truncate">
              @{post.user.username}
            </span>
            <span className="text-ocean-300 text-xs sm:text-sm">·</span>
            <span className="text-ocean-400 text-xs sm:text-sm whitespace-nowrap">
              {timeAgo(post.createdAt)}
            </span>
          </div>

          {/* 投稿本文 */}
          <p className="mt-1 text-gray-700 whitespace-pre-wrap break-words">
            {post.content}
          </p>

          {/* アクションバー */}
          <div className="flex items-center gap-6 mt-3">
            {/* コメントボタン */}
            <button
              onClick={toggleComments}
              className={`flex items-center gap-1 transition-all ${
                showComments
                  ? "text-ocean-600"
                  : "text-ocean-400 hover:text-ocean-600"
              }`}
            >
              <span className="text-lg">💬</span>
              <span className="text-sm">{commentCount || ""}</span>
            </button>

            {/* いいねボタン */}
            <button
              onClick={() => onLikeToggle?.(post.id)}
              className={`flex items-center gap-1 transition-all ${
                post.isLiked
                  ? "text-coral-500"
                  : "text-ocean-400 hover:text-coral-400"
              }`}
            >
              <span
                className={`text-lg ${post.isLiked ? "animate-like-pop" : ""}`}
              >
                {post.isLiked ? "❤️" : "🤍"}
              </span>
              <span className="text-sm">{post.likeCount || ""}</span>
            </button>
          </div>

          {/* コメントセクション */}
          {showComments && (
            <div className="mt-4 border-t border-ocean-100 pt-3">
              {/* コメント入力フォーム */}
              <form onSubmit={handleSubmitComment} className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="コメントを書く..."
                  maxLength={280}
                  className="flex-1 px-3 py-2 text-sm rounded-full border border-ocean-200 bg-white/80 focus:outline-none focus:ring-2 focus:ring-ocean-400 focus:border-transparent"
                />
                <button
                  type="submit"
                  disabled={!commentText.trim() || submitting}
                  className="px-4 py-2 text-sm rounded-full ocean-button disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                >
                  {submitting ? "..." : "送信"}
                </button>
              </form>

              {/* コメント一覧 */}
              {loadingComments ? (
                <div className="text-center py-3">
                  <span className="text-ocean-400 text-sm">読み込み中...</span>
                </div>
              ) : comments.length === 0 ? (
                <p className="text-ocean-400 text-sm text-center py-2">
                  まだコメントはありません。最初のコメントを書いてみよう！
                </p>
              ) : (
                <div className="space-y-3">
                  {comments.map((comment) => (
                    <div key={comment.id} className="flex gap-2">
                      <Link
                        href={`/profile/${comment.user.id}`}
                        className="flex-shrink-0"
                      >
                        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-palm-400 to-ocean-400 flex items-center justify-center text-white text-xs font-bold">
                          {comment.user.name?.[0] || "?"}
                        </div>
                      </Link>
                      <div className="flex-1 min-w-0">
                        <div className="bg-ocean-50/50 rounded-xl px-3 py-2">
                          <div className="flex items-center gap-1 flex-wrap">
                            <Link
                              href={`/profile/${comment.user.id}`}
                              className="font-medium text-gray-800 text-xs hover:text-ocean-600"
                            >
                              {comment.user.name}
                            </Link>
                            <span className="text-ocean-400 text-xs">
                              @{comment.user.username}
                            </span>
                          </div>
                          <p className="text-gray-700 text-sm mt-0.5 break-words">
                            {comment.content}
                          </p>
                        </div>
                        <span className="text-ocean-400 text-xs ml-2">
                          {timeAgo(comment.createdAt)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
