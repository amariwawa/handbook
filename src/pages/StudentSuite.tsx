import { DashboardLayout } from "@/components/layout/DashboardLayout";
import StudentDashboard from "@/components/student/StudentDashboard";
import { 
  LayoutDashboard, 
  BookOpen, 
  CheckSquare, 
  Gamepad2, 
  FileText,
  MessageSquare,
  Sparkles
} from "lucide-react";

const studentNavItems = [
  { name: "Dashboard", icon: LayoutDashboard, href: "/student-suite" },
  { name: "My Subjects", icon: BookOpen, href: "/student-suite/subjects" },
  { name: "Class AI", icon: Sparkles, href: "/student-suite/class" },
  { name: "Past Questions", icon: FileText, href: "/student-suite/past-questions" },
  { name: "Games", icon: Gamepad2, href: "/student-suite/games" },
  { name: "Inbox", icon: MessageSquare, href: "/student-suite/inbox" },
];

const mockFriends = [
  { name: "Bagas Mahpie", status: "Friend", avatar: "https://i.pravatar.cc/150?u=bagas" },
  { name: "Sir Dandy", status: "Old Friend", avatar: "https://i.pravatar.cc/150?u=dandy" },
  { name: "Jhon Tosan", status: "Friend", avatar: "https://i.pravatar.cc/150?u=jhon" },
];

const StudentSuite = () => {
  return (
    <DashboardLayout 
      navItems={studentNavItems} 
      userType="Student"
      friends={mockFriends}
    >
      <StudentDashboard />
    </DashboardLayout>
  );
};

export default StudentSuite;
