CREATE TABLE `analytics_events` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int,
	`eventType` varchar(100) NOT NULL,
	`eventData` json,
	`page` varchar(255),
	`vertical` varchar(50),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `analytics_events_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `quote_submissions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int,
	`vertical` enum('sr22_fr44','burial','tiny_home','pet','gig_economy') NOT NULL,
	`state` varchar(2) NOT NULL,
	`fullName` varchar(255) NOT NULL,
	`email` varchar(320) NOT NULL,
	`phone` varchar(32),
	`violationType` varchar(100),
	`coverageType` varchar(100),
	`details` json,
	`status` enum('pending','quoted','contacted','converted','expired') NOT NULL DEFAULT 'pending',
	`consent` boolean NOT NULL DEFAULT false,
	`estimatedPremium` decimal(10,2),
	`assignedAgent` varchar(255),
	`notes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `quote_submissions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `state_compliance` (
	`id` int AUTO_INCREMENT NOT NULL,
	`stateCode` varchar(2) NOT NULL,
	`stateName` varchar(100) NOT NULL,
	`sr22Required` boolean DEFAULT false,
	`fr44Required` boolean DEFAULT false,
	`sr22Duration` varchar(50),
	`minimumLiability` varchar(100),
	`filingFee` decimal(8,2),
	`processingTime` varchar(100),
	`electronicFiling` boolean DEFAULT false,
	`requirements` json,
	`notes` text,
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `state_compliance_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `subscriptions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`tier` enum('free','small','medium','large','enterprise') NOT NULL DEFAULT 'free',
	`stripeCustomerId` varchar(255),
	`stripeSubscriptionId` varchar(255),
	`status` enum('active','trialing','past_due','canceled','paused') NOT NULL DEFAULT 'trialing',
	`tokensIncluded` int NOT NULL DEFAULT 10,
	`tokensUsed` int NOT NULL DEFAULT 0,
	`currentPeriodStart` timestamp,
	`currentPeriodEnd` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `subscriptions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `token_ledger` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`amount` int NOT NULL,
	`type` enum('credit','debit','bonus','refund') NOT NULL,
	`description` varchar(500),
	`balanceAfter` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `token_ledger_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `users` ADD `phone` varchar(32);--> statement-breakpoint
ALTER TABLE `users` ADD `avatarUrl` text;