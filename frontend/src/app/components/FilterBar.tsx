// components/FilterBar.tsx
'use client';

interface FilterBarProps {
  filters: {
    search: string;
    status: string;
    priority: string;
    sort: string;
  };
  onFilterChange: (filters: any) => void;
}

export default function FilterBar({ filters, onFilterChange }: FilterBarProps) {
  return (
    <div className="filter-bar p-4 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Search */}
        <div>
          <input
            type="text"
            placeholder="🔍 Search tasks..."
            value={filters.search}
            onChange={(e) => onFilterChange({...filters, search: e.target.value})}
            className="w-full px-4 py-2 rounded-lg focus:ring-2 focus:ring-purple-500 text-white"
          />
        </div>

        {/* Status Filter */}
        <div>
          <select
            value={filters.status}
            onChange={(e) => onFilterChange({...filters, status: e.target.value})}
            className="w-full px-4 py-2 rounded-lg focus:ring-2 focus:ring-purple-500 text-white"
          >
            <option value="">All Status</option>
            <option value="pending">⏳ Pending</option>
            <option value="completed">✅ Completed</option>
          </select>
        </div>

        {/* Priority Filter */}
        <div>
          <select
            value={filters.priority}
            onChange={(e) => onFilterChange({...filters, priority: e.target.value})}
            className="w-full px-4 py-2 rounded-lg focus:ring-2 focus:ring-purple-500 text-white"
          >
            <option value="">All Priority</option>
            <option value="high">🔴 High</option>
            <option value="medium">🟡 Medium</option>
            <option value="low">🟢 Low</option>
          </select>
        </div>

        {/* Sort */}
        <div>
          <select
            value={filters.sort}
            onChange={(e) => onFilterChange({...filters, sort: e.target.value})}
            className="w-full px-4 py-2 rounded-lg focus:ring-2 focus:ring-purple-500 text-white"
          >
            <option value="">Sort by...</option>
            <option value="created_at">📅 Date Created</option>
            <option value="due_date">⏰ Due Date</option>
            <option value="priority">🎯 Priority</option>
          </select>
        </div>
      </div>
    </div>
  );
}