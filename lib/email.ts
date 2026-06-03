import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendBookingEmail(
  email: string,
  passengerName: string,
  flightNumber: string,
  seat: string,
  bookingId: string
) {
  await resend.emails.send({
    from: "onboarding@resend.dev",
    to: email,
    subject: "✈️ Booking Confirmed",

    html: `
      <h1>Booking Confirmed</h1>

      <p>Hello ${passengerName},</p>

      <p>Your flight booking has been confirmed.</p>

      <ul>
        <li>Booking ID: ${bookingId}</li>
        <li>Flight: ${flightNumber}</li>
        <li>Seat: ${seat}</li>
      </ul>

      <p>Have a safe journey!</p>
    `,
  });
}
