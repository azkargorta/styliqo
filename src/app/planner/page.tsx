import { AppShell } from "@/components/app-shell";
import { PlannerCalendar } from "@/components/planner-calendar";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function PlannerPage() {
  const supabase = getSupabaseServerClient();
  if (!supabase) redirect("/sign-in");

  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) redirect("/sign-in");

  const [{ data: outfits }, { data: entries }] = await Promise.all([
    supabase.from("outfits").select("id,name").order("created_at", { ascending: false }),
    supabase
      .from("planner_entries")
      .select("id,date,title,outfit_id,weather,notes")
      .order("date", { ascending: true }),
  ]);

  return (
    <AppShell
      title="Planificador"
      description="Calendario operativo para decidir qué ponerse por día, reutilizando conjuntos guardados y contexto meteorológico."
    >
      <PlannerCalendar outfits={outfits ?? []} entries={entries ?? []} />
    </AppShell>
  );
}
