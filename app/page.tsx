import React, { useState, useEffect, useMemo } from 'react';
import { Activity, AlertTriangle, BarChart3, TrendingUp, Shield, Database, Globe, Moon, Sun, Zap, Users, RefreshCw, ChevronLeft, ChevronRight, Lock, Wallet } from 'lucide-react';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://easygoing-charm-production-707b.up.railway.app/api';

// Global number formatter
function formatNumber(value: number | null | undefined, type: 'currency' | 'number' = 'number'): string {
  if (!value || value === 0) return type === 'currency' ? '$0.00' : '0';
  
  if (type === 'currency') {
    if (value >= 1e9) return `$${(value / 1e9).toFixed(2)}B`;
    if (value >= 1e6) return `$${(value / 1e6).toFixed(2)}M`;
    if (value >= 1e3) return `$${(value / 1e3).toFixed(2)}K`;
    return `$${value.toLocaleString(undefined, { 
      minimumFractionDigits: 2, 
      maximumFractionDigits: 2
    })}`;
  }
  
  return value.toLocaleString(undefined, { maximumFractionDigits: 2 });
}

const tabs = [
  { id: 'overview', label: 'Overview', icon: Activity },
  { id: 'positions', label: 'Positions', icon: Users },
  { id: 'reserves', label: 'Reserves', icon: Database },
  { id: 'liquidations', label: 'Liquidations', icon: AlertTriangle },
  { id: 'risk', label: 'Risk Analysis', icon: Shield },
  { id: 'chains', label: 'Cross-Chain', icon: Globe },
  { id: 'metrics', label: 'Advanced', icon: Zap },
  { id: 'portfolio', label: 'Portfolio', icon: Wallet },
  { id: 'security', label: 'Security', icon: Lock },
];

