import { useEffect, useMemo, useState } from "react";
import { MessageCircle, X, Send } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { getChatResponse, hasGemini } from "@/lib/ai";

type ChatMsg = { role: "user" | "assistant"; content: string };

const siteContext = `
Handbook Nigeria web app
Sections: Home, Subjects, Pricing, About, Donate, Admin, Category pages, Subject pages.
Key features:
- AI Tutor in subjects with explanations and plain text formatting
- Pricing plans: Basic ₦3,500, Premium ₦9,000, Enterprise ₦30,000
- Admin dashboard supports PDF upload of WAEC past questions
- Donate page: supports improved AI, school suite, teacher packages
Navigation: Top navbar with links; Home sections include Hero, Subjects, Features, Pricing.
Routes: /, /auth, /subject/:subjectId, /category/:categoryId, /categories, /donate, /admin
Guidance expectation: Help users find content, explain features, and suggest next actions.
Formatting: No markdown or symbols; use natural paragraphs.
`;

const ChatbotWidget = () => {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [history, setHistory] = useState<ChatMsg[]>([
    {
      role: "assistant",
      content:
        "Hi! I’m the Handbook assistant. Ask me anything about the site. I can guide you to subjects, pricing, donate info, or help you get started.",
    },
  ]);

  const subject = useMemo(() => "Handbook Nigeria", []);

  const send = async () => {
    const msg = input.trim();
    if (!msg) return;
    setInput("");
    setHistory((h) => [...h, { role: "user", content: msg }]);
    setBusy(true);
    try {
      const text = await getChatResponse(
        msg,
        subject,
        history.map((m) => ({ role: m.role, content: m.content })),
        siteContext
      );
      setHistory((h) => [...h, { role: "assistant", content: text }]);
    } catch {
      setHistory((h) => [
        ...h,
        {
          role: "assistant",
          content:
            "I can help you navigate the app. Try asking about subjects, pricing, the donate page, or how to start learning.",
        },
      ]);
    } finally {
      setBusy(false);
    }
  };

  useEffect(() => {
    if (!hasGemini()) {
      setHistory((h) => [
        ...h,
        {
          role: "assistant",
          content:
            "Note: AI is running in fallback mode. I’ll still guide you using the site’s context.",
        },
      ]);
    }
  }, []);

  return (
    <>
      <button
        aria-label="Open chat"
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-50 glass-strong w-12 h-12 rounded-full flex items-center justify-center"
      >
        <MessageCircle className="w-5 h-5 text-primary" />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            transition={{ duration: 0.25 }}
            className="fixed bottom-24 right-6 z-50 w-[92vw] max-w-sm glass-strong rounded-2xl shadow-xl"
          >
            <div className="p-3 flex items-center justify-between">
              <span className="font-display font-semibold">Assistant</span>
              <button onClick={() => setOpen(false)} className="w-8 h-8 flex items-center justify-center">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="h-px bg-white/10" />
            <div className="p-3 max-h-[50vh] overflow-y-auto space-y-3">
              {history.map((m, i) => (
                <div
                  key={i}
                  className={`rounded-2xl px-3 py-2 text-sm ${
                    m.role === "user" ? "bg-white/10 ml-auto max-w-[80%]" : "bg-white/5 mr-auto max-w-[85%]"
                  }`}
                >
                  {m.content}
                </div>
              ))}
            </div>
            <div className="h-px bg-white/10" />
            <div className="p-3 flex gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about Handbook…"
                className="flex-1 glass rounded-xl px-3 py-2 text-sm"
              />
              <button
                onClick={send}
                disabled={busy}
                className="btn-primary px-4 py-2 rounded-xl flex items-center gap-1 text-sm"
              >
                <Send className="w-4 h-4" />
                Send
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ChatbotWidget;
