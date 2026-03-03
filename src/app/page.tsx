import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await getServerSession(authOptions);

  if (session) {
    redirect("/timeline");
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="glass-card p-12 text-center max-w-md w-full">
        <p className="text-6xl mb-4 animate-float">🌴</p>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-sunset-500 to-coral-500 bg-clip-text text-transparent">
          TropiTweet
        </h1>
        <p className="mt-4 text-lg text-ocean-700">
          南国風SNSへようこそ
        </p>

        <div className="mt-8 space-y-3">
          <Link
            href="/register"
            className="block w-full tropical-button py-3 text-lg text-center"
          >
            新規登録
          </Link>
          <Link
            href="/login"
            className="block w-full ocean-button py-3 text-lg text-center"
          >
            ログイン
          </Link>
        </div>
      </div>
    </div>
  );
}
