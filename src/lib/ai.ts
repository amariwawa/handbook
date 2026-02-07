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
  
  const initialNeeded = count - selectedManual.length;
  if (initialNeeded <= 0) {
    return selectedManual.slice(0, count);
  }

  let aiQuestions: Question[] = [];
  
  if (genAI) {
    let attempts = 0;
    const maxAttempts = 3;
    
    // Loop until we have enough questions or run out of attempts
    while (aiQuestions.length < initialNeeded && attempts < maxAttempts) {
        attempts++;
        const currentNeeded = initialNeeded - aiQuestions.length;
        
        try {
          const seed = `${Date.now()}-${Math.random()}`;
          // Request slightly more than needed to be safe
          const requestCount = Math.max(currentNeeded, 2); 
          
          const prompt = `Generate ${requestCount} advanced, difficult multiple choice questions for the subject "${subject}" appropriate for a Senior Secondary School 3 (SS3) / University preparation level student in Nigeria.
          The questions should test deep understanding and critical thinking, not just basic recall. Each question must be distinct and new for this session.
          Randomization token: ${seed}
          
          IMPORTANT: Return the response strictly as a valid JSON array of objects. Do not use markdown.
          Each object:
            {
              "text": "Question text",
              "options": ["A", "B", "C", "D"],
              "correctAnswer": 0, // index of correct option (0-3)
              "explanation": "Detailed, helpful explanation in plain text without markdown."
            }`;
    
          const text = await tryGenerateText(prompt);
          
          const cleanedText = text.replace(/```json/g, '').replace(/```/g, '').trim();
          
          const parsedQuestions = JSON.parse(cleanedText);
          
          const newQuestions = (parsedQuestions as Array<{
            text: string;
            options: string[];
            correctAnswer: number;
            explanation?: string;
          }>).map((q, i: number) => ({
            id: `ai-${Date.now()}-${attempts}-${i}`,
            text: q.text,
            options: q.options,
            correctAnswer: q.correctAnswer,
            explanation: q.explanation
          }));
          
          aiQuestions = [...aiQuestions, ...newQuestions];
          
        } catch (error) {
          console.error(`Gemini generation attempt ${attempts} failed:`, error);
        }
    }
  } else {
    console.warn("No Gemini API key found. Using mock data.");
  }
  
  // If we still don't have enough, fill with mocks
  const totalQuestions = selectedManual.length + aiQuestions.length;
  if (totalQuestions < count) {
    const mocks = generateMockQuestions(subject, count - totalQuestions);
    aiQuestions = [...aiQuestions, ...mocks];
  }
  
  return [...selectedManual, ...aiQuestions].slice(0, count);
};

export const getExplanation = async (question: string, answer: string, isCorrect: boolean, subject: string = "General Knowledge"): Promise<string> => {
  if (genAI) {
     try {
       const prompt = `You are a friendly and encouraging AI tutor for Nigerian students.
    Subject: ${subject}
    
    Your goal is to explain the following question and answer clearly, like a helpful teacher.
    Question: "${question}"
    Student's Answer: "${answer}"
    Status: ${isCorrect ? "CORRECT" : "INCORRECT"}
    
    Instructions:
    1. Start with a warm, natural opening (e.g., "Great job!", "Not quite, but good try!", "That's correct!").
    2. Explain the concept simply. Imagine you are talking to a student in a classroom.
    3. Avoid robotic phrases like "The correct answer is option B because...". Instead say "The reason this is right is..." or "Here's why...".
    4. Keep it concise but educational.
    5. Do NOT use markdown symbols (*, #, etc). Plain text only.
    
    Randomization: ${Date.now()}`;
       const text = await tryGenerateText(prompt);
       const clean = text.replace(/[*#`]/g, "").trim();
       if (!clean) {
         return `That is ${isCorrect ? "correct" : "incorrect"}. Here is the explanation:
         
The key concept here is to understand the specific rules of ${subject}. Review the question carefully and try to recall the fundamental principles.
         
Keep practicing!`;
       }
       return clean;
     } catch (e) {
       console.error("Gemini explanation failed", e);
     }
  }
  
  const localFallback = `That is ${isCorrect ? "correct" : "incorrect"}.

To understand this better:
1. Look at the key terms in the question.
2. Recall the basic definitions.
3. Eliminate the obviously wrong options.

Keep going, you're doing well!`;
  return localFallback;
}

export const getChatResponse = async (message: string, subject: string, history: {role: string, content: string}[], context?: string): Promise<string> => {
  const tutorFallback = (): string => {
    return `I'm having a little trouble connecting right now, but I'm here to help with ${subject}. Could you rephrase your question?`;
  };

  try {
    let contextPrompt = "";
    if (context) {
      contextPrompt = `\nCurrent Activity Context: ${context}`;
    }

    const prompt = `You are "LearnAI", a friendly, enthusiastic, and knowledgeable AI tutor helping a Nigerian student with ${subject}.
    
    Tone & Style:
    - conversational, encouraging, and natural.
    - NEVER use "Thinking..." or robotic intros.
    - Speak like a supportive teacher or smart study buddy.
    - Use clear, simple English.
    
    Context:
    ${contextPrompt}
    
    Conversation History:
    ${history.map(msg => `${msg.role === 'user' ? 'Student' : 'Tutor'}: ${msg.content}`).join('\n')}
    
    Student's New Message: "${message}"
    
    Task:
    - Reply to the student's message.
    - Answer their question or guide them if they are stuck.
    - Keep responses concise (2-3 paragraphs max).
    - Do NOT use markdown formatting (no bold, italics, or code blocks).
    - If they got a question wrong, help them understand why without giving the answer away immediately if they are retrying.
    
    Your Reply:`;

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
