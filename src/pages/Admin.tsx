import { DashboardLayout } from "@/components/layout/DashboardLayout";
import AdminDashboard from "@/components/admin/Dashboard";
import { 
  LayoutDashboard, 
  Users, 
  DollarSign, 
  Database, 
  MessageSquare, 
  Calendar,
  Settings
} from "lucide-react";

const adminNavItems = [
  { name: "Dashboard", icon: LayoutDashboard, href: "/admin" },
  { name: "Users", icon: Users, href: "/admin/users" },
  { name: "Payments", icon: DollarSign, href: "/admin/payments" },
  { name: "Questions", icon: MessageSquare, href: "/admin/questions" },
  { name: "Calendars", icon: Calendar, href: "/admin/calendars" },
  { name: "Database", icon: Database, href: "/admin/database" },
];

const Admin = () => {
  return (
    <DashboardLayout 
      navItems={adminNavItems} 
      userType="Admin"
    >
      <AdminDashboard />
    </DashboardLayout>
  );
};

export default Admin;
