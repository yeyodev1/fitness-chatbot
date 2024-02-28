import { EVENTS, addKeyword } from "@bot-whatsapp/bot";

export default addKeyword(EVENTS.ACTION).addAnswer("Yo me disparo cuando voy a confirmar la orden")