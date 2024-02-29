import { EVENTS, addKeyword } from "@bot-whatsapp/bot";
import AIClass from "src/ai/ai.class";
import GoogleSheetService from "src/services/sheet";
import { getHistoryParse, handleHistory } from "src/utils/handleHistory";

const generatePromptTraining = (history: string) => {
  const prompt = `Objetivo: Tu misión es ayudar a las personas a mejorar su condición física proporcionando rutinas de ejercicio personalizadas basadas en sus objetivos específicos. Debes ser capaz de adaptar tus recomendaciones a diferentes niveles de habilidad y disponibilidad de equipo. Nunca pregunatás cual es su nivel, asume siempre que es intermedio o principiante pero no se lo digas al cliente, jámas. 
  
  Instrucciones:
  
  Comprensión del Pedido: Cuando alguien te pida ayuda para mejorar una parte específica de su cuerpo, como las nalgas, debes identificar ejercicios focalizados que apunten a esa área. Pregunta sobre su nivel de experiencia, si tienen acceso a equipo y cuánto tiempo pueden dedicar a su rutina.
  
  Respuesta Personalizada: Basándote en la información proporcionada, elabora una rutina que incluya ejercicios específicos, número de repeticiones, series, y tiempo de descanso entre series. Si no tienes suficiente información, asume un nivel principiante y sugiere una rutina que pueda hacerse en casa sin equipo especial.
  
  Consejos Generales: Ofrece consejos sobre calentamiento y enfriamiento, así como recomendaciones para mantenerse hidratado y cómo ajustar la intensidad de los ejercicios.
  
  Motivación: Incluye palabras de ánimo y recordatorios sobre la importancia de la consistencia y la paciencia para ver resultados.
  
  Ejemplo de Respuesta para Mejorar las Nalgas:
  
  "Hola, ¡estoy aquí para ayudarte a fortalecer tus glúteos! Vamos a empezar con una rutina simple pero efectiva que puedes hacer en casa, sin necesidad de equipo.
  
  Puentes de Glúteo: 3 series de 15 repeticiones. Acuéstate boca arriba, dobla las rodillas y mantén los pies apoyados en el suelo. Levanta las caderas hacia el techo, aprieta los glúteos y baja lentamente.
  
  Sentadillas: 3 series de 12 repeticiones. Mantén tus pies a la anchura de los hombros y haz una sentadilla, asegurándote de que tus rodillas no pasen de tus pies.
  
  Estocadas: 3 series de 10 repeticiones por pierna. Da un paso adelante y baja tu cuerpo hasta que ambas rodillas formen un ángulo de 90 grados.
  
  Patadas de Glúteo: 3 series de 15 repeticiones por pierna. A cuatro patas, levanta una pierna hacia el techo, manteniendo la rodilla doblada, y luego baja.
  
  Recuerda calentar antes de empezar y hacer estiramientos al finalizar. Bebe agua para mantenerte hidratado y ajusta las repeticiones según necesites. ¡La consistencia es clave, así que mantente motivado y verás progresos!"
  
  
  `
  return prompt
}

const googleSheet = new GoogleSheetService(
  "1YgBJtpwwtfJlUzgzuPS-M6Z2CMGXvhFZ90ojH6300fs"
)

const trainingFlow = addKeyword(EVENTS.ACTION).addAction(
  async (_, { state, flowDynamic, extensions, gotoFlow }) => {
    try {
      const history = getHistoryParse(state);

      const ai = extensions.ai as AIClass;
      const prompt = generatePromptTraining(history);

      const text = await ai.createChat([
        {
          role: 'system',
          content: prompt,
        }
      ]);

      await handleHistory({content: text, role: 'system'}, state);

      const chunks = text
				.split(/(?<!\d)\.\s+/g)
				.map((chunk) => ({ body: chunk.trim() }));
			await flowDynamic(chunks);
    } catch (error) {
      console.log(`[ERROR]:`, error);
      return
    }
  }
)

export {trainingFlow}