"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const userId = (session?.user as { id?: string })?.id;

  const navItems = [
    { href: "/timeline", label: "ホーム", icon: "🏠" },
    { href: `/profile/${userId}`, label: "プロフィール", icon: "🌺" },
    { href: "/settings", label: "設定", icon: "⚙️" },
  ];

  return (
    <aside
      className="hidden md:flex w-16 lg:w-64 h-screen sticky top-0 flex-col p-2 lg:p-4 transition-all"
      style={{
        background: "linear-gradient(180deg, #115e59 0%, #134e4a 100%)",
      }}
    >
      {/* ロゴ */}
      <Link
        href="/timeline"
        className="flex items-center gap-2 px-2 lg:px-4 py-3 mb-6 justify-center lg:justify-start"
      >
        <span className="text-2xl">🌴</span>
        <span className="text-xl font-bold text-white hidden lg:block">
          TropiTweet
        </span>
      </Link>

      {/* ナビゲーション */}
      <nav className="flex-1 space-y-1">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href ||
            pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-2 lg:px-4 py-3 rounded-xl transition-all text-lg justify-center lg:justify-start ${
                isActive
                  ? "bg-white/20 text-white font-semibold"
                  : "text-white/70 hover:bg-white/10 hover:text-white"
              }`}
              title={item.label}
            >
              <span className="text-xl">{item.icon}</span>
              <span className="hidden lg:block">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* ユーザー情報 & ログアウト */}
      {session?.user && (
        <div className="border-t border-white/20 pt-4 mt-4">
          <div className="flex items-center gap-3 px-2 lg:px-4 py-2 justify-center lg:justify-start">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-sunset-400 to-coral-400 flex items-center justify-center text-white font-bold flex-shrink-0">
              {session.user.name?.[0] || "?"}
            </div>
            <div className="flex-1 min-w-0 hidden lg:block">
              <p className="text-white font-medium text-sm truncate">
                {session.user.name}
              </p>
              <p className="text-white/50 text-xs truncate">
                {session.user.email}
              </p>
            </div>
          </div>
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="w-full mt-2 px-2 lg:px-4 py-2 text-white/60 hover:text-white hover:bg-white/10 rounded-xl transition-all text-sm text-center lg:text-left"
            title="ログアウト"
          >
            <span className="lg:hidden">🚪</span>
            <span className="hidden lg:inline">🚪 ログアウト</span>
          </button>
        </div>
      )}
    </aside>
  );
}
