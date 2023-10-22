import { WhatsappService } from '../../services/whatsapp.service';
import whatsappSchema from '../data/whatsapp.schema';

export class WhatsappRepository {
	static async create(whatsAppId: string, name: string) {
		return await whatsappSchema.create({
			name,
			whatsAppId,
		});
	}

	static async addEmailToWhatappUserByWhatappId(whatsAppId: string, email: string) {
		await whatsappSchema.findOneAndUpdate({ whatsAppId }, { email });
	}
}
