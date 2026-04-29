import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);

  return NextResponse.json({
    received: true,
    body,
    message:
      "Endpoint placeholder para conectar una herramienta de analítica de producto cuando se elija proveedor.",
  });
}
