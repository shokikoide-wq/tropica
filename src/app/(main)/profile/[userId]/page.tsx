"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import PostCard from "@/components/posts/PostCard";

type UserProfile = {
  id: string;
  name: string | null;
  username: string;
  bio: string;
  image: string | null;
  createdAt: string;
  postCount: number;
  followerCount: number;
  followingCount: number;
  isFollowing: boolean;
  isOwnProfile: boolean;
  posts: {
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
  }[];
};

export default function ProfilePage() {
  const params = useParams();
  const userId = params.userId as string;
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = useCallback(async () => {
    try {
      const res = await fetch(`/api/users/${userId}`);
      if (res.ok) {
        const data = await res.json();
        setProfile(data);
      }
    } catch {
      // エラー時は何もしない
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const handleFollow = async () => {
    if (!profile) return;
    try {
      const res = await fetch(`/api/users/${userId}/follow`, {
        method: "POST",
      });
      if (res.ok) {
        const data = await res.json();
        setProfile((prev) =>
          prev
            ? {
                ...prev,
                isFollowing: data.isFollowing,
                followerCount: data.followerCount,
              }
            : null
        );
      }
    } catch {
      // エラー時は何もしない
    }
  };

  const handleLikeToggle = async (postId: string) => {
    try {
      const res = await fetch(`/api/posts/${postId}/like`, {
        method: "POST",
      });
      if (res.ok) {
        const data = await res.json();
        setProfile((prev) =>
          prev
            ? {
                ...prev,
                posts: prev.posts.map((post) =>
                  post.id === postId
                    ? {
                        ...post,
                        isLiked: data.isLiked,
                        likeCount: data.likeCount,
                      }
                    : post
                ),
              }
            : null
        );
      }
    } catch {
      // エラー時は何もしない
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="glass-card p-8 animate-pulse">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-full bg-ocean-200" />
            <div className="space-y-2 flex-1">
              <div className="h-6 bg-ocean-200 rounded w-1/3" />
              <div className="h-4 bg-ocean-100 rounded w-1/4" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="glass-card p-12 text-center">
        <p className="text-4xl mb-4">🏝️</p>
        <p className="text-ocean-600 text-lg">ユーザーが見つかりません</p>
      </div>
    );
  }

  const joinDate = new Date(profile.createdAt).toLocaleDateString("ja-JP", {
    year: "numeric",
    month: "long",
  });

  return (
    <div className="space-y-6">
      {/* プロフィールヘッダー */}
      <div className="glass-card overflow-hidden">
        {/* カバー画像（グラデーション） */}
        <div
          className="h-32"
          style={{
            background:
              "linear-gradient(135deg, #f97316 0%, #f43f5e 40%, #14b8a6 100%)",
          }}
        />

        <div className="px-4 sm:px-6 pb-6">
          {/* アバターとアクション */}
          <div className="flex items-end justify-between -mt-10 mb-4">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-sunset-400 to-coral-400 flex items-center justify-center text-white text-2xl sm:text-3xl font-bold border-4 border-white shadow-lg">
              {profile.name?.[0] || "?"}
            </div>

            {!profile.isOwnProfile && (
              <button
                onClick={handleFollow}
                className={`px-6 py-2 rounded-full font-semibold transition-all ${
                  profile.isFollowing
                    ? "bg-ocean-100 text-ocean-700 hover:bg-coral-100 hover:text-coral-600"
                    : "ocean-button"
                }`}
              >
                {profile.isFollowing ? "フォロー中" : "フォローする"}
              </button>
            )}
          </div>

          {/* ユーザー名 */}
          <h1 className="text-2xl font-bold text-gray-800">
            {profile.name}
          </h1>
          <p className="text-ocean-500">@{profile.username}</p>

          {/* 自己紹介 */}
          {profile.bio && (
            <p className="mt-3 text-gray-600">{profile.bio}</p>
          )}

          {/* 参加日 */}
          <p className="mt-2 text-ocean-400 text-sm">
            🌴 {joinDate}から利用
          </p>

          {/* 統計 */}
          <div className="flex gap-4 sm:gap-6 mt-4 text-sm sm:text-base">
            <div>
              <span className="font-bold text-gray-800">
                {profile.postCount}
              </span>
              <span className="text-ocean-500 ml-1">投稿</span>
            </div>
            <div>
              <span className="font-bold text-gray-800">
                {profile.followingCount}
              </span>
              <span className="text-ocean-500 ml-1">フォロー</span>
            </div>
            <div>
              <span className="font-bold text-gray-800">
                {profile.followerCount}
              </span>
              <span className="text-ocean-500 ml-1">フォロワー</span>
            </div>
          </div>
        </div>
      </div>

      {/* ユーザーの投稿 */}
      <div>
        <h2 className="text-lg font-semibold text-gray-700 mb-3">
          📝 投稿一覧
        </h2>
        {profile.posts.length === 0 ? (
          <div className="glass-card p-8 text-center">
            <p className="text-ocean-400">まだ投稿がありません</p>
          </div>
        ) : (
          <div className="space-y-3">
            {profile.posts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                onLikeToggle={handleLikeToggle}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
