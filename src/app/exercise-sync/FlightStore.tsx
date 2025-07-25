'use client';

// Flight status types
export type FlightStatus =
  | 'On Time'
  | 'Delayed'
  | 'Boarding'
  | 'Departed'
  | 'Cancelled';

export interface Flight {
  id: string;
  flightNumber: string;
  airline: string;
  origin: string;
  destination: string;
  scheduledDeparture: string;
  actualDeparture?: string;
  status: FlightStatus;
  gate?: string;
  delay?: number; // in minutes
  passengers: number;
  aircraft: string;
}

// External store for flight data
export class FlightStore {
  private flights: Flight[] = [
    {
      id: '1',
      flightNumber: 'AA101',
      airline: 'American Airlines',
      origin: 'JFK',
      destination: 'LAX',
      scheduledDeparture: '08:30',
      status: 'On Time',
      gate: 'A12',
      passengers: 180,
      aircraft: 'Boeing 737',
    },
    {
      id: '2',
      flightNumber: 'UA205',
      airline: 'United Airlines',
      origin: 'ORD',
      destination: 'SFO',
      scheduledDeparture: '09:15',
      status: 'Delayed',
      gate: 'B7',
      delay: 25,
      passengers: 156,
      aircraft: 'Airbus A320',
    },
    {
      id: '3',
      flightNumber: 'DL430',
      airline: 'Delta Air Lines',
      origin: 'ATL',
      destination: 'MIA',
      scheduledDeparture: '10:00',
      status: 'Boarding',
      gate: 'C15',
      passengers: 142,
      aircraft: 'Boeing 757',
    },
    {
      id: '4',
      flightNumber: 'SW789',
      airline: 'Southwest Airlines',
      origin: 'DEN',
      destination: 'PHX',
      scheduledDeparture: '11:20',
      status: 'On Time',
      gate: 'D3',
      passengers: 137,
      aircraft: 'Boeing 737',
    },
    {
      id: '5',
      flightNumber: 'JB567',
      airline: 'JetBlue Airways',
      origin: 'BOS',
      destination: 'SEA',
      scheduledDeparture: '12:45',
      status: 'Delayed',
      gate: 'E22',
      delay: 15,
      passengers: 162,
      aircraft: 'Airbus A321',
    },
    {
      id: '6',
      flightNumber: 'AS123',
      airline: 'Alaska Airlines',
      origin: 'SEA',
      destination: 'ANC',
      scheduledDeparture: '13:30',
      status: 'On Time',
      gate: 'F18',
      passengers: 124,
      aircraft: 'Boeing 737',
    },
    {
      id: '7',
      flightNumber: 'NK456',
      airline: 'Spirit Airlines',
      origin: 'FLL',
      destination: 'LAS',
      scheduledDeparture: '14:15',
      status: 'Cancelled',
      passengers: 178,
      aircraft: 'Airbus A320',
    },
    {
      id: '8',
      flightNumber: 'F9789',
      airline: 'Frontier Airlines',
      origin: 'DEN',
      destination: 'MCO',
      scheduledDeparture: '15:00',
      status: 'Boarding',
      gate: 'G9',
      passengers: 186,
      aircraft: 'Airbus A321',
    },
    {
      id: '9',
      flightNumber: 'AA256',
      airline: 'American Airlines',
      origin: 'DFW',
      destination: 'JFK',
      scheduledDeparture: '16:30',
      status: 'Departed',
      gate: 'A5',
      actualDeparture: '16:35',
      delay: 5,
      passengers: 165,
      aircraft: 'Boeing 777',
    },
    {
      id: '10',
      flightNumber: 'UA890',
      airline: 'United Airlines',
      origin: 'SFO',
      destination: 'NRT',
      scheduledDeparture: '17:45',
      status: 'On Time',
      gate: 'H14',
      passengers: 240,
      aircraft: 'Boeing 787',
    },
    {
      id: '11',
      flightNumber: 'DL125',
      airline: 'Delta Air Lines',
      origin: 'LAX',
      destination: 'CDG',
      scheduledDeparture: '18:20',
      status: 'Delayed',
      gate: 'I6',
      delay: 45,
      passengers: 220,
      aircraft: 'Airbus A350',
    },
    {
      id: '12',
      flightNumber: 'HA102',
      airline: 'Hawaiian Airlines',
      origin: 'HNL',
      destination: 'LAX',
      scheduledDeparture: '19:10',
      status: 'On Time',
      gate: 'J2',
      passengers: 195,
      aircraft: 'Airbus A330',
    },
  ];

