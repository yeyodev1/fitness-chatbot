import fs from "fs";
import { OpenAI } from "openai";

const voiceToText = async (path: string): Promise<string> => {
  if (!fs.existsSync(path)) {
    throw new Error("No se encuentra el archivo");
  }

  try {
    const openai = new OpenAI({
      apiKey: process.env.OPEN_AI_KEY,
    });
    const resp = await openai.audio.transcriptions.create({
      model: "whisper-1",
      file: fs.createReadStream(path),
    });
    console.log("{resp}", resp);

    return resp.text;
  } catch (err) {
    console.log(err.response?.data || err.message);
    return "ERROR";
  }
};

export { voiceToText };
