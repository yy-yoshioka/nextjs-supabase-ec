import { supabase } from "./supabase";

/**
 * Check if the current user has admin role
 * @returns true if the user is an admin, false otherwise
 */
export async function isAdmin() {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return false;
  }

  const { data, error } = await supabase
    .from("users")
    .select("role")
    .eq("id", session.user.id)
    .single();

  if (error || !data) {
    return false;
  }

  return data.role === "admin";
}
