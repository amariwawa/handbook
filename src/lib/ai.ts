import { GoogleGenerativeAI } from "@google/generative-ai";
import type { Question } from "./constants";
import { fetchAllQuestions } from "@/lib/db";

let CURRENT_API_KEY: string | undefined =
  import.meta.env.VITE_GEMINI_API_KEY ||
  (typeof window !== "undefined" ? window.localStorage.getItem("GEMINI_API_KEY") || undefined : undefined);

let genAI: GoogleGenerativeAI | null = CURRENT_API_KEY ? new GoogleGenerativeAI(CURRENT_API_KEY) : null;

try {
  if (typeof window !== "undefined" && import.meta.env.VITE_GEMINI_API_KEY) {
    window.localStorage.setItem("GEMINI_API_KEY", import.meta.env.VITE_GEMINI_API_KEY);
  }
} catch { void 0; }

export const hasGemini = (): boolean => !!genAI;
export const setGeminiApiKey = (key: string) => {
  CURRENT_API_KEY = key;
  try {
    if (typeof window !== "undefined") {
      window.localStorage.setItem("GEMINI_API_KEY", key);
    }
  } catch { void 0; }
  genAI = key ? new GoogleGenerativeAI(key) : null;
};

export const testGeminiConnectivity = async (): Promise<boolean> => {
  if (!genAI) {
    return true;
  }
  try {
    let model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });
    try {
      await callWithTimeout(model.generateContent("ping"), 3000);
      return true;
    } catch {
      model = genAI.getGenerativeModel({ model: "gemini-pro" });
      await callWithTimeout(model.generateContent("ping"), 3000);
      return true;
    }
  } catch {
    return false;
  }
};

const MODEL_CANDIDATES = [
  "gemini-flash-latest",
  "gemini-pro",
  "gemini-1.5-pro",
  "gemini-1.5-flash",
];

const tryGenerateText = async (prompt: string): Promise<string> => {
  if (!genAI) throw new Error("No AI client");
  let lastErr: unknown = null;
  for (const m of MODEL_CANDIDATES) {
    try {
      const model = genAI.getGenerativeModel({ 
        model: m,
        generationConfig: {
          temperature: 0.9,
          topP: 0.95,
          maxOutputTokens: 1024,
        }
      });
      const res = await callWithTimeout(model.generateContent(prompt), 8000);
      const text = res.response.text();
      if (text && text.trim().length > 0) return text;
    } catch (e) {
      lastErr = e;
      continue;
    }
  }
  throw lastErr || new Error("All models failed");
};

const callWithTimeout = async <T>(promise: Promise<T>, ms: number): Promise<T> => {
  return new Promise<T>((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error("AI request timed out")), ms);
    promise
      .then((value) => {
        clearTimeout(timer);
        resolve(value);
      })
      .catch((err) => {
        clearTimeout(timer);
        reject(err);
      });
  });
};

