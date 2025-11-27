import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

interface SummaryCard {
  label: string;
  count: number;
  color: string;
}

interface HeaderProps {
  summaryCards: SummaryCard[];
}

export function Header({ summaryCards }: HeaderProps) {
  const [userName, setUserName] = useState('User');
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    const getGreeting = () => {
      const hour = new Date().getHours();
      if (hour < 12) return 'Good Morning';
      if (hour < 18) return 'Good Afternoon';
      return 'Good Evening';
    };

    setGreeting(getGreeting());

    const getUserName = async () => {
      const { data } = await supabase.auth.getUser();
      if (data.user?.email) {
        const name = data.user.email.split('@')[0];
        setUserName(name.charAt(0).toUpperCase() + name.slice(1));
      }
    };

    getUserName();
  }, []);

  return (
    <div className="bg-white border-b border-blue-100">
      <div className="p-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-8">
          {greeting}, <span className="text-blue-600">{userName}</span>
        </h1>

        <div className="grid grid-cols-3 gap-4">
          {summaryCards.map((card, idx) => (
            <div
              key={idx}
              className={`${card.color} rounded-xl p-6 border border-blue-100`}
            >
              <p className="text-slate-600 text-sm font-medium mb-2">{card.label}</p>
              <p className="text-3xl font-bold text-slate-900">{card.count}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
