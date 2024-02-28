import { BotContext, BotMethods } from "@bot-whatsapp/bot/dist/types"

import { getHistoryParse } from "../utils/handleHistory"
import AIClass from "src/ai/ai.class"
import confirmFlow from "src/flows/confirm.flow"
import { conversationFlow } from "src/flows/conversation.flow"
import { orderFlow } from "src/flows/order.flow"

export default async (_: BotContext, { state, gotoFlow, extensions }: BotMethods) => {
  const ai = extensions.ai as AIClass
  const history = getHistoryParse(state)
  const prompt =
  `
  Deberás analizar detenidamente el historial de conversación para identificar señales clave que indiquen la intención del cliente. Las señales pueden incluir, pero no se limitan a, preguntas específicas sobre productos, solicitudes de recomendaciones, inquietudes sobre opciones de pago, y expresiones directas de deseo de comprar.
  
  Posibles acciones a realizar:
  
  1. ORDENAR: Selecciona esta opción cuando el cliente muestre interés en explorar productos, pregunte por precios, o exprese el deseo de añadir algo a su carrito. En pocas palabras el cliente aun se encuentra o explorando productos, o consultando precios, o queriendo comprar mas(si quiere ver productos o catalogo esta es la intencion).
  2. CONVERSAR: Opta por esta acción cuando el cliente busque más información, tenga dudas específicas sobre un producto o servicio, o simplemente quiera hablar más sobre lo que ofrece la tienda o desea saber que es lo que tiene la tienda. Esto sugiere que el cliente aún está explorando y no se ha decidido por una compra(esta no es la intención si quiere ver productos o catalogo).
  3. CONFIRMAR: Esta acción es apropiada cuando el cliente da pasos a entender que ya desea pagar. Por ejemplo, se expresa que ya no desea pedir nada mas, o que simplemente desea ya pagar.

  Tu objetivo es comprender profundamente la intención detrás de las palabras del cliente y responder con la acción más adecuada, garantizando así una interacción efectiva y eficiente.

  Si el cliente pregunta por el catálogo, envíalo a ORDENAR
  
  Esto dijo el cliente: {HISTORY}

  Respuesta ideal (ORDENAR|CONVERSAR|CONFIRMAR):`.replace('{HISTORY}', history)

  console.log('historial de main layer: ', history)
  const text = await ai.createChat([
    {
      role: 'system',
      content: prompt
    }
  ])
console.log('text de main layer: ', text )
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