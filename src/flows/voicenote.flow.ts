import { EVENTS, addKeyword } from "@bot-whatsapp/bot";
import { handlerAI } from "src/utils/voiceNoteHandler";

const voicenoteFlow = addKeyword(EVENTS.VOICE_NOTE).addAction(
  async (ctx, { state, flowDynamic, extensions, gotoFlow }) => {
    try {
      await handlerAI(ctx);

      flowDynamic("hola")
    } catch (err) {
      console.log(`[ERROR]:`, err);
      return;
    }
  }
)

export {voicenoteFlow}