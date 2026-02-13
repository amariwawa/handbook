import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(API_KEY || "");

export const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export async function generateContent(prompt: string) {
  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Gemini AI Error:", error);
    return "I'm sorry, I'm having trouble connecting to my brain right now. Please try again later!";
  }
}

export async function generateQuestions(subject: string, topic: string, count: number = 5) {
  const prompt = `Generate ${count} multiple-choice questions for ${subject} on the topic of "${topic}". 
  Format the response as a JSON array of objects with the following structure:
  {
    "id": number,
    "text": "question text",
    "options": ["A", "B", "C", "D"],
    "correct": "correct option letter",
    "explanation": "detailed explanation",
    "followUp": "a follow-up question to deepen understanding"
  }
  Ensure the questions are suitable for Nigerian secondary school students (WAEC/JAMB level).`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    // Basic cleanup in case Gemini returns markdown blocks
    const jsonStr = text.replace(/```json|```/g, "").trim();
    return JSON.parse(jsonStr);
  } catch (error) {
    console.error("Gemini AI Questions Error:", error);
    return [];
  }
}
