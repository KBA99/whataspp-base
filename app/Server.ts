import { config } from './config';
import { MongoDB } from './data/repository/database.connect';
import { Logger } from './utils/Logger';
import qrcode from 'qrcode-terminal';
import { Client, LocalAuth } from 'whatsapp-web.js';

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

}
