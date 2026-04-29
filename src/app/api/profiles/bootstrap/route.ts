import { NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { getSupabaseServiceRoleClient } from "@/lib/supabase/admin";

export async function POST(request: Request) {
  // El endpoint no requiere body, pero aceptamos POST para hacerlo sencillo desde el cliente.
  void request;

  const supabase = getSupabaseServerClient();
  const admin = getSupabaseServiceRoleClient();

  if (!supabase || !admin) {
    return NextResponse.json(
      { error: "Supabase no está configurado (faltan variables de entorno)." },
      { status: 500 },
    );
  }

  const { data: userData, error: userErr } = await supabase.auth.getUser();

  if (userErr || !userData.user) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }

  const user = userData.user;

  const { error: upsertErr } = await admin
    .from("profiles")
    .upsert({
      id: user.id,
      email: user.email ?? null,
      full_name: user.user_metadata?.full_name ?? user.user_metadata?.name ?? null,
      tier: "free",
      monthly_ai_credits: 10,
      used_ai_credits: 0,
    })
    .select("id")
    .single();

  if (upsertErr) {
    return NextResponse.json(
      { error: upsertErr.message || "No se pudo crear/actualizar el perfil." },
      { status: 500 },
    );
  }

  return NextResponse.json({ ok: true });
}

