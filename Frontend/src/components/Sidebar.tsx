import { Users } from 'lucide-react';
import { TeamMember, Task } from '../lib/supabase';

type SidebarProps = {
  teamMembers: TeamMember[];
  tasks: Task[];
  selectedMember: string | null;
  onSelectMember: (memberId: string | null) => void;
};

export function Sidebar({ teamMembers, tasks, selectedMember, onSelectMember }: SidebarProps) {
  const getTaskCountForMember = (memberId: string) => {
    return tasks.filter(task => task.assigned_to === memberId).length;
  };

  const allTasksCount = tasks.length;

  return (
    <div className="w-64 bg-white border-r border-gray-200 h-screen overflow-y-auto">
      <div className="p-6">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 bg-teal-500 rounded-lg flex items-center justify-center text-white font-bold text-lg">
            TT
          </div>
          <div>
            <h1 className="font-bold text-lg">TaskTracker</h1>
            <p className="text-sm text-gray-500">Team Dashboard</p>
          </div>
        </div>

        <div className="mb-6">
          <h2 className="text-xs font-semibold text-gray-500 uppercase mb-3">Team Members</h2>

          <button
            onClick={() => onSelectMember(null)}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg mb-2 transition-colors ${
              selectedMember === null
                ? 'bg-teal-50 text-teal-700'
                : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            <Users className="w-5 h-5" />
            <span className="flex-1 text-left font-medium">All Tasks</span>
            <span className="text-sm font-semibold">{allTasksCount}</span>
          </button>

          <div className="space-y-1">
            {teamMembers.map((member) => (
              <button
                key={member.id}
                onClick={() => onSelectMember(member.id)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                  selectedMember === member.id
                    ? 'bg-gray-100 text-gray-900'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                  <Users className="w-4 h-4 text-gray-600" />
                </div>
                <div className="flex-1 text-left">
                  <p className="font-medium text-sm">{member.name}</p>
                  <p className="text-xs text-gray-500">{member.role}</p>
                </div>
                <span className="text-sm font-semibold text-gray-600">
                  {getTaskCountForMember(member.id)}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
