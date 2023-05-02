import { FastifyInstance, FastifyReply, FastifyRequest} from "fastify";
import {Match} from "./db/entities/Match.js";
import {User} from "./db/entities/User.js";
import {ICreateUsersBody} from "./types.js";
import { Message } from "./db/entities/Message.js";
import {readFileSync} from "node:fs";


async function DoggrRoutes(app: FastifyInstance, _options = {}) {
	if (!app) {
		throw new Error("Fastify instance has no value during routes construction");
	}
	
	app.get('/hello', async (request: FastifyRequest, reply: FastifyReply) => {
		return 'hello';
	});
	
	app.get("/dbTest", async (request: FastifyRequest, reply: FastifyReply) => {
		return request.em.find(User, {});
	});

	// CRUD
	// C
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
			console.log("Failed to create new user", err.message);
			return reply.status(500).send({message: err.message});
		}
	});

	// Core method for adding generic SEARCH http method
	// app.route<{Body: { email: string}}>({
	// 	method: "SEARCH",
	// 	url: "/users",
	//
	// 	handler: async(req, reply) => {
	// 		const { email } = req.body;
	//
	// 		try {
	// 			const theUser = await req.em.findOne(User, { email });
	// 			console.log(theUser);
	// 			reply.send(theUser);
	// 		} catch (err) {
	// 			console.error(err);
	// 			reply.status(500).send(err);
	// 		}
	// 	}
	// });
	
	//READ
	app.search("/users", async (req, reply) => {
		const { email } = req.body;
		try {
			const theUser = await req.em.findOne(User, { email });
			console.log(theUser);
			reply.send(theUser);
		} catch (err) {
			console.error(err);
			reply.status(500).send(err);
		}
	});
	
	// UPDATE
	app.put<{Body: ICreateUsersBody}>("/users", async(req, reply) => {
		const { name, email, petType} = req.body;
		
		const userToChange = await req.em.findOne(User, {email});
		userToChange.name = name;
		userToChange.petType = petType;
		
		// Reminder -- this is how we persist our JS object changes to the database itself
		await req.em.flush();
		console.log(userToChange);
		reply.send(userToChange);
		
	});
	
	// DELETE
	app.delete<{ Body: {email}}>("/users", async(req, reply) => {
		const { email } = req.body;
		
		try {
			// using reference is enough, no need for a fully initialized entity
			const userToDelete = await req.em.findOne(User, { email });
	
			await req.em.remove(userToDelete).flush();
			console.log(userToDelete);
			reply.send(userToDelete);
		} catch (err) {
			console.error(err);
			reply.status(500).send(err);
		}
	});	


	// CREATE MATCH ROUTE
	app.post<{Body: { email: string, matchee_email: string }}>("/match", async (req, reply) => {
		const { email, matchee_email } = req.body;

		try {
			// make sure that the matchee exists & get their user account
			const matchee = await req.em.findOne(User, { email: matchee_email });
			// do the same for the matcher/owner
			const owner = await req.em.findOne(User, { email });

			//create a new match between them
			const newMatch = await req.em.create(Match, {
				owner,
				matchee
			});

			//persist it to the database
			await req.em.flush();
			// send the match back to the user
			return reply.send(newMatch);
		} catch (err) {
			console.error(err);
			return reply.status(500).send(err);
		}

	});

	const badwordsCheck = (message) => {
		// Check for bad words
		const badwordsString = readFileSync("./src/plugins/badwords.txt", {encoding: 'utf-8'});
		const badwords = badwordsString.split('\r\n');

		let badword = "";
		// https://storage.googleapis.com/google-code-archive-downloads/v2/code.google.com/badwordslist/badwords.txt 
		for (let i = 0; i <= badwords.length; i++) {
			if (message.toLowerCase()
				.includes(badwords[i])) {
				badword = badwords[i];
				break;
			}
		}

		return badword;
	};

	// CREATE MESSAGE ROUTE
	app.post<{Body: { sender: string, receiver: string, message: string }}>
	("/messages", async (req, reply) => {
		const { sender, receiver, message } = req.body;		
		const badword = badwordsCheck(message);

		if (badword === "") { 
			try {
				// make sure that the receipient exists & get their user account
				const theRecipient = await req.em.findOne(User, { email: receiver });
				// do the same for the messager/sender
				const theSender = await req.em.findOne(User, { email: sender });
	
				//create a new message between them
				const newMessage = await req.em.create(Message, {
					theSender,
					theRecipient,
					message
				});
	
				//persist it to the database
				await req.em.flush();
				// send the message back to the user
				return reply.send(newMessage);
			} catch (err) {
				console.error(err);
				return reply.status(500).send(err);
			}

		} else {
			const errorMessage = "Your message contains some naughty words. Please remove the words and try again"; 
			console.error(errorMessage);
			reply.status(500).send({
				message: errorMessage
			});
		}	

	});

	app.search<{Body: { sender: string }}>("/messages/sent", async(req, reply) => {
		const { sender} = req.body;
		
		try {

			// make sure that the sender exists & get their user account
			const theSender = await req.em.findOne(User, { email: sender });
		
			const sentMessage = await req.em.find(Message, {theSender});

			// send the message back to the user
			return reply.send(sentMessage);
		} catch (err) {
			console.error(err);
			return reply.status(500).send(err);
		}
		
	});

	app.search<{Body: { receiver: string }}>("/messages", async(req, reply) => {
		const { receiver} = req.body;
		
		try {

			// make sure that the receipient exists & get their user account
			const theRecipient = await req.em.findOne(User, { email: receiver });			
	
			const receivedMessage = await req.em.find(Message, {theRecipient});

			// send the message back to the user
			return reply.send(receivedMessage);
		} catch (err) {
			console.error(err);
			return reply.status(500).send(err);
		}
		
	});

	// UPDATE
	app.put<{Body: { messageId: string, message: string }}>("/messages", async(req, reply) => {
		const { messageId, message} = req.body;
		const id = parseInt(messageId);
		const badword = badwordsCheck(message);

		if (badword === "") {

			try{
				const messageToChange = await req.em.findOne(Message, { id });
				messageToChange.message = message;
			
				
				// Reminder -- this is how we persist our JS object changes to the database itself
				await req.em.flush();
				console.log(messageToChange);
				reply.send(messageToChange);
	
			} catch (err) {
				console.error(err);
				return reply.status(500).send(err);
			}	

		} else {
			const errorMessage = "Your message contains some naughty words. Please remove the words and try again"; 
			console.error(errorMessage);
			reply.status(500).send({
				message: errorMessage
			});
		}			
		
	});

	// DELETE
	app.delete<{Body: { messageId: string, password: string }}>("/messages", async(req, reply) => {
		const { messageId, password} = req.body;
		const id = parseInt(messageId);

		const admin_password = process.env.ADMIN_PASSWORD;
		if (admin_password === password) {
			try {
				// using reference is enough, no need for a fully initialized entity
				const messageToDelete = await req.em.findOne(Message, { id });
		
				await req.em.remove(messageToDelete).flush();
				console.log(messageToDelete);
				reply.send(messageToDelete);
			} catch (err) {
				console.error(err);
				reply.status(500).send(err);
			}
		} else {
			const errorMessage = "Incorrect Admin Password";
			console.error(errorMessage);
			reply.status(401).send({
				message: errorMessage
			});
		}
		
		
	});	

	
	app.delete<{Body: { sender: string,  password: string }}>("/messages/all", async(req, reply) => {
		const { sender, password} = req.body;

		const admin_password = process.env.ADMIN_PASSWORD;
		if (admin_password === password) {		
			try {

				// make sure that the sender exists & get their user account
				const theSender = await req.em.findOne(User, { email: sender });

				const sentMessagesToDelete = await req.em.find(Message, {theSender});

	
				await req.em.remove(sentMessagesToDelete).flush();
				console.log(sentMessagesToDelete);
				reply.send(sentMessagesToDelete);
			} catch (err) {
				console.error(err);
				reply.status(500).send(err);
			}
		} else {
			const errorMessage = "Incorrect Admin Password";
			console.error(errorMessage);
			reply.status(401).send({
				message: errorMessage
			});
		}
	});	

}

export default DoggrRoutes;