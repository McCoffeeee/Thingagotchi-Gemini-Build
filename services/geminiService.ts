
import { GoogleGenAI } from "@google/genai";
import { CatState } from '../types';

let genAI: GoogleGenAI | null = null;

const getClient = () => {
  // Fix: Use process.env.API_KEY directly as per guidelines
  if (!genAI && process.env.API_KEY) {
    genAI = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }
  return genAI;
};

export const generateCatThought = async (state: CatState): Promise<string> => {
  const client = getClient();
  if (!client) return "Meow...";

  try {
    const prompt = `
      You are a virtual pixel art cat in a Tamagotchi-style game.
      Your current stats are:
      - Hunger: ${state.hunger}/100 (Lower means hungry)
      - Happiness: ${state.happiness}/100 (Lower means sad)
      - Energy: ${state.energy}/100 (Lower means tired)
      
      Based on these stats, generate a very short, cute, or sassy thought (max 10 words).
      If hungry, complain about food. If sad, ask to play. If happy, purr.
      Do not use hashtags or emojis.
    `;

    const response = await client.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text?.trim() || "Meow!";
  } catch (error) {
    console.error("Error generating cat thought:", error);
    return "Meow?";
  }
};
