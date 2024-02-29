import { EVENTS, addKeyword } from "@bot-whatsapp/bot";
import { handlerAI } from "src/utils/voiceNoteHandler";

const voicenoteFlow = addKeyword(EVENTS.VOICE_NOTE).addAction(
  async (ctx) => {
    try {
      await handlerAI(ctx);
    } catch (err) {
      console.log(`[ERROR]:`, err);
      return;
    }
  }
)

export {voicenoteFlow}