import React, { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { generateQuestions, generateContent } from "@/lib/gemini";
import { 
  BookOpen, 
  FileText, 
  Sparkles, 
  ChevronRight, 
  ChevronLeft,
  CheckCircle2,
  XCircle,
  MessageSquare,
  Volume2,
  BrainCircuit,
  Loader2,
  RefreshCw
} from "lucide-react";
import { 
  LayoutDashboard, 
  Gamepad2
} from "lucide-react";

const studentNavItems = [
  { name: "Dashboard", icon: LayoutDashboard, href: "/student-suite" },
  { name: "My Subjects", icon: BookOpen, href: "/student-suite/subjects" },
  { name: "Class AI", icon: Sparkles, href: "/student-suite/class" },
  { name: "Past Questions", icon: FileText, href: "/student-suite/past-questions" },
  { name: "Games", icon: Gamepad2, href: "/student-suite/games" },
  { name: "Inbox", icon: MessageSquare, href: "/student-suite/inbox" },
];

interface Question {
  id: number;
  subject: string;
  text: string;
  options: string[];
  correct: string;
  explanation: string;
  followUp: string;
}

const StudentPastQuestions = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [subject, setSubject] = useState("Mathematics");
  const [topic, setTopic] = useState("Algebra");
  const [aiChat, setAiChat] = useState("");
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [chatMessages, setChatMessages] = useState<{ role: "user" | "ai"; content: string }[]>([]);

  const fetchQuestions = async () => {
    setIsLoading(true);
    const newQuestions = await generateQuestions(subject, topic, 10);
    if (newQuestions && newQuestions.length > 0) {
      setQuestions(newQuestions);
      setCurrentIdx(0);
      setSelectedOption(null);
      setShowExplanation(false);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  const handleNext = () => {
    if (currentIdx < questions.length - 1) {
      setCurrentIdx(currentIdx + 1);
      setSelectedOption(null);
      setShowExplanation(false);
    }
  };

  const handlePrev = () => {
    if (currentIdx > 0) {
      setCurrentIdx(currentIdx - 1);
      setSelectedOption(null);
      setShowExplanation(false);
    }
  };

  const handleAiChat = async () => {
    if (!aiChat.trim() || isChatLoading) return;
    
    const userMsg = aiChat;
    setAiChat("");
    setChatMessages(prev => [...prev, { role: "user", content: userMsg }]);
    setIsChatLoading(true);
    
    const prompt = `Student is asking about this question: "${questions[currentIdx].text}". 
    The correct answer is ${questions[currentIdx].correct}. 
    Previous conversation: ${chatMessages.map(m => `${m.role}: ${m.content}`).join("\n")}
    Student question: ${userMsg}`;
    
    const response = await generateContent(prompt);
    setChatMessages(prev => [...prev, { role: "ai", content: response }]);
    setIsChatLoading(false);
  };

  const currentQuestion = questions[currentIdx];

  return (
    <DashboardLayout 
      navItems={studentNavItems} 
      userType="Student"
    >
      <div className="grid gap-8 lg:grid-cols-3 h-[calc(100vh-160px)]">
        {/* Question Area */}
        <div className="lg:col-span-2 space-y-6 overflow-y-auto pr-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-50 text-primary rounded-xl">
                <FileText className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-bold text-slate-900">Past Questions AI</h2>
            </div>
            <div className="flex items-center gap-4">
              <select 
                value={subject} 
                onChange={(e) => setSubject(e.target.value)}
                className="bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                <option>Mathematics</option>
                <option>English</option>
                <option>Physics</option>
                <option>Chemistry</option>
                <option>Biology</option>
              </select>
              <Button 
                size="sm" 
                onClick={fetchQuestions} 
                disabled={isLoading}
                className="rounded-lg bg-primary/10 text-primary hover:bg-primary/20"
              >
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
              </Button>
              {!isLoading && questions.length > 0 && (
                <span className="text-sm font-bold text-slate-400">Question {currentIdx + 1} of {questions.length}</span>
              )}
            </div>
          </div>

          {isLoading ? (
            <div className="h-[400px] flex flex-col items-center justify-center space-y-4">
              <Loader2 className="w-12 h-12 text-primary animate-spin" />
              <p className="text-slate-500 font-medium animate-pulse">AI is generating your questions...</p>
            </div>
          ) : questions.length > 0 ? (
            <Card className="rounded-3xl border-none shadow-sm p-8">
              <div className="mb-8">
                <span className="px-3 py-1 bg-indigo-50 text-primary text-[10px] font-bold uppercase tracking-wider rounded-lg mb-4 inline-block">
                  {currentQuestion.subject}
                </span>
                <h3 className="text-xl font-medium text-slate-800 leading-relaxed">
                  {currentQuestion.text}
                </h3>
              </div>

              <div className="space-y-4">
                {currentQuestion.options.map((option, i) => {
                  const optionLetter = String.fromCharCode(65 + i); // A, B, C, D
                  const isCorrect = optionLetter === currentQuestion.correct || option === currentQuestion.correct;
                  const isSelected = option === selectedOption;
                  
                  let bgColor = "bg-slate-50 border-slate-100";
                  if (selectedOption) {
                    if (isCorrect) bgColor = "bg-emerald-50 border-emerald-200 text-emerald-700";
                    else if (isSelected) bgColor = "bg-rose-50 border-rose-200 text-rose-700";
                  }

                  return (
                    <button
                      key={i}
                      disabled={!!selectedOption}
                      onClick={() => {
                        setSelectedOption(option);
                        setShowExplanation(true);
                      }}
                      className={`w-full text-left p-5 rounded-2xl border-2 transition-all flex items-center justify-between group ${bgColor} ${!selectedOption && 'hover:border-primary/30 hover:bg-white'}`}
                    >
                      <span className="font-medium">{optionLetter}. {option}</span>
                      {selectedOption && isCorrect && <CheckCircle2 className="w-5 h-5 text-emerald-500" />}
                      {selectedOption && isSelected && !isCorrect && <XCircle className="w-5 h-5 text-rose-500" />}
                    </button>
                  );
                })}
              </div>

              <div className="flex justify-between mt-10">
                <Button 
                  variant="ghost" 
                  onClick={handlePrev}
                  disabled={currentIdx === 0}
                  className="rounded-xl font-bold text-slate-500"
                >
                  <ChevronLeft className="w-4 h-4 mr-2" /> Previous
                </Button>
                <Button 
                  onClick={handleNext}
                  disabled={currentIdx === questions.length - 1}
                  className="bg-primary text-white hover:bg-primary/90 rounded-xl font-bold px-8"
                >
                  Next Question <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </Card>
          ) : (
            <div className="h-[400px] flex flex-col items-center justify-center space-y-4">
              <XCircle className="w-12 h-12 text-rose-500" />
              <p className="text-slate-500 font-medium">Failed to generate questions. Please try again.</p>
              <Button onClick={fetchQuestions}>Retry</Button>
            </div>
          )}
        </div>

        {/* AI Tutor Sidebar */}
        <div className="space-y-6">
          <Card className="rounded-3xl border-none shadow-sm bg-slate-900 text-white overflow-hidden h-full flex flex-col">
            <div className="p-6 bg-slate-800/50 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
                  <BrainCircuit className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="font-bold text-sm">AI Tutor</h4>
                  <p className="text-[10px] text-emerald-400 font-bold uppercase">Online</p>
                </div>
              </div>
              <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white">
                <Volume2 className="w-5 h-5" />
              </Button>
            </div>

            <div className="flex-1 p-6 overflow-y-auto space-y-6">
              {chatMessages.length > 0 ? (
                <div className="space-y-4">
                  {chatMessages.map((msg, i) => (
                    <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[85%] p-3 rounded-2xl text-xs ${
                        msg.role === 'user' 
                          ? 'bg-primary text-white rounded-tr-none' 
                          : 'bg-slate-800 text-slate-200 rounded-tl-none border border-slate-700'
                      }`}>
                        {msg.content}
                      </div>
                    </div>
                  ))}
                  {isChatLoading && (
                    <div className="flex justify-start">
                      <div className="bg-slate-800 p-3 rounded-2xl rounded-tl-none border border-slate-700">
                        <Loader2 className="w-3 h-3 animate-spin text-primary" />
                      </div>
                    </div>
                  )}
                </div>
              ) : !showExplanation ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                  <Sparkles className="w-12 h-12 text-slate-700" />
                  <p className="text-slate-500 text-sm italic">Select an answer to see my explanation!</p>
                </div>
              ) : currentQuestion && (
                <>
                  <div className="bg-slate-800/50 rounded-2xl p-5 border border-slate-700">
                    <p className="text-sm text-slate-300 leading-relaxed italic">
                      "{currentQuestion.explanation}"
                    </p>
                  </div>
                  
                  <div className="bg-primary/10 rounded-2xl p-5 border border-primary/20">
                    <p className="text-sm text-primary-foreground font-medium mb-3">
                      {currentQuestion.followUp}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <Button size="sm" className="bg-primary text-white rounded-lg text-xs" onClick={() => handleAiChat()}>Explain more</Button>
                      <Button size="sm" variant="ghost" className="text-slate-400 hover:text-white text-xs" onClick={() => setChatMessages([])}>Clear Chat</Button>
                    </div>
                  </div>
                </>
              )}
            </div>

            <div className="p-4 border-t border-slate-800 shrink-0">
              <div className="relative">
                <input 
                  type="text" 
                  value={aiChat}
                  onChange={(e) => setAiChat(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleAiChat()}
                  placeholder="Ask me anything..." 
                  className="w-full bg-slate-800 border-none rounded-xl py-3 px-4 pr-12 text-sm focus:ring-1 focus:ring-primary"
                />
                <button 
                  onClick={handleAiChat}
                  disabled={isChatLoading}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-primary"
                >
                  {isChatLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ChevronRight className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default StudentPastQuestions;