// Fallback questions to use if API fails, ensuring we don't show generic "Sample Question" text
const fallbackQuestionsData: Record<string, Question[]> = {
  "Mathematics": [
    {
      id: "math-fallback-1",
      text: "Solve for x: 2x + 5 = 15",
      options: ["5", "10", "2", "7.5"],
      correctAnswer: 0,
      explanation: "2x = 15 - 5 => 2x = 10 => x = 5"
    },
    {
      id: "math-fallback-2",
      text: "What is the derivative of x^2?",
      options: ["x", "2x", "2", "x^2"],
      correctAnswer: 1,
      explanation: "The power rule states that d/dx(x^n) = nx^(n-1). So d/dx(x^2) = 2x."
    },
    {
      id: "math-fallback-3",
      text: "If a triangle has sides 3, 4, and 5, what type of triangle is it?",
      options: ["Isosceles", "Equilateral", "Right-angled", "Scalene"],
      correctAnswer: 2,
      explanation: "Using Pythagoras theorem: 3^2 + 4^2 = 9 + 16 = 25 = 5^2. Since a^2 + b^2 = c^2, it is a right-angled triangle."
    }
  ],
  "English Language": [
    {
      id: "eng-fallback-1",
      text: "Choose the correct option to complete the sentence: He ___ to the market yesterday.",
      options: ["go", "gone", "went", "going"],
      correctAnswer: 2,
      explanation: "The sentence is in the past tense ('yesterday'), so 'went' is the correct verb form."
    },
    {
      id: "eng-fallback-2",
      text: "Which of these is a synonym for 'Happy'?",
      options: ["Sad", "Joyful", "Angry", "Tired"],
      correctAnswer: 1,
      explanation: "'Joyful' means feeling or expressing great pleasure and happiness."
    },
    {
      id: "eng-fallback-3",
      text: "Identify the noun in the sentence: 'The cat sleeps on the mat.'",
      options: ["sleeps", "on", "The", "cat"],
      correctAnswer: 3,
      explanation: "'Cat' is a naming word representing an animal, making it a noun."
    }
  ],
  "Physics": [
    {
      id: "phy-fallback-1",
      text: "What is the SI unit of force?",
      options: ["Joule", "Watt", "Newton", "Pascal"],
      correctAnswer: 2,
      explanation: "The SI unit of force is the Newton (N)."
    },
    {
      id: "phy-fallback-2",
      text: "Which of Newton's laws states that 'Action and reaction are equal and opposite'?",
      options: ["First Law", "Second Law", "Third Law", "Law of Gravitation"],
      correctAnswer: 2,
      explanation: "Newton's Third Law of Motion states that for every action, there is an equal and opposite reaction."
    }
  ],
  "Chemistry": [
    {
      id: "chem-fallback-1",
      text: "What is the chemical symbol for Gold?",
      options: ["Ag", "Au", "Fe", "Cu"],
      correctAnswer: 1,
      explanation: "Au stands for Aurum, which is the Latin name for Gold."
    },
    {
      id: "chem-fallback-2",
      text: "Which gas is evolved when calcium carbonate reacts with dilute hydrochloric acid?",
      options: ["Oxygen", "Hydrogen", "Carbon dioxide", "Nitrogen"],
      correctAnswer: 2,
      explanation: "CaCO3 + 2HCl -> CaCl2 + H2O + CO2. Carbon dioxide is evolved."
    }
  ],
  "Biology": [
    {
      id: "bio-fallback-1",
      text: "The powerhouse of the cell is the:",
      options: ["Nucleus", "Ribosome", "Mitochondria", "Golgi body"],
      correctAnswer: 2,
      explanation: "Mitochondria are responsible for generating most of the cell's supply of adenosine triphosphate (ATP), used as a source of chemical energy."
    },
    {
      id: "bio-fallback-2",
      text: "Which of these is NOT a function of the human liver?",
      options: ["Production of bile", "Detoxification", "Pumping blood", "Storage of glycogen"],
      correctAnswer: 2,
      explanation: "Pumping blood is the function of the heart, not the liver."
    }
  ],
  "Economics": [
    {
      id: "econ-fallback-1",
      text: "The concept of 'Opportunity Cost' refers to:",
      options: ["The money spent on a good", "The alternative forgone", "The cost of production", "The market price"],
      correctAnswer: 1,
      explanation: "Opportunity cost is the value of the next best alternative that is given up when making a choice."
    },
    {
      id: "econ-fallback-2",
      text: "Inflation is best described as:",
      options: ["A fall in prices", "A persistent rise in the general price level", "Increase in bank savings", "Government budget surplus"],
      correctAnswer: 1,
      explanation: "Inflation is defined as a sustained increase in the general price level of goods and services in an economy over a period of time."
    }
  ],
  "Government": [
    {
      id: "govt-fallback-1",
      text: "Democracy is often defined as government of the people, by the people, and for the:",
      options: ["Rich", "Leaders", "People", "Foreigners"],
      correctAnswer: 2,
      explanation: "This famous definition was given by Abraham Lincoln."
    },
    {
      id: "govt-fallback-2",
      text: "The arm of government responsible for interpreting laws is the:",
      options: ["Legislature", "Executive", "Judiciary", "Press"],
      correctAnswer: 2,
      explanation: "The Judiciary interprets the laws, while the Legislature makes them and the Executive implements them."
    }
  ],
  "Computer Science": [
    {
      id: "cs-fallback-1",
      text: "What does CPU stand for?",
      options: ["Central Processing Unit", "Computer Personal Unit", "Central Power Unit", "Central Program Unit"],
      correctAnswer: 0,
      explanation: "CPU stands for Central Processing Unit, often called the brain of the computer."
    },
    {
      id: "cs-fallback-2",
      text: "Which of these is an output device?",
      options: ["Keyboard", "Mouse", "Monitor", "Scanner"],
      correctAnswer: 2,
      explanation: "A monitor displays the results of the computer's processing, making it an output device."
    }
  ],
  "Basic Science": [
    {
      id: "bsc-fallback-1",
      text: "Which of the following is a living thing?",
      options: ["Stone", "Water", "Goat", "Chair"],
      correctAnswer: 2,
      explanation: "A goat shows characteristics of life such as movement, respiration, nutrition, etc."
    },
    {
      id: "bsc-fallback-2",
      text: "The solid state of water is called:",
      options: ["Steam", "Ice", "Liquid", "Vapour"],
      correctAnswer: 1,
      explanation: "When water freezes, it becomes solid ice."
    }
  ],
  "default": [
    {
      id: "default-fallback-1",
      text: "Which of the following is a key concept in this subject?",
      options: ["Concept A", "Concept B", "Concept C", "Concept D"],
      correctAnswer: 0,
      explanation: "This is a placeholder question because the AI service is currently unavailable."
    }
  ]
};

