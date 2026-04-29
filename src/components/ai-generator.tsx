"use client";

import { useMemo, useState } from "react";
import { Sparkles, Loader2 } from "lucide-react";
import type { AiRecommendationInput } from "@/types/domain";

type ApiRecommendation = {
  title: string;
  rationale: string;
  premiumOnly: boolean;
  garments: { id: string; name: string }[];
};

const inputDefaults: AiRecommendationInput = {
  occasion: "office",
  season: "spring",
  weather: "18C, nublado",
  mood: "seguro",
};

export function AiGenerator() {
  const [input, setInput] = useState<AiRecommendationInput>(inputDefaults);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<ApiRecommendation[] | null>(null);

  const canGenerate = useMemo(() => {
    return Boolean(input.weather.trim().length && input.mood.trim().length);
  }, [input.mood, input.weather]);

  async function onGenerate() {
    setLoading(true);
    setError(null);
    setResults(null);

    try {
      const res = await fetch("/api/ai/outfits", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(input),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body?.error || "Error generando recomendaciones");
      }

      const json = await res.json();
      setResults(json.data ?? []);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error desconocido");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-[2rem] border border-stone-200 bg-white p-5 shadow-sm shadow-stone-200/50">
      <div className="flex items-start justify-between gap-6">
        <div>
          <div className="flex items-center gap-3">
            <Sparkles className="h-5 w-5 text-stone-900" />
            <h2 className="text-lg font-semibold text-stone-900">
              Generar conjunto con tu asistente personal
            </h2>
          </div>
          <p className="mt-2 text-sm text-stone-600">
            Rellena el contexto (ocasión, temporada, clima y mood) y genera 2-4 recomendaciones.
          </p>
        </div>
        <div className="rounded-3xl bg-stone-100 px-4 py-3 text-sm">
          <p className="font-semibold text-stone-900">Premium</p>
          <p className="mt-1 text-stone-600">Solo disponible para cuentas premium</p>
        </div>
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="text-sm font-medium text-stone-700">Ocasión</span>
          <select
            value={input.occasion}
            onChange={(e) => setInput((prev) => ({ ...prev, occasion: e.target.value as AiRecommendationInput["occasion"] }))}
            className="mt-2 w-full rounded-2xl border border-stone-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-stone-400"
          >
            <option value="daily">Diario</option>
            <option value="office">Oficina</option>
            <option value="event">Evento</option>
            <option value="travel">Viaje</option>
            <option value="sport">Deporte</option>
          </select>
        </label>

        <label className="block">
          <span className="text-sm font-medium text-stone-700">Temporada</span>
          <select
            value={input.season}
            onChange={(e) => setInput((prev) => ({ ...prev, season: e.target.value as AiRecommendationInput["season"] }))}
            className="mt-2 w-full rounded-2xl border border-stone-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-stone-400"
          >
            <option value="spring">Primavera</option>
            <option value="summer">Verano</option>
            <option value="autumn">Otoño</option>
            <option value="winter">Invierno</option>
          </select>
        </label>

        <label className="block sm:col-span-2">
          <span className="text-sm font-medium text-stone-700">Clima</span>
          <input
            value={input.weather}
            onChange={(e) => setInput((prev) => ({ ...prev, weather: e.target.value }))}
            className="mt-2 w-full rounded-2xl border border-stone-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-stone-400"
            placeholder="Ej: 18C, nublado"
          />
        </label>

        <label className="block sm:col-span-2">
          <span className="text-sm font-medium text-stone-700">Estado de ánimo</span>
          <input
            value={input.mood}
            onChange={(e) => setInput((prev) => ({ ...prev, mood: e.target.value }))}
            className="mt-2 w-full rounded-2xl border border-stone-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-stone-400"
            placeholder="Ej: seguro, creativo, relajado..."
          />
        </label>
      </div>

      <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="button"
          disabled={!canGenerate || loading}
          onClick={() => void onGenerate()}
          className="inline-flex items-center justify-center gap-2 rounded-full bg-stone-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-stone-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
          {loading ? "Generando..." : "Generar"}
        </button>
        <p className="text-sm text-stone-500">
          Si te aparece un error, añade al menos 1 prenda en `Armario` antes de usar el asistente.
        </p>
      </div>

      {error ? (
        <div className="mt-5 rounded-3xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
          {error}
        </div>
      ) : null}

      {results ? (
        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          {results.map((r) => (
            <article key={r.title} className="rounded-[2rem] border border-stone-200 bg-stone-50 p-5">
              <h3 className="text-base font-semibold text-stone-900">{r.title}</h3>
              <p className="mt-3 text-sm leading-6 text-stone-600">{r.rationale}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {r.garments?.map((g) => (
                  <span key={g.id} className="rounded-full bg-white px-3 py-1 text-xs font-medium text-stone-700">
                    {g.name}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>
      ) : null}
    </div>
  );
}

