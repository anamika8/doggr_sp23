/** @module Models/Message */

import { Entity, Property, Unique, ManyToOne } from "@mikro-orm/core";
import { BaseEntity } from "./BaseEntity.js";
import { User } from "./User.js";
import type { Rel } from "@mikro-orm/core";

@Entity()
export class Message extends BaseEntity {
	// The person who send the messages
	@ManyToOne()
	theSender!: Rel<User>;

	// The person who received the messages
	@ManyToOne()
	theRecipient!: Rel<User>;

	// the message content
	@Property()
	message!: string;

	// Used for soft-deletes. Set to true when deleted
	@Property()
	deleted: boolean;
}
