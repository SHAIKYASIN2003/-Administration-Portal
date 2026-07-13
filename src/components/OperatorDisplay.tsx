/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Users,
  Building2,
  MapPin,
  ImageIcon,
  Search,
  Map,
  Phone,
  Grid,
  TrendingUp,
  Award,
  Lock,
  Unlock,
  Trash2,
  Eye,
  Settings,
  AlertCircle,
  FolderOpen
} from 'lucide-react';
import {
  PopulationRecord,
  InfrastructureRecord,
  InfrastructureLocationRecord,
  CustomModule,
  GalleryItem
} from '../types';
import { VisualizationRenderer } from './VisualizationRenderer';

interface OperatorDisplayProps {
  role: 'operator1' | 'operator2';
  op2Mode: 'official' | 'public';
  populationRecords: PopulationRecord[];
  onDeletePopulation?: (id: string) => void;
  infrastructureRecords: InfrastructureRecord[];
  onDeleteInfrastructure?: (id: string) => void;
  locationRecords: InfrastructureLocationRecord[];
  onDeleteLocation?: (id: string) => void;
  customModules: CustomModule[];
  onDeleteCustomRow?: (moduleId: string, rowId: string) => void;
  galleryItems: GalleryItem[];
  onDeleteGalleryItem?: (id: string) => void;
}

