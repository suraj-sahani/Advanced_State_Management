export interface FlightResult {
  destination: string;
  airline: string;
  price: number;
}

export interface HotelResult {
  destination: string;
  name: string;
  price: number;
}

export async function searchFlights(
  destination: string,
  startDate: string,
  endDate: string,
  signal: AbortSignal
): Promise<FlightResult> {
  return new Promise((resolve, reject) => {
    if (signal.aborted) {
      reject(new Error('Search aborted'));
    }
    setTimeout(() => {
      resolve({ destination, airline: 'Sky Airways', price: 299 });
    }, 3000);
  });
}

export async function searchHotels(
  destination: string,
  startDate: string,
  endDate: string,
  signal: AbortSignal
): Promise<HotelResult> {
  return new Promise((resolve, reject) => {
    if (signal.aborted) {
      reject(new Error('Search aborted'));
    }
    setTimeout(() => {
      resolve({ destination, name: `Hotel ${destination}`, price: 100 });
    }, 3000);
  });
}
