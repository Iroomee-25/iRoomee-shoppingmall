"use client";

import { createClient } from "@supabase/supabase-js";
import { useAuth } from "@clerk/nextjs";
import { useEffect, useState } from "react";

/**
 * Clerk + Supabase 통합 클라이언트 (Client Component용)
 *
 * Authorization 헤더를 직접 설정하는 방식으로
 * Clerk 토큰을 Supabase에 전달합니다.
 *
 * @example
 * ```tsx
 * 'use client';
 *
 * import { useClerkSupabaseClient } from '@/lib/supabase/clerk-client';
 *
 * export default function MyComponent() {
 *   const supabase = useClerkSupabaseClient();
 *
 *   async function fetchData() {
 *     if (!supabase) return;
 *     const { data } = await supabase.from('table').select('*');
 *     return data;
 *   }
 *
 *   return <div>...</div>;
 * }
 * ```
 */
export function useClerkSupabaseClient() {
  const { getToken, isLoaded } = useAuth();
  const [supabase, setSupabase] = useState<ReturnType<
    typeof createClient
  > | null>(null);

  useEffect(() => {
    console.group("🔧 Clerk Supabase Client 초기화");
    console.log("인증 로드 상태:", isLoaded);

    if (!isLoaded) {
      console.log("⏳ 인증 정보 로딩 중...");
      console.groupEnd();
      return;
    }

    const initClient = async () => {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
      const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

      console.log("Supabase URL:", supabaseUrl);

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

      setSupabase(client);
    };

    initClient();
  }, [getToken, isLoaded]);

  return supabase;
}
