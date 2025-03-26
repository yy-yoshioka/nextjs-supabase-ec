import { createClient } from "@supabase/supabase-js";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Database } from "./types/database";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// サーバーサイドでの一般的な利用向け
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// クライアントコンポーネント用
export const createBrowserClient = () => {
  return createClientComponentClient<Database>();
};
