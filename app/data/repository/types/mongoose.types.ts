import mongoose from 'mongoose';

export interface WhatsappDoc extends mongoose.Document {
    name: string
    email?: string
    whatsAppId: string
	stage: ConverstationStage;
}


export enum ConverstationStage {
	name,
	email,
}