export const generateQuestions = async (subject: string, count: number = 15): Promise<Question[]> => {
  let manualQuestions: Question[] = [];
  try {
    manualQuestions = await fetchAllQuestions(subject);
  } catch {
    manualQuestions = [];
  }
  let selectedManual: Question[] = [];
  if (manualQuestions.length > 0) {
    const shuffled = [...manualQuestions].sort(() => Math.random() - 0.5);
    selectedManual = shuffled.slice(0, Math.min(count, shuffled.length)).map((q, i) => ({
      ...q,
      id: q.id || `db-${Date.now()}-${i}`
    }));
  }
  const remainingCount = Math.max(0, count - selectedManual.length);
  
  if (remainingCount === 0) {
    return manualQuestions.slice(0, count);
  }

  let aiQuestions: Question[] = [];
  
  if (genAI) {
    try {
      const seed = `${Date.now()}-${Math.random()}`;
      const prompt = `Generate ${remainingCount} advanced, difficult multiple choice questions for the subject "${subject}" appropriate for a Senior Secondary School 3 (SS3) / University preparation level student in Nigeria.
      The questions should test deep understanding and critical thinking, not just basic recall. Each question must be distinct and new for this session.
      Randomization token: ${seed}
      You may occasionally include 1–2 repeated questions in the set.
      IMPORTANT: Return the response strictly as a valid JSON array of objects. Do not use markdown.
      Each object:
        {
          "text": "Question text",
          "options": ["A", "B", "C", "D"],
          "correctAnswer": 0,
          "explanation": "Detailed explanation in plain text without markdown symbols"
        }`;

      const text = await tryGenerateText(prompt);
      
      const cleanedText = text.replace(/```json/g, '').replace(/```/g, '').trim();
      
      try {
        const parsedQuestions = JSON.parse(cleanedText);
        aiQuestions = parsedQuestions.map((q: { text: string; options: string[]; correctAnswer: number; explanation?: string }, i: number) => ({
          id: `ai-${Date.now()}-${i}`,
          text: q.text,
          options: q.options,
          correctAnswer: q.correctAnswer,
          explanation: q.explanation
        }));
        if (aiQuestions.length < remainingCount) {
          aiQuestions = [
            ...aiQuestions,
            ...generateMockQuestions(subject, remainingCount - aiQuestions.length)
          ];
        }
        const allowRepeats = Math.random() < 0.35;
        if (allowRepeats) {
          const repeatCount = Math.random() < 0.5 ? 1 : 2;
          for (let r = 0; r < repeatCount && aiQuestions.length > 0; r++) {
            const idx = Math.floor(Math.random() * aiQuestions.length);
            const original = aiQuestions[idx];
            aiQuestions.push({
              ...original,
              id: `ai-repeat-${Date.now()}-${idx}-${r}`
            });
          }
        }
        if (aiQuestions.length > remainingCount) {
          aiQuestions = aiQuestions.slice(0, remainingCount);
        }
      } catch (parseError) {
        console.error("Failed to parse Gemini response:", text);
        throw parseError; 
      }
      
    } catch (error) {
      console.error("Gemini generation failed:", error);
      aiQuestions = generateMockQuestions(subject, remainingCount);
    }
  } else {
    console.warn("No Gemini API key found. Using mock data.");
    aiQuestions = generateMockQuestions(subject, remainingCount);
  }

  return [...selectedManual, ...aiQuestions];
};

