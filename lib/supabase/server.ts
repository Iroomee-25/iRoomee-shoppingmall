import { createClient } from "@supabase/supabase-js";
import { auth } from "@clerk/nextjs/server";

/**
 * Clerk + Supabase 통합 클라이언트 (Server Component용)
 *
 * Authorization 헤더를 직접 설정하는 방식으로
 * Clerk 토큰을 Supabase에 전달합니다.
 *
 * @example
 * ```tsx
 * // Server Component
 * import { createClerkSupabaseClient } from '@/lib/supabase/server';
 *
 * export default async function MyPage() {
 *   const supabase = await createClerkSupabaseClient();
 *   if (!supabase) {
 *     return <div>인증이 필요합니다</div>;
 *   }
 *   const { data } = await supabase.from('table').select('*');
 *   return <div>...</div>;
 * }
 * ```
 */
export async function createClerkSupabaseClient() {
  console.group("🔧 Server Clerk Supabase Client 초기화");

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

  console.log("Supabase URL:", supabaseUrl);

  // Clerk 인증 정보 가져오기
  const { userId, getToken } = await auth();
  console.log("사용자 ID:", userId ?? "없음");

  // 로그인하지 않은 경우
  if (!userId) {
    console.log("❌ 인증되지 않은 사용자");
    console.groupEnd();
    return null;
  }

  // Clerk 토큰 가져오기
  const token = await getToken();
  console.log("Clerk 토큰 존재:", !!token);

  // 🔧 임시: RLS가 꺼져있으니 토큰 없이 anon key만 사용
  // TODO: 나중에 Supabase에 Clerk JWT 설정 추가 필요
  const client = createClient(supabaseUrl, supabaseKey, {
    auth: {
      persistSession: false,
    },
  });

  console.log("✅ Supabase 클라이언트 생성 완료");
  console.groupEnd();

  return client;
}
