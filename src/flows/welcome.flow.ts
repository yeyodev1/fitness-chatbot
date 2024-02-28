import { EVENTS, addKeyword } from "@bot-whatsapp/bot";
import conversationalLayer from "src/layers/conversational.layer";
import mainLayer from "src/layers/main.layer";

export default addKeyword(EVENTS.WELCOME)
  .addAction(conversationalLayer)
  .addAction(mainLayer)