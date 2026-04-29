"use client";

import { useMemo, useState } from "react";
import { addDays, format, startOfWeek } from "date-fns";
import { es } from "date-fns/locale";
import clsx from "clsx";
import { CalendarDays, Plus } from "lucide-react";

type OutfitLite = {
  id: string;
  name: string;
};

type PlannerEntryLite = {
  id: string;
  date: string;
  title: string;
  outfit_id: string | null;
  weather: string | null;
  notes: string | null;
};

type ViewMode = "week" | "day";

function isoDate(date: Date) {
  return format(date, "yyyy-MM-dd");
}

export function PlannerCalendar({
  outfits,
  entries,
}: {
  outfits: OutfitLite[];
  entries: PlannerEntryLite[];
}) {
  const [mode, setMode] = useState<ViewMode>("week");
  const [anchorDate, setAnchorDate] = useState<Date>(new Date());
  const [openDate, setOpenDate] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [selectedOutfitId, setSelectedOutfitId] = useState<string>("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const days = useMemo(() => {
    if (mode === "day") return [anchorDate];
    const start = startOfWeek(anchorDate, { weekStartsOn: 1 });
    return Array.from({ length: 7 }, (_, idx) => addDays(start, idx));
  }, [anchorDate, mode]);

  const entriesByDate = useMemo(() => {
    const map = new Map<string, PlannerEntryLite[]>();
    entries.forEach((entry) => {
      const current = map.get(entry.date) ?? [];
      current.push(entry);
      map.set(entry.date, current);
    });
    return map;
  }, [entries]);

  const headerLabel = useMemo(() => {
    if (mode === "day") return format(anchorDate, "EEEE d 'de' MMMM", { locale: es });
    const start = days[0];
    const end = days[days.length - 1];
    return `${format(start, "d MMM", { locale: es })} — ${format(end, "d MMM", { locale: es })}`;
  }, [anchorDate, days, mode]);

  async function onSave() {
    if (!openDate) return;
    setSaving(true);
    setError(null);

    try {
      const res = await fetch("/api/planner/entries", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          date: openDate,
          title: title.trim(),
          outfitId: selectedOutfitId ? selectedOutfitId : null,
        }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json?.error || "No se pudo guardar.");
      window.location.reload();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error desconocido");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="rounded-[1.75rem] border border-border bg-surface p-6 shadow-sm shadow-stone-200/40">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <CalendarDays className="h-5 w-5 text-brand" />
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-stone-500">
              Planificador
            </p>
            <h2 className="mt-1 text-xl font-semibold text-stone-950">
              {headerLabel}
            </h2>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setMode("day")}
            className={clsx(
              "rounded-full px-4 py-2 text-sm font-semibold transition",
              mode === "day"
                ? "bg-brand text-white"
                : "border border-border bg-surface text-stone-700 hover:bg-surfaceMuted",
            )}
          >
            Día
          </button>
          <button
            type="button"
            onClick={() => setMode("week")}
            className={clsx(
              "rounded-full px-4 py-2 text-sm font-semibold transition",
              mode === "week"
                ? "bg-brand text-white"
                : "border border-border bg-surface text-stone-700 hover:bg-surfaceMuted",
            )}
          >
            Semana
          </button>

          <button
            type="button"
            onClick={() => setAnchorDate((d) => addDays(d, mode === "day" ? -1 : -7))}
            className="rounded-full border border-border bg-surface px-4 py-2 text-sm font-semibold text-stone-700 transition hover:bg-surfaceMuted"
          >
            Anterior
          </button>
          <button
            type="button"
            onClick={() => setAnchorDate(new Date())}
            className="rounded-full border border-border bg-surface px-4 py-2 text-sm font-semibold text-stone-700 transition hover:bg-surfaceMuted"
          >
            Hoy
          </button>
          <button
            type="button"
            onClick={() => setAnchorDate((d) => addDays(d, mode === "day" ? 1 : 7))}
            className="rounded-full border border-border bg-surface px-4 py-2 text-sm font-semibold text-stone-700 transition hover:bg-surfaceMuted"
          >
            Siguiente
          </button>
        </div>
      </div>

      {mode === "week" ? (
        <div className="mt-6 -mx-2 overflow-x-auto px-2">
          <div className="grid min-w-[980px] grid-cols-7 gap-3">
            {days.map((day) => {
              const key = isoDate(day);
              const dayEntries = entriesByDate.get(key) ?? [];

              return (
                <div key={key} className="rounded-[1.25rem] border border-border bg-surfaceMuted p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-stone-500">
                        {format(day, "EEE", { locale: es })}
                      </p>
                      <p className="mt-1 text-sm font-semibold text-stone-950">
                        {format(day, "d MMM", { locale: es })}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setOpenDate(key);
                        setTitle("");
                        setSelectedOutfitId("");
                        setError(null);
                      }}
                      className="shrink-0 inline-flex items-center gap-2 rounded-full bg-white px-3 py-2 text-xs font-semibold text-stone-900 transition hover:bg-stone-100"
                    >
                      <Plus className="h-4 w-4" />
                      <span className="hidden lg:inline">Añadir</span>
                    </button>
                  </div>

                  <div className="mt-4 space-y-2">
                    {dayEntries.length ? (
                      dayEntries.map((entry) => {
                        const outfitName = entry.outfit_id
                          ? outfits.find((o) => o.id === entry.outfit_id)?.name
                          : null;

                        return (
                          <div key={entry.id} className="rounded-2xl bg-white p-3">
                            <p className="text-sm font-semibold text-stone-900">
                              {entry.title}
                            </p>
                            <p className="mt-1 text-xs text-stone-500">
                              {outfitName ? `Conjunto: ${outfitName}` : "Sin conjunto asignado"}
                            </p>
                          </div>
                        );
                      })
                    ) : (
                      <p className="text-sm text-stone-500">Sin eventos</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="mt-6 grid gap-3">
          {days.map((day) => {
            const key = isoDate(day);
            const dayEntries = entriesByDate.get(key) ?? [];

            return (
              <div key={key} className="rounded-[1.25rem] border border-border bg-surfaceMuted p-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-stone-500">
                      {format(day, "EEEE", { locale: es })}
                    </p>
                    <p className="mt-1 text-sm font-semibold text-stone-950">
                      {format(day, "d MMMM", { locale: es })}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setOpenDate(key);
                      setTitle("");
                      setSelectedOutfitId("");
                      setError(null);
                    }}
                    className="shrink-0 inline-flex items-center gap-2 rounded-full bg-white px-3 py-2 text-xs font-semibold text-stone-900 transition hover:bg-stone-100"
                  >
                    <Plus className="h-4 w-4" />
                    Añadir
                  </button>
                </div>

                <div className="mt-4 space-y-2">
                  {dayEntries.length ? (
                    dayEntries.map((entry) => {
                      const outfitName = entry.outfit_id
                        ? outfits.find((o) => o.id === entry.outfit_id)?.name
                        : null;

                      return (
                        <div key={entry.id} className="rounded-2xl bg-white p-3">
                          <p className="text-sm font-semibold text-stone-900">
                            {entry.title}
                          </p>
                          <p className="mt-1 text-xs text-stone-500">
                            {outfitName ? `Conjunto: ${outfitName}` : "Sin conjunto asignado"}
                          </p>
                        </div>
                      );
                    })
                  ) : (
                    <p className="text-sm text-stone-500">Sin eventos</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {openDate ? (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/35 px-4">
          <div className="w-full max-w-lg rounded-[1.75rem] border border-border bg-surface p-6 shadow-xl">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-stone-500">
              Nuevo evento
            </p>
            <h3 className="mt-2 text-xl font-semibold text-stone-950">
              {format(new Date(openDate), "EEEE d 'de' MMMM", { locale: es })}
            </h3>

            <div className="mt-5 space-y-4">
              <label className="block">
                <span className="text-sm font-medium text-stone-700">Título</span>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="mt-2 w-full rounded-2xl border border-border bg-white px-4 py-3 text-sm outline-none focus:border-brand"
                  placeholder="Ej: Reunión, cena, viaje..."
                />
              </label>

              <label className="block">
                <span className="text-sm font-medium text-stone-700">Conjunto</span>
                <select
                  value={selectedOutfitId}
                  onChange={(e) => setSelectedOutfitId(e.target.value)}
                  className="mt-2 w-full rounded-2xl border border-border bg-white px-4 py-3 text-sm outline-none focus:border-brand"
                >
                  <option value="">Sin asignar</option>
                  {outfits.map((o) => (
                    <option key={o.id} value={o.id}>
                      {o.name}
                    </option>
                  ))}
                </select>
                {outfits.length === 0 ? (
                  <p className="mt-2 text-xs text-stone-500">
                    No tienes conjuntos aún. Crea alguno en “Conjuntos” o usa el seed demo.
                  </p>
                ) : null}
              </label>
            </div>

            {error ? (
              <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 p-3 text-sm text-red-800">
                {error}
              </div>
            ) : null}

            <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => setOpenDate(null)}
                className="rounded-full border border-border bg-white px-5 py-3 text-sm font-semibold text-stone-900 transition hover:bg-stone-50"
              >
                Cancelar
              </button>
              <button
                type="button"
                disabled={saving || title.trim().length < 2}
                onClick={() => void onSave()}
                className="rounded-full bg-brand px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving ? "Guardando..." : "Guardar"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

