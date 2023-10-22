import mongoose from 'mongoose';
import { ConverstationStage, WhatsappDoc } from '../types/mongoose.types';

const WhatsappSchema = new mongoose.Schema<WhatsappDoc>(
	{
		name:{
			type: String,
			required: true,
		},
		email: {
			type: String,
			required: false,
		},
		whatsAppId: {
			type: String,
			requried: true,
		},
		stage: {
			type: Number,
			required: false,
			default: ConverstationStage.email
		}
	},
	{
		timestamps: true,
	}
);

WhatsappSchema.index({ createdAt: 1 });

export default mongoose.model<WhatsappDoc>('WhatsappSchema', WhatsappSchema);
