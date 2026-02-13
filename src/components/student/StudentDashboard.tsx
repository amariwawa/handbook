import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  BookOpen, 
  Trophy, 
  Target, 
  Zap, 
  Clock, 
  ChevronRight, 
  Star,
  Plus,
  Gamepad2,
  CheckCircle2
} from "lucide-react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

const leaderboard = [
  { name: "Bagas Mahpie", score: 1250, avatar: "https://i.pravatar.cc/150?u=bagas" },
  { name: "Sir Dandy", score: 1100, avatar: "https://i.pravatar.cc/150?u=dandy" },
  { name: "Jhon Tosan", score: 950, avatar: "https://i.pravatar.cc/150?u=jhon" },
  { name: "You", score: 820, avatar: "https://github.com/shadcn.png", isMe: true },
];

const subjects = [
  { id: 1, name: "Mathematics", icon: "📐", progress: 65, color: "bg-blue-500" },
  { id: 2, name: "English", icon: "📚", progress: 40, color: "bg-purple-500" },
  { id: 3, name: "Physics", icon: "⚛️", progress: 25, color: "bg-amber-500" },
  { id: 4, name: "Biology", icon: "🧬", progress: 80, color: "bg-emerald-500" },
];

const StudentDashboard = () => {
  const [selectedSubjects, setSelectedSubjects] = useState([1, 2]);

  const toggleSubject = (id: number) => {
    setSelectedSubjects(prev => 
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  };

  return (
    <div className="grid gap-8 lg:grid-cols-3">
      <div className="lg:col-span-2 space-y-8">
        {/* Hero Banner */}
        <div className="relative h-56 bg-[#6366F1] rounded-3xl overflow-hidden p-10 flex flex-col justify-center text-white">
          <div className="z-10 max-w-md">
            <h2 className="text-3xl font-bold mb-3">Sharpen Your Skills with AI Learning</h2>
            <p className="text-indigo-100/80 mb-6">Continue your journey to master WAEC & JAMB with your personal AI tutor.</p>
            <Button className="bg-white text-[#6366F1] hover:bg-indigo-50 rounded-xl font-bold px-8 py-6 h-auto">
              Continue Learning <ChevronRight className="ml-2 w-5 h-5" />
            </Button>
          </div>
          <div className="absolute right-0 top-0 w-1/2 h-full bg-gradient-to-l from-white/10 to-transparent pointer-events-none flex items-center justify-center">
            <SparklesIcon className="w-40 h-40 text-white/20" />
          </div>
        </div>

        {/* My Subjects Section */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-slate-900">My Subjects</h3>
            <Button variant="ghost" className="text-primary font-bold">See All</Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {subjects.map((subject) => (
              <Card 
                key={subject.id} 
                className={`rounded-2xl border-none shadow-sm cursor-pointer transition-all hover:ring-2 hover:ring-primary/20 ${
                  selectedSubjects.includes(subject.id) ? 'bg-white' : 'bg-slate-50 opacity-60'
                }`}
                onClick={() => toggleSubject(subject.id)}
              >
                <CardContent className="p-4 flex items-center gap-4">
                  <div className={`w-12 h-12 ${subject.color} rounded-xl flex items-center justify-center text-2xl shadow-lg shadow-primary/10`}>
                    {subject.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-bold text-slate-900">{subject.name}</p>
                      <p className="text-xs font-bold text-slate-400">{subject.progress}%</p>
                    </div>
                    <Progress value={subject.progress} className="h-1.5" />
                  </div>
                  {selectedSubjects.includes(subject.id) ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                  ) : (
                    <Plus className="w-5 h-5 text-slate-300" />
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Continue Learning / Last Task */}
        <section>
          <h3 className="text-xl font-bold text-slate-900 mb-6">Continue Learning</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="rounded-3xl border-none shadow-sm overflow-hidden group">
              <div className="aspect-video bg-slate-100 relative">
                <img 
                  src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=60" 
                  alt="Lesson" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4 px-3 py-1 bg-white/90 backdrop-blur rounded-lg text-[10px] font-bold uppercase tracking-wider text-primary">
                  Mathematics
                </div>
              </div>
              <CardContent className="p-5">
                <h4 className="font-bold text-slate-900 mb-2">Quadratic Equations Mastery</h4>
                <div className="flex items-center gap-4 text-xs text-slate-400">
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> 45 mins</span>
                  <span className="flex items-center gap-1"><Star className="w-3 h-3 text-amber-400" /> 4.9</span>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-3xl border-none shadow-sm overflow-hidden group">
              <div className="aspect-video bg-slate-100 relative">
                <img 
                  src="https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800&auto=format&fit=crop&q=60" 
                  alt="Lesson" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4 px-3 py-1 bg-white/90 backdrop-blur rounded-lg text-[10px] font-bold uppercase tracking-wider text-purple-600">
                  English
                </div>
              </div>
              <CardContent className="p-5">
                <h4 className="font-bold text-slate-900 mb-2">Effective Comprehension</h4>
                <div className="flex items-center gap-4 text-xs text-slate-400">
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> 30 mins</span>
                  <span className="flex items-center gap-1"><Star className="w-3 h-3 text-amber-400" /> 4.8</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>

      {/* Right Sidebar */}
      <div className="space-y-8">
        {/* Statistics Card */}
        <Card className="rounded-3xl border-none shadow-sm p-6">
          <CardHeader className="p-0 mb-6 flex flex-row items-center justify-between">
            <CardTitle className="text-lg font-bold">Statistic</CardTitle>
            <Button variant="ghost" size="icon" className="text-slate-400">
              <ChevronRight className="w-5 h-5" />
            </Button>
          </CardHeader>
          <CardContent className="p-0 space-y-8">
            <div className="relative flex flex-col items-center justify-center">
              <div className="w-32 h-32">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={[{ value: 82 }, { value: 18 }]}
                      innerRadius={45}
                      outerRadius={60}
                      paddingAngle={5}
                      dataKey="value"
                      startAngle={90}
                      endAngle={450}
                    >
                      <Cell fill="#6366F1" />
                      <Cell fill="#F1F5F9" />
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="absolute inset-0 flex flex-col items-center justify-center pt-2">
                <span className="text-2xl font-bold text-slate-900">82%</span>
                <span className="text-[10px] text-slate-400 uppercase font-bold tracking-tighter">Overall</span>
              </div>
              <div className="mt-4 text-center">
                <p className="font-bold text-slate-900">Good Morning Jason 🔥</p>
                <p className="text-xs text-slate-400 mt-1">Continue your learning to achieve your target!</p>
              </div>
            </div>

            <div className="h-40">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={[
                  { name: '1-10', val: 40 },
                  { name: '11-20', val: 30 },
                  { name: '21-30', val: 60 },
                ]}>
                  <XAxis dataKey="name" hide />
                  <YAxis hide />
                  <Tooltip cursor={{fill: 'transparent'}} content={() => null} />
                  <Bar dataKey="val" fill="#6366F1" radius={[4, 4, 4, 4]} barSize={20} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Leaderboard Section */}
        <Card className="rounded-3xl border-none shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold">Leaderboard</h3>
            <Button variant="ghost" size="icon" className="text-primary">
              <Plus className="w-5 h-5" />
            </Button>
          </div>
          <div className="space-y-4">
            {leaderboard.map((item, i) => (
              <div key={i} className={`flex items-center gap-3 p-2 rounded-2xl transition-colors ${item.isMe ? 'bg-indigo-50/50 ring-1 ring-indigo-100' : ''}`}>
                <div className="relative">
                  <Avatar className="w-10 h-10 border-2 border-white shadow-sm">
                    <AvatarImage src={item.avatar} />
                    <AvatarFallback>{item.name[0]}</AvatarFallback>
                  </Avatar>
                  {i < 3 && (
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-amber-400 rounded-full flex items-center justify-center text-[8px] text-white font-bold border border-white">
                      {i + 1}
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-slate-900 truncate">{item.name}</p>
                  <p className="text-[10px] text-slate-400 uppercase font-bold">{item.score} Points</p>
                </div>
                <Button variant="ghost" size="sm" className="text-primary font-bold text-[10px]">Follow</Button>
              </div>
            ))}
            <Button variant="outline" className="w-full rounded-xl text-slate-500 border-slate-200 text-xs font-bold py-5">
              See All Friends
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

const SparklesIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
  </svg>
);

export default StudentDashboard;
