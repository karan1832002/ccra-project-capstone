import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db/client";
import { user } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function POST(req: NextRequest) {
    const { email } = await req.json();

    const existing = await db
        .select({ id: user.id })
        .from(user)
        .where(eq(user.email, email.trim().toLowerCase()))
        .limit(1);

    return NextResponse.json({ exists: existing.length > 0 });
}