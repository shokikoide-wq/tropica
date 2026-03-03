import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Sidebar from "@/components/layout/Sidebar";
import RightPanel from "@/components/layout/RightPanel";
import MobileNav from "@/components/layout/MobileNav";

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="flex min-h-screen">
      {/* PC・タブレット: 左サイドバー */}
      <Sidebar />

      {/* スマホ: 上部ヘッダー＋下部ナビ */}
      <MobileNav />

      {/* メインコンテンツ（スマホ時は上下にヘッダー/ナビの余白を確保） */}
      <main className="flex-1 max-w-2xl p-4 md:p-6 pt-16 pb-20 md:pt-6 md:pb-6">
        {children}
      </main>

      {/* PC: 右パネル（おすすめユーザー） */}
      <RightPanel />
    </div>
  );
}
