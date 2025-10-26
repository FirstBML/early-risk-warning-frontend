"use client";

import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  trend?: string;
  loading?: boolean;
  isDark?: boolean;
  icon?: LucideIcon;
}

export function StatCard({ title, value, trend, loading = false, isDark = false, icon: Icon }: StatCardProps) {
  return (
    <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow p-6`}>
      <div className="flex items-center justify-between mb-2">
        <h3 className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
          {title}
        </h3>
        {Icon && <Icon className={`h-5 w-5 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} />}
      </div>
      
      {loading ? (
        <div className={`h-8 ${isDark ? 'bg-gray-700' : 'bg-gray-200'} rounded animate-pulse`}></div>
      ) : (
        <>
          <div className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            {value}
          </div>
          {trend && (
            <div className={`text-sm ${isDark ? 'text-gray-500' : 'text-gray-500'} mt-1`}>
              {trend}
            </div>
          )}
        </>
      )}
    </div>
  );
}
