"use client";

import { useState } from "react";
import { Plus, X } from "lucide-react";
import type { Season, Occasion } from "@/types/domain";

const categories = ["tops", "bottoms", "outerwear", "footwear", "accessories"] as const;
const seasons = ["spring", "summer", "autumn", "winter"] as const;
const occasions = ["daily", "office", "event", "travel", "sport"] as const;

const categoryLabels: Record<(typeof categories)[number], string> = {
  tops: "Tops",
  bottoms: "Pantalones",
  outerwear: "Abrigos",
  footwear: "Calzado",
  accessories: "Accesorios",
};

const seasonLabels: Record<Season, string> = {
  spring: "Primavera",
  summer: "Verano",
  autumn: "Otoño",
  winter: "Invierno",
};

const occasionLabels: Record<Occasion, string> = {
  daily: "Diario",
  office: "Oficina",
  event: "Evento",
  travel: "Viaje",
  sport: "Deporte",
};

export function GarmentForm() {
  const [name, setName] = useState("");
  const [brand, setBrand] = useState("");
  const [category, setCategory] = useState<(typeof categories)[number]>("tops");
  const [colors, setColors] = useState<string[]>([]);
  const [colorPickerOpen, setColorPickerOpen] = useState(false);
  const [photo, setPhoto] = useState<File | null>(null);
  const [notes, setNotes] = useState("");
  const [isFavorite, setIsFavorite] = useState(false);
  const [selectedSeasons, setSelectedSeasons] = useState<Season[]>(["spring"]);
  const [selectedOccasions, setSelectedOccasions] = useState<Occasion[]>(["daily"]);
  const [loading, setLoading] = useState(false);
  const [seeding, setSeeding] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  function toggle<T extends string>(value: T, list: T[], setList: (next: T[]) => void) {
    if (list.includes(value)) setList(list.filter((v) => v !== value));
    else setList([...list, value]);
  }

  function addColor(raw: string) {
    const value = raw.trim().replace(/\s+/g, " ");
    if (!value) return;
    if (colors.some((c) => c.toLowerCase() === value.toLowerCase())) return;
    setColors((prev) => [...prev, value]);
  }

  function removeColor(value: string) {
    setColors((prev) => prev.filter((c) => c !== value));
  }

  async function onSubmit() {
    setMessage(null);
    setLoading(true);

    try {
      const form = new FormData();
      form.set("name", name);
      form.set("category", category);
      form.set("color", colors.join(", "));
      if (brand.trim()) form.set("brand", brand.trim());
      if (notes.trim()) form.set("notes", notes.trim());
      form.set("isFavorite", String(isFavorite));
      selectedSeasons.forEach((s) => form.append("seasons", s));
      selectedOccasions.forEach((o) => form.append("occasions", o));
      if (photo) form.set("photo", photo);

      const res = await fetch("/api/wardrobe/garments", {
        method: "POST",
        body: form,
      });

      const json = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(json?.error || "No se pudo guardar la prenda.");
      }

      setName("");
      setBrand("");
      setColors([]);
      setColorPickerOpen(false);
      setPhoto(null);
      setNotes("");
      setIsFavorite(false);
      setSelectedSeasons(["spring"]);
      setSelectedOccasions(["daily"]);
      setMessage("Prenda guardada correctamente.");

      // Recargamos para ver el nuevo item.
      window.location.reload();
    } catch (e) {
      setMessage(e instanceof Error ? e.message : "Error desconocido.");
    } finally {
      setLoading(false);
    }
  }

  async function onSeedDemoWardrobe() {
    setMessage(null);
    setSeeding(true);

    try {
      const res = await fetch("/api/wardrobe/seed-demo", {
        method: "POST",
      });

      const json = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(json?.error || "No se pudo cargar el armario demo.");
      }

      setMessage(`Armario demo cargado correctamente (${json.inserted ?? 0} prendas).`);
      window.location.reload();
    } catch (e) {
      setMessage(e instanceof Error ? e.message : "Error desconocido.");
    } finally {
      setSeeding(false);
    }
  }

  return (
    <div className="rounded-[2rem] border border-stone-200 bg-white p-5 shadow-sm shadow-stone-200/50">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <Plus className="h-5 w-5 text-stone-900" />
            <h2 className="text-lg font-semibold text-stone-900">Añadir prenda</h2>
          </div>
          <p className="mt-2 text-sm text-stone-600">
            Para que el asistente personal funcione, necesitamos al menos 1 prenda en tu armario.
          </p>
        </div>
        <div className="rounded-3xl bg-stone-100 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-stone-600">
          {loading || seeding ? "Procesando..." : "Local + Supabase"}
        </div>
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <label className="block sm:col-span-2">
          <span className="text-sm font-medium text-stone-700">Foto</span>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setPhoto(e.target.files?.[0] ?? null)}
            className="mt-2 w-full rounded-2xl border border-stone-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-stone-400"
          />
          <p className="mt-2 text-xs text-stone-500">
            Recomendado: JPG/PNG. Se guardará en tu Storage de Supabase.
          </p>
        </label>

        <label className="block sm:col-span-2">
          <span className="text-sm font-medium text-stone-700">Nombre</span>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ej: Camisa Oxford blanca"
            className="mt-2 w-full rounded-2xl border border-stone-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-stone-400"
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium text-stone-700">Categoría</span>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as (typeof categories)[number])}
            className="mt-2 w-full rounded-2xl border border-stone-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-stone-400"
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                {categoryLabels[c]}
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="text-sm font-medium text-stone-700">Colores</span>
          <div className="mt-2 rounded-2xl border border-stone-200 bg-white px-3 py-2">
            <div className="flex flex-wrap gap-2">
              {colors.map((c) => (
                <span
                  key={c}
                  className="inline-flex items-center gap-2 rounded-full bg-stone-100 px-3 py-1 text-xs font-semibold text-stone-700"
                >
                  {c}
                  <button
                    type="button"
                    onClick={() => removeColor(c)}
                    className="rounded-full p-1 text-stone-500 hover:bg-white"
                    aria-label={`Quitar color ${c}`}
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </span>
              ))}
            </div>
            <div className="relative mt-2">
              <button
                type="button"
                onClick={() => setColorPickerOpen((v) => !v)}
                className="flex w-full items-center justify-between rounded-xl border border-stone-200 bg-white px-3 py-2 text-sm font-semibold text-stone-900 transition hover:bg-stone-50"
              >
                <span>{colorPickerOpen ? "Cerrar colores" : "Seleccionar colores"}</span>
                <span className="text-xs font-semibold text-stone-500">
                  {colors.length ? `${colors.length} seleccionados` : "0 seleccionados"}
                </span>
              </button>

              {colorPickerOpen ? (
                <div className="absolute z-20 mt-2 w-full overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-lg">
                  <div className="max-h-56 overflow-auto p-2">
                    {[
                      "Blanco",
                      "Negro",
                      "Gris",
                      "Beige",
                      "Marrón",
                      "Camel",
                      "Azul marino",
                      "Azul",
                      "Verde",
                      "Oliva",
                      "Rojo",
                      "Granate",
                      "Rosa",
                      "Morado",
                      "Naranja",
                      "Amarillo",
                      "Dorado",
                      "Plateado",
                      "Multicolor",
                      "Estampado",
                    ].map((label) => {
                      const selected = colors.includes(label);
                      return (
                        <button
                          key={label}
                          type="button"
                          onClick={() => {
                            if (selected) removeColor(label);
                            else addColor(label);
                          }}
                          className={[
                            "flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-sm transition",
                            selected
                              ? "bg-brand/10 text-stone-950 ring-1 ring-brand/15"
                              : "text-stone-700 hover:bg-stone-50",
                          ].join(" ")}
                        >
                          <span>{label}</span>
                          <span
                            className={[
                              "rounded-full px-2 py-1 text-[11px] font-semibold",
                              selected ? "bg-brand text-white" : "bg-stone-100 text-stone-600",
                            ].join(" ")}
                          >
                            {selected ? "Añadido" : "Añadir"}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ) : null}
            </div>
            <p className="mt-2 text-xs text-stone-500">
              Puedes añadir varios colores (útil para prendas bicolor o estampadas).
            </p>
          </div>
        </label>

        <label className="block">
          <span className="text-sm font-medium text-stone-700">Marca (opcional)</span>
          <input
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
            placeholder="Ej: COS"
            className="mt-2 w-full rounded-2xl border border-stone-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-stone-400"
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium text-stone-700">Favorita</span>
          <div className="mt-2 flex items-center gap-3 rounded-2xl border border-stone-200 bg-white px-4 py-3">
            <input
              type="checkbox"
              checked={isFavorite}
              onChange={(e) => setIsFavorite(e.target.checked)}
            />
            <span className="text-sm text-stone-600">Marcar como favorita</span>
          </div>
        </label>

        <label className="block sm:col-span-2">
          <span className="text-sm font-medium text-stone-700">Temporadas</span>
          <div className="mt-2 flex flex-wrap gap-2">
            {seasons.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => toggle(s, selectedSeasons, setSelectedSeasons)}
                className={[
                  "rounded-full border px-3 py-2 text-xs font-semibold transition",
                  selectedSeasons.includes(s)
                    ? "border-stone-900 bg-stone-900 text-white"
                    : "border-stone-200 bg-white text-stone-700 hover:bg-stone-50",
                ].join(" ")}
              >
                {seasonLabels[s]}
              </button>
            ))}
          </div>
        </label>

        <label className="block sm:col-span-2">
          <span className="text-sm font-medium text-stone-700">Ocasiones</span>
          <div className="mt-2 flex flex-wrap gap-2">
            {occasions.map((o) => (
              <button
                key={o}
                type="button"
                onClick={() => toggle(o, selectedOccasions, setSelectedOccasions)}
                className={[
                  "rounded-full border px-3 py-2 text-xs font-semibold transition",
                  selectedOccasions.includes(o)
                    ? "border-stone-900 bg-stone-900 text-white"
                    : "border-stone-200 bg-white text-stone-700 hover:bg-stone-50",
                ].join(" ")}
              >
                {occasionLabels[o]}
              </button>
            ))}
          </div>
        </label>

        <label className="block sm:col-span-2">
          <span className="text-sm font-medium text-stone-700">Notas (opcional)</span>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Ej: Talla grande, cómoda para X..."
            className="mt-2 min-h-[92px] w-full resize-none rounded-2xl border border-stone-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-stone-400"
          />
        </label>
      </div>

      {message ? (
        <div className="mt-4 rounded-3xl border border-stone-200 bg-stone-50 p-4 text-sm text-stone-700">
          {message}
        </div>
      ) : null}

      <button
        type="button"
        disabled={
          loading ||
          seeding ||
          name.trim().length < 2 ||
          colors.length === 0
        }
        onClick={() => void onSubmit()}
        className="mt-5 w-full rounded-2xl bg-stone-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-stone-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        Guardar prenda
      </button>

      <button
        type="button"
        disabled={loading || seeding}
        onClick={() => void onSeedDemoWardrobe()}
        className="mt-3 w-full rounded-2xl border border-stone-300 bg-white px-4 py-3 text-sm font-semibold text-stone-900 transition hover:bg-stone-50 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {seeding ? "Cargando armario demo..." : "Cargar armario demo"}
      </button>
    </div>
  );
}

