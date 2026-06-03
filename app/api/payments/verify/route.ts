import crypto from "node:crypto";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      await req.json();

    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return NextResponse.json({ verified: false }, { status: 400 });
    }

    return NextResponse.json({
      verified: true,
      paymentId: razorpay_payment_id,
    });
  } catch (err) {
    console.error("Verification failed:", err);
    return NextResponse.json({ verified: false }, { status: 500 });
  }
}
