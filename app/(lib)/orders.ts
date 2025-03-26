import { createClient } from "@supabase/supabase-js";
import { Database } from "./types/database";
import { CartItem } from "../(context)/CartContext";

// サーバーサイドでSupabaseクライアントを作成
const createServerSupabaseClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  return createClient<Database>(supabaseUrl, supabaseKey);
};

// 注文データのインターフェース
export interface OrderData {
  userId: string;
  items: Array<{
    id: string;
    quantity: number;
    price: number;
  }>;
  totalPrice: number;
  status: string;
}

/**
 * 注文を作成し、注文アイテムも同時に保存する
 */
export async function createOrder(orderData: OrderData) {
  const supabase = createServerSupabaseClient();
  console.log("==================================================");
  console.log(
    "createOrder関数が呼び出されました。入力データ:",
    typeof orderData === "string"
      ? orderData
      : JSON.stringify(orderData, null, 2)
  );

  try {
    // 入力検証
    if (!orderData.userId) {
      console.error("ユーザーIDが指定されていません");
      return { error: new Error("ユーザーIDが必要です"), success: false };
    }

    if (
      !orderData.items ||
      !Array.isArray(orderData.items) ||
      orderData.items.length === 0
    ) {
      console.error(
        "注文アイテムが無効です:",
        typeof orderData.items === "string"
          ? orderData.items
          : JSON.stringify(orderData.items, null, 2)
      );
      return {
        error: new Error("有効な注文アイテムが必要です"),
        success: false,
      };
    }

    // 注文を作成
    const orderInsertData = {
      user_id: orderData.userId,
      total_price: orderData.totalPrice,
      status: orderData.status || "processing",
    };
    console.log(
      "注文データをデータベースに挿入します:",
      JSON.stringify(orderInsertData, null, 2)
    );

    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert(orderInsertData)
      .select()
      .single();

    if (orderError) {
      console.error("注文の作成に失敗しました:", orderError);
      return { error: orderError, success: false };
    }

    console.log("注文が作成されました:", order);

    // 注文アイテムを作成
    const orderItems = orderData.items.map((item) => ({
      order_id: order.id,
      product_id: item.id,
      quantity: item.quantity,
      price_at_purchase: item.price,
    }));

    console.log(
      "注文アイテムを作成します:",
      JSON.stringify(orderItems, null, 2)
    );

    const { error: itemsError } = await supabase
      .from("order_items")
      .insert(orderItems);

    if (itemsError) {
      console.error("注文アイテムの作成に失敗しました:", itemsError);
      // 注文アイテムの作成に失敗した場合は、注文自体も削除（ロールバック）
      console.log("注文をロールバックします:", order.id);
      await supabase.from("orders").delete().eq("id", order.id);
      return { error: itemsError, success: false };
    }

    console.log("注文と注文アイテムが正常に作成されました");
    console.log("==================================================");
    return { order, success: true };
  } catch (error) {
    console.error("注文処理中に予期しないエラーが発生しました:", error);
    return { error, success: false };
  }
}

/**
 * ユーザーIDに基づいて注文履歴を取得
 */
export async function getUserOrders(userId: string) {
  const supabase = createServerSupabaseClient();

  try {
    const { data, error } = await supabase
      .from("orders")
      .select(
        `
        *,
        order_items(*)
      `
      )
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return { data, success: true };
  } catch (error) {
    console.error("注文履歴の取得に失敗しました:", error);
    return { error, success: false };
  }
}

/**
 * 注文IDに基づいて注文詳細を取得
 */
export async function getOrderById(orderId: string) {
  const supabase = createServerSupabaseClient();

  try {
    const { data, error } = await supabase
      .from("orders")
      .select(
        `
        *,
        order_items(*)
      `
      )
      .eq("id", orderId)
      .single();

    if (error) throw error;
    return { data, success: true };
  } catch (error) {
    console.error("注文詳細の取得に失敗しました:", error);
    return { error, success: false };
  }
}

/**
 * 注文ステータスを更新
 */
export async function updateOrderStatus(orderId: string, status: string) {
  const supabase = createServerSupabaseClient();

  try {
    const { data, error } = await supabase
      .from("orders")
      .update({ status })
      .eq("id", orderId)
      .select()
      .single();

    if (error) throw error;
    return { data, success: true };
  } catch (error) {
    console.error("注文ステータスの更新に失敗しました:", error);
    return { error, success: false };
  }
}
