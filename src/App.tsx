import { useState, useEffect } from 'react';
import { Layout, Users, Calendar, CreditCard, BarChart3, LogOut, Dumbbell, ShieldCheck, User as UserIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, LineChart, Line } from 'recharts';

// --- Types ---
interface User {
  id: string;
  email: string;
  name: string;
  role: 'ADMIN' | 'TRAINER' | 'MEMBER';
}

// --- Mock Data & Components ---
const STATS = [
  { name: 'Total Members', value: '1,248', icon: Users, color: 'text-blue-500' },
  { name: 'Active Bookings', value: '42', icon: Calendar, color: 'text-green-500' },
  { name: 'Monthly Revenue', value: '$12,450', icon: CreditCard, color: 'text-purple-500' },
  { name: 'Gym Capacity', value: '85%', icon: BarChart3, color: 'text-orange-500' },
];

const CHART_DATA = [
  { name: 'Mon', members: 400, revenue: 2400 },
  { name: 'Tue', members: 300, revenue: 1398 },
  { name: 'Wed', members: 200, revenue: 9800 },
  { name: 'Thu', members: 278, revenue: 3908 },
  { name: 'Fri', members: 189, revenue: 4800 },
  { name: 'Sat', members: 239, revenue: 3800 },
  { name: 'Sun', members: 349, revenue: 4300 },
];

const MOCK_USERS = Array.from({ length: 50 }, (_, i) => ({
  id: `${i + 1}`,
  name: `User ${i + 1}`,
  email: `user${i + 1}@example.com`,
  role: i % 5 === 0 ? 'ADMIN' : i % 3 === 0 ? 'TRAINER' : 'MEMBER',
  status: 'Active',
  joinedAt: new Date(2023, 0, i + 1).toLocaleDateString(),
}));

