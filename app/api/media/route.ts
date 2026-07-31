import { NextResponse } from "next/server";

// Both come from the environment (.env.local locally, k8s secrets in prod).
const GATEWAY_URL = process.env.GATEWAY_URL ?? "";
const FRONTEND_GATEWAY_KEY = process.env.FRONTEND_GATEWAY_KEY ?? "";

// GET /api/media?category=event_photo
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category") || "event_photo";

    const res = await fetch(`${GATEWAY_URL}/api/media/category/${category}`, {
      headers: {
        "x-gateway-key": FRONTEND_GATEWAY_KEY,
      },
      cache: "no-store",
    });

    const json = await res.json();
    return NextResponse.json(json);
  } catch (error) {
    console.error("Error fetching media from gateway:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch media" }, { status: 500 });
  }
}

// POST /api/media (Upload file)
export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    const res = await fetch(`${GATEWAY_URL}/api/media/upload`, {
      method: "POST",
      headers: {
        "x-gateway-key": FRONTEND_GATEWAY_KEY,
      },
      body: formData,
    });

    const json = await res.json();
    return NextResponse.json(json);
  } catch (error) {
    console.error("Error uploading media to gateway:", error);
    return NextResponse.json({ success: false, error: "Failed to upload media" }, { status: 500 });
  }
}

// DELETE /api/media?id=...
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ success: false, error: "Missing media ID" }, { status: 400 });
    }

    const res = await fetch(`${GATEWAY_URL}/api/media/${id}`, {
      method: "DELETE",
      headers: {
        "x-gateway-key": FRONTEND_GATEWAY_KEY,
      },
    });

    const json = await res.json();
    return NextResponse.json(json);
  } catch (error) {
    console.error("Error deleting media via gateway:", error);
    return NextResponse.json({ success: false, error: "Failed to delete media" }, { status: 500 });
  }
}
