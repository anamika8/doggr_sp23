import {FastifyInstance} from "fastify";
import fp from "fastify-plugin";

declare module 'fastify' {
	interface FastifyInstance {
		select: <T>(path: string, handler: any) => void;
	}
}

const fastifySelectHttpMethod = async function(app: FastifyInstance, options) {
	const select = function select<T>(path, handler) {
		// We have to use .route() here because we need a non-standard http method, SEARCH
		app.route<T>(
			{
				method: "SELECT",
				url: path,
				
				handler
			}
		);
	};
	// gives us access to `app.db`
	app.decorate("select", select);
	
};

export const FastifySelectHttpMethodPlugin = fp(fastifySelectHttpMethod, {
	name: "fastify-select-http-method"
});
