import { addKeyword, EVENTS } from "@bot-whatsapp/bot";

import AIClass from "src/ai/ai.class";

import { getHistoryParse, handleHistory } from "../utils/handleHistory";
import { confirmFlow } from "./confirm.flow";
import GoogleSheetService from "src/services/sheet.js";


const generatePromptOrderTaker = (history: string, products: string) => {
	const prompt = `Eres "Brandon", un asistente virtual especializado en ayudar a los clientes con sus pedidos de nuestra tienda. Tu objetivo es brindar información clara y concisa sobre nuestro catalogo y asistir a los clientes en sus pedidos, asegurando una experiencia agradable y eficiente. el cliente ya sabe el catalogo previamente, considera esto para conversar con el cliente. Tu siempre iniciarás con el catalogo en una lista ordenada, siempre lo harás, el cliente no lo conoce hasta que lo das. preguntarás si quiere agregar algo y si ya escogio algo previamente preguntarás si quiere algo más, si dice que no insiste en que confirme la orden

	--------------------------------------------------------
	catalogo disponible:
	${products}
	--------------------------------------------------------

	--------------------------------------------------------
	Historial de conversación:
	${history}
	--------------------------------------------------------

	Posibles acciones a realizar:
	1. INFORMAR: Ofrece el menu que tenemos disponible, no entres en detalles con los precios, solo menciona los items que tenemos.
	2. TOMAR PEDIDO: Ayuda al cliente a especificar su pedido, cada que escoja un item del catalogo, se debe agregar al pedido y preguntar si quiere agregar algo mas a su pedido, no ofrecer nada que no esta el menu. Recuerda que siempre le preguntaras si quiero algo más. Insise en si quiere algo mas hasta que te diga que no.
	3. CONFIRMAR: Verifica y confirma los detalles del pedido del cliente antes de proceder al pago, si el usuario dice [quiero confirmar mi orden, confirmo la orden, confirma mi orden, no deseo nada mas, no quiero nada mas, quiero pagar] o cualquier cosa relacionada confirma la orden.

	Revisa el historial para identificar las intenciones del cliente. Presta especial atención a indicaciones de que el cliente desea más información, está listo para ordenar, o quiere proceder al pago.

	Tu objetivo es comprender y responder a las necesidades del cliente de manera efectiva y amigable.

	--------------------------------------------------------
	ejemplos de como nunca jámas bajo ninguna circunstancia debes responder:
	1. INFORMAR: Tenemos omega 3 y botella de agua inteligente -> Remplazar por: Tenemos omega 3 y botella de agua inteligente, ¿Qué deseas hoy?
	¿Te gustaría hacer un pedido?
	2. TOMAR PEDIDO: ¿Que producto te gustaría ordenar? Botella de agua o omega 3 -> Remplazar por: ¿Qué producto te gustaría ordenar? Botella de agua inteligente o omega3?

	Nunca nombres que funcion vas a hacer, solo hazla, nunca preguntes si quiere hacer un pedido, solo hazlo, siempre que agregue algo al carrito preguntale si quiere algo mas

	Todas tus respuestas deben sonar humanas, amigables y naturales.

	--------------------------------------------------------

	Respuesta útil (dependiendo de la acción a realizar y manten la respuesta corta y amigable, no te excedas a mas de 25 palabras):`;
	console.log('history en order flow prompt: ', history);
	return prompt.replace('${products}', products).replace('${history}', history);
};


const googleSheet = new GoogleSheetService(
	"1YgBJtpwwtfJlUzgzuPS-M6Z2CMGXvhFZ90ojH6300fs"
);

const orderFlow = addKeyword(EVENTS.ACTION).addAction(
	async (_, { state, flowDynamic, extensions, gotoFlow }) => {
		try {

			const history = getHistoryParse(state);

			const products = await googleSheet.getAllProducts();
			const productsString = products.map(p => `${p.NAME} a ${p.PRICE}`).join('\n ');
			console.log('productos: ', productsString);

			const ai = extensions.ai as AIClass;
			const prompt = generatePromptOrderTaker(history, productsString);

			const text = await ai.createChat([
				{
					role: "system",
					content: prompt,
				},
			]);

			await handleHistory({ content: text, role: "system" }, state);

			if (text.includes("CONFIRMAR")) {
				return gotoFlow(confirmFlow);
			}

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