export const getExplanation = async (question: string, answer: string, isCorrect: boolean): Promise<string> => {
  if (genAI) {
     try {
       const prompt = `Provide a helpful, educational explanation for this question: "${question}".
       The student answered: "${answer}".
       This answer is ${isCorrect ? "CORRECT" : "INCORRECT"}.
       Explain why it is correct or incorrect and provide the reasoning clearly and concisely to help the student learn.
       Address the student directly.
       Randomization token: ${Date.now()}-${Math.random()}
       Ensure the explanation phrasing is unique compared to typical textbook wording.
       
       IMPORTANT FORMATTING:
       - Do NOT use markdown symbols like *, **, #, or code blocks.
       - Use plain text with clear paragraph spacing.
       - Write naturally as if speaking to the student.`;
       const text = await tryGenerateText(prompt);
       const clean = text.replace(/[*#`]/g, "").trim();
       if (!clean) {
         return `Let's break this down. Your answer was "${answer}". That is ${isCorrect ? "correct" : "not correct"}.
         
Here is the reasoning in simple steps:
1) Identify the key concept in the question.
2) Apply the correct rule/formula/definition.
3) Check alternatives to avoid common pitfalls.
         
Practice this approach on the next question to reinforce understanding.`;
       }
       return clean;
     } catch (e) {
       console.error("Gemini explanation failed", e);
     }
  }
  
  const localFallback = `Let's break this down. Your answer was "${answer}". That is ${isCorrect ? "correct" : "not correct"}.
  
Think of the core idea behind the question and apply it step by step:
1) Identify the exact concept being tested.
2) Recall the correct rule, formula, or definition.
3) Work through the steps carefully and check each option.
4) Note a common mistake and why it leads to the wrong choice.
  
Use this approach on the next question to reinforce understanding.`;
  return localFallback;
}

export const getChatResponse = async (message: string, subject: string, history: {role: string, content: string}[], context?: string): Promise<string> => {
  const tutorFallback = (): string => {
    const lastUser = history.filter(h => h.role === "user").slice(-1)[0]?.content || message;
    const ctx = context ? `Context: ${context}\n\n` : "";
    return `${ctx}Let's focus on ${subject}.
I read: "${lastUser}".
Brief plan: identify the concept, apply the right rule, and check alternatives.
What part should I explain first?`;
  };

  try {
    let contextPrompt = "";
    if (context) {
      contextPrompt = `\nCurrent Context (The user is currently viewing/discussing this): ${context}`;
    }

    const prompt = `You are an expert AI tutor for the subject: ${subject}.
    You are helping a Nigerian student prepare for their exams (WAEC/JAMB).
    Be encouraging and clear.
    Randomization token: ${Date.now()}-${Math.random()}
    Ensure your response phrasing is unique and not repetitive across turns.
    
    IMPORTANT FORMATTING:
    - Do NOT use markdown symbols like *, **, #, or code blocks.
    - Use plain text with clear paragraph spacing.
    - Write naturally as if speaking to the student (e.g. use "I think...", "Let's look at...").
    - Avoid complex symbols that might confuse the student.
    - Keep it concise: 2–4 short sentences or a 3-step list max.
    - Ask at most one brief follow-up question.
    
    LEARNING CONTEXT:
    - Adapt your teaching style based on the student's questions and current context.
    - If they are struggling (getting answers wrong), break things down simply.
    - If they are advancing, challenge them slightly more.
    
    ${contextPrompt}
    
    Previous conversation:
    ${history.map(msg => `${msg.role}: ${msg.content}`).join('\n')}
    
    Student: ${message}
    
    Tutor:`;

    if (!genAI) return tutorFallback();
    const text = await tryGenerateText(prompt);
    const clean = text.replace(/[*#`]/g, "").trim();
    return clean || tutorFallback();
  } catch (error) {
    console.error("Gemini chat failed:", error);
    return tutorFallback();
  }
};

const generateMockQuestions = (subject: string, count: number): Question[] => {
  // Use defined fallback questions if available, otherwise generate generic ones but try to be subject-aware
  const fallbacks = fallbackQuestionsData[subject] || fallbackQuestionsData["default"];
  
  // If we need more questions than we have fallbacks for, cycle through them
  return Array.from({ length: count }).map((_, i) => {
    const template = fallbacks[i % fallbacks.length];
    return {
      ...template,
      id: `fallback-${Date.now()}-${i}`,
      // Add a slight variation to ID/text if reusing templates to avoid complete duplicates in UI keys
      text: i >= fallbacks.length ? `${template.text} (Variation ${Math.floor(i / fallbacks.length)})` : template.text
    };
  });
};
