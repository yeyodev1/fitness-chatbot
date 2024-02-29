import ffmpegPath from "@ffmpeg-installer/ffmpeg";
import ffmpeg from "fluent-ffmpeg";

ffmpeg.setFfmpegPath(ffmpegPath.path);

const convertOggMp3 = async (inputStream: any, outStream: any) => {
  try {
    return new Promise((resolve, reject) => {
      ffmpeg(inputStream)
        .audioQuality(96)
        .toFormat("mp3")
        .save(outStream)
        .on("progress", (p) => null)
        .on("end", () => {
          resolve(true);
        })
        .on('error', (err) => {
          reject(err);
        });
    });
  } catch (err) {
    console.log("Error en convert.js", err);
  }
};

export { convertOggMp3 };
