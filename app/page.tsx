"use client"

import React, { useState } from 'react';
import { Moon, Sun } from 'lucide-react';

const API_BASE = 'https://friendly-vitality-production.up.railway.app/api';

const tabs = [
  { id: 'overview', label: 'Overview' },
  { id: 'positions', label: 'Positions' },
  { id: 'reserves', label: 'Reserves' },
  { id: 'liquidations', label: 'Liquidations' },
  { id: 'risk', label: 'Risk Analysis' },
  { id: 'chains', label: 'Cross-Chain' },
  { id: 'metrics', label: 'Advanced' },
];

function StatCard({ title, value, loading, isDark }: { 
  title: string; 
  value: string | number; 
  loading: boolean; 
  isDark: boolean; 
}) {
  return (
    <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow p-6`}>
      <div className="flex items-center justify-between mb-2">
        <h3 className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{title}</h3>
      </div>
      {loading ? (
        <div className={`h-8 ${isDark ? 'bg-gray-700' : 'bg-gray-200'} rounded animate-pulse`}></div>
      ) : (
        <div className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{value}</div>
      )}
    </div>
  );
}

function OverviewTab({ isDark }: { isDark: boolean }) {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    fetch(`${API_BASE}/data/quick-stats`)
      .then(r => r.json())
      .then(data => {
        setStats(data);
        setLoading(false);
      })
      .catch(() => {
        setStats(null);
        setLoading(false);
      });
  }, []);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="Total Positions" 
          value={stats?.positions?.toLocaleString() || '0'} 
          loading={loading}
          isDark={isDark}
        />
        <StatCard 
          title="Total Collateral" 
          value={stats?.total_collateral_usd ? `${(stats.total_collateral_usd / 1e6).toFixed(2)}M` : '$0.00'} 
          loading={loading}
          isDark={isDark}
        />
        <StatCard 
          title="At-Risk Positions" 
          value={stats?.at_risk_positions?.toLocaleString() || '0'} 
          loading={loading}
          isDark={isDark}
        />
        <StatCard 
          title="Critical Positions" 
          value={stats?.critical_positions?.toLocaleString() || '0'} 
          loading={loading}
          isDark={isDark}
        />
      </div>
    </div>
  );
}

export default function DeFiDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [isDark, setIsDark] = useState(false);

  const renderContent = () => {
    switch (activeTab) {
      case 'overview': return <OverviewTab isDark={isDark} />;
      default: return <OverviewTab isDark={isDark} />;
    }
  };

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-900' : 'bg-gray-100'}`}>
      <header className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white'} shadow-sm border-b`}>
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>DeFi Risk Dashboard</h1>
            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Real-time monitoring and analysis</p>
          </div>
          <button
            onClick={() => setIsDark(!isDark)}
            className={`p-2 rounded-lg ${isDark ? 'bg-gray-700 text-yellow-400 hover:bg-gray-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'} transition-colors`}
            aria-label="Toggle dark mode"
          >
            {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>
        </div>
      </header>

      <nav className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white'} border-b`}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex space-x-1 overflow-x-auto">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-blue-600 text-blue-600'
                    : isDark 
                      ? 'border-transparent text-gray-400 hover:text-gray-300'
                      : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-6">
        {renderContent()}
      </main>

      <footer className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white'} border-t mt-12`}>
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center text-sm">
            <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>
              DeFi Risk Dashboard © 2025
            </p>
            <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>
              Last updated: {new Date().toLocaleString()}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}