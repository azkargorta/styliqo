import { NextResponse } from "next/server";
import { z } from "zod";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { getSupabaseServiceRoleClient } from "@/lib/supabase/admin";

const categories = ["tops", "bottoms", "outerwear", "footwear", "accessories"] as const;
const seasons = ["spring", "summer", "autumn", "winter"] as const;
const occasions = ["daily", "office", "event", "travel", "sport"] as const;

const seasonsSchema = z
  .array(z.enum(seasons))
  .min(1, "Selecciona al menos una temporada.");

const occasionsSchema = z
  .array(z.enum(occasions))
  .min(1, "Selecciona al menos una ocasión.");

const bodySchema = z.object({
  name: z.string().min(2),
  category: z.enum(categories),
  color: z.string().min(1),
  brand: z.string().optional(),
  notes: z.string().optional(),
  seasons: seasonsSchema,
  occasions: occasionsSchema,
  isFavorite: z.boolean().optional(),
});

function safeString(value: FormDataEntryValue | null) {
  return typeof value === "string" ? value : null;
}

export async function POST(request: Request) {
  const supabase = getSupabaseServerClient();

  if (!supabase) {
    return NextResponse.json(
      { error: "Supabase no está configurado." },
      { status: 500 },
    );
  }

  const { data: userData, error: userErr } = await supabase.auth.getUser();

  if (userErr || !userData.user) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }

  const contentType = request.headers.get("content-type") ?? "";

  // Parsea tanto JSON como multipart/form-data.
  let body: z.infer<typeof bodySchema>;
  let photo: File | null = null;

  if (contentType.includes("multipart/form-data")) {
    const form = await request.formData();
    const seasonsValues = form.getAll("seasons").filter((v) => typeof v === "string") as string[];
    const occasionsValues = form.getAll("occasions").filter((v) => typeof v === "string") as string[];

    body = bodySchema.parse({
      name: safeString(form.get("name")) ?? "",
      category: safeString(form.get("category")) ?? "",
      color: safeString(form.get("color")) ?? "",
      brand: safeString(form.get("brand")) ?? undefined,
      notes: safeString(form.get("notes")) ?? undefined,
      seasons: seasonsValues,
      occasions: occasionsValues,
      isFavorite: safeString(form.get("isFavorite")) === "true",
    });

    const maybeFile = form.get("photo");
    photo = maybeFile instanceof File ? maybeFile : null;
  } else {
    body = bodySchema.parse(await request.json());
  }

  const { data, error } = await supabase.from("garments").insert({
    user_id: userData.user.id,
    name: body.name,
    category: body.category,
    color: body.color,
    brand: body.brand ?? null,
    notes: body.notes ?? null,
    seasons: body.seasons,
    occasions: body.occasions,
    is_favorite: body.isFavorite ?? false,
  }).select("*").single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  // Si hay foto, la subimos y guardamos garment_images.
  if (photo && data?.id) {
    const admin = getSupabaseServiceRoleClient();
    if (!admin) {
      return NextResponse.json(
        { error: "Falta SUPABASE_SERVICE_ROLE_KEY para subir imágenes." },
        { status: 500 },
      );
    }

    const ext = (photo.name.split(".").pop() || "jpg").toLowerCase();
    const safeExt = ["jpg", "jpeg", "png", "webp"].includes(ext) ? ext : "jpg";
    const path = `${userData.user.id}/${data.id}/${crypto.randomUUID()}.${safeExt}`;

    const arrayBuffer = await photo.arrayBuffer();
    const uploadRes = await admin.storage
      .from("garments")
      .upload(path, new Uint8Array(arrayBuffer), {
        contentType: photo.type || "image/jpeg",
        upsert: true,
      });

    if (uploadRes.error) {
      return NextResponse.json({ error: uploadRes.error.message }, { status: 400 });
    }

    const { error: imgErr } = await admin.from("garment_images").insert({
      garment_id: data.id,
      storage_path: path,
      alt_text: body.name,
    });

    if (imgErr) {
      return NextResponse.json({ error: imgErr.message }, { status: 400 });
    }
  }

  return NextResponse.json({ ok: true, data });
}

