import { supabase } from "./supabase";
import { createUserProfile } from "./profiles";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Database } from "./types/database";

// Type for the signup data
export interface SignUpData {
  email: string;
  password: string;
  displayName?: string;
}

// Type for the signin data
export interface SignInData {
  email: string;
  password: string;
}

// 拡張されたユーザータイプ
export interface UserWithRole {
  id: string;
  email?: string;
  role: string;
  [key: string]: any;
}

/**
 * Sign up a new user with email and password
 */
export async function signUp({ email, password, displayName }: SignUpData) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    console.error(`Sign up error: ${JSON.stringify(error)}`);
    throw error;
  }

  // If signup was successful and we have a user, create user record and profile
  if (data.user) {
    console.log(`User created with ID: ${data.user.id}`);

    // Explicitly create a record in the users table
    try {
      // First check if the user already exists in the users table
      console.log("Checking if user exists in users table");
      const { data: existingUser, error: checkError } = await supabase
        .from("users")
        .select("id")
        .eq("id", data.user.id)
        .single();

      if (checkError && checkError.code !== "PGRST116") {
        console.error(`Error checking user: ${JSON.stringify(checkError)}`);
      }

      if (!existingUser) {
        console.log("User not found in users table, creating record");
        // Insert the user into the users table
        const { error: insertError } = await supabase.from("users").insert({
          id: data.user.id,
          email: data.user.email,
          role: "user",
        });

        if (insertError) {
          console.error(
            `Error creating user record: ${JSON.stringify(insertError)}`
          );
          throw insertError;
        }

        console.log("User record created successfully");
      } else {
        console.log("User already exists in users table");
      }

      // Wait to ensure the user record is committed
      console.log("Waiting for database consistency");
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Now create a user profile
      console.log("Creating user profile");
      await createUserProfile(data.user.id, displayName);
      console.log("Sign up and profile creation complete");
    } catch (error) {
      console.error(
        `Error in user/profile creation: ${
          error instanceof Error ? error.message : JSON.stringify(error)
        }`
      );
      throw error;
    }
  } else {
    console.log("Sign up succeeded but user data is missing");
  }

  return data;
}

/**
 * Sign in an existing user with email and password
 */
export async function signIn({ email, password }: SignInData) {
  console.log(`Attempting to sign in user with email: ${email}`);

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    console.error(`Sign in error: ${JSON.stringify(error)}`);
    throw error;
  }

  console.log("Sign in successful, session established");
  console.log(`User ID: ${data.user?.id}`);
  console.log(`Session expires at: ${data.session?.expires_at}`);

  return data;
}

/**
 * Sign out the current user
 */
export async function signOut() {
  const { error } = await supabase.auth.signOut();

  if (error) {
    throw error;
  }

  return true;
}

/**
 * Get the current authenticated user with role information
 * この関数はサーバーコンポーネントでのみ使用可能
 */
export async function getCurrentUser(): Promise<UserWithRole | null> {
  try {
    // セッションを取得
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession();

    if (sessionError) {
      console.error("Session error:", sessionError);
      return null;
    }

    if (!session) {
      console.log("No active session found");
      return null;
    }

    // ユーザー情報を取得
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError) {
      console.error("User fetch error:", userError);
      return null;
    }

    if (!user) {
      console.log("No user found in session");
      return null;
    }

    // ユーザーのロール情報を取得
    const { data: userData, error: roleError } = await supabase
      .from("users")
      .select("role")
      .eq("id", user.id)
      .single();

    if (roleError) {
      console.error("Error fetching user role:", roleError);
      // ロール情報が取得できなくても、デフォルトの'user'ロールでユーザー情報を返す
      return {
        ...user,
        role: "user",
      } as UserWithRole;
    }

    console.log("User authenticated successfully:", user.id);
    console.log("User role:", userData?.role || "user");

    // ユーザー情報とロールを合わせて返す
    return {
      ...user,
      role: userData?.role || "user",
    } as UserWithRole;
  } catch (error) {
    console.error("Unexpected error in getCurrentUser:", error);
    return null;
  }
}

/**
 * クライアントコンポーネントでユーザー情報を取得する
 */
export function useCurrentUser() {
  const supabaseClient = createClientComponentClient<Database>();

  const getUser = async (): Promise<UserWithRole | null> => {
    try {
      const {
        data: { session },
      } = await supabaseClient.auth.getSession();

      if (!session) {
        return null;
      }

      const {
        data: { user },
      } = await supabaseClient.auth.getUser();

      if (!user) {
        return null;
      }

      const { data: userData } = await supabaseClient
        .from("users")
        .select("role")
        .eq("id", user.id)
        .single();

      return {
        ...user,
        role: userData?.role || "user",
      } as UserWithRole;
    } catch (error) {
      console.error("Error in useCurrentUser:", error);
      return null;
    }
  };

  return { getUser };
}
