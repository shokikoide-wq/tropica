import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";

// いいねのON/OFFを切り替え
export async function POST(
  request: Request,
  { params }: { params: Promise<{ postId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    const userId = (session?.user as { id?: string })?.id;

    if (!userId) {
      return NextResponse.json(
        { error: "ログインが必要です" },
        { status: 401 }
      );
    }

    const { postId } = await params;

    // 既にいいね済みか確認
    const existingLike = await prisma.like.findUnique({
      where: {
        userId_postId: { userId, postId },
      },
    });

    if (existingLike) {
      // いいね解除
      await prisma.like.delete({
        where: { id: existingLike.id },
      });
    } else {
      // いいね追加
      await prisma.like.create({
        data: { userId, postId },
      });
    }

    // 最新のいいね数を取得
    const likeCount = await prisma.like.count({
      where: { postId },
    });

    return NextResponse.json({
      isLiked: !existingLike,
      likeCount,
    });
  } catch (error) {
    console.error("Like toggle error:", error);
    return NextResponse.json(
      { error: "いいねの処理に失敗しました" },
      { status: 500 }
    );
  }
}
