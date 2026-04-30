"use client";

import { useMemo, useState } from "react";
import clsx from "clsx";
import { Check, Pencil, Plus, Trash2 } from "lucide-react";
import { Collapsible } from "@/components/collapsible";

type GarmentLite = {
  id: string;
  name: string;
  category: string;
  color: string;
  brand: string | null;
};

type OutfitApi = {
  id: string;
  name: string;
  occasion: string;
  season: string;
  notes: string | null;
  outfit_items?: {
    garment_id: string;
    sort_order: number;
    garments?: GarmentLite | GarmentLite[] | null;
  }[];
};

const occasionLabels: Record<string, string> = {
  daily: "Diario",
  office: "Oficina",
  event: "Evento",
  travel: "Viaje",
  sport: "Deporte",
};

const seasonLabels: Record<string, string> = {
  spring: "Primavera",
  summer: "Verano",
  autumn: "Otoño",
  winter: "Invierno",
};

const categoryLabels: Record<string, string> = {
  tops: "Tops",
  bottoms: "Pantalones",
  outerwear: "Abrigos",
  footwear: "Calzado",
  accessories: "Accesorios",
};

function uniq<T>(arr: T[]) {
  return Array.from(new Set(arr));
}

export function OutfitBuilder({
  garments,
  outfits,
}: {
  garments: GarmentLite[];
  outfits: OutfitApi[];
}) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [occasion, setOccasion] = useState("daily");
  const [season, setSeason] = useState("spring");
  const [notes, setNotes] = useState("");
  const [selectedGarmentIds, setSelectedGarmentIds] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const garmentsByCategory = useMemo(() => {
    const map = new Map<string, GarmentLite[]>();
    garments.forEach((g) => {
      const list = map.get(g.category) ?? [];
      list.push(g);
      map.set(g.category, list);
    });
    return map;
  }, [garments]);

  const categoriesInWardrobe = useMemo(() => {
    return uniq(garments.map((g) => g.category)).filter(Boolean);
  }, [garments]);

  const selectedGarments = useMemo(() => {
    const byId = new Map(garments.map((g) => [g.id, g] as const));
    return selectedGarmentIds.map((id) => byId.get(id)).filter(Boolean) as GarmentLite[];
  }, [garments, selectedGarmentIds]);

  function resetForm() {
    setActiveId(null);
    setName("");
    setOccasion("daily");
    setSeason("spring");
    setNotes("");
    setSelectedGarmentIds([]);
    setError(null);
  }

  function loadOutfit(outfit: OutfitApi) {
    setActiveId(outfit.id);
    setName(outfit.name);
    setOccasion(outfit.occasion);
    setSeason(outfit.season);
    setNotes(outfit.notes ?? "");
    const ids =
      outfit.outfit_items
        ?.slice()
        .sort((a, b) => a.sort_order - b.sort_order)
        .map((i) => i.garment_id) ?? [];
    setSelectedGarmentIds(ids);
    setError(null);
  }

  function toggleGarment(id: string) {
    setSelectedGarmentIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  }

  async function onSave() {
    setBusy(true);
    setError(null);
    try {
      const payload = {
        name: name.trim(),
        occasion,
        season,
        notes: notes.trim() ? notes.trim() : undefined,
        garmentIds: selectedGarmentIds,
      };

      const res = await fetch(activeId ? `/api/outfits/${activeId}` : "/api/outfits", {
        method: activeId ? "PATCH" : "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json?.error || "No se pudo guardar el conjunto.");
      window.location.reload();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error desconocido");
    } finally {
      setBusy(false);
    }
  }

  async function onDelete(outfitId: string) {
    if (!confirm("¿Seguro que quieres borrar este conjunto?")) return;
    setBusy(true);
    setError(null);
    try {
      const res = await fetch(`/api/outfits/${outfitId}`, { method: "DELETE" });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json?.error || "No se pudo borrar.");
      window.location.reload();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error desconocido");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
      <div className="space-y-6">
        <Collapsible
          title={activeId ? "Editar conjunto" : "Crear conjunto"}
          description="Selecciona prendas por categoría y guarda tu combinación para reutilizarla en el planificador."
          defaultOpen={false}
          actionLabelClosed={activeId ? "Editar" : "Crear"}
          actionLabelOpen="Cerrar"
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block sm:col-span-2">
              <span className="text-sm font-medium text-stone-700">Nombre</span>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ej: Oficina minimal"
                className="mt-2 w-full rounded-2xl border border-border bg-white px-4 py-3 text-sm outline-none focus:border-brand"
              />
            </label>

            <label className="block">
              <span className="text-sm font-medium text-stone-700">Ocasión</span>
              <select
                value={occasion}
                onChange={(e) => setOccasion(e.target.value)}
                className="mt-2 w-full rounded-2xl border border-border bg-white px-4 py-3 text-sm outline-none focus:border-brand"
              >
                {Object.keys(occasionLabels).map((k) => (
                  <option key={k} value={k}>
                    {occasionLabels[k]}
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="text-sm font-medium text-stone-700">Temporada</span>
              <select
                value={season}
                onChange={(e) => setSeason(e.target.value)}
                className="mt-2 w-full rounded-2xl border border-border bg-white px-4 py-3 text-sm outline-none focus:border-brand"
              >
                {Object.keys(seasonLabels).map((k) => (
                  <option key={k} value={k}>
                    {seasonLabels[k]}
                  </option>
                ))}
              </select>
            </label>

            <label className="block sm:col-span-2">
              <span className="text-sm font-medium text-stone-700">Notas (opcional)</span>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Ej: Ideal para reuniones o días templados."
                className="mt-2 min-h-[88px] w-full resize-none rounded-2xl border border-border bg-white px-4 py-3 text-sm outline-none focus:border-brand"
              />
            </label>
          </div>

          <div className="mt-5 space-y-4">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-stone-500">
              Prendas
            </p>
            {categoriesInWardrobe.length ? (
              <div className="space-y-4">
                {categoriesInWardrobe.map((cat) => {
                  const list = garmentsByCategory.get(cat) ?? [];
                  return (
                    <div key={cat} className="rounded-[1.25rem] border border-border bg-surfaceMuted p-4">
                      <p className="text-sm font-semibold text-stone-900">
                        {categoryLabels[cat] ?? cat}
                      </p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {list.map((g) => {
                          const selected = selectedGarmentIds.includes(g.id);
                          return (
                            <button
                              key={g.id}
                              type="button"
                              onClick={() => toggleGarment(g.id)}
                              className={clsx(
                                "inline-flex items-center gap-2 rounded-full border px-3 py-2 text-xs font-semibold transition",
                                selected
                                  ? "border-brand bg-brand/10 text-stone-950"
                                  : "border-border bg-white text-stone-700 hover:bg-stone-50",
                              )}
                            >
                              {selected ? <Check className="h-3.5 w-3.5 text-brand" /> : null}
                              {g.name}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="rounded-[1.25rem] border border-dashed border-border bg-surfaceMuted p-6 text-sm text-stone-600">
                No tienes prendas en el armario todavía. Añade prendas primero.
              </div>
            )}

            <div className="rounded-[1.25rem] border border-border bg-white p-4">
              <p className="text-sm font-semibold text-stone-900">
                Selección ({selectedGarmentIds.length})
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {selectedGarments.length ? (
                  selectedGarments.map((g) => (
                    <span key={g.id} className="rounded-full bg-stone-100 px-3 py-1 text-xs font-semibold text-stone-700">
                      {g.name}
                    </span>
                  ))
                ) : (
                  <p className="text-sm text-stone-500">Selecciona al menos 1 prenda.</p>
                )}
              </div>
            </div>

            {error ? (
              <div className="rounded-2xl border border-red-200 bg-red-50 p-3 text-sm text-red-800">
                {error}
              </div>
            ) : null}

            <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => resetForm()}
                className="rounded-full border border-border bg-white px-5 py-3 text-sm font-semibold text-stone-900 transition hover:bg-stone-50"
              >
                Limpiar
              </button>
              <button
                type="button"
                disabled={busy || name.trim().length < 2 || selectedGarmentIds.length === 0}
                onClick={() => void onSave()}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-brand px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {activeId ? <Pencil className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                {busy ? "Guardando..." : activeId ? "Guardar cambios" : "Crear conjunto"}
              </button>
            </div>
          </div>
        </Collapsible>

        <div className="rounded-[1.75rem] border border-border bg-surface p-6 shadow-sm shadow-stone-200/40">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-stone-500">
            Seed demo
          </p>
          <p className="mt-2 text-sm text-stone-600">
            Si quieres generar rápidamente 2 conjuntos de ejemplo para probar el planificador:
          </p>
          <div className="mt-3 rounded-2xl bg-surfaceMuted p-4 font-mono text-xs text-stone-800">
            POST /api/outfits/seed-demo
          </div>
        </div>
      </div>

      <div className="rounded-[1.75rem] border border-border bg-surface p-6 shadow-sm shadow-stone-200/40">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-stone-500">
          Biblioteca
        </p>
        <h2 className="mt-2 text-xl font-semibold text-stone-950">
          Conjuntos guardados
        </h2>
        <p className="mt-2 text-sm text-stone-600">
          Edita o borra conjuntos. Se pueden asignar desde el planificador.
        </p>

        <div className="mt-5 space-y-3">
          {outfits.length ? (
            outfits.map((o) => (
              <article key={o.id} className="rounded-[1.25rem] border border-border bg-surfaceMuted p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate text-base font-semibold text-stone-950">{o.name}</p>
                    <p className="mt-1 text-sm text-stone-600">
                      {occasionLabels[o.occasion] ?? o.occasion} · {seasonLabels[o.season] ?? o.season}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => loadOutfit(o)}
                      className="inline-flex items-center gap-2 rounded-full border border-border bg-white px-3 py-2 text-xs font-semibold text-stone-900 transition hover:bg-stone-50"
                    >
                      <Pencil className="h-4 w-4 text-stone-700" />
                      Editar
                    </button>
                    <button
                      type="button"
                      onClick={() => void onDelete(o.id)}
                      className="inline-flex items-center gap-2 rounded-full border border-border bg-white px-3 py-2 text-xs font-semibold text-stone-900 transition hover:bg-red-50 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                      Borrar
                    </button>
                  </div>
                </div>

                <div className="mt-3 flex flex-wrap gap-2">
                  {(o.outfit_items ?? [])
                    .slice()
                    .sort((a, b) => a.sort_order - b.sort_order)
                    .map((it) => {
                      const g = it.garments;
                      return Array.isArray(g) ? g[0] : g;
                    })
                    .filter(Boolean)
                    .map((g) => (
                      <span
                        key={g!.id}
                        className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-stone-700 ring-1 ring-border"
                      >
                        {g!.name}
                      </span>
                    ))}
                </div>

                {o.notes ? (
                  <p className="mt-3 text-sm leading-6 text-stone-600">{o.notes}</p>
                ) : null}
              </article>
            ))
          ) : (
            <div className="rounded-[1.25rem] border border-dashed border-border bg-surfaceMuted p-6 text-sm text-stone-600">
              Aún no tienes conjuntos. Crea el primero con el editor de la izquierda.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

