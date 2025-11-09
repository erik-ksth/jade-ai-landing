import { NextResponse } from "next/server";

import { supabaseAdmin } from "@/lib/supabaseAdmin";

type WaitlistPayload = {
  email?: string;
  source?: string;
};

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: Request) {
  try {
    const payload = (await req.json()) as WaitlistPayload;
    const rawEmail = payload.email?.trim().toLowerCase();
    const source = payload.source?.slice(0, 120) ?? null;

    if (!rawEmail) {
      return NextResponse.json(
        { error: "Email is required." },
        { status: 400 }
      );
    }

    if (!emailRegex.test(rawEmail)) {
      return NextResponse.json(
        { error: "Please provide a valid email address." },
        { status: 400 }
      );
    }

    const ipAddress =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? null;
    const userAgent = req.headers.get("user-agent") ?? null;

    const { error } = await supabaseAdmin.from("waitlist_signups").insert({
      email: rawEmail,
      source,
      ip_address: ipAddress,
      user_agent: userAgent,
    });

    if (error) {
      if (error.code === "23505") {
        return NextResponse.json(
          {
            message: "You're already on the waitlist. We'll be in touch soon!",
          },
          { status: 200 }
        );
      }

      console.error("Failed to insert waitlist signup", error);
      return NextResponse.json(
        { error: "We couldn't add you to the waitlist. Please try again." },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: "You're on the waitlist! We'll reach out with updates soon." },
      { status: 201 }
    );
  } catch (error) {
    console.error("Unexpected waitlist error", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again later." },
      { status: 500 }
    );
  }
}