  private listeners = new Set<() => void>();

  // Subscribe to store updates
  subscribe = (callback: () => void) => {
    this.listeners.add(callback);
    return () => {
      this.listeners.delete(callback);
    };
  };

  // Get current snapshot of the data
  getSnapshot = () => {
    return this.flights;
  };

  // Notify all listeners of changes
  private notify = () => {
    this.listeners.forEach((callback) => callback());
  };

  // Simulate real-time updates
  private simulateUpdates = () => {
    setInterval(() => {
      // Randomly update a flight
      const randomIndex = Math.floor(Math.random() * this.flights.length);
      const flight = this.flights[randomIndex];

      // More aggressive random update scenarios
      const scenarios = [
        () => {
          // Add/change delay (more frequent)
          if (flight.status === 'On Time' || flight.status === 'Delayed') {
            flight.status = 'Delayed';
            flight.delay = Math.floor(Math.random() * 60) + 5;
          }
        },
        () => {
          // Change gate (more frequent)
          if (flight.gate) {
            const gates = [
              'A1',
              'A2',
              'B5',
              'B8',
              'C10',
              'C12',
              'D1',
              'D4',
              'E7',
              'F3',
              'G2',
              'H6',
              'I8',
              'J4',
            ];
            const newGate = gates[Math.floor(Math.random() * gates.length)];
            if (newGate !== flight.gate) {
              flight.gate = newGate;
            }
          }
        },
        () => {
          // Status progression (more likely)
          if (flight.status === 'On Time' && Math.random() > 0.6) {
            flight.status = 'Boarding';
          } else if (flight.status === 'Boarding' && Math.random() > 0.5) {
            flight.status = 'Departed';
            flight.actualDeparture = new Date().toLocaleTimeString('en-US', {
              hour12: false,
              hour: '2-digit',
              minute: '2-digit',
            });
          } else if (flight.status === 'Delayed' && Math.random() > 0.7) {
            flight.status = 'Boarding';
          }
        },
        () => {
          // Remove delay occasionally
          if (flight.status === 'Delayed' && Math.random() > 0.8) {
            flight.status = 'On Time';
            flight.delay = undefined;
          }
        },
        () => {
          // Random status changes
          if (Math.random() > 0.85) {
            const statuses: FlightStatus[] = ['On Time', 'Delayed', 'Boarding'];
            const currentIndex = statuses.indexOf(flight.status);
            if (currentIndex !== -1) {
              const newStatuses = statuses.filter((s) => s !== flight.status);
              flight.status =
                newStatuses[Math.floor(Math.random() * newStatuses.length)];
              if (flight.status === 'Delayed' && !flight.delay) {
                flight.delay = Math.floor(Math.random() * 45) + 10;
              } else if (flight.status === 'On Time') {
                flight.delay = undefined;
              }
            }
          }
        },
      ];

      // Execute random scenario (sometimes multiple)
      const scenario = scenarios[Math.floor(Math.random() * scenarios.length)];
      scenario();

      // 30% chance to execute a second scenario for more dynamic updates
      if (Math.random() > 0.7) {
        const secondScenario =
          scenarios[Math.floor(Math.random() * scenarios.length)];
        secondScenario();
      }

      this.flights = JSON.parse(JSON.stringify(this.flights));

      this.notify();
    }, 1000); // Update every second
  };

  constructor() {
    this.simulateUpdates();
  }

  // Manual update methods for demo
  updateFlightStatus = (flightId: string, status: FlightStatus) => {
    const flight = this.flights.find((f) => f.id === flightId);
    if (flight) {
      flight.status = status;
      if (status === 'On Time') {
        flight.delay = undefined;
      }
      this.notify();
    }
  };

  addDelay = (flightId: string, minutes: number) => {
    const flight = this.flights.find((f) => f.id === flightId);
    if (flight) {
      flight.status = 'Delayed';
      flight.delay = (flight.delay || 0) + minutes;
      this.notify();
    }
  };
}
