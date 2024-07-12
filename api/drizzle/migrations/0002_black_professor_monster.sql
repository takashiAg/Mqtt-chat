ALTER TABLE `userTag` RENAME COLUMN `name` TO `key`;--> statement-breakpoint
ALTER TABLE userTag ADD `value` text NOT NULL;