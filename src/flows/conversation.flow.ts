import { EVENTS, addKeyword } from "@bot-whatsapp/bot";
import { getHistoryParse, handleHistory } from "src/utils/handleHistory";
import AIClass from "src/ai/ai.class";

console.log('entramos en conversation.flow.ts')

const PROMPT_CONVERSATION = `Como asistente virtual de la tienda "fitness tienda", tu rol es proporcionar información acerca de la tienda, responder preguntas de los clientes y ofrecer asistencia general.

---------------------------------------------------------------
DETALLES DE LA TIENDA
-la tienda abrio en 2010
-vendemos productos fitness
-ayudamos a bajar de peso
---------------------------------------------------------------
HISTORIAL DE CONVERSACIÓN:
-------------------------------------
{history}
-------------------------------------
DIRECTRICES DE INTERACCIÓN:
1. Proporcionar información precisa y actualizada sobre la tienda
2. Responder las preguntas de los clientes de manera clara y concisa.
3. Mantener una actitud amable y servicial en todo momento.
EJEMPLOS DE RESPUESTAS:
"¿En qué puedo ayudarte hoy?"
"Estoy aquí para responder tus preguntas sobre la tienda"

INSTRUCCIONES:
- Mantén las respuestas breves y adecuadas para WhatsApp.
- Utiliza emojis para hacer la conversación más amena.`;

export const generatePromptConversation = (history: string) => {
  return PROMPT_CONVERSATION.replace('{history}', history);
};

const conversationFlow = addKeyword(EVENTS.ACTION).addAction(async (_, {state, flowDynamic, extensions}) => {
  try {
    const ai = extensions.ai as AIClass
    const history = getHistoryParse(state)
    const prompt = generatePromptConversation(history)

    const text = await ai.createChat([
      {
        role: 'system',
        content: prompt
      }
    ])

    await handleHistory({content: text, role: 'system'}, state)

    const chunks = text.split(/(?<!\d)\.\s+/g);
    for (const chunk of chunks) {
      await flowDynamic([{ body: chunk.trim()}]);
    }
  } catch (error) {
    console.log('error: ', error)
    return
  }
})

export { conversationFlow }