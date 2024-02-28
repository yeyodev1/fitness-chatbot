import { createProvider } from "@bot-whatsapp/bot";
import { BaileysProvider } from "@bot-whatsapp/provider-baileys";

export const provider = createProvider(BaileysProvider);