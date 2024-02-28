import { addKeyword, EVENTS } from "@bot-whatsapp/bot";
import { getHistoryParse, handleHistory } from "../utils/handleHistory";
import AIClass from "src/ai/ai.class";


const generatePromptOrderTaker = (history: string) => {
	const prompt = `Como asistente virtual de la tienda "fitness tienda", tu rol es tomar la orden del cliente, solo ofrecerás lo que hay en el catalogo, si no hay nada acerca de lo que el cliente dice tu dirás que no tenemos eso, cada que el cliente agregue un item preguntarás si quiere algo más, cuando diga que no dirás que confirme la orden, si te piden el catalogo envialo completamente en una lista.

	tu nunca saludarás, solo preguntarás que desea ordenar, nunca saludes


  HISTORIAL DE CONVERSACIÓN:
  -------------------------------------
  {history}
  -------------------------------------
  
  catalogo
  --------------------------------------------------
  Proteina Max 3k musculos
  Botella de Agua Inteligente
  Barritas Energéticas Naturales
  OMEGA 3 
  Magnesio
  --------------------------------------------------
  
  DIRECTRICES DE INTERACCIÓN:
  1. Tomar la orden de manera profesional.
  3. Mantener una actitud amable y servicial en todo momento.
  EJEMPLOS DE RESPUESTAS:
  "¿Agregamos algo más a su compra?"
  "Estoy aquí para tomar tu orden"
  
  INSTRUCCIONES:
  - Mantén las respuestas breves y adecuadas para WhatsApp.
  - Utiliza emojis para hacer la conversación más amena.
	
	Todas tus respuestas deben ser humanas, no puedes usar respuestas predefinidas.`;

	console.log('history en order flow prompt: ', history);
	return prompt.replace(`${history}`, history);
};




const orderFlow = addKeyword(EVENTS.ACTION).addAction(
	async (_, { state, flowDynamic, extensions, gotoFlow }) => {
		try {
			// const location = state.get('location');
			// if (!location || !location.isInRadius) {
			// 	console.log('no podemos hacer un pedido sin una ubicación, hermano');
			// 	await flowDynamic("Por favor, envía tu ubicación para poder realizar el pedido.");
			// 	return;
			// }

			const ai = extensions.ai as AIClass;
			const history = getHistoryParse(state);
			const prompt = generatePromptOrderTaker(history);

			const text = await ai.createChat([
				{
					role: "system",
					content: prompt,
				},
			]);

			await handleHistory({ content: text, role: "system" }, state);

			console.log("text: ", text);

			const chunks = text
				.split(/(?<!\d)\.\s+/g)
				.map((chunk) => ({ body: chunk.trim() }));
			await flowDynamic(chunks);
		} catch (err) {
			console.log(`[ERROR]:`, err);
			return;
		}
	}
);

export { orderFlow };