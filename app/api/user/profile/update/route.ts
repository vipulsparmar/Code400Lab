import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/db";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "UNAUTHORIZED_IDENTITY_BREACH" }, { status: 401 });
    }

    const { image } = await request.json();

    if (!image) {
      return NextResponse.json({ error: "Missing Image Data" }, { status: 400 });
    }

    if (image.length > 204800) { // 200KB limit
      return NextResponse.json({ error: "Payload Too Large: Identity media must be under 200KB." }, { status: 400 });
    }

    const updatedUser = await prisma.user.update({
      where: { email: session.user.email },
      data: { image }
    });

    return NextResponse.json({ success: true, user: updatedUser });

  } catch (error) {
    console.error("Profile update error:", error);
    return NextResponse.json({ error: "Identity Update Failed" }, { status: 500 });
  }
}
