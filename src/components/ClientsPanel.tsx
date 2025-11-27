import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { ChevronDown, ChevronRight, Plus } from 'lucide-react';

interface TaskCategory {
  id: string;
  name: string;
  taskCount: number;
}

interface Client {
  id: string;
  name: string;
  categories: TaskCategory[];
  isExpanded: boolean;
}

export function ClientsPanel() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [newClientName, setNewClientName] = useState('');
  const [isAddingClient, setIsAddingClient] = useState(false);

  useEffect(() => {
    fetchClientsAndCategories();
  }, []);

  const fetchClientsAndCategories = async () => {
    try {
      const { data: clientsData, error: clientsError } = await supabase
        .from('clients')
        .select('id, name')
        .order('created_at', { ascending: false });

      if (clientsError) throw clientsError;

      if (!clientsData || clientsData.length === 0) {
        setClients([]);
        setLoading(false);
        return;
      }

      const clientsWithCategories: Client[] = [];

      for (const client of clientsData) {
        const { data: categoriesData, error: categoriesError } = await supabase
          .from('task_categories')
          .select('id, name')
          .eq('client_id', client.id);

        if (categoriesError) throw categoriesError;

        const categories: TaskCategory[] = (categoriesData || []).map((cat) => ({
          id: cat.id,
          name: cat.name,
          taskCount: 0,
        }));

        if (categories.length === 0) {
          categories.push({
            id: `default-${client.id}`,
            name: 'General Tasks',
            taskCount: 0,
          });
        }

        clientsWithCategories.push({
          id: client.id,
          name: client.name,
          categories,
          isExpanded: true,
        });
      }

      setClients(clientsWithCategories);
    } catch (err) {
      console.error('Error fetching clients:', err);
    } finally {
      setLoading(false);
    }
  };

  const toggleClient = (clientId: string) => {
    setClients(
      clients.map((client) =>
        client.id === clientId ? { ...client, isExpanded: !client.isExpanded } : client
      )
    );
  };

  const addClient = async () => {
    if (!newClientName.trim()) return;

    try {
      const { data, error } = await supabase
        .from('clients')
        .insert([{ name: newClientName }])
        .select();

      if (error) throw error;

      if (data) {
        setNewClientName('');
        setIsAddingClient(false);
        await fetchClientsAndCategories();
      }
    } catch (err) {
      console.error('Error adding client:', err);
    }
  };

  return (
    <div className="w-64 bg-white border-l border-blue-100 overflow-y-auto">
      <div className="p-6 border-b border-blue-100 sticky top-0 bg-white">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-slate-900">Clients</h2>
          <button
            onClick={() => setIsAddingClient(!isAddingClient)}
            className="p-1 hover:bg-slate-100 rounded-lg transition-colors"
            title="Add client"
          >
            <Plus className="w-5 h-5 text-slate-600" />
          </button>
        </div>

        {isAddingClient && (
          <div className="space-y-2">
            <input
              type="text"
              value={newClientName}
              onChange={(e) => setNewClientName(e.target.value)}
              placeholder="Client name"
              className="w-full px-3 py-2 border border-blue-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              onKeyPress={(e) => e.key === 'Enter' && addClient()}
            />
            <div className="flex gap-2">
              <button
                onClick={addClient}
                className="flex-1 px-3 py-1 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700"
              >
                Add
              </button>
              <button
                onClick={() => {
                  setIsAddingClient(false);
                  setNewClientName('');
                }}
                className="flex-1 px-3 py-1 bg-slate-100 text-slate-700 text-sm rounded-lg hover:bg-slate-200"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="space-y-2 p-4">
        {loading ? (
          <p className="text-center text-sm text-slate-500 py-4">Loading clients...</p>
        ) : clients.length === 0 ? (
          <p className="text-center text-sm text-slate-500 py-4">No clients yet. Add one to get started!</p>
        ) : (
          clients.map((client) => (
            <div key={client.id}>
              <button
                onClick={() => toggleClient(client.id)}
                className="w-full flex items-center gap-2 px-4 py-2 hover:bg-blue-50 rounded-lg transition-colors"
              >
                {client.isExpanded ? (
                  <ChevronDown className="w-4 h-4 text-slate-600" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-slate-600" />
                )}
                <span className="font-medium text-slate-900 text-sm">{client.name}</span>
              </button>

              {client.isExpanded && (
                <div className="ml-6 space-y-1 mt-1">
                  {client.categories.map((category) => (
                    <button
                      key={category.id}
                      className="w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-lg transition-colors"
                    >
                      <span>{category.name}</span>
                      {category.taskCount > 0 && (
                        <span className="ml-2 text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                          {category.taskCount}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
