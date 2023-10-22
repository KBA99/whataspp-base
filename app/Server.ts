import { WhatsappConversation } from '~/app/whatsapp-conversations';
import { config } from './config';
import { MongoDB } from './data/repository/database.connect';
import { Logger } from './utils/Logger';
import qrcode from 'qrcode-terminal';
import { Client, LocalAuth } from 'whatsapp-web.js';
import whatsappSchema from './data/repository/data/whatsapp.schema';

export class Server {
	static {
		process.on('warning', (error) => {
			Logger.processError('MINT [Warning]', error); //process.send({ event: "error", detail: `${error}`, type: "error" });
		});
		process.on('uncaughtException', (error) => {
			Logger.processError('MINT [UE]', error); //process.send({ event: "error", detail: `${error}`, type: "error" });
		});
		process.on('unhandledRejection', (error) => {
			Logger.processError('MINT [UR]', <any>error); //process.send({ event: "error", detail: `${error}`, type: "error" });
		});
		process.on('close', (code, signal) => {
			Logger.processWarn(`[MINT] Worker closed with code ${code} and signal ${signal}`);
		});
		process.on('exit', (code: any, signal: any) => {
			Logger.processWarn(`[MINT] Worker exitted with code ${code} and signal ${signal}`);
		});
		process.on('disconnect', () => {
			Logger.processWarn(`[MINT] Main processes exited. Killing process.`);
			process.exit(0);
		});
	}

	static async startServer() {
		await Server.startDatabase();
		await Server.connectToWhatsapp();
		await Server.refreshConversations();
		Logger.success('Server is up and running 🚀');
	}

	static async refreshConversations() {
		const conversations = await whatsappSchema.find();
		conversations.forEach((converastion) => {
			new WhatsappConversation(converastion.whatsAppId, converastion);
		});
	}

	static async connectToWhatsapp() {
		const client = new Client({ authStrategy: new LocalAuth() });

		client.on('qr', (qr: any) => {
			qrcode.generate(qr, { small: true });
		});

		client.on('ready', async () => {
			Logger.info('Client is ready!');
		});

		client.on('message_create', async (message) => {
			if (message.fromMe === false) {
				const isConversationAlready = WhatsappConversation.conservations.includes(
					message.from
				);
				let conversation: WhatsappConversation | undefined;

				if (isConversationAlready) {
					conversation = WhatsappConversation.whatsappConversations.get(message.from);
					await conversation?.runAction(message);

					// console.log(conversation);
				} else {
					const whatsappConverastion = new WhatsappConversation(message.from);
					Logger.success('Started a new conversation');
				}
			}
		});

		client.initialize();
	}

	private static async startDatabase() {
		if (process.env.NODE_ENV == 'development') {
			Logger.info('Running application in Development mode.');
			config.mongoDB.url = config.mongoDB.dbLocalURL;
		} else if (process.env.NODE_ENV == 'production') {
			Logger.info('Running application in Production mode.');
			config.mongoDB.url = config.mongoDB.atlasURL;
		}

		await MongoDB.connectToDatabase(config.mongoDB.url);
	}
}
