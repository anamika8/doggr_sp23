import type { EntityManager } from '@mikro-orm/core';
import { Seeder } from '@mikro-orm/seeder';
import {Message} from "../entities/Message.js";
import {User} from "../entities/User.js";

export class MessageSeeder extends Seeder {
	async run(em: EntityManager): Promise<void> {
		const user1Email = "email@email.com";
		const user1 = await em.findOne(User, { email: user1Email });
		const user2Email = "email2@email.com";
		const user2 = await em.findOne(User, { email: user2Email });
		const user3Email = "email3@email.com";
		const user3 = await em.findOne(User, { email: user2Email });


		em.create(Message, {
			theSender: user1,
			theRecipient: user2,
			message: "Hi, Seeder Message",
			deleted: false
		});

		em.create(Message, {
			theSender: user1,
			theRecipient: user2,
			message: "Hi",
			deleted: false
		});

		em.create(Message, {
			theSender: user2,
			theRecipient: user1,
			message: "Hi, How are you doing?",
			deleted: false
		});

		em.create(Message, {
			theSender: user3,
			theRecipient: user1,
			message: "Hi there, how are you?",
			deleted: false
		});

		em.create(Message, {
			theSender: user1,
			theRecipient: user3,
			message: "Hey there",
			deleted: false
		});

		em.create(Message, {
			theSender: user2,
			theRecipient: user3,
			message: "Hey whatsup",
			deleted: false
		});

		em.create(Message, {
			theSender: user2,
			theRecipient: user3,
			message: "oops sorry",
			deleted: true
		});

	}
}