// Pagination Component
function Pagination({ currentPage, totalPages, onPageChange, isDark }: any) {
  return (
    <div className={`flex items-center justify-between mt-4 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
      <div className="text-sm">
        Page {currentPage} of {totalPages}
      </div>
      <div className="flex gap-2">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`px-3 py-1 rounded flex items-center gap-1 ${
            currentPage === 1
              ? 'opacity-50 cursor-not-allowed'
              : isDark ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'
          }`}
        >
          <ChevronLeft className="h-4 w-4" />
          Previous
        </button>
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`px-3 py-1 rounded flex items-center gap-1 ${
            currentPage === totalPages
              ? 'opacity-50 cursor-not-allowed'
              : isDark ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'
          }`}
        >
          Next
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

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
      setStats(statsData);
      setHealth(healthData);
      setSummary(summaryData);
      setLoading(false);
    });
  }, []);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Positions" value={formatNumber(stats?.positions)} icon={Users} loading={loading} isDark={isDark} />
        <StatCard title="Total Collateral" value={formatNumber(stats?.total_collateral_usd, 'currency')} icon={Database} loading={loading} isDark={isDark} />
        <StatCard title="At-Risk Positions" value={formatNumber(stats?.at_risk_positions)} icon={AlertTriangle} trend={stats?.at_risk_positions > 10 ? "High risk detected" : "Normal"} loading={loading} isDark={isDark} />
        <StatCard title="Critical Positions" value={formatNumber(stats?.critical_positions)} icon={Shield} loading={loading} isDark={isDark} />
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
                {formatNumber(summary?.total_debt_usd, 'currency')}
              </span>
            </div>
            <div className="flex justify-between">
              <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>At Risk Value</span>
              <span className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {formatNumber(summary?.at_risk_value_usd, 'currency')}
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
  const [groupByBorrower, setGroupByBorrower] = useState(false);
  const [viewMode, setViewMode] = useState<'detailed' | 'summary'>('detailed');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 50;

  useEffect(() => {
    setLoading(true);
    
    let endpoint = '';
    if (viewMode === 'summary') {
      endpoint = `/positions_summary?page=${currentPage}&page_size=${pageSize}`;
    } else if (filter === 'risky') {
      endpoint = `/positions/risky?page=${currentPage}&page_size=${pageSize}`;
    } else {
      endpoint = `/positions?limit=${pageSize * currentPage}&group_by_borrower=${groupByBorrower}`;
    }
    
    fetch(`${API_BASE}${endpoint}`)
      .then(r => r.json())
      .then(data => {
        if (viewMode === 'summary') {
          setPositions(data.positions || []);
          setTotalPages(data.total_pages || 1);
        } else if (filter === 'risky' && data.pagination) {
          setPositions(data.positions || []);
          setTotalPages(data.pagination.total_pages);
        } else {
          const posArray = Array.isArray(data) ? data : (data.positions || data.data || []);
          setPositions(posArray.slice((currentPage - 1) * pageSize, currentPage * pageSize));
          setTotalPages(Math.ceil(posArray.length / pageSize));
        }
        setLoading(false);
      })
      .catch(() => {
        setPositions([]);
        setLoading(false);
      });
  }, [filter, currentPage, groupByBorrower, viewMode]);

  const detailedColumns = groupByBorrower ? [
    { 
      key: 'borrower_address', 
      label: 'User', 
      render: (val: string) => val ? (
        <span className="font-mono text-xs" title={val}>{val.slice(0, 8)}...{val.slice(-6)}</span>
      ) : 'N/A' 
    },
    { key: 'chain', label: 'Chain' },
    { 
      key: 'position_count', 
      label: 'Positions',
      render: (val: number) => val || 0
    },
    { 
      key: 'tokens', 
      label: 'Assets', 
      render: (val: string[]) => val ? (
        <div className="flex flex-wrap gap-1">
          {val.slice(0, 3).map((token, i) => (
            <span key={i} className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded text-xs">
              {token}
            </span>
          ))}
          {val.length > 3 && <span className="text-xs text-gray-500">+{val.length - 3}</span>}
        </div>
      ) : 'N/A'
    },
    { 
      key: 'total_collateral_usd', 
      label: 'Total Collateral', 
      render: (val: number) => formatNumber(val, 'currency')
    },
    { 
      key: 'total_debt_usd', 
      label: 'Total Debt', 
      render: (val: number) => val && val > 0 ? formatNumber(val, 'currency') : '-'
    },
    { 
      key: 'lowest_health_factor', 
      label: 'Lowest HF', 
      render: (val: number) => {
        if (!val || val === 0) return <span className="text-gray-400">N/A</span>;
        if (val > 999) return <span className="text-green-600">∞</span>;
        const color = val < 1.1 ? 'text-red-600' : val < 1.5 ? 'text-yellow-600' : 'text-green-600';
        return <span className={color}>{val.toFixed(2)}</span>;
      }
    },
    { 
      key: 'risk_category', 
      label: 'Risk',
      render: (val: string) => (
        <span className={`px-2 py-1 rounded text-xs ${
          val === 'CRITICAL' || val === 'LIQUIDATION_IMMINENT' ? 'bg-red-100 text-red-800' :
          val === 'HIGH' ? 'bg-orange-100 text-orange-800' :
          val === 'MEDIUM' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
        }`}>
          {val || 'SAFE'}
        </span>
      )
    }
  ] : [
    { 
      key: 'borrower_address', 
      label: 'User', 
      render: (val: string) => val ? (
        <span className="font-mono text-xs" title={val}>{val.slice(0, 8)}...{val.slice(-6)}</span>
      ) : 'N/A' 
    },
    { key: 'chain', label: 'Chain' },
    { key: 'token_symbol', label: 'Asset' },
    { 
      key: 'token_address', 
      label: 'Token Address', 
      render: (val: string) => val ? (
        <span className="font-mono text-xs" title={val}>{val.slice(0, 6)}...{val.slice(-4)}</span>
      ) : 'N/A' 
    },
    { 
      key: 'collateral_usd', 
      label: 'Collateral', 
      render: (val: number) => formatNumber(val, 'currency')
    },
    { 
      key: 'debt_usd', 
      label: 'Debt', 
      render: (val: number) => val && val > 0 ? formatNumber(val, 'currency') : '-'
    },
    { 
      key: 'enhanced_health_factor', 
      label: 'Health Factor', 
      render: (val: number) => {
        if (!val || val === 0) return <span className="text-gray-400">N/A</span>;
        if (val > 999) return <span className="text-green-600">∞</span>;
        const color = val < 1.1 ? 'text-red-600' : val < 1.5 ? 'text-yellow-600' : 'text-green-600';
        return <span className={color}>{val.toFixed(2)}</span>;
      }
    },
  ];

  const summaryColumns = [
    { 
      key: 'borrower', 
      label: 'User', 
      render: (val: string) => val ? (
        <span className="font-mono text-xs" title={val}>{val.slice(0, 8)}...{val.slice(-6)}</span>
      ) : 'N/A' 
    },
    { key: 'chain', label: 'Chain' },
    { key: 'token_symbol', label: 'Asset' },
    { 
      key: 'total_collateral_usd', 
      label: 'Collateral', 
      render: (val: number) => formatNumber(val, 'currency')
    },
    { 
      key: 'total_debt_usd', 
      label: 'Debt', 
      render: (val: number) => val && val > 0 ? formatNumber(val, 'currency') : '-'
    },
    { 
      key: 'health_factor', 
      label: 'Health Factor', 
      render: (val: number | string) => {
        if (val === '∞' || val === 'Infinity') return <span className="text-green-600">∞</span>;
        const numVal = typeof val === 'string' ? parseFloat(val) : val;
        if (!numVal || numVal === 0) return <span className="text-gray-400">N/A</span>;
        if (numVal > 999) return <span className="text-green-600">∞</span>;
        const color = numVal < 1.1 ? 'text-red-600' : numVal < 1.5 ? 'text-yellow-600' : 'text-green-600';
        return <span className={color}>{numVal.toFixed(2)}</span>;
      }
    },
  ];

  const columns = viewMode === 'summary' ? summaryColumns : detailedColumns;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2 items-center">
        <button 
          onClick={() => { setFilter('all'); setCurrentPage(1); }} 
          className={`px-4 py-2 rounded ${filter === 'all' ? 'bg-blue-600 text-white' : isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-900'}`}
        >
          All Positions
        </button>
        <button 
          onClick={() => { setFilter('risky'); setCurrentPage(1); }} 
          className={`px-4 py-2 rounded ${filter === 'risky' ? 'bg-red-600 text-white' : isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-900'}`}
        >
          Risky Positions
        </button>

        <div className="h-6 w-px bg-gray-300 mx-2"></div>

        <button 
          onClick={() => { setViewMode('detailed'); setCurrentPage(1); }} 
          className={`px-4 py-2 rounded ${viewMode === 'detailed' ? 'bg-green-600 text-white' : isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-900'}`}
        >
          Detailed View
        </button>
        <button 
          onClick={() => { setViewMode('summary'); setCurrentPage(1); }} 
          className={`px-4 py-2 rounded ${viewMode === 'summary' ? 'bg-green-600 text-white' : isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-900'}`}
        >
          Summary View
        </button>

        {viewMode === 'detailed' && filter === 'all' && (
          <>
            <div className="h-6 w-px bg-gray-300 mx-2"></div>
            <label className="flex items-center gap-2 cursor-pointer px-3 py-2">
              <input
                type="checkbox"
                checked={groupByBorrower}
                onChange={(e) => { setGroupByBorrower(e.target.checked); setCurrentPage(1); }}
                className="w-4 h-4"
              />
              <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>Group by Borrower</span>
            </label>
          </>
        )}
      </div>

      <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow p-6`}>
        <h2 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
          {viewMode === 'summary' ? 'Positions Summary' : 
           filter === 'risky' ? 'Risky Positions' : 
           groupByBorrower ? 'Positions Grouped by Borrower' : 'All Positions'}
        </h2>
        <DataTable data={positions} columns={columns} loading={loading} isDark={isDark} />
        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} isDark={isDark} />
      </div>
    </div>
  );
}

function ReservesTab({ isDark }: any) {
  const [reserves, setReserves] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 50;

  useEffect(() => {
    fetch(`${API_BASE}/reserves/rpc?limit=500`)
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

  const paginatedReserves = reserves.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const totalPages = Math.ceil(reserves.length / pageSize);

  const columns = [
    { key: 'chain', label: 'Chain' },
    { 
      key: 'token_symbol', 
      label: 'Asset',
      render: (val: string) => val && val !== 'UNKNOWN' ? val : <span className="text-gray-400">Unknown</span>
    },
    { 
      key: 'token_address', 
      label: 'Address', 
      render: (val: string) => val ? (
        <span className="font-mono text-xs" title={val}>{val.slice(0, 6)}...{val.slice(-4)}</span>
      ) : 'N/A'
    },
    { 
      key: 'ltv', 
      label: 'LTV', 
      render: (val: number) => {
        if (!val || val === 0) return '0%';
        const percentage = val < 1 ? val * 100 : val;
        return `${percentage.toFixed(0)}%`;
      }
    },
    { 
      key: 'liquidation_threshold', 
      label: 'Liq. Threshold', 
      render: (val: number) => {
        if (!val || val === 0) return '0%';
        const percentage = val < 1 ? val * 100 : val;
        return `${percentage.toFixed(0)}%`;
      }
    },
  ];

  return (
    <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow p-6`}>
      <h2 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>Reserve Assets</h2>
      <DataTable data={paginatedReserves} columns={columns} loading={loading} isDark={isDark} />
      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} isDark={isDark} />
    </div>
  );
}

