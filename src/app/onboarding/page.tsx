import { SectionCard } from "@/components/section-card";

export default function OnboardingPage() {
  return (
    <main className="min-h-screen bg-stone-100 px-4 py-10">
      <div className="mx-auto max-w-4xl">
        <SectionCard
          eyebrow="Onboarding"
          title="Primeros pasos en Styliqo"
          description="Flujo base para activar la experiencia desde el primer día y reducir el esfuerzo de carga inicial."
        >
          <ol className="space-y-4 text-sm leading-7 text-stone-700">
            <li>1. Completa tu perfil y define tu estilo principal.</li>
            <li>2. Añade tus primeras 10 prendas clave con foto.</li>
            <li>3. Crea 2 outfits base: oficina y diario.</li>
            <li>4. Planifica un evento de esta semana para empezar a usar el planner.</li>
            <li>5. Si activas premium, genera tus primeros looks con IA.</li>
          </ol>
        </SectionCard>
      </div>
    </main>
  );
}
