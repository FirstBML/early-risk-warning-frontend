"use client"

import React, { useState, useEffect, useMemo } from 'react';
import { Activity, AlertTriangle, BarChart3, TrendingUp, Shield, Database, Globe, Moon, Sun, Zap, Users, RefreshCw, Download } from 'lucide-react';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://easygoing-charm-production-707b.up.railway.app/api';

const tabs = [
  { id: 'overview', label: 'Overview', icon: Activity },
  { id: 'positions', label: 'Positions', icon: Users },
  { id: 'reserves', label: 'Reserves', icon: Database },
  { id: 'liquidations', label: 'Liquidations', icon: AlertTriangle },
  { id: 'risk', label: 'Risk Analysis', icon: Shield },
  { id: 'chains', label: 'Cross-Chain', icon: Globe },
  { id: 'metrics', label: 'Advanced', icon: Zap },
];

function GaugeChart({ value, max = 100, label, isDark }: any) {
  const percentage = Math.min((value / max) * 100, 100);
  const circumference = 2 * Math.PI * 45;
  const offset = circumference - (percentage / 100) * circumference;
  
  let color = '#10b981';
  if (percentage > 70) color = '#ef4444';
  else if (percentage > 40) color = '#f59e0b';
  
  return (
    <div className="flex flex-col items-center">
      <div className="relative w-32 h-32">
        <svg className="transform -rotate-90 w-32 h-32">
          <circle cx="64" cy="64" r="45" stroke={isDark ? '#374151' : '#e5e7eb'} strokeWidth="8" fill="none" />
          <circle
            cx="64" cy="64" r="45" stroke={color} strokeWidth="8" fill="none"
            strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            {value.toFixed(0)}
          </span>
          <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>/ {max}</span>
        </div>
      </div>
      <p className={`mt-2 text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>{label}</p>
    </div>
  );
}

function ProgressBar({ value, max = 100, label, isDark }: any) {
  const percentage = Math.min((value / max) * 100, 100);
  
  let colorClass = 'bg-green-600';
  if (percentage > 70) colorClass = 'bg-red-600';
  else if (percentage > 40) colorClass = 'bg-yellow-600';
  
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>{label}</span>
        <span className={isDark ? 'text-gray-400' : 'text-gray-500'}>{percentage.toFixed(1)}%</span>
      </div>
      <div className={`w-full h-3 ${isDark ? 'bg-gray-700' : 'bg-gray-200'} rounded-full overflow-hidden`}>
        <div className={`h-full ${colorClass} rounded-full transition-all duration-500`} style={{ width: `${percentage}%` }} />
      </div>
    </div>
  );
}

function BarChart({ data, xKey, yKey, isDark }: any) {
  if (!data || data.length === 0) return null;
  const maxValue = Math.max(...data.map((d: any) => d[yKey] || 0));
  
  return (
    <div className="space-y-2">
      {data.slice(0, 5).map((item: any, idx: number) => {
        const percentage = maxValue > 0 ? ((item[yKey] || 0) / maxValue) * 100 : 0;
        return (
          <div key={idx} className="space-y-1">
            <div className="flex justify-between text-sm">
              <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>{item[xKey]}</span>
              <span className={isDark ? 'text-gray-400' : 'text-gray-500'}>{item[yKey]}</span>
            </div>
            <div className={`w-full h-2 ${isDark ? 'bg-gray-700' : 'bg-gray-200'} rounded-full overflow-hidden`}>
              <div className="h-full bg-blue-600 rounded-full transition-all duration-500" style={{ width: `${percentage}%` }} />
            </div>
          </div>
        );
      })}
    </div>
  );
}

function StatCard({ title, value, trend, loading, isDark, icon: Icon }: any) {
  return (
    <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow p-6`}>
      <div className="flex items-center justify-between mb-2">
        <h3 className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{title}</h3>
        {Icon && <Icon className={`h-5 w-5 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} />}
      </div>
      {loading ? (
        <div className={`h-8 ${isDark ? 'bg-gray-700' : 'bg-gray-200'} rounded animate-pulse`}></div>
      ) : (
        <>
          <div className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{value}</div>
          {trend && <div className={`text-sm ${isDark ? 'text-gray-500' : 'text-gray-500'} mt-1`}>{trend}</div>}
        </>
      )}
    </div>
  );
}

function DataTable({ data, columns, loading, isDark }: any) {
  if (loading) {
    return (
      <div className="space-y-2">
        {[1, 2, 3].map(i => (
          <div key={i} className={`h-16 ${isDark ? 'bg-gray-700' : 'bg-gray-200'} rounded animate-pulse`}></div>
        ))}
      </div>
    );
  }

  if (!data || data.length === 0) {
    return <div className={`text-center py-12 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>No data available</div>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className={isDark ? 'bg-gray-800' : 'bg-gray-50'}>
          <tr>
            {columns.map((col: any) => (
              <th key={col.key} className={`px-6 py-3 text-left text-xs font-medium ${isDark ? 'text-gray-400' : 'text-gray-500'} uppercase tracking-wider`}>
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className={`${isDark ? 'bg-gray-900 divide-gray-800' : 'bg-white divide-gray-200'}`}>
          {data.map((row: any, idx: number) => (
            <tr key={idx} className={isDark ? 'hover:bg-gray-800' : 'hover:bg-gray-50'}>
              {columns.map((col: any) => (
                <td key={col.key} className={`px-6 py-4 whitespace-nowrap text-sm ${isDark ? 'text-gray-300' : 'text-gray-900'}`}>
                  {col.render ? col.render(row[col.key], row) : row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function OverviewTab({ isDark }: any) {
  const [stats, setStats] = useState<any>(null);
  const [health, setHealth] = useState<any>(null);
  const [summary, setSummary] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch(`${API_BASE}/data/quick-stats`).then(r => r.json()).catch(() => null),
      fetch(`${API_BASE}/insights/protocol-health`).then(r => r.json()).catch(() => null),
      fetch(`${API_BASE}/protocol_risk_summary`).then(r => r.json()).catch(() => null),
    ]).then(([statsData, healthData, summaryData]) => {
      console.log('Overview Data:', { statsData, healthData, summaryData });
      setStats(statsData);
      setHealth(healthData);
      setSummary(summaryData);
      setLoading(false);
    });
  }, []);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Positions" value={stats?.positions?.toLocaleString() || '0'} icon={Users} loading={loading} isDark={isDark} />
        <StatCard title="Total Collateral" value={stats?.total_collateral_usd ? `$${(stats.total_collateral_usd / 1e6).toFixed(2)}M` : '$0.00'} icon={Database} loading={loading} isDark={isDark} />
        <StatCard title="At-Risk Positions" value={stats?.at_risk_positions?.toLocaleString() || '0'} icon={AlertTriangle} trend={stats?.at_risk_positions > 10 ? "High risk detected" : "Normal"} loading={loading} isDark={isDark} />
        <StatCard title="Critical Positions" value={stats?.critical_positions?.toLocaleString() || '0'} icon={Shield} loading={loading} isDark={isDark} />
      </div>

      <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow p-6`}>
        <h2 className={`text-lg font-semibold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>Health Metrics</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <GaugeChart value={health?.health_score?.score || 0} max={100} label="Health Score" isDark={isDark} />
          <GaugeChart value={(summary?.protocol_ltv || 0) * 100} max={100} label="Protocol LTV %" isDark={isDark} />
          <GaugeChart value={Math.min((summary?.average_health_factor || 0) * 20, 100)} max={100} label="Avg Health Factor" isDark={isDark} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow p-6`}>
          <h3 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>Protocol Summary</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>Total Debt</span>
              <span className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                ${summary?.total_debt_usd ? (summary.total_debt_usd / 1e6).toFixed(2) : '0'}M
              </span>
            </div>
            <div className="flex justify-between">
              <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>At Risk Value</span>
              <span className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                ${summary?.at_risk_value_usd ? (summary.at_risk_value_usd / 1e6).toFixed(2) : '0'}M
              </span>
            </div>
            <div className="flex justify-between">
              <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>Risk Percentage</span>
              <span className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {summary?.at_risk_percentage?.toFixed(1) || '0'}%
              </span>
            </div>
          </div>
        </div>

        <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow p-6`}>
          <h3 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>Risk Distribution</h3>
          {health?.position_insights?.risk_distribution && (
            <BarChart 
              data={Object.entries(health.position_insights.risk_distribution).map(([k, v]) => ({ category: k, count: v }))}
              xKey="category" yKey="count" isDark={isDark}
            />
          )}
        </div>
      </div>
    </div>
  );
}

function PositionsTab({ isDark }: any) {
  const [positions, setPositions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const endpoint = filter === 'risky' ? '/positions/risky' : '/positions';
    fetch(`${API_BASE}${endpoint}`)
      .then(r => r.json())
      .then(data => {
        const posArray = Array.isArray(data) ? data : (data.positions || data.data || []);
        console.log('Positions Data:', posArray);
        setPositions(posArray);
        setLoading(false);
      })
      .catch(() => {
        setPositions([]);
        setLoading(false);
      });
  }, [filter]);

  const columns = [
    { key: 'borrower_address', label: 'User', render: (val: string) => val ? `${val.slice(0, 6)}...${val.slice(-4)}` : 'N/A' },
    { key: 'chain', label: 'Chain' },
    { key: 'token_symbol', label: 'Asset' },
    { 
      key: 'collateral_usd', 
      label: 'Collateral', 
      render: (val: number) => {
        if (!val) return '$0.00';
        if (val >= 1e6) return `$${(val / 1e6).toFixed(2)}M`;
        if (val >= 1e3) return `$${(val / 1e3).toFixed(2)}K`;
        return `$${val.toFixed(2)}`;
      }
    },
    { 
      key: 'debt_usd', 
      label: 'Debt', 
      render: (val: number) => {
        if (!val) return '$0.00';
        if (val >= 1e6) return `$${(val / 1e6).toFixed(2)}M`;
        if (val >= 1e3) return `$${(val / 1e3).toFixed(2)}K`;
        return `$${val.toFixed(2)}`;
      }
    },
    { 
      key: 'enhanced_health_factor', 
      label: 'Health Factor', 
      render: (val: number) => {
        if (!val) return 'N/A';
        const color = val < 1.1 ? 'text-red-600' : val < 1.5 ? 'text-yellow-600' : 'text-green-600';
        return <span className={color}>{val.toFixed(2)}</span>;
      }
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <button onClick={() => setFilter('all')} className={`px-4 py-2 rounded ${filter === 'all' ? 'bg-blue-600 text-white' : isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-900'}`}>
          All Positions
        </button>
        <button onClick={() => setFilter('risky')} className={`px-4 py-2 rounded ${filter === 'risky' ? 'bg-red-600 text-white' : isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-900'}`}>
          Risky Positions
        </button>
      </div>

      <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow p-6`}>
        <h2 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
          {filter === 'risky' ? 'Risky Positions' : 'All Positions'}
        </h2>
        <DataTable data={positions.slice(0, 50)} columns={columns} loading={loading} isDark={isDark} />
      </div>
    </div>
  );
}

function ReservesTab({ isDark }: any) {
  const [reserves, setReserves] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE}/reserves/rpc`)
      .then(r => r.json())
      .then(data => {
        const resArray = Array.isArray(data) ? data : (data.reserves || data.data || []);
        console.log('Reserves Data:', resArray);
        setReserves(resArray);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Reserves Error:', error);
        setReserves([]);
        setLoading(false);
      });
  }, []);

  const columns = [
    { key: 'chain', label: 'Chain' },
    { key: 'token_symbol', label: 'Asset' },
    { key: 'supply_apy', label: 'Supply APY', render: (val: number) => val ? `${(val * 100).toFixed(2)}%` : '0.00%' },
    { key: 'borrow_apy', label: 'Borrow APY', render: (val: number) => val ? `${(val * 100).toFixed(2)}%` : '0.00%' },
    { key: 'ltv', label: 'LTV', render: (val: number) => val ? `${(val * 100).toFixed(0)}%` : '0%' },
    { key: 'liquidation_threshold', label: 'Liq. Threshold', render: (val: number) => val ? `${(val * 100).toFixed(0)}%` : '0%' },
  ];

  return (
    <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow p-6`}>
      <h2 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>Reserve Assets</h2>
      <DataTable data={reserves} columns={columns} loading={loading} isDark={isDark} />
    </div>
  );
}

function LiquidationsTab({ isDark }: any) {
  const [liquidations, setLiquidations] = useState<any[]>([]);
  const [trends, setTrends] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch(`${API_BASE}/liquidation-history`).then(r => r.json()).catch(() => []),
      fetch(`${API_BASE}/liquidation_trends`).then(r => r.json()).catch(() => null),
    ]).then(([liqData, trendsData]) => {
      const liqArray = Array.isArray(liqData) ? liqData : (liqData.history || liqData.data || []);
      console.log('Liquidations Data:', { liqArray, trendsData });
      setLiquidations(liqArray);
      setTrends(trendsData);
      setLoading(false);
    });
  }, []);

  const columns = [
    { key: 'chain', label: 'Chain' },
    { key: 'collateral_symbol', label: 'Collateral' },
    { key: 'debt_symbol', label: 'Debt' },
    { 
      key: 'collateral_seized_usd', 
      label: 'Value', 
      render: (val: number) => {
        if (!val) return '$0.00';
        if (val >= 1e6) return `$${(val / 1e6).toFixed(2)}M`;
        if (val >= 1e3) return `$${(val / 1e3).toFixed(2)}K`;
        return `$${val.toFixed(2)}`;
      }
    },
    { 
      key: 'liquidation_date', 
      label: 'Date', 
      render: (val: string) => {
        if (!val) return 'N/A';
        try {
          const date = new Date(val);
          return isNaN(date.getTime()) ? 'Invalid Date' : date.toLocaleDateString();
        } catch {
          return 'Invalid Date';
        }
      }
    },
  ];

  return (
    <div className="space-y-6">
      {trends && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatCard title="24h Liquidations" value={trends.liquidations_24h || 0} icon={AlertTriangle} loading={loading} isDark={isDark} />
          <StatCard title="24h Volume" value={trends.liquidation_volume_usd_24h ? `$${(trends.liquidation_volume_usd_24h / 1e6).toFixed(2)}M` : '$0'} loading={loading} isDark={isDark} />
          <StatCard title="7d Average" value={trends.daily_average_7d?.toFixed(1) || '0'} trend={trends.trend || 'STABLE'} loading={loading} isDark={isDark} />
        </div>
      )}

      <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow p-6`}>
        <h2 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>Recent Liquidations</h2>
        <DataTable data={liquidations.slice(0, 20)} columns={columns} loading={loading} isDark={isDark} />
      </div>
    </div>
  );
}

function RiskTab({ isDark }: any) {
  const [alerts, setAlerts] = useState<any[]>([]);
  const [signals, setSignals] = useState<any[]>([]);
  const [positions, setPositions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch(`${API_BASE}/risk_alerts_feed`).then(r => r.json()).catch(() => []),
      fetch(`${API_BASE}/borrower_risk_signals`).then(r => r.json()).catch(() => ({ signals: [] })),
      fetch(`${API_BASE}/positions`).then(r => r.json()).catch(() => []),
    ]).then(([alertData, signalData, posData]) => {
      const alertArray = Array.isArray(alertData) ? alertData : (alertData.alerts || alertData.data || []);
      setAlerts(alertArray);
      setSignals(signalData.signals || []);
      setPositions(Array.isArray(posData) ? posData : []);
      setLoading(false);
    });
  }, []);

  const riskDistribution = useMemo(() => {
    const categories: any = { SAFE: 0, LOW: 0, MEDIUM: 0, HIGH: 0, CRITICAL: 0 };
    positions.forEach((pos: any) => {
      const hf = pos.enhanced_health_factor || 0;
      if (hf >= 2) categories.SAFE++;
      else if (hf >= 1.5) categories.LOW++;
      else if (hf >= 1.3) categories.MEDIUM++;
      else if (hf >= 1.1) categories.HIGH++;
      else categories.CRITICAL++;
    });
    return Object.entries(categories).map(([name, value]) => ({ name, value, percentage: (Number(value) / positions.length) * 100 }));
  }, [positions]);

  return (
    <div className="space-y-6">
      <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow p-6`}>
        <h2 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>Position Risk Categories</h2>
        {loading ? (
          <div className="space-y-3">{[1,2,3,4,5].map(i => <div key={i} className={`h-8 ${isDark ? 'bg-gray-700' : 'bg-gray-200'} rounded animate-pulse`}></div>)}</div>
        ) : (
          <div className="space-y-4">
            {riskDistribution.map((cat: any, idx: number) => (
              <ProgressBar key={idx} value={cat.percentage} max={100} label={`${cat.name}: ${cat.value} positions`} isDark={isDark} />
            ))}
          </div>
        )}
      </div>

      <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow p-6`}>
        <h2 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>Borrower Risk Signals</h2>
        {loading ? (
          <div className="space-y-2">{[1, 2].map(i => <div key={i} className={`h-16 ${isDark ? 'bg-gray-700' : 'bg-gray-200'} rounded animate-pulse`}></div>)}</div>
        ) : signals.length > 0 ? (
          <div className="space-y-3">
            {signals.slice(0, 5).map((signal: any, idx: number) => (
              <div key={idx} className={`border-l-4 ${signal.urgency === 'CRITICAL' ? 'border-red-500' : signal.urgency === 'HIGH' ? 'border-orange-500' : 'border-yellow-500'} ${isDark ? 'bg-gray-700' : 'bg-gray-100'} p-4 rounded`}>
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>{signal.title}</h4>
                    <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{signal.description}</p>
                  </div>
                  <span className={`px-2 py-1 rounded text-xs ${signal.urgency === 'CRITICAL' ? 'bg-red-100 text-red-800' : signal.urgency === 'HIGH' ? 'bg-orange-100 text-orange-800' : 'bg-yellow-100 text-yellow-800'}`}>
                    {signal.urgency}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className={`text-center py-4 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            No risk signals found
          </div>
        )}
      </div>
    </div>
  );
}

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [isDark, setIsDark] = useState(false);

  const toggleTheme = () => {
    setIsDark(prev => !prev);
    document.documentElement.classList.toggle('dark', !isDark);
  };

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-900' : 'bg-gray-50'} transition-all`}>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className={`text-3xl font-extrabold ${isDark ? 'text-white' : 'text-gray-900'}`}>Dashboard</h1>
          <button onClick={toggleTheme} className={`px-4 py-2 rounded ${isDark ? 'bg-gray-800 text-gray-300' : 'bg-gray-200 text-gray-900'}`}>
            {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
        </div>

        <div className="flex space-x-4 mb-8">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all flex items-center justify-center space-x-2
                ${activeTab === tab.id ? (isDark ? 'bg-gray-700 text-white' : 'bg-blue-600 text-white') : (isDark ? 'bg-gray-800 text-gray-300' : 'bg-gray-100 text-gray-900')}`}
            >
              <tab.icon className="w-5 h-5" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          {activeTab === 'overview' && <OverviewTab isDark={isDark} />}
          {activeTab === 'positions' && <PositionsTab isDark={isDark} />}
          {activeTab === 'reserves' && <ReservesTab isDark={isDark} />}
          {activeTab === 'liquidations' && <LiquidationsTab isDark={isDark} />}
          {activeTab === 'risk' && <RiskTab isDark={isDark} />}
          {/* Add Metrics tab content here when available */}
        </div>
      </div>
    </div>
  );
}
