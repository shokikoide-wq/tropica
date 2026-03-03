import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";

// おすすめユーザー一覧（自分以外）を取得
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    const currentUserId = (session?.user as { id?: string })?.id;

    const users = await prisma.user.findMany({
      where: currentUserId ? { NOT: { id: currentUserId } } : {},
      take: 5,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        username: true,
        image: true,
        _count: {
          select: { followers: true },
        },
      },
    });

    return NextResponse.json(
      users.map((u) => ({
        ...u,
        followerCount: u._count.followers,
        _count: undefined,
      }))
    );
  } catch (error) {
    console.error("Get users error:", error);
    return NextResponse.json(
      { error: "ユーザー一覧の取得に失敗しました" },
      { status: 500 }
    );
  }
}
