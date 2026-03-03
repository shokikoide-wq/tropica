"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const registered = searchParams.get("registered");

  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await signIn("credentials", {
        email: form.email,
        password: form.password,
        redirect: false,
      });

      if (result?.error) {
        setError("メールアドレスまたはパスワードが正しくありません");
        return;
      }

      router.push("/timeline");
      router.refresh();
    } catch {
      setError("通信エラーが発生しました");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {registered && (
        <div className="bg-palm-400/10 border border-palm-400/30 text-palm-600 px-4 py-3 rounded-xl text-sm">
          アカウントが作成されました！ログインしてください
        </div>
      )}

      {error && (
        <div className="bg-coral-50 border border-coral-200 text-coral-600 px-4 py-3 rounded-xl text-sm">
          {error}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-ocean-800 mb-1">
          メールアドレス
        </label>
        <input
          type="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          placeholder="taro@example.com"
          required
          className="w-full px-4 py-3 rounded-xl border border-ocean-200 bg-white/80 focus:outline-none focus:ring-2 focus:ring-ocean-400 focus:border-transparent transition"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-ocean-800 mb-1">
          パスワード
        </label>
        <input
          type="password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          placeholder="パスワードを入力"
          required
          className="w-full px-4 py-3 rounded-xl border border-ocean-200 bg-white/80 focus:outline-none focus:ring-2 focus:ring-ocean-400 focus:border-transparent transition"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full tropical-button py-3 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? "ログイン中..." : "ログイン"}
      </button>
    </form>
  );
}
