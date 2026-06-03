#  SkyBook – Airline Reservation System

SkyBook is a full-stack airline reservation platform built with Next.js, TypeScript, Prisma, and PostgreSQL. Users can search flights, select seats, make bookings, manage reservations, and receive booking confirmation emails.

## Features

*  Search flights by route and date
*  Real-time seat selection
*  Flight booking management
*  User authentication (Login / Signup)
*  Email confirmation after successful booking
*  Booking reference code generation
*  Booking cancellation support
*  Payment gateway integration (Razorpay)
*  PostgreSQL database with Prisma ORM
*  Show Your Bookings

## Tech Stack

### Frontend

* Next.js 15
* React
* TypeScript
* Tailwind CSS

### Backend

* Next.js API Routes
* Prisma ORM
* PostgreSQL / NeonDB

### Additional Services

* Resend (Email Service)
* Razorpay (Payments)
* Vercel (Deployment)

## Project Structure

app/
├── api/
│ ├── bookings/
│ ├── flights/
│ ├── signup/
│ ├── auth/
│ └── payments/
├── (routes)/
│ ├── signup/
│ ├── login/
│ ├── search/
│ ├── seats/
│ ├── book/
│ └── confirm/
├── components/
├── lib/
└── prisma/

## Environment Variables

Create a `.env` file:

DATABASE_URL=your_database_url

RESEND_API_KEY=your_resend_api_key

RAZORPAY_KEY_ID=your_key_id

RAZORPAY_KEY_SECRET=your_key_secret

## Installation

Clone the repository:

```bash
git clone https://github.com/sanvi-02/Airplane-reservation.git
cd Airplane-reservation
```

Install dependencies:

```bash
npm install
```

Generate Prisma Client:

```bash
npx prisma generate
```

Run migrations:

```bash
npx prisma db push
```

Start development server:

```bash
npm run dev
```

## Future Improvements

* Boarding pass PDF generation
* Flight status tracking
* Admin dashboard
* Multi-city booking support
* OTP verification
* Loyalty rewards system

## Author

* Mannat Gupta & Sanvi Jain
* Built as a full-stack airline reservation system project using modern web technologies.
