
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { generateQuestions, getExplanation, getChatResponse, testGeminiConnectivity } from "@/lib/ai";
import { Question } from "@/lib/constants";
import { saveQuizResult } from "@/lib/db";
import { Loader2, CheckCircle2, XCircle, Send, Bot, User, Volume2, StopCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { subjectData } from "@/lib/constants";

const Subject = () => {
  const { subjectId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [explanation, setExplanation] = useState("");
  const [score, setScore] = useState(0);
  const [quizComplete, setQuizComplete] = useState(false);
  
  // Chat State
  const [chatMessage, setChatMessage] = useState("");
  const [chatHistory, setChatHistory] = useState<{role: string, content: string}[]>([
    { role: "model", content: "Hello! I'm your AI tutor. Ask me anything about this subject or the questions you just answered." }
  ]);
  const [chatLoading, setChatLoading] = useState(false);
  const [aiReady, setAiReady] = useState<boolean>(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<SpeechSynthesisVoice | null>(null);

  useEffect(() => {
    const loadVoices = () => {
      const list = window.speechSynthesis.getVoices();
      setVoices(list);
      const preferred =
        list.find(v => (v.lang || '').toLowerCase().includes('en-ng')) ||
        list.find(v => v.name.toLowerCase().includes('english') && v.name.toLowerCase().includes('female')) ||
        list.find(v => (v.lang || '').toLowerCase().includes('en-gb')) ||
        list.find(v => (v.lang || '').toLowerCase().includes('en-us')) ||
        list[0] || null;
      setSelectedVoice(preferred);
    };
    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
  }, []);

  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      
      if (isSpeaking) {
        setIsSpeaking(false);
        return;
      }

      const cleanText = text.replace(/[*#_`~]/g, '');
      const utterance = new SpeechSynthesisUtterance(cleanText);
      if (selectedVoice) {
        utterance.voice = selectedVoice;
        utterance.lang = selectedVoice.lang || 'en-US';
      }
      utterance.rate = 0.95;
      utterance.pitch = 1.0;
      utterance.volume = 1.0;
      
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      
      setIsSpeaking(true);
      window.speechSynthesis.speak(utterance);
    }
  };

  // Decode subject ID from URL (e.g. "Basic%20Science" -> "Basic Science")
  const subjectName = decodeURIComponent(subjectId || "Subject");
  
  // Find subject image
  const subjectInfo = Object.values(subjectData).flat().find(s => s.name === subjectName);
  const subjectImage = subjectInfo?.image;

  useEffect(() => {
    const loadQuestions = async () => {
      setLoading(true);
      try {
        const data = await generateQuestions(subjectName, 15);
        setQuestions(data);
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load questions.",
        });
      } finally {
        setLoading(false);
      }
    };

    if (subjectName) {
      loadQuestions();
    }
    (async () => {
      const ok = await testGeminiConnectivity();
      setAiReady(ok);
    })();
  }, [subjectName, toast]);

  const handleAnswerSelect = (index: number) => {
    if (showExplanation) return; // Prevent changing answer after submission
    setSelectedAnswer(index);
  };

  const handleSubmitAnswer = async () => {
    if (selectedAnswer === null) return;

    const currentQuestion = questions[currentQuestionIndex];
    const isCorrect = selectedAnswer === currentQuestion.correctAnswer;

    if (isCorrect) {
      setScore((prev) => prev + 1);
      toast({
        title: "Correct!",
        className: "bg-green-500 text-white",
      });
    } else {
      toast({
        title: "Incorrect",
        variant: "destructive",
      });
    }

    // Get AI explanation
    const aiExplanation = await getExplanation(
      currentQuestion.text,
      currentQuestion.options[selectedAnswer],
      isCorrect
    );
    setExplanation(aiExplanation);
    setShowExplanation(true);
  };

  const handleNextQuestion = async () => {
    setSelectedAnswer(null);
    setShowExplanation(false);
    setExplanation("");
    
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      setQuizComplete(true);
      await saveQuizResult({
        subject: subjectName,
        score,
        totalQuestions: questions.length,
        percentage: (score / questions.length) * 100,
        date: new Date().toISOString()
      });
    }
  };

  const handleChatSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatMessage.trim() || chatLoading) return;

    const userMsg = { role: "user", content: chatMessage };
    setChatHistory(prev => [...prev, userMsg]);
    setChatMessage("");
    setChatLoading(true);

    try {
      // Prepare context about the current quiz state
      const currentQuestion = questions[currentQuestionIndex];
      let context = "";
      if (currentQuestion) {
        context = `The student is currently on Question ${currentQuestionIndex + 1}: "${currentQuestion.text}".`;
        if (selectedAnswer !== null) {
          const answerText = currentQuestion.options[selectedAnswer];
          const isCorrect = selectedAnswer === currentQuestion.correctAnswer;
          context += ` They selected "${answerText}" which is ${isCorrect ? "CORRECT" : "INCORRECT"}.`;
        }
      }

      const response = await getChatResponse(userMsg.content, subjectName, chatHistory, context);
      
      setChatHistory(prev => [...prev, { role: "model", content: response }]);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Chat Error",
        description: "Failed to get response from AI tutor.",
      });
    } finally {
      setChatLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="mt-4 text-muted-foreground">Generating questions with AI...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Header with Image */}
      <div className="relative h-[300px] w-full overflow-hidden mb-12">
        {subjectImage && (
          <img 
            src={subjectImage} 
            alt={subjectName} 
            className="absolute inset-0 w-full h-full object-cover"
          />
        )}
        <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
          <div className="text-center text-white p-4">
             <h1 className="text-4xl md:text-5xl font-bold mb-4">{subjectName}</h1>
             <p className="text-xl text-gray-200">AI-Powered Past Questions & Answers</p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 pb-24">
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            {!quizComplete ? (
                <div className="max-w-3xl mx-auto">
                    <div className="flex justify-between items-center mb-4 text-sm font-medium">
                        <span>Question {currentQuestionIndex + 1} of {questions.length}</span>
                        <span>Score: {score}</span>
                    </div>
                    
                    {/* Progress Bar */}
                    <div className="w-full bg-secondary h-2 rounded-full mb-8">
                        <div 
                            className="bg-primary h-2 rounded-full transition-all duration-300" 
                            style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
                        />
                    </div>

                    <Card className="border-2">
                        <CardHeader>
                            <CardTitle className="text-xl leading-relaxed">
                                {questions[currentQuestionIndex]?.text}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {questions[currentQuestionIndex]?.options.map((option, index) => (
                                <div 
                                    key={index}
                                    onClick={() => handleAnswerSelect(index)}
                                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 flex items-center justify-between
                                        ${selectedAnswer === index ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'}
                                        ${showExplanation && index === questions[currentQuestionIndex].correctAnswer ? 'border-green-500 bg-green-50' : ''}
                                        ${showExplanation && selectedAnswer === index && index !== questions[currentQuestionIndex].correctAnswer ? 'border-red-500 bg-red-50' : ''}
                                    `}
                                >
                                    <span className="font-medium">{option}</span>
                                    {showExplanation && index === questions[currentQuestionIndex].correctAnswer && (
                                        <CheckCircle2 className="text-green-500 h-5 w-5" />
                                    )}
                                    {showExplanation && selectedAnswer === index && index !== questions[currentQuestionIndex].correctAnswer && (
                                        <XCircle className="text-red-500 h-5 w-5" />
                                    )}
                                </div>
                            ))}
                        </CardContent>
                        <CardFooter className="flex flex-col gap-4">
                            {!showExplanation ? (
                                <Button 
                                    className="w-full text-lg py-6" 
                                    onClick={handleSubmitAnswer}
                                    disabled={selectedAnswer === null}
                                >
                                    Submit Answer
                                </Button>
                            ) : (
                                <div className="w-full space-y-4">
                                    <div className="bg-secondary/50 p-6 rounded-lg border border-border">
                                        <h3 className="font-bold mb-2 flex items-center gap-2">
                                            <span className="text-primary">AI Explanation</span>
                                        </h3>
                                        <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                                            {explanation}
                                        </p>
                                    </div>
                                    <Button className="w-full text-lg py-6" onClick={handleNextQuestion}>
                                        Next Question
                                    </Button>
                                </div>
                            )}
                        </CardFooter>
                    </Card>
                </div>
            ) : (
                <Card className="max-w-xl mx-auto text-center p-8">
                    <CardHeader>
                        <CardTitle className="text-3xl mb-4">Quiz Complete!</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-6xl font-bold text-primary mb-4">
                            {Math.round((score / questions.length) * 100)}%
                        </div>
                        <p className="text-muted-foreground text-lg mb-8">
                            You scored {score} out of {questions.length} questions correctly.
                        </p>
                        <div className="flex gap-4 justify-center">
                            <Button variant="outline" onClick={() => navigate('/')}>
                                Back to Subjects
                            </Button>
                            <Button onClick={() => window.location.reload()}>
                                Try Again
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            )}

            

            {/* AI Tutor Chat Section */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="max-w-3xl mx-auto mt-12 mb-20"
            >
              <Card className="border-primary/20 shadow-lg">
                <CardHeader className="bg-primary/5 border-b">
                  <div className="flex items-center gap-3">
                    <div className="bg-primary p-2 rounded-full">
                      <Bot className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-xl">AI Subject Tutor</CardTitle>
                      <p className="text-sm text-muted-foreground">Ask follow-up questions or clarify concepts</p>
                      <div className="mt-1 text-xs">
                        <span className={aiReady ? "text-green-600" : "text-amber-600"}>
                          {aiReady ? "AI Connected" : "AI Connecting..."}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <ScrollArea className="h-[400px] p-4">
                    <div className="space-y-4">
                      {chatHistory.map((msg, idx) => (
                        <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                          <div 
                            className={`max-w-[80%] p-3 rounded-2xl ${
                              msg.role === 'user' 
                                ? 'bg-primary text-primary-foreground rounded-tr-none' 
                                : 'bg-muted rounded-tl-none'
                            }`}
                          >
                            <p className="text-sm leading-relaxed whitespace-pre-wrap font-sans">{msg.content}</p>
                            {msg.role === 'model' && (
                                <button 
                                    onClick={() => speakText(msg.content)}
                                    className="mt-2 text-xs flex items-center gap-1 text-muted-foreground hover:text-primary transition-colors"
                                >
                                    {isSpeaking ? <StopCircle className="w-3 h-3" /> : <Volume2 className="w-3 h-3" />}
                                    <span>{isSpeaking ? "Stop Speaking" : "Read Aloud"}</span>
                                </button>
                            )}
                          </div>
                        </div>
                      ))}
                      {chatLoading && (
                        <div className="flex justify-start">
                          <div className="bg-muted p-3 rounded-2xl rounded-tl-none flex items-center gap-2">
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span className="text-sm text-muted-foreground">Thinking...</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </ScrollArea>
                </CardContent>
                <CardFooter className="p-4 bg-background border-t">
                  <form onSubmit={handleChatSubmit} className="flex w-full gap-2">
                    <Input 
                      placeholder="Ask a question about this subject..." 
                      value={chatMessage}
                      onChange={(e) => setChatMessage(e.target.value)}
                      disabled={chatLoading}
                      className="flex-1"
                    />
                    <Button type="submit" size="icon" disabled={chatLoading || !chatMessage.trim()}>
                      <Send className="w-4 h-4" />
                    </Button>
                  </form>
                </CardFooter>
              </Card>
            </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Subject;
