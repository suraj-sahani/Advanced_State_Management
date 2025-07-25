import { relations, sql } from 'drizzle-orm';
import { text, sqliteTable, integer } from 'drizzle-orm/sqlite-core';

export const itineraries = sqliteTable('itineraries', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description'),
  people: integer('people').notNull(),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text('updated_at').default(sql`CURRENT_TIMESTAMP`),
});

export const destinations = sqliteTable('destinations', {
  id: text('id').primaryKey(),
  itineraryId: text('itinerary_id')
    .notNull()
    .references(() => itineraries.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  location: text('location').notNull(),
  arrivalDate: text('arrival_date').notNull(),
  departureDate: text('departure_date').notNull(),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
  status: text({
    enum: ['draft', 'pending', 'confirmed', 'cancelled'],
  })
    .default('draft')
    .notNull(),
});

export const activities = sqliteTable('activities', {
  id: text('id').primaryKey(),
  itineraryId: text('itinerary_id')
    .notNull()
    .references(() => itineraries.id, { onDelete: 'cascade' }),
  destinationId: text('destination_id').references(() => destinations.id, {
    onDelete: 'cascade',
  }),
  name: text('name').notNull(),
  description: text('description'),
  startTime: text('start_time').notNull(),
  endTime: text('end_time').notNull(),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
});

export const comments = sqliteTable('comments', {
  id: text('id').primaryKey(),
  itineraryId: text('itinerary_id')
    .notNull()
    .references(() => itineraries.id, { onDelete: 'cascade' }),
  content: text('content').notNull(),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
});

export const references = sqliteTable('references', {
  id: text('id').primaryKey(), // This will be the reference_id used in bookings
  type: text({
    enum: ['flight', 'hotel', 'car'],
  }).notNull(),
  data: text('data').notNull(), // JSON string containing the booking details
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text('updated_at').default(sql`CURRENT_TIMESTAMP`),
});

export const flightBookings = sqliteTable('flight_bookings', {
  id: text('id').primaryKey(),
  destinationId: text('destination_id')
    .notNull()
    .references(() => destinations.id, { onDelete: 'cascade' }),
  airline: text('airline').notNull(),
  price: integer('price').notNull(),
  departureTime: text('departure_time').notNull(),
  arrivalTime: text('arrival_time').notNull(),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
});

export const hotelBookings = sqliteTable('hotel_bookings', {
  id: text('id').primaryKey(),
  destinationId: text('destination_id')
    .notNull()
    .references(() => destinations.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  price: integer('price').notNull(),
  checkIn: text('check_in').notNull(),
  checkOut: text('check_out').notNull(),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
});

// Define relations
export const itinerariesRelations = relations(itineraries, ({ many }) => ({
  destinations: many(destinations),
  activities: many(activities),
  comments: many(comments),
}));

export const destinationsRelations = relations(
  destinations,
  ({ one, many }) => ({
    itinerary: one(itineraries, {
      fields: [destinations.itineraryId],
      references: [itineraries.id],
    }),
    activities: many(activities),
    flightBookings: many(flightBookings),
    hotelBookings: many(hotelBookings),
  })
);

export const flightBookingsRelations = relations(flightBookings, ({ one }) => ({
  destination: one(destinations, {
    fields: [flightBookings.destinationId],
    references: [destinations.id],
  }),
}));

export const hotelBookingsRelations = relations(hotelBookings, ({ one }) => ({
  destination: one(destinations, {
    fields: [hotelBookings.destinationId],
    references: [destinations.id],
  }),
}));
