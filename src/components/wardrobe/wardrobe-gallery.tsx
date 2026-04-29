"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import clsx from "clsx";
import { Heart, SlidersHorizontal } from "lucide-react";
import type { Garment, GarmentCategory, Season } from "@/types/domain";

type ViewMode = "all" | "bySeason";

const seasonLabels: Record<Season, string> = {
  spring: "Primavera",
  summer: "Verano",
  autumn: "Otoño",
  winter: "Invierno",
};

const categoryLabels: Record<GarmentCategory, string> = {
  tops: "Tops",
  bottoms: "Pantalones",
  outerwear: "Abrigos",
  footwear: "Calzado",
  accessories: "Accesorios",
};

const seasonOrder: Season[] = ["spring", "summer", "autumn", "winter"];

function matchesSeason(garment: Garment, season: Season | "all") {
  if (season === "all") return true;
  return garment.season.includes(season);
}

function CardGrid({
  list,
  busyId,
  onToggleFavorite,
}: {
  list: Garment[];
  busyId: string | null;
  onToggleFavorite: (garment: Garment) => void;
}) {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {list.map((garment) => (
        <article
          key={garment.id}
          className="group overflow-hidden rounded-[1.75rem] border border-border bg-surface shadow-sm shadow-stone-200/40"
        >
          <div className="relative h-64 bg-stone-200">
            <Image
              src={garment.imageUrl}
              alt={garment.name}
              fill
              className="object-cover"
              sizes="(max-width: 1280px) 50vw, 33vw"
            />
            <button
              type="button"
              onClick={() => onToggleFavorite(garment)}
              disabled={busyId === garment.id}
              className={clsx(
                "absolute right-3 top-3 inline-flex h-10 w-10 items-center justify-center rounded-2xl backdrop-blur transition",
                garment.favorite
                  ? "bg-brand text-white shadow-md shadow-black/10"
                  : "bg-white/80 text-stone-700 hover:bg-white",
                busyId === garment.id ? "opacity-60" : "opacity-100",
              )}
              aria-label={garment.favorite ? "Quitar de favoritas" : "Marcar como favorita"}
            >
              <Heart className={clsx("h-5 w-5", garment.favorite ? "fill-white" : "fill-transparent")} />
            </button>
          </div>

          <div className="p-5">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <h3 className="truncate text-lg font-semibold text-stone-950">
                  {garment.name}
                </h3>
                <p className="mt-1 text-sm text-stone-600">
                  {garment.brand ? `${garment.brand} · ` : ""}
                  {garment.color} · {categoryLabels[garment.category]}
                </p>
              </div>
              {garment.favorite ? (
                <span className="rounded-full bg-brand/10 px-3 py-1 text-xs font-semibold text-brand ring-1 ring-brand/15">
                  Favorita
                </span>
              ) : null}
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {garment.season.map((s) => (
                <span
                  key={s}
                  className="rounded-full bg-surfaceMuted px-3 py-1 text-xs font-semibold text-stone-600 ring-1 ring-border"
                >
                  {seasonLabels[s]}
                </span>
              ))}
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}

export function WardrobeGallery({ garments }: { garments: Garment[] }) {
  const [viewMode, setViewMode] = useState<ViewMode>("all");
  const [seasonFilter, setSeasonFilter] = useState<Season | "all">("all");
  const [categoryFilter, setCategoryFilter] = useState<GarmentCategory | "all">("all");
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return garments.filter((g) => {
      if (favoritesOnly && !g.favorite) return false;
      if (categoryFilter !== "all" && g.category !== categoryFilter) return false;
      if (!matchesSeason(g, seasonFilter)) return false;
      return true;
    });
  }, [garments, favoritesOnly, categoryFilter, seasonFilter]);

  const groupedBySeason = useMemo(() => {
    const map = new Map<Season, Garment[]>();
    seasonOrder.forEach((s) => map.set(s, []));

    filtered.forEach((g) => {
      const seasons = g.season.length ? g.season : seasonOrder;
      seasons.forEach((s) => {
        if (map.has(s)) map.get(s)!.push(g);
      });
    });

    return map;
  }, [filtered]);

  async function toggleFavorite(garment: Garment) {
    setBusyId(garment.id);
    try {
      const res = await fetch(`/api/wardrobe/garments/${garment.id}`, {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ isFavorite: !garment.favorite }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json?.error || "No se pudo actualizar la prenda.");
      window.location.reload();
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="space-y-5">
      <div className="rounded-[1.75rem] border border-border bg-surface p-5 shadow-sm shadow-stone-200/40">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="flex items-center gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-2xl bg-brand/10 ring-1 ring-brand/15">
              <SlidersHorizontal className="h-5 w-5 text-brand" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-stone-500">
                Filtros
              </p>
              <p className="mt-1 text-sm text-stone-600">
                Filtra por estación, categoría y favoritas.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setViewMode("all")}
              className={clsx(
                "rounded-full px-4 py-2 text-sm font-semibold transition",
                viewMode === "all"
                  ? "bg-brand text-white"
                  : "border border-border bg-surface text-stone-700 hover:bg-surfaceMuted",
              )}
            >
              Todas
            </button>
            <button
              type="button"
              onClick={() => setViewMode("bySeason")}
              className={clsx(
                "rounded-full px-4 py-2 text-sm font-semibold transition",
                viewMode === "bySeason"
                  ? "bg-brand text-white"
                  : "border border-border bg-surface text-stone-700 hover:bg-surfaceMuted",
              )}
            >
              Por estación
            </button>
          </div>
        </div>

        <div className="mt-5 grid gap-3 md:grid-cols-3">
          <label className="block">
            <span className="text-sm font-medium text-stone-700">Estación</span>
            <select
              value={seasonFilter}
              onChange={(e) => setSeasonFilter(e.target.value as Season | "all")}
              className="mt-2 w-full rounded-2xl border border-border bg-white px-4 py-3 text-sm outline-none transition focus:border-brand"
            >
              <option value="all">Todas</option>
              {seasonOrder.map((s) => (
                <option key={s} value={s}>
                  {seasonLabels[s]}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="text-sm font-medium text-stone-700">Categoría</span>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value as GarmentCategory | "all")}
              className="mt-2 w-full rounded-2xl border border-border bg-white px-4 py-3 text-sm outline-none transition focus:border-brand"
            >
              <option value="all">Todas</option>
              {Object.keys(categoryLabels).map((c) => (
                <option key={c} value={c}>
                  {categoryLabels[c as GarmentCategory]}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="text-sm font-medium text-stone-700">Favoritas</span>
            <button
              type="button"
              onClick={() => setFavoritesOnly((v) => !v)}
              className={clsx(
                "mt-2 flex w-full items-center justify-between rounded-2xl border border-border bg-white px-4 py-3 text-sm font-semibold text-stone-900 transition hover:bg-surfaceMuted",
              )}
            >
              <span>{favoritesOnly ? "Solo favoritas" : "Todas"}</span>
              <Heart className={clsx("h-4 w-4", favoritesOnly ? "text-brand fill-brand" : "text-stone-400")} />
            </button>
          </label>
        </div>
      </div>

      {viewMode === "all" ? (
        filtered.length ? (
          <CardGrid list={filtered} busyId={busyId} onToggleFavorite={(g) => void toggleFavorite(g)} />
        ) : (
          <div className="rounded-[1.75rem] border border-dashed border-border bg-surfaceMuted p-8 text-center text-sm text-stone-600">
            No hay prendas con estos filtros.
          </div>
        )
      ) : (
        <div className="space-y-6">
          {seasonOrder.map((s) => {
            const list = groupedBySeason.get(s) ?? [];
            if (!list.length) return null;
            return (
              <section key={s}>
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.28em] text-stone-500">
                      Estación
                    </p>
                    <h3 className="mt-1 text-xl font-semibold text-stone-950">
                      {seasonLabels[s]}
                    </h3>
                  </div>
                  <span className="rounded-full bg-surface px-4 py-2 text-sm font-semibold text-stone-700 ring-1 ring-border">
                    {list.length} prendas
                  </span>
                </div>
                <CardGrid list={list} busyId={busyId} onToggleFavorite={(g) => void toggleFavorite(g)} />
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
}

