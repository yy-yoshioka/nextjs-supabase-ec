import { supabase } from "./supabase";

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
    throw error;
  }

  // If signup was successful and we have a user, create a profile
  if (data.user) {
    // The auth user should automatically be added to the users table by Supabase
    // Now create a user profile
    await createUserProfile(data.user.id, displayName);
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

/**
 * Create a user profile in the database
 */
async function createUserProfile(userId: string, displayName?: string) {
  const { error } = await supabase.from("user_profiles").insert({
    user_id: userId,
    display_name: displayName || null,
  });

  if (error) {
    console.error("Error creating user profile:", error);
    throw error;
  }
}
