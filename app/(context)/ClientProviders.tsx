"use client";

import React from "react";
import AuthProvider from "./AuthProvider";
// import { CartProvider } from "./CartContext";

// クライアントサイドのプロバイダーをまとめたコンポーネント
export default function ClientProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      {/* <CartProvider>{children}</CartProvider
      > */}
      {children}
    </AuthProvider>
  );
}
