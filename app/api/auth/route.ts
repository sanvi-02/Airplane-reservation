import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    success: true,
    message: "Auth API is working",
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const { email, password } = body;

    // Demo validation
    if (!email || !password) {
      return NextResponse.json(
        {
          success: false,
          message: "Email and password are required",
        },
        { status: 400 }
      );
    }

    // Check registered_user cookie
    const registeredUserStr = req.cookies.get("registered_user")?.value;
    let registeredUser = null;
    if (registeredUserStr) {
      try {
        registeredUser = JSON.parse(registeredUserStr);
      } catch (e) {
        console.error("Error parsing registered_user cookie", e);
      }
    }

    const isMatch = (email === "admin@example.com" && password === "password123") || 
      (registeredUser && email === registeredUser.email && password === registeredUser.password);

    if (isMatch) {
      const response = NextResponse.json({
        success: true,
        message: "Login successful",
        user: {
          email,
        },
      });
      // Set isLoggedIn cookie
      response.cookies.set("isLoggedIn", "true", { path: "/" });
      return response;
    }

    return NextResponse.json(
      {
        success: false,
        message: "Invalid credentials",
      },
      { status: 401 }
    );
  } catch (error) {
    console.error("AUTH ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
      },
      { status: 500 }
    );
  }
}
