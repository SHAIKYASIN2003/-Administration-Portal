/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Shield, Eye, Database, Globe, RefreshCw } from 'lucide-react';

interface HeaderProps {
  role: 'operator1' | 'operator2';
  setRole: (role: 'operator1' | 'operator2') => void;
  op2Mode?: 'official' | 'public';
  setOp2Mode?: (mode: 'official' | 'public') => void;
  onResetData: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  role,
  setRole,
  op2Mode = 'official',
  setOp2Mode,
  onResetData,
}) => {
  return (
    <header id="app-header" className="bg-slate-900 text-slate-200 border-b border-slate-800 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Portal Branding */}
        <div className="flex items-center gap-2.5">
          <div className="bg-blue-600 text-white p-1.5 rounded shadow-sm">
            <Database className="h-4 w-4 text-white" id="header-logo-icon" />
          </div>
          <div>
            <h1 className="text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2">
              Municipal & Panchayat Portal
              <span className="text-[10px] bg-blue-500/20 text-blue-400 px-1.5 py-0.5 rounded font-mono font-medium tracking-normal normal-case">v2.1</span>
            </h1>
            <p className="text-[10px] text-slate-400 font-medium tracking-tight">Administrative Data Gateway • High Density Theme</p>
          </div>
        </div>

        {/* Role and Mode Control Center */}
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-end">
          {/* Reset Demo Data Button */}
          <button
            onClick={onResetData}
            title="Reset to sample data"
            className="flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-[10px] font-bold text-slate-300 border border-slate-700 transition duration-150"
            id="btn-reset-demo"
          >
            <RefreshCw className="h-3 w-3" />
            <span>RESET DATABASE</span>
          </button>

          {/* Active Role Selector */}
          <div className="flex items-center bg-slate-950 p-1 rounded border border-slate-800 shadow-inner">
            <button
              onClick={() => setRole('operator1')}
              className={`flex items-center gap-1 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded transition duration-150 ${
                role === 'operator1'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
              id="role-switch-op1"
            >
              <Shield className="h-3 w-3" />
              <span>Operator 1</span>
            </button>
            <button
              onClick={() => setRole('operator2')}
              className={`flex items-center gap-1 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded transition duration-150 ${
                role === 'operator2'
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
              id="role-switch-op2"
            >
              <Eye className="h-3 w-3" />
              <span>Operator 2</span>
            </button>
          </div>

          {/* Operator 2 Sub-Mode Toggle (Only visible if role is operator2) */}
          {role === 'operator2' && setOp2Mode && (
            <div className="flex items-center bg-slate-950 p-0.5 rounded border border-slate-800">
              <button
                onClick={() => setOp2Mode('official')}
                className={`px-2 py-0.5 text-[10px] font-bold rounded uppercase tracking-wider transition duration-150 ${
                  op2Mode === 'official'
                    ? 'bg-slate-800 text-white shadow-sm'
                    : 'text-slate-500 hover:text-slate-300'
                }`}
                id="mode-switch-official"
              >
                Official
              </button>
              <button
                onClick={() => setOp2Mode('public')}
                className={`flex items-center gap-0.5 px-2 py-0.5 text-[10px] font-bold rounded uppercase tracking-wider transition duration-150 ${
                  op2Mode === 'public'
                    ? 'bg-slate-800 text-white shadow-sm'
                    : 'text-slate-500 hover:text-slate-300'
                }`}
                id="mode-switch-public"
              >
                <Globe className="h-2.5 w-2.5 text-amber-500" />
                <span>Public</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
