import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function POST(request: Request) {
  try {
    const { email, token } = await request.json();

    if (!email || !token) {
      return NextResponse.json({ error: "Missing required identification." }, { status: 400 });
    }

    // Attempt to locate the Command Token in the vault
    const verificationToken = await prisma.verificationToken.findFirst({
      where: {
        identifier: email,
        token: token,
        expires: { gt: new Date() } // Ensure token is not expired
      }
    });

    if (!verificationToken) {
      return NextResponse.json({ error: "Invalid or expired Command Token." }, { status: 400 });
    }

    // Token is valid! Activate the Expert Profile
    await prisma.user.update({
      where: { email },
      data: {
        emailVerified: new Date()
      }
    });

    // Clean up used token
    await prisma.verificationToken.delete({
      where: {
        identifier_token: {
          identifier: email,
          token: token
        }
      }
    });

    return NextResponse.json({
      message: "Expert profile activated successfully. Authorization complete.",
      status: "Verified"
    });

  } catch (error) {
    console.error("Verification error:", error);
    return NextResponse.json({ error: "System could not authorize token." }, { status: 500 });
  }
}
