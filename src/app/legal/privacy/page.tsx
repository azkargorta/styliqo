import { SectionCard } from "@/components/section-card";

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-stone-100 px-4 py-10">
      <div className="mx-auto max-w-4xl">
        <SectionCard
          eyebrow="Legal"
          title="Política de privacidad"
          description="Texto base para la fase de lanzamiento. Debe revisarse jurídicamente antes de publicar la app."
        >
          <div className="space-y-6 text-sm leading-7 text-stone-700">
            <p>
              Styliqo almacena información de cuenta, prendas, imágenes, outfits,
              elementos del planner, wishlist y eventos relacionados con suscripción.
            </p>
            <p>
              Las imágenes subidas por el usuario se destinan exclusivamente a la
              prestación del servicio y a futuras funciones de etiquetado y recomendación.
            </p>
            <p>
              Si se activan funciones premium con IA, podrán procesarse metadatos del armario
              y contexto de uso para devolver sugerencias de conjuntos.
            </p>
          </div>
        </SectionCard>
      </div>
    </main>
  );
}
