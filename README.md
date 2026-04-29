## Styliqo

Styliqo es una web app de armario virtual personal construida con `Next.js` y preparada para evolucionar con `Supabase`, `Stripe` y generación de outfits con IA.

## Incluye

La base actual ya incorpora:
- portada comercial,
- dashboard privado,
- módulos de `armario`, `outfits`, `planner` y `wishlist`,
- pantalla `premium`,
- endpoints base para `checkout`, `analytics` e `IA`,
- esquema SQL inicial en `supabase/schema.sql`,
- onboarding y páginas legales.

## Variables de entorno

Copia `.env.example` y completa:

```bash
NEXT_PUBLIC_APP_URL=
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
STRIPE_SECRET_KEY=
STRIPE_PREMIUM_PRICE_ID=
GEMINI_API_KEY=
GEMINI_MODEL=gemini-2.0-flash
```

## Desarrollo

```bash
npm run dev
npm run lint
npm run build
```

La app arranca aunque falten credenciales reales, usando datos de ejemplo y fallbacks para acelerar el desarrollo.

## Base de datos

Ejecuta el contenido de `supabase/schema.sql` en tu proyecto de Supabase para crear:
- perfiles,
- prendas e imágenes,
- outfits y sus items,
- planner,
- wishlist,
- suscripciones,
- generaciones IA,
- límites de uso,
- y políticas RLS por usuario.

## Siguientes integraciones recomendadas

- conectar `Supabase Auth` al login real,
- reemplazar los datos mock por lecturas/escrituras reales,
- activar `Stripe Checkout` y webhooks,
- enchufar un proveedor IA real en `src/lib/ai/recommendations.ts`.
