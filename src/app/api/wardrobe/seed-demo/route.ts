import { NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase/server";

const demoGarments = [
  {
    name: "Camisa Oxford blanca",
    category: "tops",
    color: "Blanco",
    brand: "COS",
    notes: "Fondo de armario para oficina y looks smart casual.",
    seasons: ["spring", "autumn"],
    occasions: ["office", "daily"],
    is_favorite: true,
  },
  {
    name: "Camiseta basica negra",
    category: "tops",
    color: "Negro",
    brand: "Uniqlo",
    notes: "Muy combinable para diario y viaje.",
    seasons: ["spring", "summer", "autumn"],
    occasions: ["daily", "travel"],
    is_favorite: false,
  },
  {
    name: "Jersey de punto gris",
    category: "tops",
    color: "Gris",
    brand: "Arket",
    notes: "Capa intermedia para clima fresco.",
    seasons: ["autumn", "winter"],
    occasions: ["daily", "office", "travel"],
    is_favorite: false,
  },
  {
    name: "Vaquero recto azul",
    category: "bottoms",
    color: "Azul",
    brand: "Levi's",
    notes: "Base casual versatil.",
    seasons: ["spring", "autumn", "winter"],
    occasions: ["daily", "travel"],
    is_favorite: true,
  },
  {
    name: "Pantalon sastre negro",
    category: "bottoms",
    color: "Negro",
    brand: "Massimo Dutti",
    notes: "Ideal para oficina y eventos.",
    seasons: ["autumn", "winter", "spring"],
    occasions: ["office", "event"],
    is_favorite: true,
  },
  {
    name: "Chino beige",
    category: "bottoms",
    color: "Beige",
    brand: "Mango",
    notes: "Alternativa ligera al vaquero.",
    seasons: ["spring", "summer", "autumn"],
    occasions: ["daily", "office", "travel"],
    is_favorite: false,
  },
  {
    name: "Blazer beige estructurado",
    category: "outerwear",
    color: "Beige",
    brand: "Massimo Dutti",
    notes: "Eleva cualquier look de oficina.",
    seasons: ["spring", "autumn"],
    occasions: ["office", "event"],
    is_favorite: true,
  },
  {
    name: "Gabardina camel",
    category: "outerwear",
    color: "Camel",
    brand: "Zara",
    notes: "Abrigo ligero para entretiempo.",
    seasons: ["spring", "autumn"],
    occasions: ["daily", "office", "travel"],
    is_favorite: false,
  },
  {
    name: "Chaqueta denim azul",
    category: "outerwear",
    color: "Azul",
    brand: "Pull&Bear",
    notes: "Perfecta para looks casuales.",
    seasons: ["spring", "summer", "autumn"],
    occasions: ["daily", "travel"],
    is_favorite: false,
  },
  {
    name: "Zapatillas minimal blancas",
    category: "footwear",
    color: "Blanco",
    brand: "Common Projects",
    notes: "Muy faciles de combinar.",
    seasons: ["spring", "summer", "autumn"],
    occasions: ["daily", "travel"],
    is_favorite: true,
  },
  {
    name: "Botines negros piel",
    category: "footwear",
    color: "Negro",
    brand: "Camper",
    notes: "Para dias frescos y looks mas pulidos.",
    seasons: ["autumn", "winter"],
    occasions: ["office", "event"],
    is_favorite: false,
  },
  {
    name: "Mochila negra urbana",
    category: "accessories",
    color: "Negro",
    brand: "Rains",
    notes: "Util para trabajo y viaje.",
    seasons: ["spring", "summer", "autumn", "winter"],
    occasions: ["daily", "office", "travel"],
    is_favorite: false,
  },
];

export async function POST() {
  const supabase = getSupabaseServerClient();

  if (!supabase) {
    return NextResponse.json({ error: "Supabase no está configurado." }, { status: 500 });
  }

  const { data: userData, error: userErr } = await supabase.auth.getUser();

  if (userErr || !userData.user) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }

  const userId = userData.user.id;

  const { count, error: existingError } = await supabase
    .from("garments")
    .select("id", { count: "exact", head: true })
    .eq("user_id", userId);

  if (existingError) {
    return NextResponse.json({ error: existingError.message }, { status: 500 });
  }

  if ((count ?? 0) > 0) {
    return NextResponse.json(
      {
        error:
          "Ya tienes prendas en tu armario. Si quieres, primero vaciamos o añadimos un seed más pequeño.",
      },
      { status: 400 },
    );
  }

  const rows = demoGarments.map((garment) => ({
    user_id: userId,
    ...garment,
  }));

  const { error } = await supabase.from("garments").insert(rows);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({
    ok: true,
    inserted: rows.length,
  });
}

