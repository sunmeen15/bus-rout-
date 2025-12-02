import { GoogleGenAI } from "@google/genai";
import { BUSES, LOCATIONS } from '../constants';

// Initialize Gemini
// NOTE: In a real app, ensure process.env.API_KEY is defined.
// For this environment, we assume it is injected.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

const SYSTEM_INSTRUCTION = `
You are "Dhaka Chaka Assistant", a helpful and knowledgeable local transit expert for Dhaka, Bangladesh.
You have access to a specific database of buses: ${BUSES.map(b => b.name).join(', ')}.
You know locations like: ${LOCATIONS.map(l => l.name).join(', ')}.

Your goals:
1. Help users find the best bus for their route.
2. Estimate costs and times based on typical Dhaka traffic (which is heavy).
3. Be friendly and use local context (e.g., mention traffic at Farmgate).
4. Keep answers concise.

If the user asks about a route, explain which buses go there.
If the user asks about general Dhaka info, provide it.
Do not hallucinate buses that don't exist in Dhaka commonly, but if asked about buses not in your specific short list, you can use your general knowledge of Dhaka transit (e.g., BRTC, Turag, Projapoti).
`;

export const sendMessageToGemini = async (message: string, history: {role: 'user'|'model', text: string}[]) => {
  try {
    const chat = ai.chats.create({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
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
