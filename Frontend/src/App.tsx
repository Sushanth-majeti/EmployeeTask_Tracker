import { useEffect, useState } from 'react';
import { Search, Plus, Star, TrendingUp } from 'lucide-react';
import { supabase, Task, TeamMember } from './lib/supabase';
import { Sidebar } from './components/Sidebar';
import { StatsCards } from './components/StatsCards';
import { TaskCard } from './components/TaskCard';
import { AddTaskModal } from './components/AddTaskModal';

function App() {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedMember, setSelectedMember] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [membersRes, tasksRes] = await Promise.all([
        supabase.from('team_members').select('*').order('name'),
        supabase.from('tasks').select('*').order('created_at', { ascending: false }),
      ]);

      if (membersRes.data) setTeamMembers(membersRes.data);
      if (tasksRes.data) setTasks(tasksRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (taskId: string, newStatus: Task['status']) => {
    try {
      const { error } = await supabase
        .from('tasks')
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq('id', taskId);

      if (!error) {
        setTasks(tasks.map(task =>
          task.id === taskId ? { ...task, status: newStatus } : task
        ));
      }
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', taskId);

      if (!error) {
        setTasks(tasks.filter(task => task.id !== taskId));
      }
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const handleAddTask = async (newTask: {
    title: string;
    status: string;
    priority: string;
    due_date: string;
    assigned_to: string;
  }) => {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .insert([newTask])
        .select()
        .single();

      if (!error && data) {
        setTasks([data, ...tasks]);
      }
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesMember = !selectedMember || task.assigned_to === selectedMember;
    const matchesStatus = statusFilter === 'all' || task.status === statusFilter;
    return matchesSearch && matchesMember && matchesStatus;
  });

  const totalTasks = filteredTasks.length;
  const completedTasks = filteredTasks.filter(t => t.status === 'completed').length;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const groupTasksByAssignee = () => {
    const grouped: { [key: string]: Task[] } = {};
    filteredTasks.forEach(task => {
      if (!grouped[task.assigned_to]) {
        grouped[task.assigned_to] = [];
      }
      grouped[task.assigned_to].push(task);
    });
    return grouped;
  };

  const groupedTasks = groupTasksByAssignee();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar
        teamMembers={teamMembers}
        tasks={tasks}
        selectedMember={selectedMember}
        onSelectMember={setSelectedMember}
      />

      <div className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto p-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Team Dashboard</h1>
              <p className="text-gray-600">
                {totalTasks} total tasks • {completionRate}% completed
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search tasks or employees..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 w-80 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="overdue">Overdue</option>
              </select>
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
              >
                <Plus className="w-5 h-5" />
                Add Task
              </button>
            </div>
          </div>

          <StatsCards tasks={filteredTasks} />

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Team Tasks</h2>
              <div className="flex gap-2">
                <button className="p-2 text-teal-600 hover:bg-teal-50 rounded-lg transition-colors">
                  <Star className="w-5 h-5" />
                </button>
                <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                  <TrendingUp className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="space-y-8">
              {Object.entries(groupedTasks).map(([assigneeId, assigneeTasks]) => {
                const assignee = teamMembers.find(m => m.id === assigneeId);
                if (!assignee) return null;

                return (
                  <div key={assigneeId}>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                        <span className="text-sm font-semibold text-gray-700">
                          {assignee.name.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900">{assignee.name}</h3>
                        <p className="text-sm text-gray-500">
                          {assignee.role} • {assigneeTasks.length} tasks
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4 ml-13">
                      {assigneeTasks.map(task => (
                        <TaskCard
                          key={task.id}
                          task={task}
                          assignee={assignee}
                          onStatusChange={handleStatusChange}
                          onDelete={handleDeleteTask}
                        />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <AddTaskModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddTask}
        teamMembers={teamMembers}
      />
    </div>
  );
}

export default App;
