import { Task } from '../lib/supabase';

type StatsCardsProps = {
  tasks: Task[];
};

export function StatsCards({ tasks }: StatsCardsProps) {
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.status === 'completed').length;
  const inProgressTasks = tasks.filter(t => t.status === 'in_progress').length;
  const pendingTasks = tasks.filter(t => t.status === 'pending').length;
  const overdueTasks = tasks.filter(t => t.status === 'overdue').length;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <div className="grid grid-cols-4 gap-6 mb-8">
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <h3 className="text-sm font-medium text-gray-600 mb-4">Completion Rate</h3>
        <div className="flex items-center justify-center mb-4">
          <div className="relative w-32 h-32">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="64"
                cy="64"
                r="56"
                stroke="#e5e7eb"
                strokeWidth="12"
                fill="none"
              />
              <circle
                cx="64"
                cy="64"
                r="56"
                stroke="#10b981"
                strokeWidth="12"
                fill="none"
                strokeDasharray={`${2 * Math.PI * 56}`}
                strokeDashoffset={`${2 * Math.PI * 56 * (1 - completionRate / 100)}`}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-3xl font-bold text-gray-900">{completionRate}%</span>
            </div>
          </div>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-gray-900">{completedTasks}/{totalTasks}</p>
          <p className="text-sm text-gray-500">tasks completed</p>
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium text-gray-600">In Progress</h3>
          <div className="w-2 h-2 rounded-full bg-blue-500"></div>
        </div>
        <p className="text-4xl font-bold text-gray-900">{inProgressTasks}</p>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium text-gray-600">Pending</h3>
          <div className="w-2 h-2 rounded-full bg-orange-500"></div>
        </div>
        <p className="text-4xl font-bold text-gray-900">{pendingTasks}</p>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium text-gray-600">Overdue</h3>
          <div className="w-2 h-2 rounded-full bg-red-500"></div>
        </div>
        <p className="text-4xl font-bold text-gray-900">{overdueTasks}</p>
      </div>
    </div>
  );
}
