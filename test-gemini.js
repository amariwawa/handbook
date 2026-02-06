import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from 'fs';
import path from 'path';

// Read .env file manually
const envPath = path.resolve(process.cwd(), '.env');
const envContent = fs.readFileSync(envPath, 'utf-8');
const match = envContent.match(/VITE_GEMINI_API_KEY=(.+)/);
const apiKey = match ? match[1].trim() : null;

console.log("Testing Gemini API...");
console.log("API Key found:", apiKey ? "Yes (starts with " + apiKey.substring(0, 5) + ")" : "No");

if (!apiKey) {
  console.error("No API key found in .env");
  process.exit(1);
}

const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

async function run() {
  try {
    const modelsToTest = ["gemini-flash-latest", "gemini-pro-latest", "gemini-2.0-flash-lite-preview-02-05"];
    
    for (const modelName of modelsToTest) {
        console.log(`\nTrying '${modelName}'...`);
        try {
            const model = genAI.getGenerativeModel({ model: modelName });
            const result = await model.generateContent("Hi");
            console.log(`${modelName} works! Response:`, result.response.text());
            break; // Found one that works
        } catch (e) {
            console.error(`${modelName} failed:`, e.message.split('\n')[0]);
        }
    }

  } catch (error) {
    console.error("\nGeneral Error:");
    console.error(error);
  }
}

run();