export const OperatorDisplay: React.FC<OperatorDisplayProps> = ({
  role,
  op2Mode,
  populationRecords,
  onDeletePopulation,
  infrastructureRecords,
  onDeleteInfrastructure,
  locationRecords,
  onDeleteLocation,
  customModules,
  onDeleteCustomRow,
  galleryItems,
  onDeleteGalleryItem,
}) => {
  // If Official mode is active (either Operator 1 Display or Operator 2 Official Mode)
  const isOfficialView = role === 'operator1' || (role === 'operator2' && op2Mode === 'official');
  const isReadOnly = role === 'operator2';

  // State for active official section tab
  const [activeOfficialTab, setActiveOfficialTab] = useState<'population' | 'infrastructure' | 'locations' | 'custom'>('population');

  // State for active public section tab
  const [activePublicTab, setActivePublicTab] = useState<'gallery' | 'locations' | 'custom'>('gallery');

  // Search queries
  const [gallerySearch, setGallerySearch] = useState<string>('');
  const [locationSearch, setLocationSearch] = useState<string>('');

  // Gallery expanded spot
  const [expandedSpot, setExpandedSpot] = useState<GalleryItem | null>(null);

  // Active Custom Module in display list
  const [selectedCustomModId, setSelectedCustomModId] = useState<string>(customModules[0]?.id || '');

  // --- FILTERS & SEARCH PROCESSORS ---
  const filteredGallery = galleryItems.filter(item => {
    const q = gallerySearch.toLowerCase();
    return (
      item.title.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q) ||
      (item.address && item.address.toLowerCase().includes(q)) ||
      item.description.toLowerCase().includes(q)
    );
  });

  const filteredLocations = locationRecords.filter(loc => {
    const q = locationSearch.toLowerCase();
    return (
      loc.proprietaryName.toLowerCase().includes(q) ||
      loc.ownership.toLowerCase().includes(q) ||
      loc.address.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6" id="display-portal-workspace">
      {/* Title section depending on view mode */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            {isOfficialView ? (
              <>
                <TrendingUp className="text-emerald-500 h-5.5 w-5.5" />
                <span>Executive Reports & Official Dashboard</span>
              </>
            ) : (
              <>
                <Eye className="text-amber-500 h-5.5 w-5.5" />
                <span>Public Information Directory</span>
              </>
            )}
          </h2>
          <p className="text-xs text-slate-500 font-medium">
            {isOfficialView
              ? `Authorized Personnel Portal • Mode: ${role === 'operator1' ? 'Operator 1 (Full CRUD)' : 'Operator 2 (Read-Only Reports)'}`
              : 'Public Citizen Hub • Real-time verified municipal coordinates, visiting maps, and tourism directories.'}
          </p>
        </div>

        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
          isOfficialView
            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
            : 'bg-amber-50 text-amber-700 border border-amber-200'
        }`}>
          {isOfficialView ? 'Official Analytics' : 'Citizen Information'}
        </span>
      </div>

      {/* ====================================================================
          1. OFFICIAL MODE VIEW (ADMINISTRATIVE CHARTS, CENSUS & DATABASES)
          ==================================================================== */}
      {isOfficialView && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8" id="official-display-grid">
          {/* Internal subtab switches */}
          <div className="lg:col-span-3">
            <div className="bg-slate-900 text-white rounded-xl p-3 shadow flex flex-col gap-1.5 border border-slate-800">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-3 mb-2">Report Sub-categories</p>
              
              <button
                onClick={() => setActiveOfficialTab('population')}
                className={`w-full flex items-center gap-2.5 px-3.5 py-2 rounded text-xs font-bold text-left transition ${
                  activeOfficialTab === 'population'
                    ? 'bg-blue-600 text-white font-extrabold shadow-sm'
                    : 'text-slate-300 hover:bg-slate-800'
                }`}
                id="off-tab-pop"
              >
                <Users className="h-4 w-4" />
                <span>Population Census</span>
              </button>

              <button
                onClick={() => setActiveOfficialTab('infrastructure')}
                className={`w-full flex items-center gap-2.5 px-3.5 py-2 rounded text-xs font-bold text-left transition ${
                  activeOfficialTab === 'infrastructure'
                    ? 'bg-blue-600 text-white font-extrabold shadow-sm'
                    : 'text-slate-300 hover:bg-slate-800'
                }`}
                id="off-tab-infra"
              >
                <Building2 className="h-4 w-4" />
                <span>Physical Infrastructure</span>
              </button>

              <button
                onClick={() => setActiveOfficialTab('locations')}
                className={`w-full flex items-center gap-2.5 px-3.5 py-2 rounded text-xs font-bold text-left transition ${
                  activeOfficialTab === 'locations'
                    ? 'bg-blue-600 text-white font-extrabold shadow-sm'
                    : 'text-slate-300 hover:bg-slate-800'
                }`}
                id="off-tab-loc"
              >
                <MapPin className="h-4 w-4" />
                <span>Geographic Map Locations</span>
              </button>

              {customModules.length > 0 && (
                <button
                  onClick={() => {
                    setActiveOfficialTab('custom');
                    if (!customModules.find(m => m.id === selectedCustomModId)) {
                      setSelectedCustomModId(customModules[0].id);
                    }
                  }}
                  className={`w-full flex items-center gap-2.5 px-3.5 py-2 rounded text-xs font-bold text-left transition ${
                    activeOfficialTab === 'custom'
                      ? 'bg-blue-600 text-white font-extrabold shadow-sm'
                      : 'text-slate-300 hover:bg-slate-800'
                  }`}
                  id="off-tab-custom"
                >
                  <Settings className="h-4 w-4" />
                  <span>Custom Saved Datasets</span>
                </button>
              )}
            </div>
          </div>

          {/* Report Display Area */}
          <div className="lg:col-span-9 space-y-6">
            
            {/* A. Population Census Projections */}
            {activeOfficialTab === 'population' && (
              <div className="space-y-6" id="off-content-population">
                {/* Visualizer card */}
                <VisualizationRenderer
                  title="Official Yearly Population Census"
                  chartType="All" // Displays Table, Line, Bar, and Pie stacked!
                  data={populationRecords}
                  attributes={['totalPopulation', 'genderMale', 'genderFemale', 'childrenTotal', 'oldAgeTotal']}
                  xAxisKey="year"
                  yAxisKey="totalPopulation"
                />

                {/* Direct raw list with actions for Operator 1 */}
                <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
                  <h3 className="font-bold text-slate-800 text-sm tracking-tight mb-4 flex items-center gap-1.5">
                    <Users className="h-4 w-4 text-emerald-500" />
                    <span>Raw Demographic Census Ledger</span>
                  </h3>

                  <div className="overflow-x-auto border border-slate-100 rounded-lg">
                    <table className="min-w-full divide-y divide-slate-100 text-left text-xs">
                      <thead className="bg-slate-50 font-bold text-slate-700">
                        <tr>
                          <th className="px-3 py-2.5">Year</th>
                          <th className="px-3 py-2.5 text-right">Total Population</th>
                          <th className="px-3 py-2.5 text-right">Male</th>
                          <th className="px-3 py-2.5 text-right">Female</th>
                          <th className="px-3 py-2.5 text-right">Others</th>
                          <th className="px-3 py-2.5 text-right">Children (M/F)</th>
                          <th className="px-3 py-2.5 text-right">Old Age (60+)</th>
                          {!isReadOnly && <th className="px-3 py-2.5 text-right">Actions</th>}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 bg-white text-slate-600">
                        {populationRecords.map(rec => (
                          <tr key={rec.id} className="hover:bg-slate-50/50">
                            <td className="px-3 py-2.5 font-bold text-slate-900">{rec.year}</td>
                            <td className="px-3 py-2.5 font-bold text-slate-800 text-right">{rec.totalPopulation}</td>
                            <td className="px-3 py-2.5 text-right">{rec.genderMale}</td>
                            <td className="px-3 py-2.5 text-right">{rec.genderFemale}</td>
                            <td className="px-3 py-2.5 text-right">{rec.genderOthers}</td>
                            <td className="px-3 py-2.5 text-right font-medium">
                              {rec.childrenTotal} ({rec.childrenMale}/{rec.childrenFemale})
                            </td>
                            <td className="px-3 py-2.5 text-right font-medium">
                              {rec.oldAgeTotal} ({rec.oldAgeMale}/{rec.oldAgeFemale})
                            </td>
                            {!isReadOnly && onDeletePopulation && (
                              <td className="px-3 py-2.5 text-right">
                                <button
                                  onClick={() => {
                                    if (confirm(`Delete the population record for year ${rec.year}?`)) {
                                      onDeletePopulation(rec.id);
                                    }
                                  }}
                                  className="text-rose-500 hover:bg-rose-50 p-1 rounded transition"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </button>
                              </td>
                            )}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* B. Physical Infrastructure Inventory */}
            {activeOfficialTab === 'infrastructure' && (
              <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-5" id="off-content-infrastructure">
                <div className="border-b border-slate-100 pb-3">
                  <h3 className="font-bold text-slate-800 text-sm tracking-tight flex items-center gap-1.5">
                    <Building2 className="h-4 w-4 text-emerald-500" />
                    <span>Registered Public & Private Infrastructures</span>
                  </h3>
                  <p className="text-[11px] text-slate-400">Total physical assets and structural directories registered across municipal borders.</p>
                </div>

                <div className="overflow-x-auto border border-slate-100 rounded-xl">
                  <table className="min-w-full divide-y divide-slate-200 text-left text-xs">
                    <thead className="bg-slate-50 text-slate-700 font-bold uppercase tracking-wider">
                      <tr>
                        <th className="px-4 py-3">Infrastructure Type</th>
                        <th className="px-4 py-3">Total Count</th>
                        <th className="px-4 py-3">Ownership Class</th>
                        <th className="px-4 py-3">Individual Property Names</th>
                        <th className="px-4 py-3">Direct Helplines</th>
                        {!isReadOnly && <th className="px-4 py-3 text-right">Actions</th>}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 bg-white text-slate-600">
                      {infrastructureRecords.map(infra => (
                        <tr key={infra.id} className="hover:bg-slate-50/50">
                          <td className="px-4 py-3 font-bold text-slate-900">{infra.name}</td>
                          <td className="px-4 py-3 font-semibold text-slate-800">{infra.count}</td>
                          <td className="px-4 py-3">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                              infra.ownership === 'Government'
                                ? 'bg-emerald-50 text-emerald-700'
                                : infra.ownership === 'Private'
                                ? 'bg-blue-50 text-blue-700'
                                : 'bg-amber-50 text-amber-700'
                            }`}>
                              {infra.ownership}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-slate-500 max-w-xs truncate" title={infra.properties.join(', ')}>
                            {infra.properties.join(', ') || 'N/A'}
                          </td>
                          <td className="px-4 py-3 text-slate-500 text-[11px]">
                            {infra.contactNumbers.join(', ') || 'N/A'}
                          </td>
                          {!isReadOnly && onDeleteInfrastructure && (
                            <td className="px-4 py-3 text-right">
                              <button
                                onClick={() => {
                                  if (confirm(`Delete infrastructure listing for "${infra.name}"?`)) {
                                    onDeleteInfrastructure(infra.id);
                                  }
                                }}
                                className="text-rose-500 hover:bg-rose-50 p-1.5 rounded-lg transition"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </td>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* C. Geographic Map Locations */}
            {activeOfficialTab === 'locations' && (
              <div className="space-y-6" id="off-content-locations">
                <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
                  <div className="border-b border-slate-100 pb-3 mb-4">
                    <h3 className="font-bold text-slate-800 text-sm tracking-tight flex items-center gap-1.5">
                      <MapPin className="h-4 w-4 text-emerald-500" />
                      <span>Proprietary Locations Registry</span>
                    </h3>
                    <p className="text-[11px] text-slate-400">Physical address assets with geographic map attachments and structural photos.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {locationRecords.map(loc => (
                      <div key={loc.id} className="bg-slate-50 rounded-xl overflow-hidden border border-slate-200/80 flex flex-col justify-between">
                        <div>
                          <div className="h-32 bg-slate-200 relative">
                            <img src={loc.imageUrl} alt={loc.proprietaryName} className="w-full h-full object-cover" />
                            <span className="absolute top-2 right-2 bg-slate-900/85 text-white text-[9px] font-extrabold uppercase px-2 py-0.5 rounded">
                              {loc.ownership}
                            </span>
                          </div>
                          <div className="p-4 space-y-2">
                            <h4 className="font-bold text-slate-800 text-xs">{loc.proprietaryName}</h4>
                            <p className="text-[11px] text-slate-500 flex items-start gap-1">
                              <MapPin className="h-3 w-3 text-slate-400 shrink-0 mt-0.5" />
                              <span>{loc.address}</span>
                            </p>
                            <p className="text-[11px] text-slate-500 flex items-center gap-1">
                              <Phone className="h-3 w-3 text-slate-400" />
                              <span>{loc.contactNumbers.join(', ') || 'None specified'}</span>
                            </p>
                          </div>
                        </div>

                        {!isReadOnly && onDeleteLocation && (
                          <div className="px-4 py-2 bg-slate-100/60 border-t flex justify-end">
                            <button
                              onClick={() => {
                                if (confirm(`Remove location directory for "${loc.proprietaryName}"?`)) {
                                  onDeleteLocation(loc.id);
                                }
                              }}
                              className="text-rose-500 hover:bg-rose-50 p-1 rounded transition text-xs flex items-center gap-1 font-semibold"
                            >
                              <Trash2 className="h-3 w-3" />
                              <span>Delete Record</span>
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* D. Custom Saved Datasets */}
            {activeOfficialTab === 'custom' && selectedCustomModId && (() => {
              const mod = customModules.find(m => m.id === selectedCustomModId);
              if (!mod) return <p className="text-slate-500 italic">No custom modules active.</p>;

              return (
                <div className="space-y-6" id={`off-content-custom-mod-${mod.id}`}>
                  {/* Select menu among modules if multiple */}
                  {customModules.length > 1 && (
                    <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm flex items-center gap-3">
                      <span className="text-xs font-bold text-slate-500 uppercase">Active Custom Dataset:</span>
                      <select
                        value={selectedCustomModId}
                        onChange={e => setSelectedCustomModId(e.target.value)}
                        className="bg-slate-50 border px-2.5 py-1 text-xs font-semibold rounded-lg text-slate-700 outline-none"
                      >
                        {customModules.map(m => (
                          <option key={m.id} value={m.id}>{m.name}</option>
                        ))}
                      </select>
                    </div>
                  )}

                  {/* Schema layout & permissions indicator */}
                  <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                      <div>
                        <h3 className="font-extrabold text-slate-900 text-sm">{mod.name} Module Data Ledger</h3>
                        <p className="text-[11px] text-slate-400">Visualization and spreadsheet projection for the custom designed database.</p>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs">
                        <span className="text-[10px] font-bold text-slate-400 uppercase">Public Access Status:</span>
                        {mod.allowedForOperator2 ? (
                          <span className="text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full font-bold text-[10px] flex items-center gap-1">
                            <Unlock className="h-2.5 w-2.5" />
                            <span>Granted</span>
                          </span>
                        ) : (
                          <span className="text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full font-bold text-[10px] flex items-center gap-1">
                            <Lock className="h-2.5 w-2.5" />
                            <span>Restricted</span>
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Records Table */}
                    <div className="overflow-x-auto border border-slate-100 rounded-lg">
                      <table className="min-w-full divide-y divide-slate-200 text-left text-xs text-slate-600">
                        <thead className="bg-slate-50 font-bold text-slate-700">
                          <tr>
                            {mod.columns.map(col => (
                              <th key={col.id} className="px-3 py-2.5">{col.label}</th>
                            ))}
                            {!isReadOnly && <th className="px-3 py-2.5 text-right">Actions</th>}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 bg-white">
                          {mod.data.length === 0 ? (
                            <tr>
                              <td colSpan={mod.columns.length + (isReadOnly ? 0 : 1)} className="text-center py-8 text-slate-400 italic">
                                No records registered inside this module.
                              </td>
                            </tr>
                          ) : (
                            mod.data.map(row => (
                              <tr key={row.id} className="hover:bg-slate-50/50">
                                {mod.columns.map(col => (
                                  <td key={col.id} className="px-3 py-2.5">
                                    {col.dataType === 'Image' && row[col.label] ? (
                                      <img src={row[col.label]} alt="Media cell" className="h-8 w-12 object-cover rounded border" />
                                    ) : (
                                      String(row[col.label] !== undefined ? row[col.label] : '-')
                                    )}
                                  </td>
                                ))}
                                {!isReadOnly && onDeleteCustomRow && (
                                  <td className="px-3 py-2.5 text-right">
                                    <button
                                      onClick={() => {
                                        if (confirm('Delete this record row?')) {
                                          onDeleteCustomRow(mod.id, row.id);
                                        }
                                      }}
                                      className="text-rose-500 hover:bg-rose-50 p-1 rounded transition"
                                    >
                                      <Trash2 className="h-3.5 w-3.5" />
                                    </button>
                                  </td>
                                )}
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Rendering preconfigured visualization */}
                  <div className="text-slate-800">
                    <VisualizationRenderer
                      title={`${mod.name} Module - Saved Official Projections`}
                      chartType={mod.visualizationSetup.chartType}
                      data={mod.data}
                      attributes={mod.visualizationSetup.attributes}
                      xAxisKey={mod.visualizationSetup.xAxis}
                      yAxisKey={mod.visualizationSetup.yAxis}
                    />
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      )}

      {/* ====================================================================
          2. PUBLIC MODE VIEW (VISITING PLACES, GEOLOCATION, ALLOWED MODULES)
          ==================================================================== */}
      {!isOfficialView && (
        <div className="space-y-6" id="public-portal-workspace">
          {/* Public Page navigation bar */}
          <div className="flex border-b border-slate-200 bg-white rounded shadow-sm overflow-hidden p-1">
            <button
              onClick={() => {
                setActivePublicTab('gallery');
                setExpandedSpot(null);
              }}
              className={`flex-1 py-2 text-xs font-bold text-center rounded transition ${
                activePublicTab === 'gallery'
                  ? 'bg-blue-600 text-white font-extrabold shadow-sm'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
              id="pub-tab-gallery"
            >
              <ImageIcon className="h-3.5 w-3.5 inline-block mr-1.5" />
              <span>Visiting Places (Gallery)</span>
            </button>

            <button
              onClick={() => setActivePublicTab('locations')}
              className={`flex-1 py-2 text-xs font-bold text-center rounded transition ${
                activePublicTab === 'locations'
                  ? 'bg-blue-600 text-white font-extrabold shadow-sm'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
              id="pub-tab-locations"
            >
              <MapPin className="h-3.5 w-3.5 inline-block mr-1.5" />
              <span>Infrastructure Locations</span>
            </button>

            <button
              onClick={() => setActivePublicTab('custom')}
              className={`flex-1 py-2 text-xs font-bold text-center rounded transition ${
                activePublicTab === 'custom'
                  ? 'bg-blue-600 text-white font-extrabold shadow-sm'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
              id="pub-tab-custom"
            >
              <Settings className="h-3.5 w-3.5 inline-block mr-1.5" />
              <span>Public Custom Modules</span>
            </button>
          </div>

          {/* A. Public Visiting Places (Gallery) with Search */}
          {activePublicTab === 'gallery' && (
            <div className="space-y-6" id="pub-content-gallery">
              
              {/* Search Panel */}
              <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-sm flex items-center gap-3">
                <Search className="h-4 w-4 text-slate-400 shrink-0" />
                <input
                  type="text"
                  value={gallerySearch}
                  onChange={e => setGallerySearch(e.target.value)}
                  placeholder="Search visiting places by title, category, place, description..."
                  className="w-full text-xs font-medium text-slate-700 placeholder-slate-400 outline-none bg-transparent"
                  id="pub-input-search-gallery"
                />
                {gallerySearch && (
                  <button onClick={() => setGallerySearch('')} className="text-slate-400 hover:text-slate-600 text-xs font-semibold">
                    Clear
                  </button>
                )}
              </div>

              {/* Folders grid for visiting places */}
              {!expandedSpot ? (
                <div>
                  <p className="text-xs uppercase tracking-wider font-extrabold text-slate-400 mb-3">Tourism Directory (File-Folder Grid style)</p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {filteredGallery.map(item => (
                      <button
                        key={item.id}
                        onClick={() => setExpandedSpot(item)}
                        className="group bg-white hover:bg-slate-50 border border-slate-200 p-4 rounded-xl text-center transition shadow-sm flex flex-col items-center gap-2"
                        id={`pub-folder-item-${item.id}`}
                      >
                        <FolderOpen className="h-10 w-10 text-amber-500 fill-amber-500/10 group-hover:scale-105 transition" />
                        <span className="text-xs font-bold text-slate-800 truncate w-full">{item.title}</span>
                        <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full">{item.category}</span>
                      </button>
                    ))}
                    {filteredGallery.length === 0 && (
                      <div className="col-span-full text-center py-12 text-slate-400 italic text-xs">
                        No visiting places matching your query was found.
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                /* Expanded Visiting Spot inside Grid Layout */
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-md animate-fadeIn" id="pub-gallery-expanded">
                  <div className="flex justify-between items-start border-b border-slate-100 pb-3 mb-4">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-50 text-amber-700 border border-amber-200 px-2.5 py-0.5 rounded-full">
                        {expandedSpot.category}
                      </span>
                      <h3 className="font-extrabold text-lg text-slate-900 mt-2">{expandedSpot.title}</h3>
                      {expandedSpot.address && (
                        <p className="text-xs text-slate-500 flex items-center gap-1 mt-1 font-semibold">
                          <MapPin className="h-3.5 w-3.5 text-slate-400" />
                          <span>{expandedSpot.address}</span>
                        </p>
                      )}
                    </div>
                    <button
                      onClick={() => setExpandedSpot(null)}
                      className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition"
                    >
                      Back to folders
                    </button>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100 mb-6">{expandedSpot.description}</p>

                  <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                    {/* All Uploaded Images */}
                    <div className="md:col-span-8 space-y-3">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Public Media Gallery</p>
                      <div className="grid grid-cols-2 gap-3">
                        {expandedSpot.images.map((img, index) => (
                          <div key={index} className="h-44 bg-slate-100 rounded-lg overflow-hidden border relative shadow-sm">
                            <img src={img} alt={`Img-${index}`} className="w-full h-full object-cover" />
                            <span className="absolute bottom-2 left-2 bg-slate-900/70 text-white text-[9px] px-2 py-0.5 rounded">
                              Image {index + 1}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Direction Map */}
                    {expandedSpot.mapImage && (
                      <div className="md:col-span-4 space-y-3">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Direction & Map Location</p>
                        <div className="h-44 bg-slate-100 rounded-lg overflow-hidden border relative shadow-sm">
                          <img src={expandedSpot.mapImage} alt="Map Directions" className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-slate-900/10" />
                          <div className="absolute bottom-2 right-2 bg-amber-500 text-slate-950 text-[10px] font-bold px-2 py-0.5 rounded shadow">
                            Direction Map
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* B. Public Infrastructure Geolocation Directory */}
          {activePublicTab === 'locations' && (
            <div className="space-y-6" id="pub-content-locations">
              {/* Search directory */}
              <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-sm flex items-center gap-3">
                <Search className="h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  value={locationSearch}
                  onChange={e => setLocationSearch(e.target.value)}
                  placeholder="Search infrastructure by name, address, government/private status..."
                  className="w-full text-xs font-medium text-slate-700 outline-none bg-transparent"
                  id="pub-input-search-locations"
                />
                {locationSearch && (
                  <button onClick={() => setLocationSearch('')} className="text-slate-400 text-xs">Clear</button>
                )}
              </div>

              {/* View Only Locations Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {filteredLocations.map(loc => (
                  <div key={loc.id} className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm flex flex-col justify-between">
                    <div>
                      <div className="h-40 bg-slate-100 relative">
                        <img src={loc.imageUrl} alt={loc.proprietaryName} className="w-full h-full object-cover" />
                        <span className={`absolute top-2.5 right-2.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          loc.ownership === 'Government'
                            ? 'bg-emerald-500 text-slate-950'
                            : loc.ownership === 'Private'
                            ? 'bg-blue-500 text-white'
                            : 'bg-amber-500 text-slate-950'
                        }`}>
                          {loc.ownership}
                        </span>
                      </div>
                      <div className="p-4 space-y-2">
                        <h4 className="font-extrabold text-slate-800 text-sm">{loc.proprietaryName}</h4>
                        <p className="text-xs text-slate-500 flex items-start gap-1">
                          <MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0 mt-0.5" />
                          <span>{loc.address}</span>
                        </p>
                        {loc.contactNumbers.length > 0 && (
                          <div className="pt-2 border-t border-slate-100 flex items-center gap-2 text-xs text-slate-500 font-medium">
                            <Phone className="h-3.5 w-3.5 text-emerald-500" />
                            <span>{loc.contactNumbers.join(' • ')}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                {filteredLocations.length === 0 && (
                  <div className="col-span-full text-center py-12 text-slate-400 italic text-xs">No proprietary addresses matched your search.</div>
                )}
              </div>
            </div>
          )}

          {/* C. Public Allowed Custom Modules (View Permissions Granted Only) */}
          {activePublicTab === 'custom' && (
            <div className="space-y-6" id="pub-content-custom">
              {/* Only filter custom modules where Operator 1 has allowed view access */}
              {(() => {
                const allowedMods = customModules.filter(m => m.allowedForOperator2);
                if (allowedMods.length === 0) {
                  return (
                    <div className="bg-white p-8 border border-dashed rounded-xl text-center text-slate-500">
                      <AlertCircle className="h-8 w-8 text-slate-400 mx-auto mb-2" />
                      <p className="text-xs font-bold text-slate-700">No public custom modules permitted by administration.</p>
                      <p className="text-[10px] text-slate-400 mt-1">Operator 1 has not granted viewing rights to any custom datasets at this time.</p>
                    </div>
                  );
                }

                return (
                  <div className="space-y-6">
                    {/* Simple module navigation selector */}
                    <div className="flex flex-wrap gap-2">
                      {allowedMods.map(mod => (
                        <button
                          key={mod.id}
                          onClick={() => setSelectedCustomModId(mod.id)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition border ${
                            selectedCustomModId === mod.id
                              ? 'bg-amber-500 text-slate-950 border-amber-600 shadow'
                              : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                          }`}
                        >
                          {mod.name}
                        </button>
                      ))}
                    </div>

                    {/* Rendering of selected permitted module */}
                    {(() => {
                      const activeMod = allowedMods.find(m => m.id === selectedCustomModId) || allowedMods[0];
                      if (!activeMod) return null;

                      return (
                        <div className="space-y-6 animate-fadeIn" id={`pub-custom-module-view-${activeMod.id}`}>
                          {/* Data Table */}
                          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
                            <h3 className="font-extrabold text-slate-800 text-sm mb-3">{activeMod.name} Dataset Ledger</h3>
                            <div className="overflow-x-auto border border-slate-100 rounded-lg">
                              <table className="min-w-full divide-y divide-slate-100 text-left text-xs">
                                <thead className="bg-slate-50 font-bold text-slate-700">
                                  <tr>
                                    {activeMod.columns.map(c => (
                                      <th key={c.id} className="px-3 py-2.5">{c.label}</th>
                                    ))}
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 bg-white text-slate-600">
                                  {activeMod.data.length === 0 ? (
                                    <tr>
                                      <td colSpan={activeMod.columns.length} className="text-center py-6 italic text-slate-400">
                                        No registered rows inside public records.
                                      </td>
                                    </tr>
                                  ) : (
                                    activeMod.data.map(row => (
                                      <tr key={row.id} className="hover:bg-slate-50/50">
                                        {activeMod.columns.map(col => (
                                          <td key={col.id} className="px-3 py-2.5">
                                            {col.dataType === 'Image' && row[col.label] ? (
                                              <img src={row[col.label]} alt="Media Cell" className="h-8 w-12 object-cover rounded border" />
                                            ) : (
                                              String(row[col.label] !== undefined ? row[col.label] : '-')
                                            )}
                                          </td>
                                        ))}
                                      </tr>
                                    ))
                                  )}
                                </tbody>
                              </table>
                            </div>
                          </div>

                          {/* Visualization based on Operator 1 config */}
                          <div className="text-slate-800">
                            <VisualizationRenderer
                              title={`${activeMod.name} - Permitted Public Metrics`}
                              chartType={activeMod.visualizationSetup.chartType}
                              data={activeMod.data}
                              attributes={activeMod.visualizationSetup.attributes}
                              xAxisKey={activeMod.visualizationSetup.xAxis}
                              yAxisKey={activeMod.visualizationSetup.yAxis}
                            />
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                );
              })()}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
