import { createClient } from "@supabase/supabase-js";
import { Database } from "./types/database";
import { Order, OrderItem, Product } from "./types/database";

// 拡張された注文アイテムの型定義
export interface OrderItemWithProduct extends OrderItem {
  product?: Product;
}

// 拡張された注文の型定義
export interface OrderWithItems extends Order {
  order_items: OrderItemWithProduct[];
}

// クライアントサイドでSupabaseクライアントを作成
const createClientSupabaseClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  return createClient<Database>(supabaseUrl, supabaseKey);
};

/**
 * ユーザーのすべての注文を取得する
 */
export async function getUserOrders(userId: string): Promise<{
  orders: OrderWithItems[];
  error: string | null;
}> {
  try {
    if (!userId) {
      return { orders: [], error: "ユーザーIDが必要です" };
    }

    const supabase = createClientSupabaseClient();

    // ユーザーの注文を取得
    const { data: ordersData, error: ordersError } = await supabase
      .from("orders")
      .select(
        `
        *,
        order_items(*)
      `
      )
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (ordersError) throw ordersError;

    // 注文内の商品情報を取得
    const ordersWithProducts = await Promise.all(
      ordersData.map(async (order) => {
        const orderItemsWithProducts = await Promise.all(
          order.order_items.map(async (item: OrderItem) => {
            // 商品情報を取得
            const { data: productData } = await supabase
              .from("products")
              .select("*")
              .eq("id", item.product_id)
              .single();

            return {
              ...item,
              product: productData,
            };
          })
        );

        return {
          ...order,
          order_items: orderItemsWithProducts,
        };
      })
    );

    return { orders: ordersWithProducts, error: null };
  } catch (err) {
    console.error("注文履歴の取得に失敗しました:", err);
    return {
      orders: [],
      error:
        err instanceof Error ? err.message : "注文履歴の取得に失敗しました",
    };
  }
}

/**
 * 特定の注文詳細を取得する
 */
export async function getOrderById(
  orderId: string,
  userId: string
): Promise<{
  order: OrderWithItems | null;
  error: string | null;
}> {
  try {
    if (!orderId) {
      return { order: null, error: "注文IDが必要です" };
    }

    if (!userId) {
      return { order: null, error: "ユーザーIDが必要です" };
    }

    const supabase = createClientSupabaseClient();

    // 注文の詳細を取得
    const { data: orderData, error: orderError } = await supabase
      .from("orders")
      .select(
        `
        *,
        order_items(*)
      `
      )
      .eq("id", orderId)
      .eq("user_id", userId) // 自分の注文のみ表示
      .single();

    if (orderError) throw orderError;
    if (!orderData) throw new Error("注文が見つかりません");

    // 注文内の商品情報を取得
    const orderItemsWithProducts = await Promise.all(
      orderData.order_items.map(async (item: OrderItem) => {
        // 商品情報を取得
        const { data: productData } = await supabase
          .from("products")
          .select("*")
          .eq("id", item.product_id)
          .single();

        return {
          ...item,
          product: productData,
        };
      })
    );

    const orderWithProducts = {
      ...orderData,
      order_items: orderItemsWithProducts,
    };

    return { order: orderWithProducts, error: null };
  } catch (err) {
    console.error("注文詳細の取得に失敗しました:", err);
    return {
      order: null,
      error:
        err instanceof Error ? err.message : "注文詳細の取得に失敗しました",
    };
  }
}

/**
 * Stripeセッションから注文IDを取得する
 */
export async function getSessionOrderId(sessionId: string): Promise<{
  orderId: string | null;
  error: string | null;
}> {
  try {
    if (!sessionId) {
      return { orderId: null, error: "セッションIDが必要です" };
    }

    // APIエンドポイントからセッション情報を取得
    const response = await fetch(`/api/checkout/session?id=${sessionId}`);

    if (!response.ok) {
      throw new Error(`APIリクエストエラー: ${response.status}`);
    }

    const data = await response.json();
    return {
      orderId: data?.orderId || null,
      error: null,
    };
  } catch (err) {
    console.error("セッション情報の取得に失敗しました:", err);
    return {
      orderId: null,
      error:
        err instanceof Error
          ? err.message
          : "セッション情報の取得に失敗しました",
    };
  }
}
