"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { usePathname } from "next/navigation";
import { useState } from "react";

export default function MobileNav() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const userId = (session?.user as { id?: string })?.id;
  const [showMenu, setShowMenu] = useState(false);

  const navItems = [
    { href: "/timeline", label: "ホーム", icon: "🏠" },
    { href: `/profile/${userId}`, label: "プロフィール", icon: "🌺" },
    { href: "/settings", label: "設定", icon: "⚙️" },
  ];

  return (
    <>
      {/* スマホ上部ヘッダー */}
      <header
        className="md:hidden fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-4 py-3 border-b border-white/20"
        style={{
          background:
            "linear-gradient(135deg, #115e59 0%, #134e4a 100%)",
        }}
      >
        <Link href="/timeline" className="flex items-center gap-2">
          <span className="text-xl">🌴</span>
          <span className="text-lg font-bold text-white">TropiTweet</span>
        </Link>
        <button
          onClick={() => setShowMenu(!showMenu)}
          className="w-8 h-8 rounded-full bg-gradient-to-br from-sunset-400 to-coral-400 flex items-center justify-center text-white font-bold text-sm"
        >
          {session?.user?.name?.[0] || "?"}
        </button>
      </header>

      {/* ドロップダウンメニュー */}
      {showMenu && (
        <>
          <div
            className="md:hidden fixed inset-0 z-40"
            onClick={() => setShowMenu(false)}
          />
          <div className="md:hidden fixed top-14 right-3 z-50 glass-card p-3 min-w-[180px] shadow-xl">
            <p className="text-sm font-medium text-gray-800 px-3 py-1">
              {session?.user?.name}
            </p>
            <p className="text-xs text-ocean-400 px-3 pb-2 border-b border-ocean-100">
              {session?.user?.email}
            </p>
            <button
              onClick={() => {
                setShowMenu(false);
                signOut({ callbackUrl: "/" });
              }}
              className="w-full mt-2 px-3 py-2 text-sm text-left text-ocean-600 hover:bg-ocean-50 rounded-lg transition-colors"
            >
              🚪 ログアウト
            </button>
          </div>
        </>
      )}

      {/* スマホ下部ナビゲーション */}
      <nav
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 flex border-t border-white/20"
        style={{
          background:
            "linear-gradient(135deg, #115e59 0%, #134e4a 100%)",
        }}
      >
        {navItems.map((item) => {
          const isActive =
            pathname === item.href ||
            pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex-1 flex flex-col items-center py-3 transition-all ${
                isActive ? "text-white" : "text-white/50"
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              <span className="text-xs mt-0.5">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}
