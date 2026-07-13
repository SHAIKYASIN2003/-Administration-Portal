/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis as RechartsXAxis,
  YAxis as RechartsYAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { Table, BarChart2, PieChart as PieIcon, LineChart as LineIcon, AlertCircle } from 'lucide-react';

interface VisualizationRendererProps {
  title: string;
  chartType: 'Table' | 'Bar' | 'Pie' | 'Line' | 'All';
  data: Record<string, any>[];
  attributes: string[]; // attributes/columns to display
  xAxisKey: string;     // column or attribute name for X-axis
  yAxisKey: string;     // column or attribute name for Y-axis (for simple metrics)
}

const COLORS = [
  '#2563eb', // blue-600
  '#10b981', // emerald-500
  '#f59e0b', // amber-500
  '#8b5cf6', // purple-500
  '#ec4899', // pink-500
  '#ef4444', // red-500
  '#14b8a6', // teal-500
  '#f97316'  // orange-500
];

export const VisualizationRenderer: React.FC<VisualizationRendererProps> = ({
  title,
  chartType,
  data,
  attributes,
  xAxisKey,
  yAxisKey,
}) => {
  if (!data || data.length === 0) {
    return (
      <div id="vis-empty-state" className="flex flex-col items-center justify-center p-8 bg-slate-50 border border-dashed border-slate-200 rounded-xl text-slate-500">
        <AlertCircle className="h-8 w-8 text-slate-400 mb-2" />
        <p className="text-sm font-medium">No records available to visualize.</p>
        <p className="text-xs text-slate-400">Add records to see tables and charts.</p>
      </div>
    );
  }

  if (!attributes || attributes.length === 0) {
    return (
      <div id="vis-no-attrs-state" className="flex flex-col items-center justify-center p-8 bg-slate-50 border border-dashed border-slate-200 rounded-xl text-slate-500">
        <AlertCircle className="h-8 w-8 text-slate-400 mb-2" />
        <p className="text-sm font-medium">No attributes selected for visualization.</p>
        <p className="text-xs text-slate-400">Configure attributes in the setup section.</p>
      </div>
    );
  }

  // Generate data formatted for Pie Chart (summarized/averaged or just using the first/latest record)
  const renderPieChart = () => {
    // We can show the attribute distribution for the latest/most recent record in the data
    const latestRecord = data[data.length - 1];
    const pieData = attributes
      .map((attr, idx) => {
        const val = Number(latestRecord?.[attr]);
        return {
          name: attr,
          value: isNaN(val) ? 0 : val,
          color: COLORS[idx % COLORS.length]
        };
      })
      .filter(item => item.value > 0);

    if (pieData.length === 0) {
      return (
        <div className="flex items-center justify-center h-64 text-xs text-slate-400">
          No numeric values available in the latest record for Pie chart.
        </div>
      );
    }

    return (
      <div className="flex flex-col md:flex-row items-center justify-center gap-6 py-4">
        <div className="w-full max-w-[280px] h-60">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                paddingAngle={3}
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`${value}`, 'Value']} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="flex flex-wrap gap-x-4 gap-y-2 justify-center max-w-sm">
          {pieData.map((item, index) => (
            <div key={index} className="flex items-center gap-2 text-xs">
              <span className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
              <span className="font-semibold text-slate-700">{item.name}:</span>
              <span className="text-slate-500">{item.value}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderTable = () => (
    <div className="overflow-x-auto border border-slate-200 rounded-lg shadow-sm">
      <table className="min-w-full divide-y divide-slate-200 text-left text-sm text-slate-600">
        <thead className="bg-slate-50 text-slate-700 font-semibold text-xs uppercase tracking-wider">
          <tr>
            <th className="px-4 py-3 border-b border-slate-200">{xAxisKey ? String(xAxisKey).toUpperCase() : 'ID'}</th>
            {attributes.map((attr) => (
              <th key={attr} className="px-4 py-3 border-b border-slate-200">{attr}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 bg-white">
          {data.map((row, idx) => (
            <tr key={row.id || idx} className="hover:bg-slate-50/50 transition-colors">
              <td className="px-4 py-3 font-semibold text-slate-800 border-b border-slate-100">
                {row[xAxisKey] !== undefined ? String(row[xAxisKey]) : row.year || idx + 1}
              </td>
              {attributes.map((attr) => {
                const val = row[attr];
                return (
                  <td key={attr} className="px-4 py-3 border-b border-slate-100">
                    {typeof val === 'boolean' ? (val ? 'Yes' : 'No') : val !== undefined ? String(val) : '-'}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderBarChart = () => (
    <div className="h-72 w-full pt-4">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
          <RechartsXAxis dataKey={xAxisKey} tickLine={false} axisLine={false} stroke="#64748b" style={{ fontSize: '11px' }} />
          <RechartsYAxis tickLine={false} axisLine={false} stroke="#64748b" style={{ fontSize: '11px' }} />
          <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
          <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
          {attributes.map((attr, index) => (
            <Bar
              key={attr}
              dataKey={attr}
              fill={COLORS[index % COLORS.length]}
              radius={[4, 4, 0, 0]}
              maxBarSize={50}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );

  const renderLineChart = () => (
    <div className="h-72 w-full pt-4">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
          <RechartsXAxis dataKey={xAxisKey} tickLine={false} axisLine={false} stroke="#64748b" style={{ fontSize: '11px' }} />
          <RechartsYAxis tickLine={false} axisLine={false} stroke="#64748b" style={{ fontSize: '11px' }} />
          <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
          <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
          {attributes.map((attr, index) => (
            <Line
              key={attr}
              type="monotone"
              dataKey={attr}
              stroke={COLORS[index % COLORS.length]}
              strokeWidth={2.5}
              activeDot={{ r: 6 }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );

  return (
    <div id={`vis-block-${title.replace(/\s+/g, '-').toLowerCase()}`} className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-sm">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
        <h3 className="font-semibold text-slate-800 text-sm tracking-tight flex items-center gap-2">
          {title}
        </h3>
        <span className="text-xs font-semibold px-2.5 py-1 bg-slate-100 text-slate-600 rounded-full flex items-center gap-1">
          {chartType === 'Table' && <Table className="h-3 w-3 text-slate-500" />}
          {chartType === 'Bar' && <BarChart2 className="h-3 w-3 text-emerald-500" />}
          {chartType === 'Pie' && <PieIcon className="h-3 w-3 text-amber-500" />}
          {chartType === 'Line' && <LineIcon className="h-3 w-3 text-blue-500" />}
          {chartType === 'All' && <span className="text-[10px] uppercase font-bold tracking-wider text-purple-600">All Visualizations</span>}
          {chartType}
        </span>
      </div>

      {chartType === 'Table' && renderTable()}
      {chartType === 'Bar' && renderBarChart()}
      {chartType === 'Pie' && renderPieChart()}
      {chartType === 'Line' && renderLineChart()}

      {chartType === 'All' && (
        <div className="space-y-8 divide-y divide-slate-100" id="all-vis-grid">
          <div className="pt-2">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">1. Data Table</h4>
            {renderTable()}
          </div>
          <div className="pt-6">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">2. Growth Trend (Line Chart)</h4>
            {renderLineChart()}
          </div>
          <div className="pt-6">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">3. Attribute Comparison (Bar Chart)</h4>
            {renderBarChart()}
          </div>
          <div className="pt-6">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1">
              <span>4. Key Distribution (Pie Chart)</span>
              <span className="text-[10px] text-slate-400 font-normal normal-case">(based on most recent year)</span>
            </h4>
            {renderPieChart()}
          </div>
        </div>
      )}
    </div>
  );
};
