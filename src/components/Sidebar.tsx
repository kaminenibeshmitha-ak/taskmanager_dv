import { Home, Inbox, CheckSquare, MessageSquare, Calendar, Settings, HelpCircle } from 'lucide-react';
import { useState, useEffect } from 'react';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function Sidebar({ activeTab, onTabChange }: SidebarProps) {
  const [currentDay, setCurrentDay] = useState('');

  useEffect(() => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const today = new Date();
    setCurrentDay(days[today.getDay()]);
  }, []);

  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'inbox', label: 'Inbox', icon: Inbox },
    { id: 'tasks', label: 'Tasks', icon: CheckSquare },
    { id: 'chats', label: 'Chats', icon: MessageSquare },
    { id: 'calendar', label: 'Calendar', icon: Calendar },
  ];

  const bottomItems = [
    { id: 'settings', label: 'Settings', icon: Settings },
    { id: 'help', label: 'Help & Support', icon: HelpCircle },
  ];

  return (
    <div className="w-64 bg-white border-r border-blue-100 flex flex-col h-screen sticky top-0">
      <div className="p-6">
        <h2 className="text-sm font-semibold text-slate-600 uppercase tracking-wide">
          {currentDay}
        </h2>
      </div>

      <nav className="flex-1 space-y-2 px-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                isActive
                  ? 'bg-blue-50 text-blue-600 font-medium'
                  : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="space-y-2 px-4 pb-6">
        {bottomItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-slate-700 hover:bg-slate-50 transition-all"
            >
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
