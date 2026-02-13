import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Users, 
  DollarSign, 
  Database, 
  TrendingUp, 
  Activity, 
  MessageSquare, 
  Calendar,
  ChevronRight
} from "lucide-react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from "recharts";

const data = [
  { name: '1-10 Aug', income: 400, users: 240 },
  { name: '11-20 Aug', income: 300, users: 139 },
  { name: '21-30 Aug', income: 600, users: 980 },
];

const AdminDashboard = () => {
  return (
    <div className="space-y-8">
      {/* Hero Banner Style */}
      <div className="relative h-48 bg-primary rounded-3xl overflow-hidden p-8 flex items-center">
        <div className="z-10 max-w-md">
          <h2 className="text-3xl font-bold text-white mb-2">System Overview</h2>
          <p className="text-primary-foreground/80">Track real-time performance, manage users, and monitor financial growth.</p>
          <button className="mt-4 px-6 py-2 bg-white text-primary rounded-xl font-bold text-sm hover:bg-slate-50 transition-colors">
            Generate Report
          </button>
        </div>
        <div className="absolute right-0 top-0 w-64 h-full opacity-20 pointer-events-none">
          <TrendingUp className="w-full h-full p-4" />
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="rounded-2xl border-none shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Monthly Income</CardTitle>
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
              <DollarSign className="w-4 h-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">$24,500</div>
            <p className="text-xs text-emerald-600 font-medium flex items-center gap-1 mt-1">
              +12.5% <TrendingUp className="w-3 h-3" />
              <span className="text-slate-400 font-normal ml-1">from last month</span>
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-none shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Total Users</CardTitle>
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
              <Users className="w-4 h-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">12,842</div>
            <p className="text-xs text-blue-600 font-medium flex items-center gap-1 mt-1">
              +8.2% <Activity className="w-3 h-3" />
              <span className="text-slate-400 font-normal ml-1">active now</span>
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-none shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">AI Questions</CardTitle>
            <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
              <MessageSquare className="w-4 h-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">1,240</div>
            <p className="text-xs text-purple-600 font-medium flex items-center gap-1 mt-1">
              Real-time tracking
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-none shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Database</CardTitle>
            <div className="p-2 bg-amber-50 text-amber-600 rounded-lg">
              <Database className="w-4 h-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">1.2 GB</div>
            <p className="text-xs text-amber-600 font-medium mt-1">
              98% Health
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-8 md:grid-cols-7">
        {/* Income Chart */}
        <Card className="md:col-span-4 rounded-3xl border-none shadow-sm p-6">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Income Statistics</h3>
              <p className="text-sm text-slate-400">Monthly revenue growth</p>
            </div>
            <button className="text-primary text-sm font-bold flex items-center gap-1">
              See All <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94A3B8', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94A3B8', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Area type="monotone" dataKey="income" stroke="#8B5CF6" strokeWidth={3} fillOpacity={1} fill="url(#colorIncome)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* User Activity */}
        <Card className="md:col-span-3 rounded-3xl border-none shadow-sm p-6">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-lg font-bold text-slate-900">User Activity</h3>
              <p className="text-sm text-slate-400">New vs Recurring</p>
            </div>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94A3B8', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94A3B8', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  cursor={{fill: '#F8FAFC'}}
                />
                <Bar dataKey="users" fill="#8B5CF6" radius={[6, 6, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Customer Database / Recent Users */}
      <Card className="rounded-3xl border-none shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-50 flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-900">Customer Database</h3>
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-slate-50 text-slate-600 rounded-xl text-sm font-medium">Export CSV</button>
            <button className="px-4 py-2 bg-primary text-white rounded-xl text-sm font-medium">Add User</button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">User</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Plan</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Last Active</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {[
                { name: "John Doe", email: "john@example.com", status: "Active", plan: "Premium", active: "2 mins ago" },
                { name: "Sarah Smith", email: "sarah@example.com", status: "Active", plan: "Basic", active: "10 mins ago" },
                { name: "Mike Johnson", email: "mike@example.com", status: "Inactive", plan: "Premium", active: "2 days ago" },
              ].map((user, i) => (
                <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center font-bold text-slate-400">
                        {user.name[0]}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900">{user.name}</p>
                        <p className="text-xs text-slate-400">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${
                      user.status === 'Active' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-500'
                    }`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">{user.plan}</td>
                  <td className="px-6 py-4 text-sm text-slate-400">{user.active}</td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 transition-colors">
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default AdminDashboard;
