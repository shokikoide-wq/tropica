"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function SettingsPage() {
  const { data: session, update: updateSession } = useSession();
  const router = useRouter();
  const userId = (session?.user as { id?: string })?.id;

  const [form, setForm] = useState({
    name: "",
    username: "",
    bio: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // 現在のプロフィールを取得
  useEffect(() => {
    if (!userId) return;
    fetch(`/api/users/${userId}`)
      .then((r) => r.json())
      .then((data) => {
        setForm({
          name: data.name || "",
          username: data.username || "",
          bio: data.bio || "",
        });
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [userId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setSaving(true);

    try {
      const res = await fetch("/api/users/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage({ type: "error", text: data.error });
        return;
      }

      // セッション情報も更新
      await updateSession({ name: form.name });
      setMessage({ type: "success", text: "プロフィールを更新しました！" });

      // 2秒後にプロフィールページへ移動
      setTimeout(() => {
        router.push(`/profile/${userId}`);
      }, 2000);
    } catch {
      setMessage({ type: "error", text: "通信エラーが発生しました" });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="glass-card p-8 animate-pulse">
        <div className="h-8 bg-ocean-200 rounded w-1/3 mb-6" />
        <div className="space-y-4">
          <div className="h-12 bg-ocean-100 rounded" />
          <div className="h-12 bg-ocean-100 rounded" />
          <div className="h-24 bg-ocean-100 rounded" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">⚙️ プロフィール編集</h1>

      <form onSubmit={handleSubmit} className="glass-card p-6 space-y-5">
        {/* メッセージ表示 */}
        {message && (
          <div
            className={`px-4 py-3 rounded-xl text-sm ${
              message.type === "success"
                ? "bg-palm-400/10 border border-palm-400/30 text-palm-600"
                : "bg-coral-50 border border-coral-200 text-coral-600"
            }`}
          >
            {message.text}
          </div>
        )}

        {/* アバタープレビュー */}
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-sunset-400 to-coral-400 flex items-center justify-center text-white text-2xl font-bold">
            {form.name?.[0] || "?"}
          </div>
          <div>
            <p className="font-medium text-gray-800">
              {form.name || "名前未設定"}
            </p>
            <p className="text-ocean-400 text-sm">
              @{form.username || "username"}
            </p>
          </div>
        </div>

        {/* 表示名 */}
        <div>
          <label className="block text-sm font-medium text-ocean-800 mb-1">
            表示名
          </label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="あなたの表示名"
            className="w-full px-4 py-3 rounded-xl border border-ocean-200 bg-white/80 focus:outline-none focus:ring-2 focus:ring-ocean-400 focus:border-transparent transition"
          />
        </div>

        {/* ユーザー名 */}
        <div>
          <label className="block text-sm font-medium text-ocean-800 mb-1">
            ユーザー名 <span className="text-coral-500">*</span>
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-ocean-400">
              @
            </span>
            <input
              type="text"
              value={form.username}
              onChange={(e) =>
                setForm({ ...form, username: e.target.value })
              }
              placeholder="username"
              required
              className="w-full pl-8 pr-4 py-3 rounded-xl border border-ocean-200 bg-white/80 focus:outline-none focus:ring-2 focus:ring-ocean-400 focus:border-transparent transition"
            />
          </div>
        </div>

        {/* 自己紹介 */}
        <div>
          <label className="block text-sm font-medium text-ocean-800 mb-1">
            自己紹介
          </label>
          <textarea
            value={form.bio}
            onChange={(e) => setForm({ ...form, bio: e.target.value })}
            placeholder="自己紹介を書いてみよう（160文字まで）"
            rows={4}
            maxLength={160}
            className="w-full px-4 py-3 rounded-xl border border-ocean-200 bg-white/80 focus:outline-none focus:ring-2 focus:ring-ocean-400 focus:border-transparent transition resize-none"
          />
          <p
            className={`text-right text-xs mt-1 ${
              form.bio.length > 140 ? "text-sunset-500" : "text-ocean-400"
            }`}
          >
            {form.bio.length}/160
          </p>
        </div>

        {/* 保存ボタン */}
        <button
          type="submit"
          disabled={saving}
          className="w-full tropical-button py-3 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {saving ? "保存中..." : "プロフィールを保存"}
        </button>
      </form>
    </div>
  );
}
