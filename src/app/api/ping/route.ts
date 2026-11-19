import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase/client";

// Supabase 쿼리(캐시되지 않는 fetch)를 기다리기 때문에 Cache Components 아래에서도
// 이 라우트는 자동으로 동적으로 처리됩니다(별도의 dynamic 설정이 필요 없음).
// Supabase 무료 플랜은 일정 기간 API 호출이 없으면 프로젝트를 일시정지합니다.
// Vercel Cron(vercel.json)이 하루 한 번 이 라우트를 호출해 호출 기록을 남겨 둡니다.
export async function GET() {
  const { error } = await supabase.from("products").select("id").limit(1);

  if (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true, pingedAt: new Date().toISOString() });
}
