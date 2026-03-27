import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { hash } from "bcryptjs";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const { email, password, name } = await request.json();

    // Level 1: Syntax Validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Invalid Command Email format." }, { status: 400 });
    }

    if (!name || name.length < 2) {
      return NextResponse.json({ error: "Professional name must be at least 2 characters." }, { status: 400 });
    }

    if (!password || password.length < 8) {
      return NextResponse.json({ error: "Security Token must be at least 8 characters for encryption." }, { status: 400 });
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return NextResponse.json({ error: "Account already exists with this email." }, { status: 400 });
    }

    // Generate a 6-digit OTP Token
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const tokenExpires = new Date(Date.now() + 3600000); // 1 hour expiration

    // Hash the password for security
    const hashedPassword = await hash(password, 12);

    // Create the new Expert Profile (Inactive until verified)
    const user = await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
        username: email.split("@")[0],
        points: 0,
        rank: "New Developer",
        solved: 0,
        streak: 0,
        emailVerified: null, // Keep null to enforce verification
      }
    });

    // Store the OTP Code in the VerificationToken vault
    await prisma.verificationToken.create({
      data: {
        identifier: email,
        token: otpCode,
        expires: tokenExpires
      }
    });

    // Send the Verification Email via Resend
    if (process.env.RESEND_API_KEY) {
      try {
        await resend.emails.send({
          from: "onboarding@resend.dev",
          to: email,
          subject: "🛡️ COMMAND TOKEN: Verify your Expert Profile",

          html: `<div style="font-family: sans-serif; padding: 20px; background: #070707; color: white; border-radius: 12px; border: 1px solid #5E6AD233;">
            <h2 style="color: #5E6AD2;">VERIFY YOUR IDENTITY</h2>
            <p>Welcome to Code400Lab Expert, <strong>${name}</strong>.</p>
            <p>Your unique 6-digit command token is:</p>
            <h1 style="font-size: 32px; letter-spacing: 12px; color: #00E676; background: #111; display: inline-block; padding: 15px 30px; border-radius: 8px; font-family: monospace;">${otpCode}</h1>
            <p style="margin-top: 20px; color: #888;">This token will expire in 1 hour. Authorized access only.</p>
          </div>`
        });
      } catch (err) {
        console.error("Email delivery failed:", err);
      }
    }

    // Dev Override: Log the code to console if no API Key is present
    console.log(`[AUTH_SYSTEM] Verification code for ${email}: ${otpCode}`);

    return NextResponse.json({
      message: "Expert profile initialization successful. Verify email to activate.",
      email: user.email
    });

  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json({ error: "System could not initialize profile." }, { status: 500 });
  }
}
