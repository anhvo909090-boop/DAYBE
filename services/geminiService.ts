
import { GoogleGenAI, Type, Modality } from "@google/genai";
import type { GameRound, GameCategory } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable is not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

function shuffleArray<T,>(array: T[]): T[] {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

const categoryPrompts: Record<GameCategory, string> = {
    animals: "con vật",
    plants: "loài cây hoặc rau củ",
    objects: "đồ vật trong nhà"
};

export async function generateGameRound(category: GameCategory): Promise<GameRound> {
  try {
    const categoryPrompt = categoryPrompts[category];
    const optionsPrompt = `Tạo một danh sách gồm 4 ${categoryPrompt} quen thuộc với trẻ em Việt Nam. Mục đầu tiên là đáp án đúng. Trả lời bằng tiếng Việt.`;

    const optionsResponse = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: optionsPrompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    options: {
                        type: Type.ARRAY,
                        items: { type: Type.STRING },
                        description: "A list of 4 items."
                    }
                }
            }
        }
    });

    const parsedOptions = JSON.parse(optionsResponse.text);
    if (!parsedOptions.options || parsedOptions.options.length !== 4) {
      throw new Error("Invalid options format from API");
    }

    const allOptions: string[] = parsedOptions.options;
    const correctAnswer = allOptions[0];

    const imagePrompt = `Một bức ảnh đơn giản, rõ nét, thân thiện với trẻ em về: ${correctAnswer}. Nền trắng. Phong cách hoạt hình.`;
    
    const imageResponse = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
            parts: [{ text: imagePrompt }],
        },
        config: {
            responseModalities: [Modality.IMAGE],
        },
    });

    let imageBase64 = '';
    for (const part of imageResponse.candidates[0].content.parts) {
      if (part.inlineData) {
        imageBase64 = part.inlineData.data;
        break;
      }
    }

    if (!imageBase64) {
        throw new Error("Image generation failed.");
    }
    
    return {
      image: `data:image/png;base64,${imageBase64}`,
      options: shuffleArray(allOptions),
      correctAnswer: correctAnswer,
    };
  } catch (error) {
    console.error("Error generating game round:", error);
    throw new Error("Failed to create a new game round. Please try again.");
  }
}
