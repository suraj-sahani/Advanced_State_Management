CREATE TABLE `activities` (
	`id` text PRIMARY KEY NOT NULL,
	`itinerary_id` text NOT NULL,
	`destination_id` text,
	`name` text NOT NULL,
	`description` text,
	`start_time` text NOT NULL,
	`end_time` text NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (`itinerary_id`) REFERENCES `itineraries`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`destination_id`) REFERENCES `destinations`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `comments` (
	`id` text PRIMARY KEY NOT NULL,
	`itinerary_id` text NOT NULL,
	`content` text NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (`itinerary_id`) REFERENCES `itineraries`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `destinations` (
	`id` text PRIMARY KEY NOT NULL,
	`itinerary_id` text NOT NULL,
	`name` text NOT NULL,
	`location` text NOT NULL,
	`arrival_date` text NOT NULL,
	`departure_date` text NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	`status` text DEFAULT 'draft' NOT NULL,
	FOREIGN KEY (`itinerary_id`) REFERENCES `itineraries`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `flight_bookings` (
	`id` text PRIMARY KEY NOT NULL,
	`destination_id` text NOT NULL,
	`airline` text NOT NULL,
	`price` integer NOT NULL,
	`departure_time` text NOT NULL,
	`arrival_time` text NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (`destination_id`) REFERENCES `destinations`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `hotel_bookings` (
	`id` text PRIMARY KEY NOT NULL,
	`destination_id` text NOT NULL,
	`name` text NOT NULL,
	`price` integer NOT NULL,
	`check_in` text NOT NULL,
	`check_out` text NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (`destination_id`) REFERENCES `destinations`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `itineraries` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`people` integer NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
CREATE TABLE `references` (
	`id` text PRIMARY KEY NOT NULL,
	`type` text NOT NULL,
	`data` text NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP
);
