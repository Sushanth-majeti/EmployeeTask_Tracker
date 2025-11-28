import { Edit2, Trash2, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { Task, TeamMember } from '../lib/supabase';

type TaskCardProps = {
  task: Task;
  assignee: TeamMember | undefined;
  onStatusChange: (taskId: string, newStatus: Task['status']) => void;
  onDelete: (taskId: string) => void;
};

export function TaskCard({ task, assignee, onStatusChange, onDelete }: TaskCardProps) {
  const getStatusIcon = () => {
    switch (task.status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4" />;
      case 'in_progress':
        return <Clock className="w-4 h-4" />;
      case 'pending':
        return <AlertCircle className="w-4 h-4" />;
      case 'overdue':
        return <AlertCircle className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const getStatusStyles = () => {
    switch (task.status) {
      case 'completed':
        return 'bg-green-50 text-green-700';
      case 'in_progress':
        return 'bg-blue-50 text-blue-700';
      case 'pending':
        return 'bg-orange-50 text-orange-700';
      case 'overdue':
        return 'bg-red-50 text-red-700';
      default:
        return 'bg-gray-50 text-gray-700';
    }
  };

  const getStatusLabel = () => {
    switch (task.status) {
      case 'in_progress':
        return 'In Progress';
      case 'pending':
        return 'Pending';
      case 'completed':
        return 'Completed';
      case 'overdue':
        return 'Overdue';
      default:
        return task.status;
    }
  };

  const getPriorityStyles = () => {
    switch (task.priority) {
      case 'high':
        return 'bg-red-100 text-red-700';
      case 'medium':
        return 'bg-orange-100 text-orange-700';
      case 'low':
        return 'bg-blue-100 text-blue-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const getActionButton = () => {
    if (task.status === 'completed') {
      return null;
    }
    if (task.status === 'pending') {
      return (
        <button
          onClick={() => onStatusChange(task.id, 'in_progress')}
          className="w-full py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium"
        >
          Start Work
        </button>
      );
    }
    if (task.status === 'in_progress') {
      return (
        <button
          onClick={() => onStatusChange(task.id, 'completed')}
          className="w-full py-2 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors text-sm font-medium"
        >
          Mark Complete
        </button>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <h3 className="font-semibold text-gray-900 flex-1">{task.title}</h3>
        <div className="flex gap-2 ml-2">
          <button className="text-gray-400 hover:text-gray-600">
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(task.id)}
            className="text-gray-400 hover:text-red-600"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="flex gap-2 mb-4">
        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${getStatusStyles()}`}>
          {getStatusIcon()}
          {getStatusLabel()}
        </span>
        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getPriorityStyles()}`}>
          {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
        </span>
      </div>

      <div className="space-y-2 mb-4 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-500">Due:</span>
          <span className="text-gray-900 font-medium">{formatDate(task.due_date)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">Assigned:</span>
          <span className="text-gray-900 font-medium">{assignee?.name || 'Unassigned'}</span>
        </div>
      </div>

      {getActionButton()}
    </div>
  );
}
