CREATE TABLE `agent_check_ins` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`mood` enum('great','good','okay','tough','burnout') NOT NULL,
	`wins` text,
	`challenges` text,
	`affirmationSeen` varchar(500),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `agent_check_ins_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `agent_goals` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`title` varchar(255) NOT NULL,
	`targetAmount` decimal(12,2),
	`currentAmount` decimal(12,2) DEFAULT '0',
	`targetDate` timestamp,
	`vertical` varchar(50),
	`status` enum('active','achieved','abandoned') NOT NULL DEFAULT 'active',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `agent_goals_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `phone_call_logs` (
	`id` int AUTO_INCREMENT NOT NULL,
	`callSid` varchar(255),
	`callerNumber` varchar(32),
	`direction` enum('inbound','outbound') NOT NULL DEFAULT 'inbound',
	`detectedVertical` varchar(50),
	`transcription` text,
	`summary` text,
	`outcome` enum('quoted','transferred','callback_scheduled','no_action','voicemail') DEFAULT 'no_action',
	`durationSeconds` int,
	`recordingUrl` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `phone_call_logs_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `scraper_jobs` (
	`id` int AUTO_INCREMENT NOT NULL,
	`jobType` varchar(100) NOT NULL,
	`sourceState` varchar(2) NOT NULL,
	`sourceCounty` varchar(100),
	`targetUrl` text,
	`status` enum('pending','running','completed','failed','disabled') NOT NULL DEFAULT 'pending',
	`leadsFound` int DEFAULT 0,
	`lastRunAt` timestamp,
	`nextRunAt` timestamp,
	`errorLog` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `scraper_jobs_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `support_tickets` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int,
	`guestEmail` varchar(320),
	`subject` varchar(500) NOT NULL,
	`body` text NOT NULL,
	`category` enum('billing','quote','technical','compliance','general') NOT NULL DEFAULT 'general',
	`priority` enum('low','normal','high','urgent') NOT NULL DEFAULT 'normal',
	`status` enum('open','in_progress','waiting','resolved','closed') NOT NULL DEFAULT 'open',
	`assignedAdminId` int,
	`resolvedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `support_tickets_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `ticket_replies` (
	`id` int AUTO_INCREMENT NOT NULL,
	`ticketId` int NOT NULL,
	`userId` int,
	`isAdmin` boolean NOT NULL DEFAULT false,
	`body` text NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `ticket_replies_id` PRIMARY KEY(`id`)
);
