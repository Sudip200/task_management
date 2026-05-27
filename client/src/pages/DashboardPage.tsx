import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router';
import toast from 'react-hot-toast';
import { getTasksStats } from '../api';
import { useAuth } from '../context/AuthContext';

const cardBase =
  'rounded-2xl border border-white/10 bg-slate-900/50 p-5 text-left shadow-lg shadow-black/20';

export default function DashboardPage() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const { data, isLoading, isError } = useQuery({
    queryKey: ['task-stats'],
    queryFn: getTasksStats,
  });

  const handleLogout = async () => {
    await logout();
    toast.success('Logged out successfully.');
    navigate('/login', { replace: true });
  };

  if (isLoading) {
    return (
      <main className="min-h-screen bg-slate-950 px-4 py-8 text-slate-100 sm:px-6 lg:px-8">
        <section className="mx-auto w-full max-w-6xl rounded-3xl border border-white/10 bg-white/5 p-6">
          <p className="text-slate-300">Loading dashboard stats...</p>
        </section>
      </main>
    );
  }

  if (isError || !data) {
    return (
      <main className="min-h-screen bg-slate-950 px-4 py-8 text-slate-100 sm:px-6 lg:px-8">
        <section className="mx-auto w-full max-w-6xl rounded-3xl border border-white/10 bg-white/5 p-6">
          <p className="text-rose-300">Failed to load dashboard stats.</p>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-8 text-slate-100 sm:px-6 lg:px-8">
      <section className="mx-auto w-full max-w-6xl rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl shadow-black/25 backdrop-blur-xl">
        <div className="mb-6 flex flex-col gap-4 rounded-2xl border border-white/10 bg-slate-900/40 p-5 text-left md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-white">Dashboard</h1>
            <p className="mt-1 text-sm text-slate-300">Overview of your task progress and priority load.</p>
            <p className="mt-2 text-xs text-slate-400">Signed in as {user?.email ?? 'Unknown user'}</p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => navigate('/tasks')}
              className="rounded-lg border border-cyan-400/40 bg-cyan-500/10 px-3 py-2 text-xs font-semibold text-cyan-200"
            >
              Open Tasks
            </button>
            <button
              type="button"
              onClick={() => navigate('/profile')}
              className="rounded-lg border border-indigo-400/40 bg-indigo-500/10 px-3 py-2 text-xs font-semibold text-indigo-200"
            >
              Profile
            </button>
            <button
              type="button"
              onClick={handleLogout}
              className="rounded-lg border border-rose-500/40 bg-rose-500/10 px-3 py-2 text-xs font-semibold text-rose-200"
            >
              Logout
            </button>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <article className={cardBase}>
            <p className="text-sm text-slate-300">Total Tasks</p>
            <p className="mt-2 text-3xl font-semibold text-white">{data.total}</p>
          </article>

          <article className={cardBase}>
            <p className="text-sm text-slate-300">Completed</p>
            <p className="mt-2 text-3xl font-semibold text-emerald-300">{data.completed}</p>
          </article>

          <article className={cardBase}>
            <p className="text-sm text-slate-300">Pending</p>
            <p className="mt-2 text-3xl font-semibold text-amber-300">{data.pending}</p>
          </article>

          <article className={cardBase}>
            <p className="text-sm text-slate-300">Completion Rate</p>
            <p className="mt-2 text-3xl font-semibold text-cyan-300">{data.completionRate}%</p>
          </article>
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          <article className={cardBase}>
            <h2 className="text-xl font-semibold text-white">Status Breakdown</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              <div className="rounded-lg border border-white/10 bg-white/5 p-3">
                <p className="text-xs text-slate-300">To Do</p>
                <p className="mt-1 text-2xl font-semibold text-white">{data.todo}</p>
              </div>
              <div className="rounded-lg border border-white/10 bg-white/5 p-3">
                <p className="text-xs text-slate-300">In Progress</p>
                <p className="mt-1 text-2xl font-semibold text-white">{data.inProgress}</p>
              </div>
              <div className="rounded-lg border border-white/10 bg-white/5 p-3">
                <p className="text-xs text-slate-300">Done</p>
                <p className="mt-1 text-2xl font-semibold text-white">{data.completed}</p>
              </div>
            </div>
          </article>

          <article className={cardBase}>
            <h2 className="text-xl font-semibold text-white">Priority Breakdown</h2>
            <div className="mt-4 space-y-3">
              <div className="flex items-center justify-between rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-3">
                <p className="text-sm text-emerald-200">Low</p>
                <p className="text-xl font-semibold text-emerald-100">{data.priority.LOW}</p>
              </div>
              <div className="flex items-center justify-between rounded-lg border border-amber-500/30 bg-amber-500/10 p-3">
                <p className="text-sm text-amber-200">Medium</p>
                <p className="text-xl font-semibold text-amber-100">{data.priority.MEDIUM}</p>
              </div>
              <div className="flex items-center justify-between rounded-lg border border-rose-500/30 bg-rose-500/10 p-3">
                <p className="text-sm text-rose-200">High</p>
                <p className="text-xl font-semibold text-rose-100">{data.priority.HIGH}</p>
              </div>
            </div>
          </article>
        </div>
      </section>
    </main>
  );
}