
import { supabase } from "./supabase";
import { Question } from "./constants";

export interface QuizResult {
  subject: string;
  score: number;
  totalQuestions: number;
  percentage: number;
  date: string;
}

export interface PaymentRecord {
  plan: string;
  amount: string;
  method: string;
  date: string;
  status: string;
}

// Function to fetch manual questions from the database
export const fetchManualQuestions = async (subject: string): Promise<Question[]> => {
  try {
    const { data, error } = await supabase
      .from('questions')
      .select('id,text,options,correct_answer,explanation')
      .eq('subject', subject)
      .order('created_at', { ascending: false });
    
    if (error) {
        console.warn("Error fetching manual questions (table might not exist yet):", error.message);
        return [];
    }

    const rows = (data || []) as Array<{ id: string | number; text: string; options: string[]; correct_answer: number; explanation?: string }>;
    return rows.map((r) => ({
      id: String(r.id),
      text: r.text,
      options: Array.isArray(r.options) ? r.options : [],
      correctAnswer: Number(r.correct_answer ?? 0),
      explanation: r.explanation ?? undefined
    }));
  } catch (err) {
      console.warn("Error in fetchManualQuestions:", err);
      return [];
  }
};

export const fetchAllQuestions = async (subject: string): Promise<Question[]> => {
  try {
    const { data, error } = await supabase
      .from('questions')
      .select('id,text,options,correct_answer,explanation')
      .eq('subject', subject);
    if (error) {
      console.warn("Error fetching all questions:", error.message);
      return [];
    }
    const rows = (data || []) as Array<{ id: string | number; text: string; options: string[]; correct_answer: number; explanation?: string }>;
    return rows.map((r) => ({
      id: String(r.id),
      text: r.text,
      options: Array.isArray(r.options) ? r.options : [],
      correctAnswer: Number(r.correct_answer ?? 0),
      explanation: r.explanation ?? undefined
    }));
  } catch (err) {
    console.warn("Error in fetchAllQuestions:", err);
    return [];
  }
};

export const bulkInsertQuestions = async (subject: string, items: Question[]): Promise<{ inserted: number }> => {
  try {
    const payload = items.map((q) => ({
      subject,
      text: q.text,
      options: q.options,
      correct_answer: q.correctAnswer,
      explanation: q.explanation ?? null,
    }));
    const { error, count } = await supabase
      .from('questions')
      .insert(payload, { count: 'planned' });
    if (error) {
      throw error;
    }
    return { inserted: payload.length };
  } catch (err) {
    console.warn("Bulk insert failed:", err);
    return { inserted: 0 };
  }
};

// Function to save quiz results
export const saveQuizResult = async (result: QuizResult) => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  try {
    const { error } = await supabase.from('quiz_results').insert({ 
        user_id: user.id,
        subject: result.subject,
        score: result.score,
        total_questions: result.totalQuestions,
        percentage: result.percentage
    });
    
    if (error) throw error;
    console.log("Quiz result saved to DB");
  } catch (error) {
    console.warn("Failed to save result to DB (check if table exists):", error);
    // Fallback log
    console.log("Mock Save:", { ...result, user_id: user.id });
  }
};

// Function to record a payment
export const recordPayment = async (payment: PaymentRecord) => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  try {
    const { error } = await supabase.from('payments').insert({ 
        user_id: user.id,
        plan: payment.plan,
        amount: payment.amount,
        method: payment.method,
        status: payment.status
    });

    if (error) throw error;
    console.log("Payment recorded in DB");
  } catch (error) {
    console.warn("Failed to record payment in DB (check if table exists):", error);
    // Fallback log
    console.log("Mock Payment:", { ...payment, user_id: user.id });
  }
};
