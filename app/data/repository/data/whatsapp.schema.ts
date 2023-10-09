import mongoose from 'mongoose';
import { WhatsappDoc } from '../types/mongoose.types';

const WhatsappSchema = new mongoose.Schema<WhatsappDoc>(
	{},
	{
		timestamps: true,
	}
);

WhatsappSchema.index({ createdAt: 1 });

export default mongoose.model<WhatsappDoc>('WhatsappSchema', WhatsappSchema);
