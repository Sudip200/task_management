import { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import useTasks, { type CreateTaskInput, type UpdateTaskInput } from '../hooks/useTasks';
import type { Task, TaskPriority, TaskStatus } from '../api';

type Filters = {
  search: string;
  status: 'ALL' | TaskStatus;
  priority: 'ALL' | TaskPriority;
};

const initialFilters: Filters = {
  search: '',
  status: 'ALL',
  priority: 'ALL',
};

const priorityBadge: Record<TaskPriority, string> = {
  LOW: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
  MEDIUM: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
  HIGH: 'bg-rose-500/15 text-rose-300 border-rose-500/30',
};

const statusLabel: Record<TaskStatus, string> = {
  TODO: 'To Do',
  IN_PROGRESS: 'In Progress',
  DONE: 'Done',
};

const getErrorMessage = (error: unknown, fallback: string) => {
  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === 'object' && error !== null && 'response' in error) {
    const response = error as { response?: { data?: { message?: string } } };
    return response.response?.data?.message ?? fallback;
  }

  return fallback;
};

function TaskFormModal({
  task,
  open,
  loading,
  onClose,
  onCreate,
  onUpdate,
}: {
  task: Task | null;
  open: boolean;
  loading: boolean;
  onClose: () => void;
  onCreate: (payload: CreateTaskInput) => Promise<void>;
  onUpdate: (payload: UpdateTaskInput) => Promise<void>;
}) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<TaskStatus>('TODO');
  const [priority, setPriority] = useState<TaskPriority>('MEDIUM');
  const [dueDate, setDueDate] = useState('');
  const [formError, setFormError] = useState('');

  useEffect(() => {
    if (!task) {
      setTitle('');
      setDescription('');
      setStatus('TODO');
      setPriority('MEDIUM');
      setDueDate('');
      setFormError('');
      return;
    }

    setTitle(task.title);
    setDescription(task.description ?? '');
    setStatus(task.status);
    setPriority(task.priority);
    setDueDate(task.dueDate ? new Date(task.dueDate).toISOString().slice(0, 16) : '');
    setFormError('');
  }, [task]);

  if (!open) {
    return null;
  }

  const handleSave = async () => {
    if (!title.trim()) {
      setFormError('Title is required.');
      return;
    }

    const payload = {
      title: title.trim(),
      description: description.trim() || undefined,
      status,
      priority,
      dueDate: dueDate ? new Date(dueDate).toISOString() : null,
    };

    try {
      if (task) {
        await onUpdate({ id: task.id, ...payload });
      } else {
        await onCreate(payload);
      }
      onClose();
    } catch (error) {
      setFormError(getErrorMessage(error, task ? 'Failed to update task.' : 'Failed to create task.'));
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
      <div className="w-full max-w-xl rounded-2xl border border-white/10 bg-slate-900 p-6 text-left shadow-2xl">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-xl font-semibold text-white">{task ? 'Update Task' : 'Add New Task'}</h3>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md px-3 py-1 text-sm text-slate-300 hover:bg-white/10"
          >
            Close
          </button>
        </div>

        <div className="space-y-4">
          <label className="block text-sm text-slate-300">
            Title
            <input
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              className="mt-1 w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-white"
            />
          </label>

          <label className="block text-sm text-slate-300">
            Description
            <textarea
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              rows={3}
              className="mt-1 w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-white"
            />
          </label>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block text-sm text-slate-300">
              Status
              <select
                value={status}
                onChange={(event) => setStatus(event.target.value as TaskStatus)}
                className="mt-1 w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-white"
              >
                <option className="text-black" value="TODO">To Do</option>
                <option className="text-black" value="IN_PROGRESS">In Progress</option>
                <option className="text-black" value="DONE">Done</option>
              </select>
            </label>

            <label className="block text-sm text-slate-300">
              Priority
              <select
                value={priority}
                onChange={(event) => setPriority(event.target.value as TaskPriority)}
                className="mt-1 w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-white"
              >
                <option className="text-black" value="LOW">Low</option>
                <option className="text-black" value="MEDIUM">Medium</option>
                <option className="text-black" value="HIGH">High</option>
              </select>
            </label>
          </div>

          <label className="block text-sm text-slate-300">
            Due Date
            <input
              type="datetime-local"
              value={dueDate}
              onChange={(event) => setDueDate(event.target.value)}
              className="mt-1 w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-white"
            />
          </label>

          {formError ? <p className="text-sm text-rose-300">{formError}</p> : null}

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-white/10 px-4 py-2 text-sm text-slate-200"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={loading}
              className="rounded-lg bg-cyan-400 px-4 py-2 text-sm font-semibold text-slate-900 disabled:opacity-60"
            >
              {loading ? 'Saving...' : task ? 'Save changes' : 'Create task'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function TasksPage() {
  const {
    tasks,
    isLoading,
    error,
    createTask,
    deleteTask,
    updateTask,
    isCreating,
    isUpdating,
    isDeleting,
  } = useTasks();

  const [filters, setFilters] = useState<Filters>(initialFilters);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const matchesSearch =
        task.title.toLowerCase().includes(filters.search.toLowerCase()) ||
        (task.description ?? '').toLowerCase().includes(filters.search.toLowerCase());

      const matchesStatus = filters.status === 'ALL' || task.status === filters.status;
      const matchesPriority = filters.priority === 'ALL' || task.priority === filters.priority;

      return matchesSearch && matchesStatus && matchesPriority;
    });
  }, [filters.priority, filters.search, filters.status, tasks]);

  const handleDelete = async (taskId: string) => {
    const confirmed = window.confirm('Are you sure you want to delete this task?');
    if (!confirmed) {
      return;
    }

    try {
      await deleteTask(taskId);
      toast.success('Task deleted successfully.');
    } catch (deleteError) {
      toast.error(getErrorMessage(deleteError, 'Failed to delete task.'));
    }
  };

  const openEditModal = (task: Task) => {
    setSelectedTask(task);
    setIsModalOpen(true);
  };

  const openCreateModal = () => {
    setSelectedTask(null);
    setIsModalOpen(true);
  };

  const closeTaskModal = () => {
    setSelectedTask(null);
    setIsModalOpen(false);
  };

  const handleUpdate = async (payload: UpdateTaskInput) => {
    await updateTask(payload);
    toast.success('Task updated successfully.');
  };

  const handleCreate = async (payload: CreateTaskInput) => {
    await createTask(payload);
    toast.success('Task created successfully.');
  };

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-8 text-slate-100 sm:px-6 lg:px-8">
      <section className="mx-auto w-full max-w-6xl rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl shadow-black/25 backdrop-blur-xl">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-3xl font-semibold text-white">Tasks</h1>
          <div className="flex items-center gap-3">
            <p className="text-sm text-slate-300">Total tasks: {tasks.length}</p>
            <button
              type="button"
              onClick={openCreateModal}
              className="rounded-lg bg-cyan-400 px-3.5 py-2 text-sm font-semibold text-slate-900"
            >
              Add Task
            </button>
          </div>
        </div>

        <div className="mb-6 grid gap-3 md:grid-cols-3">
          <input
            type="text"
            value={filters.search}
            onChange={(event) => setFilters((prev) => ({ ...prev, search: event.target.value }))}
            placeholder="Search by title or description"
            className="rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-slate-500"
          />

          <select
            value={filters.status}
            onChange={(event) =>
              setFilters((prev) => ({ ...prev, status: event.target.value as Filters['status'] }))
            }
            className="rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white"
          >
            <option className="text-black" value="ALL">All Status</option>
            <option className="text-black" value="TODO">To Do</option>
            <option className="text-black" value="IN_PROGRESS">In Progress</option>
            <option className="text-black" value="DONE">Done</option>
          </select>

          <select
            value={filters.priority}
            onChange={(event) =>
              setFilters((prev) => ({ ...prev, priority: event.target.value as Filters['priority'] }))
            }
            className="rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white"
          >
            <option className="text-black" value="ALL">All Priority</option>
            <option className="text-black" value="LOW">Low</option>
            <option className="text-black" value="MEDIUM">Medium</option>
            <option className="text-black" value="HIGH">High</option>
          </select>
        </div>

        {isLoading ? <p className="text-slate-300">Loading tasks...</p> : null}
        {!isLoading && error ? <p className="text-rose-300">Failed to load tasks.</p> : null}

        {!isLoading && !error ? (
          <div className="grid gap-4">
            {filteredTasks.length === 0 ? (
              <div className="rounded-xl border border-dashed border-white/20 p-8 text-center text-slate-300">
                No tasks found for current search and filters.
              </div>
            ) : (
              filteredTasks.map((task) => (
                <article
                  key={task.id}
                  className="rounded-2xl border border-white/10 bg-slate-900/50 p-4 text-left"
                >
                  <div className="mb-2 flex flex-wrap items-center gap-2">
                    <span className={`rounded-full border px-2.5 py-1 text-xs ${priorityBadge[task.priority]}`}>
                      {task.priority}
                    </span>
                    <span className="rounded-full border border-cyan-500/30 bg-cyan-500/10 px-2.5 py-1 text-xs text-cyan-200">
                      {statusLabel[task.status]}
                    </span>
                  </div>

                  <h3 className="text-lg font-semibold text-white">{task.title}</h3>
                  <p className="mt-1 text-sm text-slate-300">{task.description || 'No description'}</p>

                  <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                    <p className="text-xs text-slate-400">
                      Due: {task.dueDate ? new Date(task.dueDate).toLocaleString() : 'Not set'}
                    </p>

                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => openEditModal(task)}
                        className="rounded-lg border border-cyan-400/40 bg-cyan-500/10 px-3 py-1.5 text-xs font-semibold text-cyan-200"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(task.id)}
                        disabled={isDeleting}
                        className="rounded-lg border border-rose-500/40 bg-rose-500/10 px-3 py-1.5 text-xs font-semibold text-rose-200 disabled:opacity-60"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </article>
              ))
            )}
          </div>
        ) : null}
      </section>

      <TaskFormModal
        task={selectedTask}
        open={isModalOpen}
        loading={isCreating || isUpdating}
        onClose={closeTaskModal}
        onCreate={handleCreate}
        onUpdate={handleUpdate}
      />
    </main>
  );
}