function LiquidationsTab({ isDark }: any) {
  const [liquidations, setLiquidations] = useState<any[]>([]);
  const [trends, setTrends] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 50;

  useEffect(() => {
    Promise.all([
      fetch(`${API_BASE}/liquidation-history?limit=500`).then(r => r.json()).catch(() => []),
      fetch(`${API_BASE}/liquidation_trends`).then(r => r.json()).catch(() => null),
    ]).then(([liqData, trendsData]) => {
      const liqArray = Array.isArray(liqData) ? liqData : (liqData.history || liqData.data || []);
      setLiquidations(liqArray);
      setTrends(trendsData);
      setLoading(false);
    });
  }, []);

  const paginatedLiquidations = liquidations.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const totalPages = Math.ceil(liquidations.length / pageSize);

  const columns = [
    { key: 'chain', label: 'Chain' },
    { key: 'collateral_symbol', label: 'Collateral' },
    { key: 'debt_symbol', label: 'Debt' },
    { 
      key: 'collateral_seized_usd', 
      label: 'Value', 
      render: (val: number) => formatNumber(val, 'currency')
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
          <StatCard title="24h Liquidations" value={formatNumber(trends.liquidations_24h)} icon={AlertTriangle} loading={loading} isDark={isDark} />
          <StatCard title="24h Volume" value={formatNumber(trends.liquidation_volume_usd_24h, 'currency')} loading={loading} isDark={isDark} />
          <StatCard title="7d Daily Average" value={trends.daily_average_7d?.toFixed(1) || '0.0'} trend={trends.trend || 'STABLE'} loading={loading} isDark={isDark} />
        </div>
      )}

      <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow p-6`}>
        <h2 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>Recent Liquidations</h2>
        <DataTable data={paginatedLiquidations} columns={columns} loading={loading} isDark={isDark} />
        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} isDark={isDark} />
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
      if (hf >= 2 || hf === 0) categories.SAFE++;
      else if (hf >= 1.5) categories.LOW++;
      else if (hf >= 1.3) categories.MEDIUM++;
      else if (hf >= 1.1) categories.HIGH++;
      else categories.CRITICAL++;
    });
    return Object.entries(categories).map(([name, value]) => ({ 
      name, 
      value, 
      percentage: positions.length > 0 ? (Number(value) / positions.length) * 100 : 0 
    }));
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
                    <h4 className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>{signal.title || 'Risk Signal'}</h4>
                    <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{signal.description || 'No details'}</p>
                  </div>
                  <span className={`px-2 py-1 rounded text-xs ${signal.urgency === 'CRITICAL' ? 'bg-red-100 text-red-800' : signal.urgency === 'HIGH' ? 'bg-orange-100 text-orange-800' : 'bg-yellow-100 text-yellow-800'}`}>
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

      <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow p-6`}>
        <h2 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>Risk Alerts Feed</h2>
        {loading ? (
          <div className="space-y-2">{[1, 2, 3].map(i => <div key={i} className={`h-16 ${isDark ? 'bg-gray-700' : 'bg-gray-200'} rounded animate-pulse`}></div>)}</div>
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
                      <div className={`text-xs ${isDark ? 'text-red-500' : 'text-red-600'} mt-1`}>{new Date(alert.timestamp).toLocaleString()}</div>
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

function ChainsTab({ isDark }: any) {
  const [chains, setChains] = useState<any[]>([]);
  const [comparison, setComparison] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch(`${API_BASE}/chains/available`).then(r => r.json()).catch(() => ({ chains: [] })),
      fetch(`${API_BASE}/crosschain_risk_comparison`).then(r => r.json()).catch(() => ({ comparison: [] })),
    ]).then(([chainsData, compData]) => {
      const SUPPORTED_CHAINS = ['ethereum', 'avalanche', 'polygon', 'arbitrum', 'optimism', 'base'];
      
      const chainArray = (chainsData.chains || []).filter(
        (chain: string) => SUPPORTED_CHAINS.includes(chain.toLowerCase())
      );
      
      const compArray = (compData.comparison || []).filter(
        (item: any) => SUPPORTED_CHAINS.includes(item.chain?.toLowerCase())
      );
      
      setChains(chainArray);
      setComparison(compArray);
      setLoading(false);
    });
  }, []);

  return (
    <div className="space-y-6">
      <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow p-6`}>
        <h2 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>Supported Chains</h2>
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

      <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow p-6`}>
        <h2 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>Cross-Chain Risk Comparison</h2>
        {loading ? (
          <div className="space-y-2">{[1, 2].map(i => <div key={i} className={`h-24 ${isDark ? 'bg-gray-700' : 'bg-gray-200'} rounded animate-pulse`}></div>)}</div>
        ) : comparison.length > 0 ? (
          <div className="space-y-4">
            {comparison.map((item: any, idx: number) => (
              <div key={idx} className={`border ${isDark ? 'border-gray-700' : 'border-gray-200'} rounded-lg p-4`}>
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className={`font-semibold text-lg ${isDark ? 'text-white' : 'text-gray-900'}`}>{item.chain}</h3>
                    <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{formatNumber(item.total_positions)} positions</p>
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
                      {formatNumber(item.total_collateral_usd, 'currency')}
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
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 50;

  useEffect(() => {
    fetch(`${API_BASE}/reserve_risk_metrics`)
      .then(r => r.json())
      .then((data) => {
        const metricsArray = data.metrics || [];
        // Filter out zero exposures
        const filteredMetrics = metricsArray.filter((m: any) => m.total_exposure_usd > 0);
        setMetrics(filteredMetrics);
        setLoading(false);
      })
      .catch(() => {
        setMetrics([]);
        setLoading(false);
      });
  }, []);

  const paginatedMetrics = metrics.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const totalPages = Math.ceil(metrics.length / pageSize);

  const columns = [
    { key: 'token_symbol', label: 'Asset' },
    { key: 'chain', label: 'Chain' },
    { 
      key: 'token_address', 
      label: 'Address', 
      render: (val: string) => val ? (
        <span className="font-mono text-xs" title={val}>{val.slice(0, 6)}...{val.slice(-4)}</span>
      ) : 'N/A'
    },
    { 
      key: 'utilization_rate', 
      label: 'Utilization', 
      render: (val: number) => val ? `${(val * 100).toFixed(1)}%` : '0%' 
    },
    { 
      key: 'total_exposure_usd', 
      label: 'Exposure', 
      render: (val: number) => {
        if (!val || val === 0) return <span className="text-gray-400">No Exposure</span>;
        return formatNumber(val, 'currency');
      }
    },
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
        Advanced risk analysis for reserve assets with active exposure
      </p>
      {metrics.length === 0 && !loading ? (
        <p className={isDark ? 'text-gray-400' : 'text-gray-500'}>No metrics available</p>
      ) : (
        <>
          <DataTable data={paginatedMetrics} columns={columns} loading={loading} isDark={isDark} />
          {totalPages > 1 && <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} isDark={isDark} />}
        </>
      )}
    </div>
  );
}

function PortfolioTab({ isDark }: any) {
  const [walletAddress, setWalletAddress] = useState('');
  const [portfolio, setPortfolio] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<'fast' | 'full'>('fast');

  const handleFetch = async () => {
    if (!walletAddress || walletAddress.length !== 42) {
      alert('Please enter a valid wallet address (42 characters starting with 0x)');
      return;
    }

    setLoading(true);
    try {
      const endpoint = mode === 'fast' ? '/v2/portfolio/view-fast' : '/v2/portfolio/view';
      const response = await fetch(`${API_BASE}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          wallet_address: walletAddress,
          chains: ['ethereum', 'polygon', 'arbitrum', 'optimism', 'base', 'avalanche']
        })
      });
      
      if (!response.ok) throw new Error('Failed to fetch portfolio');
      
      const data = await response.json();
      setPortfolio(data);
    } catch (error: any) {
      alert('Error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow p-6`}>
        <h2 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>Portfolio Viewer</h2>
        
        <div className="space-y-4">
          <div>
            <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              Wallet Address
            </label>
            <input
              type="text"
              value={walletAddress}
              onChange={(e) => setWalletAddress(e.target.value)}
              placeholder="0x..."
              className={`w-full px-4 py-2 rounded border ${
                isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
              } focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
          </div>

          <div className="flex gap-4 items-center">
            <div className="flex gap-2">
              <button
                onClick={() => setMode('fast')}
                className={`px-4 py-2 rounded ${mode === 'fast' ? 'bg-blue-600 text-white' : isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-900'}`}
              >
                Fast Mode (2-3s)
              </button>
              <button
                onClick={() => setMode('full')}
                className={`px-4 py-2 rounded ${mode === 'full' ? 'bg-blue-600 text-white' : isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-900'}`}
              >
                Full Mode (40s+)
              </button>
            </div>
            
            <button
              onClick={handleFetch}
              disabled={loading}
              className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {loading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Wallet className="h-4 w-4" />}
              {loading ? 'Loading...' : 'Fetch Portfolio'}
            </button>
          </div>
        </div>
      </div>

      {portfolio && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard 
              title="Total Collateral" 
              value={formatNumber(portfolio.total_metrics?.total_collateral_usd, 'currency')} 
              isDark={isDark} 
            />
            <StatCard 
              title="Total Debt" 
              value={formatNumber(portfolio.total_metrics?.total_debt_usd, 'currency')} 
              isDark={isDark} 
            />
            <StatCard 
              title="Health Factor" 
              value={portfolio.total_metrics?.lowest_health_factor?.toFixed(2) || 'N/A'} 
              isDark={isDark} 
            />
            <StatCard 
              title="Net Worth" 
              value={formatNumber(portfolio.total_metrics?.total_net_worth_usd, 'currency')} 
              isDark={isDark} 
            />
          </div>

          <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow p-6`}>
            <h3 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>Chain Breakdown</h3>
            <div className="space-y-4">
              {Object.entries(portfolio.chain_details || {}).map(([chain, data]: [string, any]) => (
                data.has_positions && (
                  <div key={chain} className={`border ${isDark ? 'border-gray-700' : 'border-gray-200'} rounded-lg p-4`}>
                    <h4 className={`font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>{chain.toUpperCase()}</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <div className={isDark ? 'text-gray-400' : 'text-gray-600'}>Collateral</div>
                        <div className={isDark ? 'text-white' : 'text-gray-900'}>{formatNumber(data.account_data?.total_collateral_usd, 'currency')}</div>
                      </div>
                      <div>
                        <div className={isDark ? 'text-gray-400' : 'text-gray-600'}>Debt</div>
                        <div className={isDark ? 'text-white' : 'text-gray-900'}>{formatNumber(data.account_data?.total_debt_usd, 'currency')}</div>
                      </div>
                      <div>
                        <div className={isDark ? 'text-gray-400' : 'text-gray-600'}>Health Factor</div>
                        <div className={isDark ? 'text-white' : 'text-gray-900'}>{data.account_data?.health_factor?.toFixed(2) || 'N/A'}</div>
                      </div>
                      <div>
                        <div className={isDark ? 'text-gray-400' : 'text-gray-600'}>Risk Level</div>
                        <span className={`px-2 py-1 rounded text-xs ${
                          data.account_data?.risk_level === 'CRITICAL' ? 'bg-red-100 text-red-800' :
                          data.account_data?.risk_level === 'MEDIUM' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
                        }`}>
                          {data.account_data?.risk_level || 'N/A'}
                        </span>
                      </div>
                    </div>
                  </div>
                )
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function SecurityTab({ isDark }: any) {
  const [password, setPassword] = useState('');
  const [settings, setSettings] = useState<any>(null);
  const [message, setMessage] = useState('');

  const handleClearCache = async () => {
    if (!password) {
      setMessage('Please enter admin password');
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/admin/cache/clear?password=${encodeURIComponent(password)}`, {
        method: 'POST'
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setMessage('✅ ' + data.message);
      } else {
        setMessage('❌ ' + data.detail);
      }
    } catch (error: any) {
      setMessage('❌ Error: ' + error.message);
    }
  };

  const handleGetSettings = async () => {
    if (!password) {
      setMessage('Please enter admin password');
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/admin/settings?password=${encodeURIComponent(password)}`);
      const data = await response.json();
      
      if (response.ok) {
        setSettings(data);
        setMessage('✅ Settings loaded');
      } else {
        setMessage('❌ ' + data.detail);
        setSettings(null);
      }
    } catch (error: any) {
      setMessage('❌ Error: ' + error.message);
    }
  };

  return (
    <div className="space-y-6">
      <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow p-6`}>
        <h2 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>Admin Controls</h2>
        
        <div className="space-y-4">
          <div>
            <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              Admin Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter admin password"
              className={`w-full px-4 py-2 rounded border ${
                isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
              } focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
          </div>

          <div className="flex gap-4">
            <button
              onClick={handleClearCache}
              className="px-6 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Clear Cache
            </button>
            <button
              onClick={handleGetSettings}
              className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              View Settings
            </button>
          </div>

          {message && (
            <div className={`p-4 rounded ${message.startsWith('✅') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              {message}
            </div>
          )}
        </div>
      </div>

      {settings && (
        <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow p-6`}>
          <h3 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>System Settings</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>Cache TTL:</span>
              <span className={isDark ? 'text-white' : 'text-gray-900'}>{settings.cache_ttl_minutes} minutes</span>
            </div>
            <div className="flex justify-between">
              <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>Database:</span>
              <span className={isDark ? 'text-white' : 'text-gray-900'}>{settings.database_connected ? '✅ Connected' : '❌ Disconnected'}</span>
            </div>
            <div className="flex justify-between">
              <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>Portfolio Service:</span>
              <span className={isDark ? 'text-white' : 'text-gray-900'}>{settings.services_running?.portfolio_service ? '✅ Running' : '❌ Stopped'}</span>
            </div>
            <div className="mt-4">
              <span className={`block mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Supported Chains:</span>
              <div className="flex flex-wrap gap-2">
                {settings.supported_chains?.map((chain: string) => (
                  <span key={chain} className={`px-3 py-1 rounded text-sm ${isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'}`}>
                    {chain}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
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
      case 'portfolio': return <PortfolioTab isDark={isDark} />;
      case 'security': return <SecurityTab isDark={isDark} />;
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