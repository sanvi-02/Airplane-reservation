import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const { name, email, password } = body;

    if (!name || !email || !password) {
      return NextResponse.json(
        {
          success: false,
          message: "All fields are required",
        },
        { status: 400 }
      );
    }

    const response = NextResponse.json(
      {
        success: true,
        message: "Account created successfully",
        user: {
          name,
          email,
        },
      },
      { status: 201 }
    );

    // Set isLoggedIn cookie
    response.cookies.set("isLoggedIn", "true", { path: "/" });
    // Save registered user details in a cookie
    response.cookies.set(
      "registered_user",
      JSON.stringify({ email, password }),
      { path: "/", maxAge: 60 * 60 * 24 * 7 }
    );

    return response;
  } catch (error) {
    console.error("SIGNUP ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
      },
      { status: 500 }
    );
  }
}
