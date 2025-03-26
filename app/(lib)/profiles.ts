import { supabase } from "./supabase";
import { UserProfile } from "./types/database";

/**
 * Get a user profile by user id
 */
export async function getUserProfile(userId: string) {
  const { data, error } = await supabase
    .from("user_profiles")
    .select("*")
    .eq("user_id", userId)
    .single();

  if (error) {
    console.error("Error fetching user profile:", error);
    throw error;
  }

  return data as UserProfile;
}

/**
 * Update a user profile
 */
export async function updateUserProfile(
  profile: Partial<UserProfile> & { user_id: string }
) {
  const { error } = await supabase
    .from("user_profiles")
    .upsert(profile)
    .eq("user_id", profile.user_id);

  if (error) {
    console.error("Error updating user profile:", error);
    throw error;
  }

  return true;
}

/**
 * Get the current user's profile
 */
export async function getCurrentUserProfile() {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return null;
  }

  try {
    return await getUserProfile(session.user.id);
  } catch (error) {
    console.error("Error getting current user profile:", error);
    return null;
  }
}
