import { supabase } from "./supabase";
import { UserProfile } from "./types/database";

/**
 * Get a user profile by user id
 */
export async function getUserProfile(userId: string) {
  try {
    console.log(`Attempting to fetch profile for user: ${userId}`);

    if (!userId) {
      const error = new Error("User ID is null or undefined");
      console.error("Invalid user ID:", error);
      throw error;
    }

    // 複数のプロファイルがあるかチェック
    const countCheck = await supabase
      .from("user_profiles")
      .select("id", { count: "exact" })
      .eq("user_id", userId);

    const profileCount = countCheck.count || 0;
    console.log(`Found ${profileCount} profiles for user: ${userId}`);

    if (profileCount > 1) {
      console.warn(
        `Multiple profiles detected (${profileCount}), will use the most recent one`
      );

      // 最新のプロファイルを取得
      const multiResult = await supabase
        .from("user_profiles")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(1);

      console.log(
        "Latest profile query:",
        JSON.stringify(multiResult, null, 2)
      );

      if (multiResult.error) {
        console.error(
          `Error fetching latest profile: ${JSON.stringify(multiResult.error)}`
        );
        throw multiResult.error;
      }

      if (!multiResult.data || multiResult.data.length === 0) {
        throw new Error(
          `No profile found despite count > 0 for user: ${userId}`
        );
      }

      // 重複したプロファイルをバックグラウンドで削除（非同期）
      cleanupDuplicateProfiles(userId, multiResult.data[0].id);

      return multiResult.data[0] as UserProfile;
    }

    // 通常のケース（0または1件のプロファイル）
    const result = await supabase
      .from("user_profiles")
      .select("*")
      .eq("user_id", userId)
      .maybeSingle();

    // Log the entire result for debugging
    console.log("Query result:", JSON.stringify(result, null, 2));

    if (result.error) {
      console.error(
        `Error fetching user profile: ${JSON.stringify(result.error)}`
      );

      // Check specific error types
      if (result.error.code === "PGRST116") {
        console.log("Profile not found for user - will need to create one");
        throw new Error(`Profile not found for user: ${userId}`);
      }

      throw result.error;
    }

    if (!result.data) {
      console.error("No profile data returned but no error reported");
      throw new Error(`No profile data found for user: ${userId}`);
    }

    return result.data as UserProfile;
  } catch (error) {
    console.error("Exception while fetching user profile:", error);
    // Rethrow the error for the caller to handle
    throw error;
  }
}

/**
 * 重複したプロファイルを削除する
 * 最新のプロファイル(keepId)を保持し、それ以外を削除
 */
async function cleanupDuplicateProfiles(userId: string, keepId: string) {
  console.log(
    `Cleaning up duplicate profiles for user: ${userId}, keeping ID: ${keepId}`
  );

  try {
    // keepId以外のプロファイルを削除
    const { data, error } = await supabase
      .from("user_profiles")
      .delete()
      .eq("user_id", userId)
      .neq("id", keepId)
      .select();

    if (error) {
      console.error(`Error during profile cleanup: ${JSON.stringify(error)}`);
    } else {
      const deletedCount = data?.length || 0;
      console.log(`Successfully deleted ${deletedCount} duplicate profiles`);
    }
  } catch (err) {
    console.error("Exception during profile cleanup:", err);
    // クリーンアップなので例外はスローしない
  }
}

/**
 * Update a user profile
 */
export async function updateUserProfile(
  profile: Partial<UserProfile> & { user_id: string }
) {
  console.log(`Updating profile for user: ${profile.user_id}`, profile);

  try {
    // まず既存のプロファイルを確認
    const { data: existingProfile, error: checkError } = await supabase
      .from("user_profiles")
      .select("id")
      .eq("user_id", profile.user_id)
      .maybeSingle();

    console.log(
      "Existing profile check:",
      JSON.stringify(existingProfile, null, 2)
    );

    if (checkError && checkError.code !== "PGRST116") {
      console.error(
        `Error checking existing profile: ${JSON.stringify(checkError)}`
      );
      throw checkError;
    }

    let result;

    if (existingProfile) {
      // 既存のプロファイルがある場合は更新
      console.log(`Updating existing profile with ID: ${existingProfile.id}`);
      result = await supabase
        .from("user_profiles")
        .update(profile)
        .eq("id", existingProfile.id)
        .select();
    } else {
      // 既存のプロファイルがない場合は作成
      console.log("No existing profile found, creating new profile");
      result = await supabase.from("user_profiles").insert(profile).select();
    }

    console.log("Update/Insert result:", JSON.stringify(result, null, 2));

    if (result.error) {
      console.error(
        `Error updating user profile: ${JSON.stringify(result.error)}`
      );
      throw result.error;
    }

    return true;
  } catch (error) {
    console.error("Exception in updateUserProfile:", error);
    throw error;
  }
}

