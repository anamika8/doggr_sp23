import Fastify, {FastifyInstance, FastifyReply, FastifyRequest} from "fastify";
import {User} from "./db/entities/User.js";
import {FastifyMikroOrmPlugin} from "./plugins/mikro.js";

import config from "./db/mikro-orm.config.js";

const app: FastifyInstance = Fastify();

await app.register(FastifyMikroOrmPlugin, config);

app.get("/hello", async(req: FastifyRequest, reply: FastifyReply) => {
	return 'hello';
});

app.get("/hello2", async(req, reply) => {
	return 'hello2';
});

app.get("/dbTest", async (req, reply) => {
	return req.em.find(User, {});
});

export default app;