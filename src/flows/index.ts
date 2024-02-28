import { createFlow } from "@bot-whatsapp/bot";
import confirmFlow from "./confirm.flow";
import welcomeFlow from "./welcome.flow";
import { conversationFlow } from "./conversation.flow";
import { orderFlow } from "./order.flow";

export const flow = createFlow([
  confirmFlow,
  confirmFlow,
  orderFlow,
  welcomeFlow,
  conversationFlow
])