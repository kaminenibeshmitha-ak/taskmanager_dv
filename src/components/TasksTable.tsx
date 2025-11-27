import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { CheckCircle, Circle, AlertCircle } from 'lucide-react';

interface Task {
  id: string;
  title: string;
  assignee: string;
  status: 'pending' | 'in-progress' | 'completed';
}

export function TasksTable() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const { data, error } = await supabase
          .from('tasks')
          .select('id, title, assignee, status')
          .order('created_at', { ascending: false })
          .limit(2);

        if (error) throw error;
        setTasks(data || []);
      } catch (err) {
        console.error('Error fetching tasks:', err);
        setTasks([
          {
            id: '1',
            title: 'Boost Weekly',
            assignee: 'Vikram Durga',
            status: 'in-progress',
          },
          {
            id: '2',
            title: 'SQR',
            assignee: 'Vikram Durga',
            status: 'completed',
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return (
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium bg-green-50 text-green-700">
            <CheckCircle className="w-4 h-4" />
            Completed
          </span>
        );
      case 'in-progress':
        return (
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium bg-blue-50 text-blue-700">
            <Circle className="w-4 h-4" />
            In-Progress
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium bg-slate-50 text-slate-700">
            <AlertCircle className="w-4 h-4" />
            Pending
          </span>
        );
    }
  };

  return (
    <div className="bg-white rounded-xl border border-blue-100">
      <div className="p-6 border-b border-blue-100">
        <h2 className="text-lg font-bold text-slate-900">My Tasks</h2>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-50 border-b border-blue-100">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                Task Name
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                Assignee
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-blue-100">
            {loading ? (
              <tr>
                <td colSpan={3} className="px-6 py-8 text-center text-slate-500">
                  Loading tasks...
                </td>
              </tr>
            ) : tasks.length === 0 ? (
              <tr>
                <td colSpan={3} className="px-6 py-8 text-center text-slate-500">
                  No tasks yet
                </td>
              </tr>
            ) : (
              tasks.map((task) => (
                <tr key={task.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 text-sm font-medium text-slate-900">
                    {task.title}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-700">{task.assignee}</td>
                  <td className="px-6 py-4">{getStatusBadge(task.status)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
