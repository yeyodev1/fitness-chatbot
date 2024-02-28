import { createFlow } from "@bot-whatsapp/bot";
import confirmFlow from "./confirm.flow";
import orderFlow from "./order.flow";
import welcomeFlow from "./welcome.flow";
import { conversationFlow } from "./conversation.flow";

export const flow = createFlow([
  confirmFlow,
  confirmFlow,
  orderFlow,
  welcomeFlow,
  conversationFlow
])