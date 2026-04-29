import { SectionCard } from "@/components/section-card";

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-stone-100 px-4 py-10">
      <div className="mx-auto max-w-4xl">
        <SectionCard
          eyebrow="Legal"
          title="Términos y condiciones"
          description="Base operativa para la fase de publicación. Debe revisarse con asesoramiento legal antes de producción."
        >
          <div className="space-y-6 text-sm leading-7 text-stone-700">
            <p>
              El usuario es responsable del contenido que sube a la plataforma,
              incluyendo imágenes, textos y enlaces de wishlist.
            </p>
            <p>
              Las funciones premium dependen del estado de la suscripción y pueden
              estar sujetas a límites de uso razonables para controlar costes operativos.
            </p>
            <p>
              Styliqo puede modificar o retirar funciones beta de recomendación automática
              sin afectar al acceso a los datos principales del armario del usuario.
            </p>
          </div>
        </SectionCard>
      </div>
    </main>
  );
}
