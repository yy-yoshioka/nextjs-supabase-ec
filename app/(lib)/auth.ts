import { supabase } from "./supabase";
import { createUserProfile } from "./profiles";

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
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    throw error;
  }

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
 * Get the current authenticated user
 */
export async function getCurrentUser() {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return null;
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}
