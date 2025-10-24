"use client"

import React, { useState, useEffect } from 'react';
import { Activity, AlertTriangle, BarChart3, TrendingUp, Shield, Database, Globe, Moon, Sun, Zap, Users } from 'lucide-react';

const API_BASE = 'https://easygoing-charm-production-707b.up.railway.app/api';

const tabs = [
  { id: 'overview', label: 'Overview', icon: Activity },
  { id: 'positions', label: 'Positions', icon: Users },
  { id: 'reserves', label: 'Reserves', icon: Database },
  { id: 'liquidations', label: 'Liquidations', icon: AlertTriangle },
  { id: 'risk', label: 'Risk Analysis', icon: Shield },
  { id: 'chains', label: 'Cross-Chain', icon: Globe },
  { id: 'metrics', label: 'Advanced', icon: Zap },
];

// Type definitions
interface GaugeChartProps {
  value: number;
  max?: number;
  label: string;
  isDark: boolean;
}

interface ProgressBarProps {
  value: number;
  max: number;
  label: string;
  color: string;
  isDark: boolean;
}

interface BarChartProps {
  data: any[];
  xKey: string;
  yKey: string;
  isDark: boolean;
}

interface StatCardProps {
  title: string;
  value: string | number;
  trend?: string;
  loading: boolean;
  isDark: boolean;
  icon?: any;
}

interface DataTableProps {
  data: any[];
  columns: any[];
  loading: boolean;
  isDark: boolean;
}

// Gauge Chart Component
function GaugeChart({ value, max = 100, label, isDark }: GaugeChartProps) {
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
          <circle
            cx="64"
            cy="64"
            r="45"
            stroke={isDark ? '#374151' : '#e5e7eb'}
            strokeWidth="8"
            fill="none"
          />
          <circle
            cx="64"
            cy="64"
            r="45"
            stroke={color}
            strokeWidth="8"
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
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

// Progress Bar for Risk Categories
function ProgressBar({ value, max, label, color, isDark }: ProgressBarProps) {
  const percentage = Math.min((value / max) * 100, 100);
  
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-sm">
        <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>{label}</span>
        <span className={isDark ? 'text-gray-400' : 'text-gray-500'}>{value}</span>
      </div>
      <div className={`w-full h-2 ${isDark ? 'bg-gray-700' : 'bg-gray-200'} rounded-full overflow-hidden`}>
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ 
            width: `${percentage}%`,
            backgroundColor: color
          }}
        />
      </div>
    </div>
  );
}

