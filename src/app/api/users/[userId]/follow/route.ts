import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";

// フォロー/フォロー解除を切り替え
export async function POST(
  request: Request,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    const currentUserId = (session?.user as { id?: string })?.id;

    if (!currentUserId) {
      return NextResponse.json(
        { error: "ログインが必要です" },
        { status: 401 }
      );
    }

    const { userId } = await params;

    if (currentUserId === userId) {
      return NextResponse.json(
        { error: "自分自身はフォローできません" },
        { status: 400 }
      );
    }

    // 既にフォロー済みか確認
    const existingFollow = await prisma.follow.findUnique({
      where: {
        followerId_followingId: {
          followerId: currentUserId,
          followingId: userId,
        },
      },
    });

    if (existingFollow) {
      // フォロー解除
      await prisma.follow.delete({
        where: { id: existingFollow.id },
      });
    } else {
      // フォロー追加
      await prisma.follow.create({
        data: {
          followerId: currentUserId,
          followingId: userId,
        },
      });
    }

    // 最新のフォロワー数を取得
    const followerCount = await prisma.follow.count({
      where: { followingId: userId },
    });

    return NextResponse.json({
      isFollowing: !existingFollow,
      followerCount,
    });
  } catch (error) {
    console.error("Follow toggle error:", error);
    return NextResponse.json(
      { error: "フォローの処理に失敗しました" },
      { status: 500 }
    );
  }
}
