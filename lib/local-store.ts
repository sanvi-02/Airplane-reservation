import { promises as fs } from "node:fs";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { nanoid } from "nanoid";

type StoredBooking = {
  id: string;
  referenceCode: string;
  passengerName: string;
  passengerEmail: string;
  seatId: string;
  createdAt: string;
};

type StoreState = {
  bookings: StoredBooking[];
  bookedSeats: Record<string, true>;
};

const CITIES = [
  "Delhi",
  "Mumbai",
  "Bangalore",
  "Chennai",
  "Kolkata",
  "Hyderabad",
  "Pune",
  "Ahmedabad",
  "Jaipur",
  "Goa",
];

const CITY_BY_SLUG = Object.fromEntries(CITIES.map((city) => [slug(city), city]));
const STORE_PATH = path.join(process.cwd(), "data", "local-store.json");

function slug(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-");
}

function hash(value: string) {
  let total = 0;
  for (let i = 0; i < value.length; i += 1) {
    total = (total * 31 + value.charCodeAt(i)) >>> 0;
  }
  return total;
}

async function readStore(): Promise<StoreState> {
  try {
    return JSON.parse(await fs.readFile(STORE_PATH, "utf8")) as StoreState;
  } catch {
    return { bookings: [], bookedSeats: {} };
  }
}

async function writeStore(state: StoreState) {
  await fs.mkdir(path.dirname(STORE_PATH), { recursive: true });
  await fs.writeFile(STORE_PATH, JSON.stringify(state, null, 2));
}

function flightId(origin: string, destination: string, date: string, index: number) {
  return `demo_${slug(origin)}_${slug(destination)}_${date}_${index}`;
}

function parseFlightId(id: string) {
  const match = /^demo_([^_]+)_([^_]+)_(\d{4}-\d{2}-\d{2})_(\d+)$/.exec(id);
  if (!match) return null;

  const origin = CITY_BY_SLUG[match[1]];
  const destination = CITY_BY_SLUG[match[2]];
  const index = Number(match[4]);

  if (!origin || !destination || !Number.isInteger(index)) return null;
  return { origin, destination, date: match[3], index };
}

function makeFlight(origin: string, destination: string, date: string, index: number) {
  const departures = [
    { hour: 6, minute: 15, durationMinutes: 135 },
    { hour: 13, minute: 40, durationMinutes: 150 },
    { hour: 19, minute: 5, durationMinutes: 140 },
  ];
  const plan = departures[index - 1] ?? departures[0];
  const departureTime = new Date(`${date}T${String(plan.hour).padStart(2, "0")}:${String(plan.minute).padStart(2, "0")}:00+05:30`);
  const arrivalTime = new Date(departureTime.getTime() + plan.durationMinutes * 60_000);
  const basePrice = 3200 + (hash(`${origin}-${destination}`) % 1800);

  return {
    id: flightId(origin, destination, date, index),
    flightNumber: `SB${100 + (hash(`${origin}-${destination}-${index}`) % 800)}`,
    origin,
    destination,
    departureTime,
    arrivalTime,
    price: basePrice + index * 450,
    createdAt: new Date(`${date}T00:00:00+05:30`),
  };
}

function formatTime(date: Date) {
  return date.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

function duration(departure: Date, arrival: Date) {
  const diff = arrival.getTime() - departure.getTime();
  const hours = Math.floor(diff / 3_600_000);
  const minutes = Math.floor((diff % 3_600_000) / 60_000);
  return `${hours}h ${minutes}m`;
}

function seatNumbers() {
  const cols = ["A", "B", "C", "D", "E", "F"];
  return Array.from({ length: 30 }, (_, index) => {
    return `${Math.floor(index / 6) + 1}${cols[index % 6]}`;
  });
}

function seatId(flightIdValue: string, seatNumber: string) {
  return `${flightIdValue}_${seatNumber}`;
}

function parseSeatId(id: string) {
  const match = /^(demo_[^_]+_[^_]+_\d{4}-\d{2}-\d{2}_\d+)_(\d+[A-F])$/.exec(id);
  if (!match) return null;
  return { flightId: match[1], seatNumber: match[2] };
}

function baseBooked(id: string, seatNumber: string) {
  return hash(`${id}-${seatNumber}`) % 9 === 0;
}

async function localFlightFromId(id: string) {
  const parsed = parseFlightId(id);
  if (!parsed) return null;
  return makeFlight(parsed.origin, parsed.destination, parsed.date, parsed.index);
}

export async function searchLocalFlights(origin: string, destination: string, date: string) {
  const state = await readStore();

  return [1, 2, 3].map((index) => {
    const flight = makeFlight(origin, destination, date, index);
    const seats = seatNumbers().filter((number) => {
      const id = seatId(flight.id, number);
      return !baseBooked(flight.id, number) && !state.bookedSeats[id];
    });

    return {
      id: flight.id,
      flightNumber: flight.flightNumber,
      origin: flight.origin,
      destination: flight.destination,
      departureTime: formatTime(flight.departureTime),
      arrivalTime: formatTime(flight.arrivalTime),
      price: flight.price,
      availableSeats: seats.length,
      duration: duration(flight.departureTime, flight.arrivalTime),
    };
  });
}

export async function getLocalSeats(flightIdValue: string) {
  const flight = await localFlightFromId(flightIdValue);
  if (!flight) return null;

  const state = await readStore();
  const seats = seatNumbers().map((number) => {
    const id = seatId(flightIdValue, number);
    return {
      id,
      seatNumber: number,
      isBooked: baseBooked(flightIdValue, number) || Boolean(state.bookedSeats[id]),
      flightId: flightIdValue,
    };
  });

  return { flight, seats };
}

export async function getLocalSeat(seatIdValue: string) {
  const parsed = parseSeatId(seatIdValue);
  if (!parsed) return null;

  const result = await getLocalSeats(parsed.flightId);
  if (!result) return null;

  const seat = result.seats.find((item) => item.id === seatIdValue);
  if (!seat) return null;

  return { ...seat, flight: result.flight };
}

export async function createLocalBooking({
  seatId: seatIdValue,
  passengerName,
  passengerEmail,
}: {
  seatId: string;
  passengerName: string;
  passengerEmail: string;
}) {
  const seat = await getLocalSeat(seatIdValue);
  if (!seat) return { status: 404, body: { error: "Seat not found" } };
  if (seat.isBooked) return { status: 409, body: { error: "Seat already booked" } };

  const state = await readStore();
  const booking: StoredBooking = {
    id: randomUUID(),
    referenceCode: nanoid(8).toUpperCase(),
    passengerName,
    passengerEmail,
    seatId: seatIdValue,
    createdAt: new Date().toISOString(),
  };

  state.bookings.push(booking);
  state.bookedSeats[seatIdValue] = true;
  await writeStore(state);

  return { status: 201, body: await expandBooking(booking) };
}

async function expandBooking(booking: StoredBooking) {
  const seat = await getLocalSeat(booking.seatId);
  return {
    ...booking,
    seat,
  };
}

export async function lookupLocalBooking(referenceCode: string) {
  const state = await readStore();
  const booking = state.bookings.find(
    (item) => item.referenceCode.toUpperCase() === referenceCode.toUpperCase()
  );
  return booking ? expandBooking(booking) : null;
}

export async function cancelLocalBooking(id: string) {
  const state = await readStore();
  const booking = state.bookings.find((item) => item.id === id);
  if (!booking) return false;

  state.bookings = state.bookings.filter((item) => item.id !== id);
  delete state.bookedSeats[booking.seatId];
  await writeStore(state);
  return true;
}
