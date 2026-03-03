import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash("password123", 12);

  await prisma.user.upsert({
    where: { email: "test@example.com" },
    update: {},
    create: {
      email: "test@example.com",
      username: "testuser",
      name: "テストユーザー",
      hashedPassword,
      bio: "テスト用アカウントです",
    },
  });

  await prisma.user.upsert({
    where: { email: "hanako@example.com" },
    update: {},
    create: {
      email: "hanako@example.com",
      username: "hanako_tropical",
      name: "南国花子",
      hashedPassword,
      bio: "南国が大好き！",
    },
  });

  await prisma.user.upsert({
    where: { email: "bula@example.com" },
    update: {},
    create: {
      email: "bula@example.com",
      username: "bula",
      name: "トロピカ",
      hashedPassword,
      bio: "Bula! トロピカルライフ",
    },
  });

  console.log("シードデータ投入完了！");
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
