import { supabase } from "./supabase";
import { Product } from "./types/database";

/**
 * 全ての商品を取得する
 */
export async function getAllProducts() {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching products:", error);
    throw error;
  }

  return data as Product[];
}

/**
 * 特定のIDの商品を取得する
 */
export async function getProductById(id: string) {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error(`Error fetching product with id ${id}:`, error);
    throw error;
  }

  return data as Product;
}

/**
 * 商品を作成する（管理者用）
 */
export async function createProduct(
  product: Omit<Product, "id" | "created_at">
) {
  const { data, error } = await supabase
    .from("products")
    .insert(product)
    .select()
    .single();

  if (error) {
    console.error("Error creating product:", error);
    throw error;
  }

  return data as Product;
}

/**
 * 商品を更新する（管理者用）
 */
export async function updateProduct(
  id: string,
  product: Partial<Omit<Product, "id" | "created_at">>
) {
  const { data, error } = await supabase
    .from("products")
    .update(product)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error(`Error updating product with id ${id}:`, error);
    throw error;
  }

  return data as Product;
}

/**
 * 商品を削除する（管理者用）
 */
export async function deleteProduct(id: string) {
  const { error } = await supabase.from("products").delete().eq("id", id);

  if (error) {
    console.error(`Error deleting product with id ${id}:`, error);
    throw error;
  }

  return true;
}
