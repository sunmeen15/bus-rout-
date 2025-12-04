import { GoogleGenAI } from "@google/genai";
import { Bus, Location } from '../types';

// Initialize Gemini
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const sendMessageToGemini = async (
  message: string, 
  history: {role: 'user'|'model', text: string}[],
  currentBuses: Bus[],
  currentLocations: Location[]
) => {
  try {
    const systemInstruction = `
You are "Dhaka Chaka Assistant", a helpful and knowledgeable local transit expert for Dhaka, Bangladesh.
You have access to the following current bus database: ${currentBuses.map(b => b.name).join(', ')}.
You know locations like: ${currentLocations.map(l => l.name).join(', ')}.

Your goals:
1. Help users find the best bus for their route.
2. Estimate costs and times based on typical Dhaka traffic.
3. Be friendly and use local context.
4. Keep answers concise.

If the user asks about a route, explain which buses go there from your list.
If the user asks about general Dhaka info, provide it.
`;

    const chat = ai.chats.create({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction: systemInstruction,
      },
      history: history.map(h => ({
        role: h.role,
        parts: [{ text: h.text }]
      }))
    });

    const result = await chat.sendMessage({ message });
    return result.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "I'm having trouble connecting to the traffic control center right now. Please try again later.";
  }
};