function UserManagementView() {
  const [search, setSearch] = useState('');
  const [sortField, setSortField] = useState<string>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const filteredUsers = MOCK_USERS.filter(user => 
    user.name.toLowerCase().includes(search.toLowerCase()) ||
    user.email.toLowerCase().includes(search.toLowerCase()) ||
    user.role.toLowerCase().includes(search.toLowerCase())
  ).sort((a, b) => {
    const aValue = (a as any)[sortField];
    const bValue = (b as any)[sortField];
    if (sortOrder === 'asc') return aValue > bValue ? 1 : -1;
    return aValue < bValue ? 1 : -1;
  });

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const paginatedUsers = filteredUsers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const toggleSort = (field: string) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  return (
    <motion.div key="users" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-3xl font-bold tracking-tight text-slate-900">User Management</h2>
        <div className="flex gap-2">
          <div className="relative">
            <input 
              type="text" 
              placeholder="Search users..." 
              value={search}
              onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
              className="w-full sm:w-64 rounded-xl border border-slate-200 bg-white px-4 py-2 pl-10 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
            <Users className="absolute left-3 top-2.5 text-slate-400" size={16} />
          </div>
          <button className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500 transition-all">
            Add User
          </button>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-bold tracking-wider">
              <tr>
                <th className="px-6 py-4 cursor-pointer hover:text-indigo-600 transition-colors" onClick={() => toggleSort('name')}>
                  <div className="flex items-center gap-1">
                    Name {sortField === 'name' && (sortOrder === 'asc' ? '↑' : '↓')}
                  </div>
                </th>
                <th className="px-6 py-4 cursor-pointer hover:text-indigo-600 transition-colors" onClick={() => toggleSort('email')}>
                  <div className="flex items-center gap-1">
                    Email {sortField === 'email' && (sortOrder === 'asc' ? '↑' : '↓')}
                  </div>
                </th>
                <th className="px-6 py-4 cursor-pointer hover:text-indigo-600 transition-colors" onClick={() => toggleSort('role')}>
                  <div className="flex items-center gap-1">
                    Role {sortField === 'role' && (sortOrder === 'asc' ? '↑' : '↓')}
                  </div>
                </th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginatedUsers.map((user) => (
                <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-slate-900">{user.name}</td>
                  <td className="px-6 py-4 text-slate-600">{user.email}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-md text-[10px] font-bold ${
                      user.role === 'ADMIN' ? 'bg-purple-50 text-purple-700' : 
                      user.role === 'TRAINER' ? 'bg-orange-50 text-orange-700' : 
                      'bg-blue-50 text-blue-700'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="flex items-center gap-1.5 text-green-600 font-medium">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-600"></span>
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-indigo-600 font-semibold hover:underline">Edit</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between border-t border-slate-100 bg-white px-6 py-4">
          <div className="text-xs text-slate-500">
            Showing <span className="font-bold text-slate-900">{(currentPage - 1) * itemsPerPage + 1}</span> to <span className="font-bold text-slate-900">{Math.min(currentPage * itemsPerPage, filteredUsers.length)}</span> of <span className="font-bold text-slate-900">{filteredUsers.length}</span> users
          </div>
          <div className="flex gap-2">
            <button 
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(p => p - 1)}
              className="rounded-lg border border-slate-200 px-3 py-1 text-xs font-semibold disabled:opacity-50 hover:bg-slate-50 transition-all"
            >
              Previous
            </button>
            <button 
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(p => p + 1)}
              className="rounded-lg border border-slate-200 px-3 py-1 text-xs font-semibold disabled:opacity-50 hover:bg-slate-50 transition-all"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [view, setView] = useState<'LANDING' | 'LOGIN' | 'DASHBOARD' | 'ADMIN' | 'USERS' | 'CLASSES'>('LANDING');
  const [loading, setLoading] = useState(false);

  // Simple Auth Handlers
  const handleLogin = (role: 'ADMIN' | 'MEMBER') => {
    setLoading(true);
    setTimeout(() => {
      setUser({ id: '1', email: 'user@example.com', name: 'John Doe', role });
      setView(role === 'ADMIN' ? 'ADMIN' : 'DASHBOARD');
      setLoading(false);
    }, 800);
  };

  const handleLogout = () => {
    setUser(null);
    setView('LANDING');
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b border-slate-200 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setView('LANDING')}>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-lg shadow-indigo-200">
              <Dumbbell size={24} />
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900">IronCore</span>
          </div>

          <div className="flex items-center gap-6">
            {user && (
              <div className="hidden md:flex items-center gap-6">
                {user.role === 'ADMIN' ? (
                  <>
                    <button onClick={() => setView('ADMIN')} className={`text-sm font-semibold ${view === 'ADMIN' ? 'text-indigo-600' : 'text-slate-600'}`}>Overview</button>
                    <button onClick={() => setView('USERS')} className={`text-sm font-semibold ${view === 'USERS' ? 'text-indigo-600' : 'text-slate-600'}`}>Users</button>
                  </>
                ) : (
                  <>
                    <button onClick={() => setView('DASHBOARD')} className={`text-sm font-semibold ${view === 'DASHBOARD' ? 'text-indigo-600' : 'text-slate-600'}`}>Dashboard</button>
                    <button onClick={() => setView('CLASSES')} className={`text-sm font-semibold ${view === 'CLASSES' ? 'text-indigo-600' : 'text-slate-600'}`}>Book Classes</button>
                  </>
                )}
              </div>
            )}

            {user ? (
              <div className="flex items-center gap-4">
                <div className="hidden md:block text-right">
                  <p className="text-sm font-semibold">{user.name}</p>
                  <p className="text-xs text-slate-500 uppercase tracking-wider font-bold">{user.role}</p>
                </div>
                <button 
                  onClick={handleLogout}
                  className="flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
                >
                  <LogOut size={16} />
                </button>
              </div>
            ) : (
              <button 
                onClick={() => setView('LOGIN')}
                className="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md hover:bg-indigo-700 transition-all active:scale-95"
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <AnimatePresence mode="wait">
          {view === 'LANDING' && (
            <motion.div 
              key="landing"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex flex-col items-center justify-center py-20 text-center"
            >
              <h1 className="max-w-3xl text-5xl font-extrabold tracking-tight text-slate-900 sm:text-7xl">
                Elevate Your <span className="text-indigo-600">Fitness</span> Journey
              </h1>
              <p className="mt-6 max-w-xl text-lg text-slate-600">
                The all-in-one management system for modern gyms. Track memberships, book classes, and analyze performance with ease.
              </p>
              <div className="mt-10 flex flex-wrap justify-center gap-4">
                <button 
                  onClick={() => setView('LOGIN')}
                  className="rounded-xl bg-slate-900 px-8 py-4 text-lg font-bold text-white shadow-xl hover:bg-slate-800 transition-all active:scale-95"
                >
                  Get Started
                </button>
                <button onClick={() => setView('CLASSES')} className="rounded-xl border-2 border-slate-200 bg-white px-8 py-4 text-lg font-bold text-slate-900 hover:bg-slate-50 transition-all">
                  View Classes
                </button>
              </div>
            </motion.div>
          )}

          {view === 'LOGIN' && (
            <motion.div 
              key="login"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="mx-auto max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-2xl"
            >
              <div className="mb-8 text-center">
                <h2 className="text-3xl font-bold text-slate-900">Welcome Back</h2>
                <p className="mt-2 text-slate-500">Choose your access level to continue</p>
              </div>
              <div className="grid gap-4">
                <button 
                  onClick={() => handleLogin('MEMBER')}
                  className="flex items-center justify-between rounded-xl border-2 border-slate-100 p-4 text-left hover:border-indigo-600 hover:bg-indigo-50 transition-all group"
                >
                  <div>
                    <p className="font-bold text-slate-900">Member Portal</p>
                    <p className="text-sm text-slate-500">Book classes and track progress</p>
                  </div>
                  <UserIcon className="text-slate-400 group-hover:text-indigo-600" />
                </button>
                <button 
                  onClick={() => handleLogin('ADMIN')}
                  className="flex items-center justify-between rounded-xl border-2 border-slate-100 p-4 text-left hover:border-indigo-600 hover:bg-indigo-50 transition-all group"
                >
                  <div>
                    <p className="font-bold text-slate-900">Admin Dashboard</p>
                    <p className="text-sm text-slate-500">Manage gym operations and staff</p>
                  </div>
                  <ShieldCheck className="text-slate-400 group-hover:text-indigo-600" />
                </button>
              </div>
              <div className="mt-8">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-slate-200"></span></div>
                  <div className="relative flex justify-center text-xs uppercase"><span className="bg-white px-2 text-slate-500">Or continue with</span></div>
                </div>
                <button className="mt-4 w-full flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-all">
                  <img src="https://www.google.com/favicon.ico" className="w-4 h-4" alt="Google" referrerPolicy="no-referrer" />
                  Google Account
                </button>
              </div>
            </motion.div>
          )}

          {view === 'ADMIN' && (
            <motion.div key="admin" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-3xl font-bold tracking-tight text-slate-900">Admin Overview</h2>
                  <p className="text-slate-500">Real-time performance metrics for IronCore Gym.</p>
                </div>
              </div>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {STATS.map((stat) => (
                  <div key={stat.name} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                    <div className="flex items-center justify-between">
                      <div className={`rounded-lg bg-slate-50 p-2 ${stat.color}`}><stat.icon size={24} /></div>
                      <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full">+12%</span>
                    </div>
                    <div className="mt-4">
                      <p className="text-sm font-medium text-slate-500">{stat.name}</p>
                      <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="grid gap-6 lg:grid-cols-2">
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                  <h3 className="mb-6 text-lg font-bold text-slate-900">Membership Growth</h3>
                  <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={CHART_DATA}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                        <Tooltip contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0' }} />
                        <Line type="monotone" dataKey="members" stroke="#4f46e5" strokeWidth={3} dot={{ r: 4, fill: '#4f46e5' }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                  <h3 className="mb-6 text-lg font-bold text-slate-900">Revenue Analysis</h3>
                  <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={CHART_DATA}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                        <Tooltip contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0' }} />
                        <Bar dataKey="revenue" fill="#818cf8" radius={[6, 6, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {view === 'USERS' && (
            <UserManagementView />
          )}

          {view === 'DASHBOARD' && (
            <motion.div key="dashboard" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-3xl font-bold tracking-tight text-slate-900">Welcome Back, {user?.name}</h2>
                  <p className="text-slate-500">Your membership is active until Dec 2023.</p>
                </div>
                <button onClick={() => setView('CLASSES')} className="rounded-xl bg-indigo-600 px-6 py-3 text-sm font-bold text-white shadow-lg hover:bg-indigo-700">Book a Class</button>
              </div>
              <div className="grid gap-6 md:grid-cols-3">
                <div className="md:col-span-2 space-y-6">
                  <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                    <h3 className="text-lg font-bold mb-4">My Recent Bookings</h3>
                    <div className="space-y-4">
                      {[1, 2].map(i => (
                        <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-slate-50">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">HIIT</div>
                            <div>
                              <p className="font-bold">Advanced HIIT Session</p>
                              <p className="text-sm text-slate-500">Tomorrow at 10:00 AM</p>
                            </div>
                          </div>
                          <button className="text-red-500 text-sm font-bold hover:underline">Cancel</button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="space-y-6">
                  <div className="rounded-2xl bg-slate-900 p-6 text-white shadow-xl">
                    <h3 className="text-lg font-bold mb-2">IronCore Pro</h3>
                    <p className="text-slate-400 text-sm mb-6">Upgrade to VIP for unlimited personal training sessions.</p>
                    <button className="w-full rounded-xl bg-indigo-600 py-3 font-bold hover:bg-indigo-500 transition-all">Upgrade Now</button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {view === 'CLASSES' && (
            <motion.div key="classes" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight text-slate-900">Available Classes</h2>
                <div className="flex gap-2">
                  <button className="px-4 py-2 rounded-lg bg-white border border-slate-200 text-sm font-semibold">Today</button>
                  <button className="px-4 py-2 rounded-lg bg-white border border-slate-200 text-sm font-semibold">This Week</button>
                </div>
              </div>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {['Yoga Flow', 'Power Lifting', 'Zumba Party', 'CrossFit Intro', 'Spin Class', 'Boxing 101'].map((name, i) => (
                  <div key={i} className="group rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm hover:shadow-md transition-all">
                    <div className="h-40 bg-slate-100 relative">
                      <img src={`https://picsum.photos/seed/gym${i}/800/600`} className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-500" alt={name} referrerPolicy="no-referrer" />
                      <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">Level: Intermediate</div>
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-slate-900">{name}</h3>
                      <p className="mt-2 text-sm text-slate-500">Join our expert trainers for an intense 60-minute session designed to push your limits.</p>
                      <div className="mt-6 flex items-center justify-between">
                        <div className="text-sm">
                          <p className="font-bold">08:00 AM</p>
                          <p className="text-slate-500">Trainer: Alex S.</p>
                        </div>
                        <button className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-bold text-white hover:bg-indigo-600 transition-all">Book Spot</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-white/60 backdrop-blur-sm">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent"></div>
        </div>
      )}
    </div>
  );
}
