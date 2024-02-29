import { downloadMediaMessage } from '@whiskeysockets/baileys';
import * as fs from 'node:fs/promises';

import { voiceToText } from 'src/services/whisper';
import { convertOggMp3 } from 'src/utils/convert';

const handlerAI = async (ctx: any) => {
  let pathTmpOgg: string, pathTmpMp3: string; 
  try {
    const buffer = await downloadMediaMessage(ctx, "buffer", {} );
    pathTmpOgg = `${process.cwd()}/src/tmp/voice-note-${Date.now()}.ogg`;
    pathTmpMp3 = `${process.cwd()}/src/tmp/voice-note-${Date.now()}.mp3`;
    await fs.writeFile(pathTmpOgg, buffer);
    await convertOggMp3(pathTmpOgg, pathTmpMp3);
    const text = await voiceToText(pathTmpMp3);
   
    
    await fs.unlink(pathTmpOgg);
    await fs.unlink(pathTmpMp3);

    return text;
    
  } catch (err) {
    console.log('Error encountered in the voiceNoteHandler', err);
  
    if (pathTmpOgg) await fs.unlink(pathTmpOgg).catch(console.error);
    if (pathTmpMp3) await fs.unlink(pathTmpMp3).catch(console.error);
  }
};

export { handlerAI };
