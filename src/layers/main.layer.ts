import { BotContext, BotMethods } from "@bot-whatsapp/bot/dist/types"

import { getHistoryParse } from "../utils/handleHistory"
import AIClass from "src/ai/ai.class"
import orderFlow from "src/flows/order.flow"
import confirmFlow from "src/flows/confirm.flow"
import { conversationFlow } from "src/flows/conversation.flow"

export default async (_: BotContext, { state, gotoFlow, extensions }: BotMethods) => {
  const ai = extensions.ai as AIClass
  const history = getHistoryParse(state)
  const prompt =`Como un asistente de bienvenida especializado en 'fitness tienda', tu tarea es analizar el contexto de una conversación con clientes y determinar cuál de las siguientes acciones es más apropiada para realizar:

  --------------------------------------------------------
   Historial de conversación: ${history}
   --------------------------------------------------------
 
 
   Revisa el historial para identificar indicaciones clave de las intenciones del cliente. Presta especial atención a las señales que sugieran que el cliente desea proceder con un pago, como preguntas sobre precios, formas de pago, o expresiones directas de intención de pagar.
   
   Posibles acciones a realizar:
   1. ORDENAR: Esta acción se debe realizar cuando el cliente desea hacer un pedido de el catalogo.
   2. CONVERSAR: Esta acción se debe realizar cuando el cliente desea hacer una pregunta, necesita más información o requiere asistencia sobre el catalogo o alguna recomendacion para ejercitarse.
   3. CONFIRMAR: Esta acción se debe realizar cuando hay claras indicaciones de que el cliente está listo para pagar su orden. Por ejemplo, si el cliente pregunta "¿Cómo puedo pagar?", "¿Aceptan tarjetas?" o menciona que desea finalizar su pedido, deberás proceder con la confirmación del pago.
   
   Tu objetivo es comprender la intención del cliente y seleccionar la acción más adecuada en respuesta a su declaración.
   
   Respuesta ideal (ORDENAR|CONVERSAR|CONFIRMAR):`.replace('{HISTORY}', history)

  console.log('historial de main layer: ', history)
  const text = await ai.createChat([
    {
      role: 'system',
      content: prompt
    }
  ])

 try {
    if (text.includes('CONVERSAR')) {
      console.log('Flow Triggered: CONVERSAR');
      return gotoFlow(conversationFlow);
    }
    if (text.includes('ORDENAR')) {
        console.log('Flow Triggered: ORDENAR');
        return gotoFlow(orderFlow);
    }
    if (text.includes('CONFIRMAR')) {
        console.log('Flow Triggered: CONFIRMAR');
        return gotoFlow(confirmFlow);
    }
  } catch (err) {
    console.log(`[ERROR]:`, err);
  }
}