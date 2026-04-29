import { NextResponse } from "next/server";
import { z } from "zod";
import { getSupabaseServerClient } from "@/lib/supabase/server";

const postSchema = z.object({
  date: z.string().min(8),
  title: z.string().min(2),
  outfitId: z.string().uuid().nullable().optional(),
  weather: z.string().optional(),
  notes: z.string().optional(),
});

export async function GET() {
  const supabase = getSupabaseServerClient();
  if (!supabase) return NextResponse.json({ error: "Supabase no está configurado." }, { status: 500 });

  const { data: userData, error: userErr } = await supabase.auth.getUser();
  if (userErr || !userData.user) return NextResponse.json({ error: "No autorizado." }, { status: 401 });

  const { data, error } = await supabase
    .from("planner_entries")
    .select("id,date,title,outfit_id,weather,notes")
    .order("date", { ascending: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ data: data ?? [] });
}

export async function POST(request: Request) {
  const supabase = getSupabaseServerClient();
  if (!supabase) return NextResponse.json({ error: "Supabase no está configurado." }, { status: 500 });

  const { data: userData, error: userErr } = await supabase.auth.getUser();
  if (userErr || !userData.user) return NextResponse.json({ error: "No autorizado." }, { status: 401 });

  const body = postSchema.parse(await request.json());

  const { data, error } = await supabase
    .from("planner_entries")
    .insert({
      user_id: userData.user.id,
      date: body.date,
      title: body.title,
      outfit_id: body.outfitId ?? null,
      weather: body.weather ?? null,
      notes: body.notes ?? null,
    })
    .select("id,date,title,outfit_id,weather,notes")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ ok: true, data });
}

