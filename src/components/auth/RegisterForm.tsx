"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterForm() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "登録に失敗しました");
        return;
      }

      router.push("/login?registered=true");
    } catch {
      setError("通信エラーが発生しました");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-coral-50 border border-coral-200 text-coral-600 px-4 py-3 rounded-xl text-sm">
          {error}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-ocean-800 mb-1">
          表示名
        </label>
        <input
          type="text"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          placeholder="トロピカル太郎"
          className="w-full px-4 py-3 rounded-xl border border-ocean-200 bg-white/80 focus:outline-none focus:ring-2 focus:ring-ocean-400 focus:border-transparent transition"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-ocean-800 mb-1">
          ユーザー名 <span className="text-coral-500">*</span>
        </label>
        <input
          type="text"
          value={form.username}
          onChange={(e) => setForm({ ...form, username: e.target.value })}
          placeholder="tropical_taro"
          required
          className="w-full px-4 py-3 rounded-xl border border-ocean-200 bg-white/80 focus:outline-none focus:ring-2 focus:ring-ocean-400 focus:border-transparent transition"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-ocean-800 mb-1">
          メールアドレス <span className="text-coral-500">*</span>
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
          パスワード <span className="text-coral-500">*</span>
        </label>
        <input
          type="password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          placeholder="6文字以上"
          required
          minLength={6}
          className="w-full px-4 py-3 rounded-xl border border-ocean-200 bg-white/80 focus:outline-none focus:ring-2 focus:ring-ocean-400 focus:border-transparent transition"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full tropical-button py-3 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? "登録中..." : "アカウントを作成"}
      </button>
    </form>
  );
}
