import WAWebJS from 'whatsapp-web.js';
import { WhatsappRepository } from './data/repository/repository-impl/whatsapp-repository';
import { ConverstationStage, WhatsappDoc } from './data/repository/types/mongoose.types';

export class WhatsappConversation {
	static conservations: Array<string> = new Array();
	static whatsappConversations = new Map<string, WhatsappConversation>();

	public stage: ConverstationStage = ConverstationStage.name;
	private isWaitingForReply?: boolean;
	private name?: string;
	private email?: string;

	constructor(public whatsappId: string, user?: WhatsappDoc) {
		WhatsappConversation.conservations.push(this.whatsappId);
		console.log('created a new converastion!');

		WhatsappConversation.whatsappConversations.set(this.whatsappId, this);
		console.log('added converastion to map!');

		if (user) {
			this.stage = user.stage;
			this.name = user.name;
			this.email = user.email;
		}
	}

	async runAction(message: WAWebJS.Message) {
		switch (this.stage) {
			case ConverstationStage.name:
				if (!this.isWaitingForReply && !this.name) {
					await message.reply(
						`Hi there! I don't currently know your name! What would you like me to save your name as?`
					);
					this.isWaitingForReply = true;
				} else {
					// Run the logic to save the user name here to the database
					this.name = this.name ?? message.body;
					await message.reply(`Okay, Hi ${this.name}. I hope you are well today!`);

					// Run logic here to save user to database
					await this.saveName(this.name);

					this.stage = ConverstationStage.email;
					this.isWaitingForReply = false;
				}

				break;

			case ConverstationStage.email:
				// Run logic to save email

				if (!this.isWaitingForReply) {
					await message.reply(
						`Hi ${this.name} What would you like me to save your email as?`
					);
					this.isWaitingForReply = true;
				} else {
					this.email = message.body;
					await this.saveEmail(this.email);
					await message.reply(
						`Okay ${this.name}! I will save your email as ${this.email}`
					);

					// set the conversation stage to the next stage
					this.isWaitingForReply = false;
				}
				break;

			default:
				break;
		}
	}

	async saveName(name: string) {
		await WhatsappRepository.create(this.whatsappId, name);
	}

	async saveEmail(email: string) {
		await WhatsappRepository.addEmailToWhatappUserByWhatappId(this.whatsappId, email);
	}
}
