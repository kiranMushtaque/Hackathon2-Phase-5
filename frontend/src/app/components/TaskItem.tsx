// components/TaskItem.tsx
'use client';

interface Task {
  id: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  due_date?: string;
  tags?: string;
  recurring_interval?: string;
}

interface TaskItemProps {
  task: Task;
  onUpdate: () => void;
}

export default function TaskItem({ task, onUpdate }: TaskItemProps) {
  const priorityColors = {
    high: 'bg-red-100 text-red-800 border-red-300',
    medium: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    low: 'bg-green-100 text-green-800 border-green-300'
  };

  const priorityIcons = {
    high: '🔴',
    medium: '🟡',
    low: '🟢'
  };

  async function toggleComplete() {
    try {
      const endpoint = task.status === 'pending' 
        ? `http://localhost:8000/api/demo_user_id/tasks/${task.id}/complete`
        : `http://localhost:8000/api/demo_user_id/tasks/${task.id}`;
      
      const method = task.status === 'pending' ? 'PATCH' : 'PUT';
      const body = task.status === 'pending' ? undefined : JSON.stringify({ status: 'pending' });

      await fetch(endpoint, {
        method,
        headers: body ? { 'Content-Type': 'application/json' } : {},
        body
      });
      
      onUpdate();
    } catch (error) {
      console.error('Error toggling task:', error);
    }
  }

  async function deleteTask() {
    if (!confirm('Delete this task?')) return;
    
    try {
      await fetch(`http://localhost:8000/api/demo_user_id/tasks/${task.id}`, {
        method: 'DELETE'
      });
      onUpdate();
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  }

  return (
    <div className={`task-item rounded-lg p-4 mb-3 ${task.status === 'completed' ? 'completed' : ''}`}>
      <div className="flex items-start gap-4">
        {/* Checkbox */}
        <input
          type="checkbox"
          checked={task.status === 'completed'}
          onChange={toggleComplete}
          className="mt-1 w-5 h-5 cursor-pointer accent-purple-500"
        />

        {/* Content */}
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className={`text-lg font-semibold text-white ${task.status === 'completed' ? 'line-through text-gray-300' : ''}`}>
              {task.title}
            </h3>

            {/* Priority Badge */}
            <span className={`badge ${task.priority === 'high' ? 'priority-high' : task.priority === 'medium' ? 'priority-medium' : 'priority-low'}`}>
              {priorityIcons[task.priority as keyof typeof priorityIcons]} {task.priority.toUpperCase()}
            </span>

            {/* Recurring Indicator */}
            {task.recurring_interval && (
              <span className="text-xs bg-purple-200 text-purple-900 px-2 py-1 rounded-full">
                🔁 {task.recurring_interval}
              </span>
            )}
          </div>

          {/* Description */}
          {task.description && (
            <p className="text-purple-100 text-sm mb-2">{task.description}</p>
          )}

          {/* Meta Info */}
          <div className="flex flex-wrap gap-3 text-sm text-purple-200">
            {task.due_date && (
              <span className="flex items-center gap-1">
                📅 {new Date(task.due_date).toLocaleDateString()}
              </span>
            )}

            {task.tags && (
              <span className="flex items-center gap-1">
                🏷️ {task.tags}
              </span>
            )}
          </div>
        </div>

        {/* Actions */}
        <button
          onClick={deleteTask}
          className="text-red-300 hover:text-red-100 font-semibold"
        >
          🗑️
        </button>
      </div>
    </div>
  );
}