'use client';

import { useState } from 'react';

interface TaskFormProps {
  onTaskAdded: () => void;
}

export default function TaskForm({ onTaskAdded }: TaskFormProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium',
    due_date: '',
    tags: '',
    recurring_interval: 'none'
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    
    const payload = {
      title: formData.title,
      description: formData.description,
      priority: formData.priority,
      due_date: formData.due_date ? new Date(formData.due_date).toISOString() : undefined,
      tags: formData.tags || undefined,
      recurring_interval: formData.recurring_interval === 'none' ? undefined : formData.recurring_interval
    };

    try {
      const response = await fetch('http://localhost:8000/api/demo_user_id/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      if (response.ok) {
        // Reset form
        setFormData({
          title: '',
          description: '',
          priority: 'medium',
          due_date: '',
          tags: '',
          recurring_interval: 'none'
        });
        onTaskAdded();
      }
    } catch (error) {
      console.error('Error creating task:', error);
      alert('Failed to create task. Make sure backend is running.');
    }
  }

  return (
    <div className="task-form p-6 mb-6">
      <h2 className="text-2xl font-bold mb-4 text-white">➕ Add New Task</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            required
            value={formData.title}
            onChange={(e) => setFormData({...formData, title: e.target.value})}
            placeholder="e.g., Buy groceries"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium mb-2">Description</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            placeholder="e.g., Milk, eggs, bread..."
            rows={3}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Priority */}
          <div>
            <label className="block text-sm font-medium mb-2">Priority</label>
            <select
              value={formData.priority}
              onChange={(e) => setFormData({...formData, priority: e.target.value})}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="low">🟢 Low</option>
              <option value="medium">🟡 Medium</option>
              <option value="high">🔴 High</option>
            </select>
          </div>

          {/* Due Date */}
          <div>
            <label className="block text-sm font-medium mb-2">Due Date</label>
            <input
              type="date"
              value={formData.due_date}
              onChange={(e) => setFormData({...formData, due_date: e.target.value})}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Recurring */}
          <div>
            <label className="block text-sm font-medium mb-2">Recurring</label>
            <select
              value={formData.recurring_interval}
              onChange={(e) => setFormData({...formData, recurring_interval: e.target.value})}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="none">None</option>
              <option value="daily">🔁 Daily</option>
              <option value="weekly">🔁 Weekly</option>
              <option value="monthly">🔁 Monthly</option>
            </select>
          </div>
        </div>

        {/* Tags */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Tags <span className="text-gray-500 text-xs">(comma-separated)</span>
          </label>
          <input
            type="text"
            value={formData.tags}
            onChange={(e) => setFormData({...formData, tags: e.target.value})}
            placeholder="e.g., work, home, urgent"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full btn-primary text-white font-semibold py-3 px-6 rounded-lg"
        >
          ➕ Add Task
        </button>
      </form>
    </div>
  );
}