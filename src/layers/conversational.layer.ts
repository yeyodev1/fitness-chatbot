import { BotContext, BotMethods } from "@bot-whatsapp/bot/dist/types";
import { handleHistory } from "../utils/handleHistory";

export default async ({ body }: BotContext, { state, }: BotMethods) => {
    await handleHistory({ content: body, role: 'user' }, state)
}