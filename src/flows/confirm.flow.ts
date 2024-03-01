import { addKeyword, EVENTS } from "@bot-whatsapp/bot";
import AIClass from "src/ai/ai.class";
import {
	clearHistory,
	handleHistory,
	getHistoryParse,
} from "../utils/handleHistory";
import typing from '../utils/texting'
import GoogleSheetService from "src/services/sheet.js";
import { BotContext } from "@bot-whatsapp/bot/dist/types";
import { generateTimer } from "src/utils/timer";

const googleSheet = new GoogleSheetService(
	"1YgBJtpwwtfJlUzgzuPS-M6Z2CMGXvhFZ90ojH6300fs"
);

const generateJsonParseForPayment = (history: any, name: string, email: string, identificacion: string, cellphone: string, products: any) => {
	const prompt = `Basado en el historial de conversación: ${history}
    Analiza la información proporcionada y genera un objeto JSON para el proceso de pago, estrictamente siempre debera tener la siguente sintaxis en ingles.

		el json lo harás comparando esos datos con los siguientes datos siempre con estos datos guardarás el pedido, con el precio y nombre correspondiente
		${products}

		--------------------------------------------------------
		ejemplo de sintaxis
			client: {
				name: "John Doe",
				email: "hola@ejemplo.com"
				identification: "1234567890",
				cellphone: "1234567890"
				orderItems: [
					{
						name: "Omega 3",
						quantity: 1,
						price: 10.00
					}
				]
			}
		--------------------------------------------------------

    Datos del Cliente:
    - nombre: "${name}"
    - email: "${email}"
    - identificacion: "${identificacion}"
		- celular: "${cellphone}
    
    Objeto JSON a generar para el pago:`;

	return prompt;
};

/**
 * Flujo para manejar el proceso de pago
 */
const confirmFlow = addKeyword("pay")
	.addAction(async (ctx: any, ctxFn: any ) => {
		await typing(ctx, ctxFn.provider)
		await ctxFn.flowDynamic([{body:"Por favor, introduce tu dirección de correo electrónico:", delay: generateTimer(300, 850)}]);
		await handleHistory(
			{ role: "system", content: "Por favor, introduce tu dirección de correo electrónico:" },
			ctxFn.state
		);
	})
	.addAction(
		{ capture: true },
		async (ctx: any, { state, flowDynamic, fallBack, provider }) => {
			if (ctx.body.includes("@") && ctx.body.includes(".")) {
				await state.update({ email: ctx.body });
				await handleHistory({ role: "user", content: ctx.body }, state);
				await typing(ctx, provider)
				await flowDynamic([{body:"Ahora, necesito que me facilites tu nombre:", delay: generateTimer(300, 850)}]);
				await handleHistory(
					{ role: "system", content: "Ahora, necesito que me facilites tu nombre:" },
					state
				);
			} else {
				return fallBack(
					"El correo electrónico proporcionado no es válido. Por favor, introduce un correo electrónico válido:"
				);
			}
		}
	)
	.addAction(
		{ capture: true },
		async (ctx: any, { state, flowDynamic, fallBack, provider }) => {
			if (ctx.body.trim().split(" ").length > 1) {
				await state.update({ name: ctx.body.trim() });
				await handleHistory(
					{ role: "user", content: ctx.body.trim() },
					state
				);
				await typing(ctx, provider)
				await flowDynamic([{body:"Finalmente, proporciona tu número de identificación:", delay: generateTimer(300, 850)}]);
				await handleHistory(
					{
						role: "system",
						content: "Finalmente, proporciona tu número de identificación:",
					},
					state
				);
			} else {
				return fallBack(
					"Por favor, proporciona tu nombre y apellidos:"
				);
			}
		}
	)
	.addAction(
		{ capture: true },
		async (ctx: any, { state, flowDynamic, fallBack, provider }) => {
			if (ctx.body.trim().length > 8) {
				await state.update({ identification: ctx.body.trim() });
				await handleHistory(
					{ role: "user", content: ctx.body.trim() },
					state
				);
				await typing(ctx, provider)
				await flowDynamic([{body:"Gracias por facilitarnos tus datos, estamos generando tu enlace de pago.", delay: generateTimer(300, 850)}]);
				await handleHistory(
					{
						role: "system",
						content:
							"Gracias por facilitarnos tus datos, estamos generando tu enlace de pago.",
					},
					state
				);
			} else {
				return fallBack(
					"El número de identificación debe ser mayor a 8 dígitos. Por favor, vuelve a ingresarla:"
				);
			}
		}
	)
	.addAction(async (ctx: any, { state, flowDynamic, extensions, provider }) => {
		const email = state.get("email");
		const name = state.get("name");
		const identification = state.get("identification");
		const cellphone = ctx.from; 
		const products = await googleSheet.getAllProducts();
		
		
		const productsString = products.map(p => `${p.NAME} a ${p.PRICE}`).join('\n ');
	
		const history = getHistoryParse(state);
		console.log('historial', history);
		
		const ai = extensions.ai as AIClass;
		const prompt = generateJsonParseForPayment(
			history,
			name,
			email,
			identification,
			cellphone,
			productsString,
		);
	
		
		const jsonPaymentInfo = await ai.createChat([
			{ role: "system", content: prompt },
		]);


		console.log(`JSON para Pago:...... \n ${jsonPaymentInfo}`);
		const paymentInfo = JSON.parse(jsonPaymentInfo);
		const client = paymentInfo.client;

		console.log('client', client);

		try {
			const data = {
				name: name,
				email: email,
				identification: identification,
				cellphone: cellphone,
				orderItems: client.orderItems.map((item: { name: any; quantity: any; price: any; }) => `Nombre: ${item.name}, cantidad: ${item.quantity}, precio: ${item.price}`).join(', ').replace(/"/g, ''),
			}
			console.log('data from flow', data);
			await googleSheet.saveOrder(data);
		} catch (error) {
			console.error("Error al guardar la orden:", error);
		}
		
		// clearHistory(state);
		console.log('Historial de conversación limpio', state.getAllState());
		await typing(ctx, provider)
		await flowDynamic([{body:"¡Hecho! Tu pedido ha sido programado; pronto un representante se pondrá en contacto contigo para coordinar la entrega. ¡Agradecemos tu compra! 🚀🎉", delay: generateTimer(300, 850)}]);
	});
	

export { confirmFlow };