"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { UserWithRole } from "../(lib)/auth";
import { Database } from "../(lib)/types/database";
import { supabase } from "../(lib)/supabase";

// 認証コンテキスト用の型
type AuthContextType = {
  user: UserWithRole | null;
  isLoading: boolean;
  refreshUser: () => Promise<void>;
};

// 認証コンテキストの作成
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 認証プロバイダーコンポーネント
export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<UserWithRole | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // ユーザー情報を再取得する関数
  const refreshUser = async () => {
    try {
      setIsLoading(true);
      const {
        data: { session },
      } = await supabase.auth.getSession();
      console.log(session);
      if (!session) {
        setUser(null);
        return;
      }

      const {
        data: { user: authUser },
      } = await supabase.auth.getUser();

      if (!authUser) {
        setUser(null);
        return;
      }

      // ユーザーのロール情報を取得
      const { data: userData } = await supabase
        .from("users")
        .select("role")
        .eq("id", authUser.id)
        .single();

      setUser({
        ...authUser,
        role: userData?.role || "user",
      } as UserWithRole);
    } catch (error) {
      console.error("Error refreshing user:", error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  // 初回マウント時とセッション変更時にユーザー情報を取得
  useEffect(() => {
    refreshUser();

    // セッションの変更を監視
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      refreshUser();
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // コンテキスト値の作成
  const value = {
    user,
    isLoading,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// 認証コンテキストを使用するためのカスタムフック
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
