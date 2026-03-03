import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";

// 自分のプロフィールを更新
export async function PATCH(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    const userId = (session?.user as { id?: string })?.id;

    if (!userId) {
      return NextResponse.json(
        { error: "ログインが必要です" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { name, username, bio } = body;

    // ユーザー名のバリデーション
    if (username !== undefined) {
      if (!username || username.trim().length === 0) {
        return NextResponse.json(
          { error: "ユーザー名を入力してください" },
          { status: 400 }
        );
      }
      // 他のユーザーと重複チェック
      const existing = await prisma.user.findFirst({
        where: { username, NOT: { id: userId } },
      });
      if (existing) {
        return NextResponse.json(
          { error: "このユーザー名は既に使われています" },
          { status: 409 }
        );
      }
    }

    // 自己紹介は160文字まで
    if (bio !== undefined && bio.length > 160) {
      return NextResponse.json(
        { error: "自己紹介は160文字以内にしてください" },
        { status: 400 }
      );
    }

    const updateData: { name?: string; username?: string; bio?: string } = {};
    if (name !== undefined) updateData.name = name;
    if (username !== undefined) updateData.username = username;
    if (bio !== undefined) updateData.bio = bio;

    const user = await prisma.user.update({
      where: { id: userId },
      data: updateData,
      select: {
        id: true,
        name: true,
        username: true,
        bio: true,
        image: true,
      },
    });

    return NextResponse.json(user);
  } catch (error) {
    console.error("Update profile error:", error);
    return NextResponse.json(
      { error: "プロフィールの更新に失敗しました" },
      { status: 500 }
    );
  }
}