/**
 * Get the current user's profile
 */
export async function getCurrentUserProfile() {
  try {
    console.log("Getting current user session");
    const sessionResult = await supabase.auth.getSession();
    console.log("Session result:", JSON.stringify(sessionResult, null, 2));

    const session = sessionResult.data.session;

    if (!session) {
      console.log("No active session found");
      return null;
    }

    const userId = session.user.id;
    console.log(`Current user ID: ${userId}`);

    try {
      // Try to get the profile
      console.log("Attempting to get user profile");
      const profile = await getUserProfile(userId);
      return profile;
    } catch (error) {
      console.error("Error getting current user profile:", error);

      // If profile doesn't exist, create one
      const errorMessage =
        error instanceof Error ? error.message : String(error);

      if (
        (error as any)?.code === "PGRST116" ||
        errorMessage.includes("not found") ||
        errorMessage.includes("No profile data found")
      ) {
        console.log(`Creating new profile for user: ${userId}`);
        try {
          await createUserProfile(userId);
          // Now try to get the profile again
          console.log("Retrying profile fetch after creation");
          return await getUserProfile(userId);
        } catch (createError) {
          console.error("Error creating profile automatically:", createError);
        }
      }

      return null;
    }
  } catch (error) {
    console.error("Error getting session:", error);
    return null;
  }
}

/**
 * Create a new user profile
 * This is automatically called during signup
 */
export async function createUserProfile(userId: string, displayName?: string) {
  try {
    console.log(`Checking if profile exists for user: ${userId}`);

    if (!userId) {
      const error = new Error(
        "Cannot create profile: User ID is null or undefined"
      );
      console.error(error);
      throw error;
    }

    // Check if profile already exists
    const result = await supabase
      .from("user_profiles")
      .select("id") // Only select the ID to minimize data transfer
      .eq("user_id", userId)
      .maybeSingle(); // Use maybeSingle() instead of handling arrays

    console.log("Profile check result:", JSON.stringify(result, null, 2));

    // If we get data back, a profile exists
    if (result.data) {
      console.log(`Profile already exists for user: ${userId}`);
      return result.data.id;
    }

    // If we got an error that's not "not found", that's a problem
    if (result.error && result.error.code !== "PGRST116") {
      console.error(
        `Error checking for existing profile: ${JSON.stringify(result.error)}`
      );
      throw result.error;
    }

    console.log(`Creating new profile for user: ${userId}`);

    // Create the profile
    const insertResult = await supabase
      .from("user_profiles")
      .insert({
        user_id: userId,
        display_name: displayName || null,
        avatar_url: null,
        bio: null,
        address: null,
        phone_number: null,
      })
      .select();

    console.log(
      "Profile creation result:",
      JSON.stringify(insertResult, null, 2)
    );

    if (insertResult.error) {
      console.error(
        `Error creating user profile: ${JSON.stringify(insertResult.error)}`
      );
      throw insertResult.error;
    }

    if (!insertResult.data || insertResult.data.length === 0) {
      console.error("Profile was created but no data was returned");
      // This is not necessarily an error, we can continue
    } else {
      console.log(
        `Successfully created profile with ID: ${insertResult.data[0].id}`
      );
      return insertResult.data[0].id;
    }

    return true;
  } catch (error) {
    console.error("Exception in createUserProfile:", error);
    throw error;
  }
}

/**
 * Upload avatar image for a user profile
 */
export async function uploadAvatar(userId: string, file: File) {
  const fileExt = file.name.split(".").pop();
  const fileName = `${userId}-avatar.${fileExt}`;
  const filePath = `avatars/${fileName}`;

  // Upload the file
  const { error: uploadError } = await supabase.storage
    .from("profiles")
    .upload(filePath, file, { upsert: true });

  if (uploadError) {
    console.error("Error uploading avatar:", uploadError);
    throw uploadError;
  }

  // Get the public URL
  const { data } = supabase.storage.from("profiles").getPublicUrl(filePath);

  // Update the user profile with the new avatar URL
  const { error: updateError } = await supabase
    .from("user_profiles")
    .update({ avatar_url: data.publicUrl })
    .eq("user_id", userId);

  if (updateError) {
    console.error("Error updating profile with new avatar:", updateError);
    throw updateError;
  }

  return data.publicUrl;
}
