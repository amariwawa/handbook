import React from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  Inbox, 
  BookOpen, 
  CheckSquare, 
  Users, 
  Settings, 
  LogOut, 
  Search, 
  Bell, 
  MessageSquare,
  Sparkles,
  Gamepad2,
  FileText,
  UserPlus
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

interface NavItem {
  name: string;
  icon: React.ElementType;
  href: string;
}

interface DashboardLayoutProps {
  children: React.ReactNode;
  navItems: NavItem[];
  userType: "Admin" | "Student" | "Teacher";
  friends?: Array<{ name: string; status: string; avatar?: string }>;
}

export const DashboardLayout = ({ 
  children, 
  navItems, 
  userType,
  friends = [] 
}: DashboardLayoutProps) => {
  const location = useLocation();

  return (
    <div className="flex h-screen bg-[#F8F9FB] text-slate-900 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col">
        <div className="p-6">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="font-display text-xl font-bold tracking-tight">
              HAND<span className="italic text-primary">BOOK</span>
            </span>
          </Link>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-2 space-y-8">
          {/* Overview Section */}
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4 px-2">
              Overview
            </p>
            <nav className="space-y-1">
              {navItems.map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`flex items-center gap-3 px-3 py-2 rounded-xl transition-all duration-200 group ${
                      isActive 
                        ? "bg-primary text-white shadow-lg shadow-primary/20" 
                        : "text-slate-500 hover:bg-slate-50 hover:text-primary"
                    }`}
                  >
                    <item.icon className={`w-5 h-5 ${isActive ? "text-white" : "group-hover:text-primary"}`} />
                    <span className="font-medium text-sm">{item.name}</span>
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Friends Section (Specific to Students/Teachers) */}
          {userType !== "Admin" && (
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4 px-2 flex justify-between items-center">
                Friends
                <button className="text-primary hover:text-primary/80">
                  <UserPlus className="w-4 h-4" />
                </button>
              </p>
              <div className="space-y-3">
                {friends.length > 0 ? (
                  friends.map((friend, i) => (
                    <div key={i} className="flex items-center gap-3 px-2">
                      <Avatar className="w-8 h-8">
                        <AvatarImage src={friend.avatar} />
                        <AvatarFallback>{friend.name[0]}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-700 truncate">{friend.name}</p>
                        <p className="text-[10px] text-slate-400 truncate">{friend.status}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-400 px-2 italic">No friends yet</p>
                )}
              </div>
            </div>
          )}

          {/* Settings Section */}
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4 px-2">
              Settings
            </p>
            <nav className="space-y-1">
              <Link
                to="/settings"
                className="flex items-center gap-3 px-3 py-2 rounded-xl text-slate-500 hover:bg-slate-50 hover:text-primary transition-all"
              >
                <Settings className="w-5 h-5" />
                <span className="font-medium text-sm">Setting</span>
              </Link>
              <button
                className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-rose-500 hover:bg-rose-50 transition-all"
              >
                <LogOut className="w-5 h-5" />
                <span className="font-medium text-sm">Logout</span>
              </button>
            </nav>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-20 bg-white border-b border-slate-200 px-8 flex items-center justify-between shrink-0">
          <div className="w-96 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input 
              placeholder="Search your course...." 
              className="pl-10 bg-slate-50 border-none rounded-xl focus-visible:ring-primary"
            />
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" className="rounded-xl text-slate-500">
                <MessageSquare className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="icon" className="rounded-xl text-slate-500 relative">
                <Bell className="w-5 h-5" />
                <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
              </Button>
            </div>
            
            <div className="h-8 w-px bg-slate-200" />
            
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-slate-900">Jason Ranti</p>
                <p className="text-[10px] font-medium text-slate-400 uppercase tracking-tighter">{userType}</p>
              </div>
              <Avatar className="w-10 h-10 border-2 border-white shadow-sm">
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>JR</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-8">
          {children}
        </div>
      </main>
    </div>
  );
};
