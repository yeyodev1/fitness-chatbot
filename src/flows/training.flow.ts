import { EVENTS, addKeyword } from "@bot-whatsapp/bot";

const trainingFlow = addKeyword(EVENTS.ACTION).addAnswer('yo me disparo cuando hay que ofrecer un entrenamiento o rutina')

export {trainingFlow}