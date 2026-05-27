import { useNavigate } from 'react-router';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    toast.success('Logged out successfully.');
    navigate('/login', { replace: true });
  };

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-8 text-slate-100 sm:px-6 lg:px-8">
      <section className="mx-auto w-full max-w-3xl rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl shadow-black/25 backdrop-blur-xl">
        <div className="mb-6 text-left">
          <h1 className="text-3xl font-semibold text-white">Profile</h1>
          <p className="mt-2 text-sm text-slate-300">Account details fetched from /auth/me.</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
         

          <div className="rounded-2xl border border-white/10 bg-slate-900/50 p-4 text-left">
            <p className="text-xs uppercase text-slate-400">Email</p>
            <p className="mt-2 text-sm text-white">{user?.email ?? '-'}</p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-slate-900/50 p-4 text-left">
            <p className="text-xs uppercase text-slate-400">Joined</p>
            <p className="mt-2 text-sm text-white">
              {user?.createdAt ? new Date(user.createdAt).toLocaleString() : '-'}
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-slate-900/50 p-4 text-left">
            <p className="text-xs uppercase text-slate-400">Total Tasks</p>
            <p className="mt-2 text-2xl font-semibold text-cyan-300">{user?.taskCount ?? 0}</p>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => navigate('/tasks')}
            className="rounded-lg border border-cyan-400/40 bg-cyan-500/10 px-4 py-2 text-sm font-semibold text-cyan-200"
          >
            Go to Tasks
          </button>
          <button
            type="button"
            onClick={handleLogout}
            className="rounded-lg border border-rose-500/40 bg-rose-500/10 px-4 py-2 text-sm font-semibold text-rose-200"
          >
            Logout
          </button>
        </div>
      </section>
    </main>
  );
}
