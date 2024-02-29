import { createFlow } from "@bot-whatsapp/bot";

import { conversationFlow } from "./conversation.flow";
import { confirmFlow } from "./confirm.flow";
import welcomeFlow from "./welcome.flow";
import { orderFlow } from "./order.flow";
import { trainingFlow } from "./training.flow";
import { voicenoteFlow } from "./voicenote.flow";

export const flow = createFlow([
  confirmFlow,
  orderFlow,
  welcomeFlow,
  conversationFlow,
  trainingFlow,
  voicenoteFlow
])