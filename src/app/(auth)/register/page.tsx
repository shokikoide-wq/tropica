import Link from "next/link";
import RegisterForm from "@/components/auth/RegisterForm";

export default function RegisterPage() {
  return (
    <div className="glass-card p-8">
      <div className="text-center mb-8">
        <p className="text-4xl mb-2">🌺</p>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-sunset-500 to-coral-500 bg-clip-text text-transparent">
          TropiTweet
        </h1>
        <p className="text-ocean-600 mt-2">新しいアカウントを作成</p>
      </div>

      <RegisterForm />

      <p className="text-center mt-6 text-sm text-ocean-600">
        既にアカウントをお持ちですか？{" "}
        <Link
          href="/login"
          className="text-sunset-500 font-semibold hover:text-sunset-600"
        >
          ログイン
        </Link>
      </p>
    </div>
  );
}