function BarChart({ data, xKey, yKey, isDark }: BarChartProps) {
  if (!data || data.length === 0) return null;
  
  const maxValue = Math.max(...data.map(d => d[yKey] || 0));
  
  return (
    <div className="space-y-2">
      {data.slice(0, 5).map((item, idx) => {
        const percentage = maxValue > 0 ? ((item[yKey] || 0) / maxValue) * 100 : 0;
        return (
          <div key={idx} className="space-y-1">
            <div className="flex justify-between text-sm">
              <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>{item[xKey]}</span>
              <span className={isDark ? 'text-gray-400' : 'text-gray-500'}>{item[yKey]}</span>
            </div>
            <div className={`w-full h-2 ${isDark ? 'bg-gray-700' : 'bg-gray-200'} rounded-full overflow-hidden`}>
              <div
                className="h-full bg-blue-600 rounded-full transition-all duration-500"
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

function StatCard({ title, value, trend, loading, isDark, icon: Icon }: StatCardProps) {
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

function DataTable({ data, columns, loading, isDark }: DataTableProps) {
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
    return (
      <div className={`text-center py-12 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
        No data available
      </div>
    );
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
          {data.map((row, idx) => (
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

function OverviewTab({ isDark }: { isDark: boolean }) {
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
      setStats(statsData);
      setHealth(healthData);
      setSummary(summaryData);
      setLoading(false);
    });
  }, []);

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="Total Positions" 
          value={stats?.positions?.toLocaleString() || '0'} 
          icon={Users}
          loading={loading}
          isDark={isDark}
        />
        <StatCard 
          title="Total Collateral" 
          value={stats?.total_collateral_usd ? `${(stats.total_collateral_usd / 1e6).toFixed(2)}M` : '$0.00'} 
          icon={Database}
          loading={loading}
          isDark={isDark}
        />
        <StatCard 
          title="At-Risk Positions" 
          value={stats?.at_risk_positions?.toLocaleString() || '0'} 
          icon={AlertTriangle}
          trend={stats?.at_risk_positions > 10 ? "High risk detected" : "Normal"}
          loading={loading}
          isDark={isDark}
        />
        <StatCard 
          title="Critical Positions" 
          value={stats?.critical_positions?.toLocaleString() || '0'} 
          icon={Shield}
          loading={loading}
          isDark={isDark}
        />
      </div>

      {/* Gauges */}
      <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow p-6`}>
        <h2 className={`text-lg font-semibold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>Health Metrics</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <GaugeChart 
            value={health?.health_score?.score || 0} 
            max={100} 
            label="Health Score" 
            isDark={isDark}
          />
          <GaugeChart 
            value={(summary?.protocol_ltv || 0) * 100} 
            max={100} 
            label="Protocol LTV %" 
            isDark={isDark}
          />
          <GaugeChart 
            value={Math.min((summary?.average_health_factor || 0) * 20, 100)} 
            max={100} 
            label="Avg Health Factor" 
            isDark={isDark}
          />
        </div>
      </div>

      {/* Protocol Details */}
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
              data={Object.entries(health.position_insights.risk_distribution).map(([k, v]) => ({
                category: k,
                count: v
              }))}
              xKey="category"
              yKey="count"
              isDark={isDark}
            />
          )}
        </div>
      </div>
    </div>
  );
}

function PositionsTab({ isDark }: { isDark: boolean }) {
  const [positions, setPositions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const endpoint = filter === 'risky' ? '/positions/risky' : '/positions';
    fetch(`${API_BASE}${endpoint}`)
      .then(r => r.json())
      .then(data => {
        const posArray = Array.isArray(data) ? data : (data.positions || data.data || []);
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
        if (val >= 1e6) return `${(val / 1e6).toFixed(2)}M`;
        if (val >= 1e3) return `${(val / 1e3).toFixed(2)}K`;
        return `${val.toFixed(2)}`;
      }
    },
    { 
      key: 'debt_usd', 
      label: 'Debt', 
      render: (val: number) => {
        if (!val) return '$0.00';
        if (val >= 1e6) return `${(val / 1e6).toFixed(2)}M`;
        if (val >= 1e3) return `${(val / 1e3).toFixed(2)}K`;
        return `${val.toFixed(2)}`;
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
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded ${filter === 'all' ? 'bg-blue-600 text-white' : isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-900'}`}
        >
          All Positions
        </button>
        <button
          onClick={() => setFilter('risky')}
          className={`px-4 py-2 rounded ${filter === 'risky' ? 'bg-red-600 text-white' : isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-900'}`}
        >
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

function ReservesTab({ isDark }: { isDark: boolean }) {
  const [reserves, setReserves] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE}/reserves/rpc`)
      .then(r => r.json())
      .then(data => {
        const resArray = Array.isArray(data) ? data : (data.reserves || data.data || []);
        setReserves(resArray);
        setLoading(false);
      })
      .catch(() => {
        setReserves([]);
        setLoading(false);
      });
  }, []);

  const columns = [
    { key: 'chain', label: 'Chain' },
    { key: 'token_symbol', label: 'Asset' },
    { 
      key: 'supply_apy', 
      label: 'Supply APY', 
      render: (val: number) => {
        if (!val || val === 0) return '0.00%';
        const percentage = val > 1 ? val : val * 100;
        return `${percentage.toFixed(2)}%`;
      }
    },
    { 
      key: 'borrow_apy', 
      label: 'Borrow APY', 
      render: (val: number) => {
        if (!val || val === 0) return '0.00%';
        const percentage = val > 1 ? val : val * 100;
        return `${percentage.toFixed(2)}%`;
      }
    },
    { 
      key: 'ltv', 
      label: 'LTV', 
      render: (val: number) => {
        if (!val || val === 0) return '0%';
        const percentage = val > 1 ? val : val * 100;
        return `${percentage.toFixed(0)}%`;
      }
    },
    { 
      key: 'liquidation_threshold', 
      label: 'Liq. Threshold', 
      render: (val: number) => {
        if (!val || val === 0) return '0%';
        const percentage = val > 1 ? val : val * 100;
        return `${percentage.toFixed(0)}%`;
      }
    },
  ];

  return (
    <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow p-6`}>
      <h2 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>Reserve Assets</h2>
      <DataTable data={reserves} columns={columns} loading={loading} isDark={isDark} />
    </div>
  );
}

function LiquidationsTab({ isDark }: { isDark: boolean }) {
  const [liquidations, setLiquidations] = useState<any[]>([]);
  const [trends, setTrends] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch(`${API_BASE}/liquidation-history`).then(r => r.json()).catch(() => []),
      fetch(`${API_BASE}/liquidation_trends`).then(r => r.json()).catch(() => null),
    ]).then(([liqData, trendsData]) => {
      const liqArray = Array.isArray(liqData) ? liqData : (liqData.history || liqData.data || []);
      
      // Fix date formatting
      const formattedLiqArray = liqArray.map((item: any) => ({
        ...item,
        liquidation_date: item.liquidation_date ? new Date(item.liquidation_date).toLocaleDateString() : 'N/A'
      }));
      
      setLiquidations(formattedLiqArray);
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
        if (val >= 1e6) return `${(val / 1e6).toFixed(2)}M`;
        if (val >= 1e3) return `${(val / 1e3).toFixed(2)}K`;
        return `${val.toFixed(2)}`;
      }
    },
    { key: 'liquidation_date', label: 'Date' },
  ];

  return (
    <div className="space-y-6">
      {/* Trends */}
      {trends && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatCard 
            title="24h Liquidations" 
            value={trends.liquidations_24h || 0}
            icon={AlertTriangle}
            loading={loading}
            isDark={isDark}
          />
          <StatCard 
            title="24h Volume" 
            value={trends.liquidation_volume_usd_24h ? `$${(trends.liquidation_volume_usd_24h / 1e6).toFixed(2)}M` : '$0'}
            loading={loading}
            isDark={isDark}
          />
          <StatCard 
            title="7d Average" 
            value={trends.daily_average_7d?.toFixed(1) || '0'}
            trend={trends.trend || 'STABLE'}
            loading={loading}
            isDark={isDark}
          />
        </div>
      )}

      <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow p-6`}>
        <h2 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>Recent Liquidations</h2>
        <DataTable data={liquidations.slice(0, 20)} columns={columns} loading={loading} isDark={isDark} />
      </div>
    </div>
  );
}

function RiskTab({ isDark }: { isDark: boolean }) {
  const [alerts, setAlerts] = useState<any[]>([]);
  const [signals, setSignals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch(`${API_BASE}/risk_alerts_feed`).then(r => r.json()).catch(() => []),
      fetch(`${API_BASE}/borrower_risk_signals`).then(r => r.json()).catch(() => ({ signals: [] })),
    ]).then(([alertData, signalData]) => {
      const alertArray = Array.isArray(alertData) ? alertData : (alertData.alerts || alertData.data || []);
      setAlerts(alertArray);
      setSignals(signalData.signals || []);
      setLoading(false);
    });
  }, []);

  return (
    <div className="space-y-6">
      {/* Risk Signals */}
      <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow p-6`}>
        <h2 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>Borrower Risk Signals</h2>
        {loading ? (
          <div className="space-y-2">
            {[1, 2].map(i => (
              <div key={i} className={`h-16 ${isDark ? 'bg-gray-700' : 'bg-gray-200'} rounded animate-pulse`}></div>
            ))}
          </div>
        ) : signals.length > 0 ? (
          <div className="space-y-3">
            {signals.slice(0, 5).map((signal: any, idx: number) => (
              <div key={idx} className={`border-l-4 ${
                signal.urgency === 'CRITICAL' ? 'border-red-500' : 
                signal.urgency === 'HIGH' ? 'border-orange-500' : 'border-yellow-500'
              } ${isDark ? 'bg-gray-900' : 'bg-gray-50'} p-4 rounded`}>
                <div className="flex justify-between items-start">
                  <div>
                    <div className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {signal.borrower_address} - {signal.chain}
                    </div>
                    <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      HF: {signal.current_health_factor} | Collateral: ${(signal.collateral_usd / 1e3).toFixed(2)}K
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    signal.urgency === 'CRITICAL' ? 'bg-red-100 text-red-800' :
                    signal.urgency === 'HIGH' ? 'bg-orange-100 text-orange-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {signal.urgency}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className={isDark ? 'text-gray-400' : 'text-gray-500'}>No risk signals detected</p>
        )}
      </div>

      {/* Risk Alerts */}
      <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow p-6`}>
        <h2 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>Risk Alerts Feed</h2>
        {loading ? (
          <div className="space-y-2">
            {[1, 2, 3].map(i => (
              <div key={i} className={`h-16 ${isDark ? 'bg-gray-700' : 'bg-gray-200'} rounded animate-pulse`}></div>
            ))}
          </div>
        ) : alerts.length > 0 ? (
          <div className="space-y-3">
            {alerts.slice(0, 10).map((alert: any, idx: number) => (
              <div key={idx} className={`border-l-4 border-red-500 ${isDark ? 'bg-red-900/20' : 'bg-red-50'} p-4 rounded`}>
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
                  <div className="flex-1">
                    <div className={`font-medium ${isDark ? 'text-red-400' : 'text-red-900'}`}>{alert.severity || 'ALERT'}</div>
                    <div className={`text-sm ${isDark ? 'text-red-300' : 'text-red-700'}`}>{alert.message || 'No details available'}</div>
                    {alert.timestamp && (
                      <div className={`text-xs ${isDark ? 'text-red-500' : 'text-red-600'} mt-1`}>
                        {new Date(alert.timestamp).toLocaleString()}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className={isDark ? 'text-gray-400' : 'text-gray-500'}>No alerts at this time</p>
        )}
      </div>
    </div>
  );
}

function ChainsTab({ isDark }: { isDark: boolean }) {
  const [chains, setChains] = useState<any[]>([]);
  const [comparison, setComparison] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch(`${API_BASE}/chains/available`).then(r => r.json()).catch(() => ({ chains: [] })),
      fetch(`${API_BASE}/crosschain_risk_comparison`).then(r => r.json()).catch(() => ({ comparison: [] })),
    ]).then(([chainsData, compData]) => {
      const chainArray = Array.isArray(chainsData) ? chainsData : (chainsData.chains || chainsData.data || []);
      const compArray = Array.isArray(compData) ? compData : (compData.comparison || compData.data || []);
      setChains(chainArray);
      setComparison(compArray);
      setLoading(false);
    });
  }, []);

  return (
    <div className="space-y-6">
      {/* Available Chains */}
      <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow p-6`}>
        <h2 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>Available Chains</h2>
        {loading ? (
          <div className={`h-16 ${isDark ? 'bg-gray-700' : 'bg-gray-200'} rounded animate-pulse`}></div>
        ) : chains.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {chains.map((chain: any, idx: number) => (
              <span key={idx} className={`px-4 py-2 ${isDark ? 'bg-blue-900 text-blue-200' : 'bg-blue-100 text-blue-800'} rounded-full font-medium`}>
                {typeof chain === 'string' ? chain : chain.name || chain.chain}
              </span>
            ))}
          </div>
        ) : (
          <p className={isDark ? 'text-gray-400' : 'text-gray-500'}>No chains available</p>
        )}
      </div>

      {/* Cross-Chain Comparison */}
      <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow p-6`}>
        <h2 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>Cross-Chain Risk Comparison</h2>
        {loading ? (
          <div className="space-y-2">
            {[1, 2].map(i => (
              <div key={i} className={`h-24 ${isDark ? 'bg-gray-700' : 'bg-gray-200'} rounded animate-pulse`}></div>
            ))}
          </div>
        ) : comparison.length > 0 ? (
          <div className="space-y-4">
            {comparison.map((item: any, idx: number) => (
              <div key={idx} className={`border ${isDark ? 'border-gray-700' : 'border-gray-200'} rounded-lg p-4`}>
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className={`font-semibold text-lg ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {item.chain}
                    </h3>
                    <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      {item.total_positions} positions
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    item.safety_score > 80 ? 'bg-green-100 text-green-800' :
                    item.safety_score > 50 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                  }`}>
                    Safety: {item.safety_score?.toFixed(0) || 'N/A'}
                  </span>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <div className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>Avg Health Factor</div>
                    <div className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {item.average_health_factor?.toFixed(2) || 'N/A'}
                    </div>
                  </div>
                  <div>
                    <div className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>TVL</div>
                    <div className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      ${item.total_collateral_usd ? (item.total_collateral_usd / 1e6).toFixed(2) : '0'}M
                    </div>
                  </div>
                  <div>
                    <div className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>Debt Ratio</div>
                    <div className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {item.debt_collateral_ratio ? `${(item.debt_collateral_ratio * 100).toFixed(1)}%` : '0%'}
                    </div>
                  </div>
                  <div>
                    <div className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>7d Liquidations</div>
                    <div className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {item.liquidations_7d || 0}
                    </div>
                  </div>
                </div>
                
                {item.top_collateral_tokens && item.top_collateral_tokens.length > 0 && (
                  <div className="mt-3">
                    <div className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'} mb-2`}>Top Assets:</div>
                    <div className="flex flex-wrap gap-1">
                      {item.top_collateral_tokens.map((token: string, tidx: number) => (
                        <span key={tidx} className={`px-2 py-1 text-xs rounded ${isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'}`}>
                          {token}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className={isDark ? 'text-gray-400' : 'text-gray-500'}>No comparison data available</p>
        )}
      </div>
    </div>
  );
}

function MetricsTab({ isDark }: { isDark: boolean }) {
  const [metrics, setMetrics] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE}/reserve_risk_metrics`)
      .then(r => r.json())
      .then(data => {
        const metricsArray = Array.isArray(data) ? data : (data.metrics || data.data || []);
        setMetrics(metricsArray);
        setLoading(false);
      })
      .catch(() => {
        setMetrics([]);
        setLoading(false);
      });
  }, []);

  const columns = [
    { key: 'token_symbol', label: 'Asset' },
    { key: 'chain', label: 'Chain' },
    { key: 'utilization_rate', label: 'Utilization', render: (val: number) => val ? `${(val * 100).toFixed(1)}%` : '0%' },
    { key: 'total_exposure_usd', label: 'Exposure', render: (val: number) => val ? `${(val / 1e6).toFixed(2)}M` : '$0' },
    { key: 'risk_score', label: 'Risk Score', render: (val: number) => val || 0 },
    { 
      key: 'risk_level', 
      label: 'Risk Level',
      render: (val: string) => (
        <span className={`px-2 py-1 rounded text-xs font-medium ${
          val === 'HIGH' ? 'bg-red-100 text-red-800' :
          val === 'MEDIUM' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
        }`}>
          {val || 'LOW'}
        </span>
      )
    },
  ];

  return (
    <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow p-6`}>
      <h2 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>Reserve Risk Metrics</h2>
      <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'} mb-4`}>
        Advanced risk analysis for reserve assets
      </p>
      <DataTable data={metrics.slice(0, 20)} columns={columns} loading={loading} isDark={isDark} />
    </div>
  );
}

export default function DeFiDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [isDark, setIsDark] = useState(false);

  const renderContent = () => {
    switch (activeTab) {
      case 'overview': return <OverviewTab isDark={isDark} />;
      case 'positions': return <PositionsTab isDark={isDark} />;
      case 'reserves': return <ReservesTab isDark={isDark} />;
      case 'liquidations': return <LiquidationsTab isDark={isDark} />;
      case 'risk': return <RiskTab isDark={isDark} />;
      case 'chains': return <ChainsTab isDark={isDark} />;
      case 'metrics': return <MetricsTab isDark={isDark} />;
      default: return <OverviewTab isDark={isDark} />;
    }
  };

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-900' : 'bg-gray-100'}`}>
      {/* Header */}
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

      {/* Navigation */}
      <nav className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white'} border-b`}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex space-x-1 overflow-x-auto">
            {tabs.map(tab => {
              const Icon = tab.icon;
              return (
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
                  <Icon className="h-4 w-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        {renderContent()}
      </main>

      {/* Footer */}
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