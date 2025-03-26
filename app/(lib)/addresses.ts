import { supabase } from "@/app/(lib)/supabase";
import { UserAddress } from "@/app/(lib)/types/database";

/**
 * ユーザーの住所一覧を取得する
 */
export async function getUserAddresses(
  userId: string
): Promise<{ data: UserAddress[] | null; error: any }> {
  if (!userId) {
    console.error("getUserAddresses: userId is required");
    return { data: null, error: new Error("userId is required") };
  }

  try {
    console.log(`Getting addresses for user: ${userId}`);

    const { data, error } = await supabase
      .from("user_addresses")
      .select("*")
      .eq("user_id", userId)
      .order("is_default", { ascending: false })
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching user addresses:", error);
      return { data: null, error };
    }

    console.log(`Found ${data.length} addresses for user: ${userId}`);
    return { data, error: null };
  } catch (error) {
    console.error("Unexpected error in getUserAddresses:", error);
    return { data: null, error };
  }
}

/**
 * ユーザーのデフォルト住所を取得する
 */
export async function getDefaultUserAddress(
  userId: string
): Promise<{ data: UserAddress | null; error: any }> {
  if (!userId) {
    console.error("getDefaultUserAddress: userId is required");
    return { data: null, error: new Error("userId is required") };
  }

  try {
    console.log(`Getting default address for user: ${userId}`);

    const { data, error } = await supabase
      .from("user_addresses")
      .select("*")
      .eq("user_id", userId)
      .eq("is_default", true)
      .single();

    if (error) {
      // error.code === 'PGRST116' は "結果が見つからない" エラー
      if (error.code === "PGRST116") {
        console.log(`No default address found for user: ${userId}`);
        return { data: null, error: null };
      }

      console.error("Error fetching default user address:", error);
      return { data: null, error };
    }

    console.log(`Found default address for user: ${userId}`);
    return { data, error: null };
  } catch (error) {
    console.error("Unexpected error in getDefaultUserAddress:", error);
    return { data: null, error };
  }
}

/**
 * 住所を作成する
 */
export async function createUserAddress(
  addressData: Omit<UserAddress, "id" | "created_at">
): Promise<{ data: UserAddress | null; error: any }> {
  if (!addressData.user_id) {
    console.error("createUserAddress: user_id is required");
    return { data: null, error: new Error("user_id is required") };
  }

  try {
    console.log(`Creating address for user: ${addressData.user_id}`);

    const { data, error } = await supabase
      .from("user_addresses")
      .insert(addressData)
      .select()
      .single();

    if (error) {
      console.error("Error creating user address:", error);
      return { data: null, error };
    }

    console.log(`Created address for user: ${addressData.user_id}`);
    return { data, error: null };
  } catch (error) {
    console.error("Unexpected error in createUserAddress:", error);
    return { data: null, error };
  }
}

/**
 * 住所を更新する
 */
export async function updateUserAddress(
  addressId: string,
  addressData: Partial<Omit<UserAddress, "id" | "created_at" | "user_id">>
): Promise<{ data: UserAddress | null; error: any }> {
  if (!addressId) {
    console.error("updateUserAddress: addressId is required");
    return { data: null, error: new Error("addressId is required") };
  }

  try {
    console.log(`Updating address: ${addressId}`);

    const { data, error } = await supabase
      .from("user_addresses")
      .update(addressData)
      .eq("id", addressId)
      .select()
      .single();

    if (error) {
      console.error("Error updating user address:", error);
      return { data: null, error };
    }

    console.log(`Updated address: ${addressId}`);
    return { data, error: null };
  } catch (error) {
    console.error("Unexpected error in updateUserAddress:", error);
    return { data: null, error };
  }
}

/**
 * 住所を削除する
 */
export async function deleteUserAddress(
  addressId: string
): Promise<{ success: boolean; error: any }> {
  if (!addressId) {
    console.error("deleteUserAddress: addressId is required");
    return { success: false, error: new Error("addressId is required") };
  }

  try {
    console.log(`Deleting address: ${addressId}`);

    // 削除前に対象アドレスがデフォルトかどうかを確認
    const { data: address } = await supabase
      .from("user_addresses")
      .select("*")
      .eq("id", addressId)
      .single();

    const { error } = await supabase
      .from("user_addresses")
      .delete()
      .eq("id", addressId);

    if (error) {
      console.error("Error deleting user address:", error);
      return { success: false, error };
    }

    // 削除した住所がデフォルトだった場合、別のアドレスをデフォルトに設定
    if (address && address.is_default) {
      const { data: otherAddresses } = await supabase
        .from("user_addresses")
        .select("*")
        .eq("user_id", address.user_id)
        .order("created_at", { ascending: false })
        .limit(1);

      if (otherAddresses && otherAddresses.length > 0) {
        await supabase
          .from("user_addresses")
          .update({ is_default: true })
          .eq("id", otherAddresses[0].id);
      }
    }

    console.log(`Deleted address: ${addressId}`);
    return { success: true, error: null };
  } catch (error) {
    console.error("Unexpected error in deleteUserAddress:", error);
    return { success: false, error };
  }
}

/**
 * 住所をデフォルトに設定する
 */
export async function setDefaultUserAddress(
  addressId: string
): Promise<{ success: boolean; error: any }> {
  if (!addressId) {
    console.error("setDefaultUserAddress: addressId is required");
    return { success: false, error: new Error("addressId is required") };
  }

  try {
    console.log(`Setting address as default: ${addressId}`);

    const { error } = await supabase
      .from("user_addresses")
      .update({ is_default: true })
      .eq("id", addressId);

    if (error) {
      console.error("Error setting default user address:", error);
      return { success: false, error };
    }

    console.log(`Set address as default: ${addressId}`);
    return { success: true, error: null };
  } catch (error) {
    console.error("Unexpected error in setDefaultUserAddress:", error);
    return { success: false, error };
  }
}
