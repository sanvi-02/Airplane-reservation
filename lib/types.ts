export interface Flight {
  id: string;
  flightNumber: string;
  origin: string;
  destination: string;
  departureTime: string;
  arrivalTime: string;
  price: number;
  seats?: Seat[];
  createdAt: string;
}

export interface Seat {
  id: string;
  seatNumber: string;
  isBooked: boolean;
  flightId: string;
  flight?: Flight;
  booking?: Booking;
}

export interface Booking {
  id: string;
  referenceCode: string;
  passengerName: string;
  passengerEmail: string;
  seatId: string;
  seat?: Seat;
  createdAt: string;
}
