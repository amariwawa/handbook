import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { generateContent } from "@/lib/gemini";
import { 
  Users, 
  BookOpen, 
  Sparkles, 
  FileText, 
  MessageSquare, 
  TrendingUp, 
  Plus, 
  Search,
  ChevronRight,
  BrainCircuit,
  GraduationCap,
  Loader2,
  CheckSquare
} from "lucide-react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line
} from "recharts";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/avatar";
import { motion } from "framer-motion";

const performanceData = [
  { name: 'Mon', score: 65 },
  { name: 'Tue', score: 72 },
  { name: 'Wed', score: 68 },
  { name: 'Thu', score: 85 },
  { name: 'Fri', score: 78 },
];

const students = [
  { name: "Adewale Chen", progress: 85, lastTopic: "Algebra", status: "On Track" },
  { name: "Chisom Okafor", progress: 42, lastTopic: "Genetics", status: "Needs Help" },
  { name: "Fatima Musa", progress: 92, lastTopic: "Mechanics", status: "Excelling" },
];

const TeacherDashboard = () => {
  const [aiResult, setAiResult] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTool, setActiveTool] = useState<string | null>(null);

  const handleAiTool = async (tool: string) => {
    setIsLoading(true);
    setActiveTool(tool);
    setAiResult(null);

    let prompt = "";
    if (tool === "lesson-note") {
      prompt = "Generate a detailed lesson note template for a Nigerian secondary school teacher. Include: Topic, Objectives, Introduction, Body (divided into periods), Summary, and Assessment. Leave placeholders for the specific subject and topic.";
    } else if (tool === "research") {
      prompt = "You are a research assistant for a Nigerian secondary school teacher. Provide a list of 5 high-quality academic resources or websites that can help a teacher stay updated with modern teaching methodologies and Nigerian curriculum changes.";
    } else if (tool === "quiz") {
      prompt = "Generate a template for a 10-question multiple choice quiz for a Nigerian secondary school class. Include placeholders for subject and topic, and provide a sample question to show the format.";
    }

    try {
      const response = await generateContent(prompt);
      setAiResult(response);
    } catch (error) {
      console.error("AI Tool Error:", error);
      setAiResult("Sorry, I couldn't generate the content right now. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Hero Banner for Teacher */}
      <div className="relative h-48 bg-emerald-600 rounded-3xl overflow-hidden p-8 flex items-center">
        <div className="z-10 max-w-md">
          <h2 className="text-3xl font-bold text-white mb-2">Welcome Back, Instructor</h2>
          <p className="text-emerald-50/80">Manage your classrooms, generate AI lesson notes, and track student performance.</p>
          <div className="mt-4 flex gap-3">
            <Button className="bg-white text-emerald-600 hover:bg-emerald-50 font-bold rounded-xl">
              <Plus className="w-4 h-4 mr-2" /> New Lesson
            </Button>
            <Button variant="outline" className="bg-emerald-700/30 border-emerald-400/30 text-white hover:bg-emerald-700/50 font-bold rounded-xl">
              AI Note Generator
            </Button>
          </div>
        </div>
        <div className="absolute right-0 top-0 w-64 h-full opacity-10 pointer-events-none">
          <GraduationCap className="w-full h-full p-4 text-white" />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Class Performance Chart */}
        <Card className="md:col-span-2 rounded-3xl border-none shadow-sm p-6">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Class Performance</h3>
              <p className="text-sm text-slate-400">Average test scores this week</p>
            </div>
            <select className="bg-slate-50 border-none rounded-lg text-xs font-bold px-3 py-2 text-slate-500 focus:ring-0">
              <option>Mathematics SS3</option>
              <option>Physics SS3</option>
            </select>
          </div>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94A3B8', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94A3B8', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Line type="monotone" dataKey="score" stroke="#10B981" strokeWidth={4} dot={{fill: '#10B981', r: 4}} activeDot={{r: 8}} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* AI Tools Card */}
        <Card className="rounded-3xl border-none shadow-sm p-6 bg-slate-900 text-white">
          <div className="mb-6">
            <div className="w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center mb-4">
              <BrainCircuit className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-bold">AI Assistant</h3>
            <p className="text-slate-400 text-sm">Empower your teaching with AI</p>
          </div>
          <div className="space-y-3">
            <Button 
              onClick={() => handleAiTool("lesson-note")}
              disabled={isLoading}
              className="w-full justify-start bg-slate-800 hover:bg-slate-700 text-white border-none rounded-xl h-12 px-4 group"
            >
              <FileText className="w-4 h-4 mr-3 text-emerald-500" />
              <span className="text-sm font-medium">
                {isLoading && activeTool === "lesson-note" ? "Generating..." : "Generate Lesson Note"}
              </span>
              {isLoading && activeTool === "lesson-note" ? (
                <Loader2 className="w-4 h-4 ml-auto animate-spin" />
              ) : (
                <ChevronRight className="w-4 h-4 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
              )}
            </Button>
            <Button 
              onClick={() => handleAiTool("research")}
              disabled={isLoading}
              className="w-full justify-start bg-slate-800 hover:bg-slate-700 text-white border-none rounded-xl h-12 px-4 group"
            >
              <Sparkles className="w-4 h-4 mr-3 text-purple-500" />
              <span className="text-sm font-medium">
                {isLoading && activeTool === "research" ? "Researching..." : "Research Assistant"}
              </span>
              {isLoading && activeTool === "research" ? (
                <Loader2 className="w-4 h-4 ml-auto animate-spin" />
              ) : (
                <ChevronRight className="w-4 h-4 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
              )}
            </Button>
            <Button 
              onClick={() => handleAiTool("quiz")}
              disabled={isLoading}
              className="w-full justify-start bg-slate-800 hover:bg-slate-700 text-white border-none rounded-xl h-12 px-4 group"
            >
              <CheckSquare className="w-4 h-4 mr-3 text-amber-500" />
              <span className="text-sm font-medium">
                {isLoading && activeTool === "quiz" ? "Creating..." : "Create Quiz/Exam"}
              </span>
              {isLoading && activeTool === "quiz" ? (
                <Loader2 className="w-4 h-4 ml-auto animate-spin" />
              ) : (
                <ChevronRight className="w-4 h-4 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
              )}
            </Button>
          </div>

          {aiResult && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 p-4 bg-slate-800 rounded-2xl border border-slate-700"
            >
              <div className="flex justify-between items-center mb-2">
                <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">AI Generated Response</span>
                <Button variant="ghost" size="sm" className="h-6 text-[10px] text-slate-400" onClick={() => setAiResult(null)}>Clear</Button>
              </div>
              <div className="text-xs text-slate-300 leading-relaxed whitespace-pre-wrap max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                {aiResult}
              </div>
            </motion.div>
          )}
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Student Tracking Table */}
        <Card className="md:col-span-2 rounded-3xl border-none shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-50 flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-900">Student Tracking</h3>
            <Button variant="ghost" className="text-primary font-bold text-sm">View All</Button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/50">
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Student</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Progress</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {students.map((student, i) => (
                  <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="w-8 h-8">
                          <AvatarFallback>{student.name[0]}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-bold text-slate-900">{student.name}</p>
                          <p className="text-[10px] text-slate-400">Last: {student.lastTopic}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="w-32">
                        <div className="flex justify-between mb-1">
                          <span className="text-[10px] font-bold text-slate-400">{student.progress}%</span>
                        </div>
                        <Progress value={student.progress} className="h-1" />
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-lg text-[9px] font-bold uppercase tracking-wider ${
                        student.status === 'Excelling' ? 'bg-emerald-50 text-emerald-600' : 
                        student.status === 'Needs Help' ? 'bg-rose-50 text-rose-600' : 'bg-blue-50 text-blue-600'
                      }`}>
                        {student.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Button variant="ghost" size="sm" className="text-primary font-bold">Message</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Group Chat Preview */}
        <Card className="rounded-3xl border-none shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-slate-900">Teacher's Lounge</h3>
            <span className="px-2 py-0.5 bg-rose-500 text-white text-[10px] font-bold rounded-full">3 New</span>
          </div>
          <div className="space-y-4">
            {[
              { name: "Principal Okoro", msg: "Meeting at 2pm in the lounge", time: "10:45 AM" },
              { name: "Mrs. Adebayo", msg: "The new AI notes are amazing!", time: "9:30 AM" },
              { name: "Mr. Ibrahim", msg: "Physics lab results are out", time: "Yesterday" },
            ].map((chat, i) => (
              <div key={i} className="flex gap-3 cursor-pointer hover:bg-slate-50 p-2 rounded-xl transition-colors">
                <Avatar className="w-10 h-10 border-2 border-white shadow-sm">
                  <AvatarFallback>{chat.name[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between mb-0.5">
                    <p className="text-xs font-bold text-slate-900 truncate">{chat.name}</p>
                    <span className="text-[9px] text-slate-400 whitespace-nowrap">{chat.time}</span>
                  </div>
                  <p className="text-[11px] text-slate-500 truncate">{chat.msg}</p>
                </div>
              </div>
            ))}
            <Button className="w-full rounded-xl bg-slate-50 text-primary hover:bg-slate-100 border-none font-bold py-5 mt-2">
              Open Group Chat
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default TeacherDashboard;
