import "dotenv/config";
import { createBot } from "@bot-whatsapp/bot";
import { provider } from "./provider";
import { flow } from "./flows";
import { database } from "./database";
import AIClass from "./ai/ai.class";

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
}

main();