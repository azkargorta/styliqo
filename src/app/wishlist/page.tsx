import Link from "next/link";
import { AppShell } from "@/components/app-shell";
import { SectionCard } from "@/components/section-card";
import { wishlistItems } from "@/lib/mock-data";

export default function WishlistPage() {
  return (
    <AppShell
      title="Lista de deseos"
      description="Lista de compra futura para detectar gaps del armario y convertir deseos en prendas reales cuando tenga sentido."
    >
      <div className="grid gap-6">
        <SectionCard
          eyebrow="Priorización"
          title="Prendas deseadas"
          description="Este módulo ya deja preparada la estructura para guardar enlaces, alertas de precio y conversión posterior a prenda real."
        >
          <div className="grid gap-4 md:grid-cols-2">
            {wishlistItems.map((item) => (
              <article key={item.id} className="rounded-3xl border border-stone-200 bg-white p-5">
                <div className="flex items-center justify-between gap-4">
                  <h2 className="text-lg font-semibold text-stone-900">{item.name}</h2>
                  <span className="rounded-full bg-stone-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-stone-600">
                    {item.priority}
                  </span>
                </div>
                <p className="mt-3 text-sm text-stone-600">
                  {item.store} · precio objetivo {item.targetPrice} EUR
                </p>
                <Link
                  href={item.url}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-4 inline-flex rounded-full bg-stone-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-stone-700"
                >
                  Abrir tienda
                </Link>
              </article>
            ))}
          </div>
        </SectionCard>
      </div>
    </AppShell>
  );
}
