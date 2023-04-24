import {User} from "./db/entities/User.js";
import { FastifyInstance, FastifyReply, FastifyRequest} from "fastify";
import {ICreateUsersBody} from "./types.js";

async function DoggrRoutes(app: FastifyInstance, _options = {}) {
	if (!app) {
		throw new Error("Fastify instance has no value during route construction");
	}

	app.get("/hello", async(_req: FastifyRequest, _reply: FastifyReply) => {
		return 'hello';
	});

	app.get("/hello2", async(_req, _reply) => {
		return 'hello2';
	});

	app.get("/dbTest", async (req, _reply) => {
		return req.em.find(User, {});
	});

	app.post<{Body: ICreateUsersBody}>("/users", async (req, reply) => {
		const { name, email, petType} = req.body;

		try {
			const newUser = await req.em.create(User, {
				name,
				email,
				petType
			});

			// This will immediately update the real database.  You can store up several changes and flush only once
			// NOTE THE AWAIT -- do not forget it or weirdness abounds
			await req.em.flush();

			console.log("Created new user:", newUser);
			return reply.send(newUser);
		} catch (err) {
			console.log("Failed to create new user: ", err.message);
			return reply.status(500).send({ message: err.message});
		}
	});
}

export default DoggrRoutes;