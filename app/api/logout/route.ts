import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const response = NextResponse.json({
    success: true,
    message: "Logged out successfully",
  });

  // Clear the isLoggedIn cookie by setting maxAge to 0
  response.cookies.set("isLoggedIn", "false", { path: "/", maxAge: 0 });

  return response;
}
