import "dotenv/config";
import { createBot } from "@bot-whatsapp/bot";
import { provider } from "./provider";
import { flow } from "./flows";
import { database } from "./database";
import AIClass from "./ai/ai.class";
import { handleCtx } from "@bot-whatsapp/provider-baileys";
import { getInitSettings } from "./make";

const ai = new AIClass(process.env.OPEN_AI_KEY);

async function main() {
	const bot = await createBot(
		{
			provider,
			flow,
			database,
		},
		{
			extensions: {
				ai,
			},
		}
	);

	provider.initHttpServer(3000);

	provider.http.server.post(
		"/message",
		handleCtx(async (bot, req, res) => {
			const body = req.body;
			const number = body.number;
			const message = body.message;
			await bot.sendMessage(number, message, {});
			return res.end("send");
		})
	);

	console.log('listo para enviar')
}

getInitSettings().then(main)