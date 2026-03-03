"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

type SuggestedUser = {
  id: string;
  name: string | null;
  username: string;
  image: string | null;
  followerCount: number;
};

export default function RightPanel() {
  const [users, setUsers] = useState<SuggestedUser[]>([]);

  useEffect(() => {
    fetch("/api/users")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setUsers(data);
      })
      .catch(() => {});
  }, []);

  if (users.length === 0) return null;

  return (
    <aside className="w-72 h-screen sticky top-0 p-6 hidden xl:block">
      <div className="glass-card p-4">
        <h3 className="font-bold text-gray-700 mb-3">🌺 おすすめユーザー</h3>
        <div className="space-y-3">
          {users.map((user) => (
            <Link
              key={user.id}
              href={`/profile/${user.id}`}
              className="flex items-center gap-3 hover:bg-ocean-50 p-2 rounded-xl transition-colors"
            >
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-ocean-400 to-ocean-600 flex items-center justify-center text-white font-bold flex-shrink-0">
                {user.name?.[0] || "?"}
              </div>
              <div className="min-w-0">
                <p className="font-medium text-gray-800 text-sm truncate">
                  {user.name}
                </p>
                <p className="text-ocean-400 text-xs truncate">
                  @{user.username}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </aside>
  );
}
