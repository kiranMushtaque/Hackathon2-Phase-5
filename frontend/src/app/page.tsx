'use client';

import { useState, useEffect } from 'react';
import TaskForm from './components/TaskForm';
import FilterBar from './components/FilterBar';
import TaskItem from './components/TaskItem';

export default function Home() {
  const [tasks, setTasks] = useState([]);
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    priority: '',
    sort: ''
  });

  useEffect(() => {
    loadTasks();
  }, [filters]);

  async function loadTasks() {
    try {
      const params = new URLSearchParams();
      if (filters.status) params.append('status', filters.status);
      if (filters.priority) params.append('priority', filters.priority);
      if (filters.search) params.append('search', filters.search);
      if (filters.sort) params.append('sort', filters.sort);

      const response = await fetch(`http://localhost:8000/api/demo_user_id/tasks?${params}`);
      const data = await response.json();
      setTasks(data);
    } catch (error) {
      console.error('Error loading tasks:', error);
    }
  }

  const pendingCount = tasks.filter((t: any) => t.status === 'pending').length;
  const completedCount = tasks.filter((t: any) => t.status === 'completed').length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 py-8">
      <div className="max-w-5xl mx-auto px-4">
        {/* Header */}
        <header className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-white mb-2 bg-gradient-to-r from-blue-300 to-purple-300 bg-clip-text text-transparent">
            📝 Todo App - Phase 5
          </h1>
          <p className="text-purple-200">
            Advanced task management with priorities, tags, and recurring tasks
          </p>
        </header>

        {/* Task Form */}
        <TaskForm onTaskAdded={loadTasks} />

        {/* Stats */}
        <div className="stats-card bg-white/10 backdrop-blur-lg rounded-xl p-4 mb-6 border border-white/20">
          <div className="flex gap-6 text-sm font-semibold text-white">
            <span className="flex items-center gap-2">
              📊 Total: <span className="text-blue-300">{tasks.length}</span>
            </span>
            <span className="flex items-center gap-2">
              ⏳ Pending: <span className="text-orange-300">{pendingCount}</span>
            </span>
            <span className="flex items-center gap-2">
              ✅ Completed: <span className="text-green-300">{completedCount}</span>
            </span>
          </div>
        </div>

        {/* Filters */}
        <FilterBar filters={filters} onFilterChange={setFilters} />

        {/* Task List */}
        <div>
          <h2 className="text-2xl font-bold mb-4 text-white">
            My Tasks ({tasks.length})
          </h2>

          {tasks.length === 0 ? (
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8 text-center text-purple-200 border border-white/20">
              <p className="text-lg">No tasks yet. Create your first task above! 👆</p>
            </div>
          ) : (
            <div className="space-y-3">
              {tasks.map((task: any) => (
                <TaskItem key={task.id} task={task} onUpdate={loadTasks} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}