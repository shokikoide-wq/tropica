import Link from "next/link";
import LoginForm from "@/components/auth/LoginForm";
import { Suspense } from "react";

export default function LoginPage() {
  return (
    <div className="glass-card p-8">
      <div className="text-center mb-8">
        <p className="text-4xl mb-2">🌴</p>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-sunset-500 to-coral-500 bg-clip-text text-transparent">
          TropiTweet
        </h1>
        <p className="text-ocean-600 mt-2">ログインしてはじめよう</p>
      </div>

      <Suspense fallback={<div className="text-center text-ocean-400">読み込み中...</div>}>
        <LoginForm />
      </Suspense>

      <p className="text-center mt-6 text-sm text-ocean-600">
        アカウントをお持ちでないですか？{" "}
        <Link
          href="/register"
          className="text-sunset-500 font-semibold hover:text-sunset-600"
        >
          新規登録
        </Link>
      </p>
    </div>
  );
}
