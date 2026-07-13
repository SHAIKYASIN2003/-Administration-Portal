/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Operator1Create } from './components/Operator1Create';
import { OperatorDisplay } from './components/OperatorDisplay';
import {
  PopulationRecord,
  InfrastructureRecord,
  InfrastructureLocationRecord,
  CustomModule,
  GalleryItem
} from './types';
import {
  INITIAL_POPULATION_DATA,
  INITIAL_INFRASTRUCTURE_DATA,
  INITIAL_INFRASTRUCTURE_LOCATION_DATA,
  INITIAL_CUSTOM_MODULES,
  INITIAL_GALLERY_DATA,
  getStoredData,
  setStoredData
} from './data';
import { Shield, Eye, Database, PlusCircle, LayoutDashboard, Globe, ArrowLeft, RefreshCw, Layers } from 'lucide-react';

export default function App() {
  // --- CORE STATE MANAGERS ---
  // role: null (Role Selector), 'operator1', or 'operator2'
  const [role, setRole] = useState<'operator1' | 'operator2' | null>(null);

  // Operator 1 Navigation: 'home' | 'create' | 'display'
  const [op1Tab, setOp1Tab] = useState<'home' | 'create' | 'display'>('home');

  // Operator 2 Navigation: 'home' | 'display'
  const [op2Tab, setOp2Tab] = useState<'home' | 'display'>('home');

  // Operator 2 display sub-mode: 'official' | 'public'
  const [op2Mode, setOp2Mode] = useState<'official' | 'public'>('official');

  // Datasets states (hooked to local storage)
  const [populationRecords, setPopulationRecords] = useState<PopulationRecord[]>([]);
  const [infrastructureRecords, setInfrastructureRecords] = useState<InfrastructureRecord[]>([]);
  const [locationRecords, setLocationRecords] = useState<InfrastructureLocationRecord[]>([]);
  const [customModules, setCustomModules] = useState<CustomModule[]>([]);
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);

  // Load from local storage on boot
  useEffect(() => {
    setPopulationRecords(getStoredData('population_records', INITIAL_POPULATION_DATA));
    setInfrastructureRecords(getStoredData('infra_records', INITIAL_INFRASTRUCTURE_DATA));
    setLocationRecords(getStoredData('location_records', INITIAL_INFRASTRUCTURE_LOCATION_DATA));
    setCustomModules(getStoredData('custom_modules', INITIAL_CUSTOM_MODULES));
    setGalleryItems(getStoredData('gallery_items', INITIAL_GALLERY_DATA));
  }, []);

  // Write datasets back to local storage on changes
  useEffect(() => {
    if (populationRecords.length > 0) setStoredData('population_records', populationRecords);
  }, [populationRecords]);

  useEffect(() => {
    if (infrastructureRecords.length > 0) setStoredData('infra_records', infrastructureRecords);
  }, [infrastructureRecords]);

  useEffect(() => {
    if (locationRecords.length > 0) setStoredData('location_records', locationRecords);
  }, [locationRecords]);

  useEffect(() => {
    if (customModules.length > 0) setStoredData('custom_modules', customModules);
  }, [customModules]);

  useEffect(() => {
    if (galleryItems.length > 0) setStoredData('gallery_items', galleryItems);
  }, [galleryItems]);

  // --- ACTIONS & HANDLERS ---
  const handleSavePopulation = (rec: PopulationRecord) => {
    setPopulationRecords(prev => {
      const idx = prev.findIndex(item => item.year === rec.year);
      if (idx > -1) {
        const updated = [...prev];
        updated[idx] = rec;
        return updated;
      }
      return [...prev, rec].sort((a, b) => a.year - b.year);
    });
  };

  const handleDeletePopulation = (id: string) => {
    setPopulationRecords(prev => prev.filter(rec => rec.id !== id));
  };

  const handleSaveInfrastructure = (rec: InfrastructureRecord) => {
    setInfrastructureRecords(prev => {
      const idx = prev.findIndex(item => item.name === rec.name && item.ownership === rec.ownership);
      if (idx > -1) {
        const updated = [...prev];
        updated[idx] = rec;
        return updated;
      }
      return [...prev, rec];
    });
  };

  const handleDeleteInfrastructure = (id: string) => {
    setInfrastructureRecords(prev => prev.filter(item => item.id !== id));
  };

  const handleSaveLocation = (rec: InfrastructureLocationRecord) => {
    setLocationRecords(prev => {
      const idx = prev.findIndex(item => item.id === rec.id || item.proprietaryName === rec.proprietaryName);
      if (idx > -1) {
        const updated = [...prev];
        updated[idx] = rec;
        return updated;
      }
      return [...prev, rec];
    });
  };

  const handleDeleteLocation = (id: string) => {
    setLocationRecords(prev => prev.filter(rec => rec.id !== id));
  };

  const handleSaveCustomModuleSchema = (mod: CustomModule) => {
    setCustomModules(prev => {
      const idx = prev.findIndex(item => item.id === mod.id);
      if (idx > -1) {
        const updated = [...prev];
        updated[idx] = mod;
        return updated;
      }
      return [...prev, mod];
    });
  };

  const handleDeleteCustomModule = (id: string) => {
    setCustomModules(prev => prev.filter(mod => mod.id !== id));
  };

  const handleDeleteCustomRow = (moduleId: string, rowId: string) => {
    setCustomModules(prev =>
      prev.map(mod => {
        if (mod.id === moduleId) {
          return {
            ...mod,
            data: mod.data.filter(row => row.id !== rowId)
          };
        }
        return mod;
      })
    );
  };

  const handleSaveGallery = (item: GalleryItem) => {
    setGalleryItems(prev => {
      const idx = prev.findIndex(g => g.title === item.title);
      if (idx > -1) {
        const updated = [...prev];
        updated[idx] = item;
        return updated;
      }
      return [...prev, item];
    });
  };

  const handleDeleteGalleryItem = (id: string) => {
    setGalleryItems(prev => prev.filter(g => g.id !== id));
  };

  // Reset to initial demo database
  const handleResetDemoData = () => {
    if (confirm('Are you sure you want to restore the default sample databases? All custom rows/modules will be reset.')) {
      localStorage.clear();
      setPopulationRecords(INITIAL_POPULATION_DATA);
      setInfrastructureRecords(INITIAL_INFRASTRUCTURE_DATA);
      setLocationRecords(INITIAL_INFRASTRUCTURE_LOCATION_DATA);
      setCustomModules(INITIAL_CUSTOM_MODULES);
      setGalleryItems(INITIAL_GALLERY_DATA);
      alert('Sample databases loaded successfully!');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 flex flex-col" id="app-container">
      {/* Dynamic Header */}
      {role && (
        <Header
          role={role}
          setRole={(newRole) => {
            setRole(newRole);
            setOp1Tab('home');
            setOp2Tab('home');
            setOp2Mode('official');
          }}
          op2Mode={op2Mode}
          setOp2Mode={setOp2Mode}
          onResetData={handleResetDemoData}
        />
      )}

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* ====================================================================
            1. OPERATOR SELECTION SCREEN (SPLASH VIEW)
            ==================================================================== */}
        {role === null && (
          <div className="flex flex-col items-center justify-center py-16 animate-fadeIn" id="operator-selector-screen">
            <div className="text-center max-w-xl mb-12">
              <div className="bg-blue-600 text-white p-3 rounded-xl inline-block shadow-sm mb-4">
                <Database className="h-6 w-6" />
              </div>
              <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 font-display sm:text-3xl">
                Municipal & Panchayat Portal
              </h1>
              <p className="text-xs text-slate-500 mt-2 font-medium leading-relaxed">
                Welcome to the administration data gateway. Select your designated operator profile below to register records, compile metrics, or access public displays.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-3xl">
              {/* Operator 1 Card */}
              <button
                onClick={() => {
                  setRole('operator1');
                  setOp1Tab('home');
                }}
                className="group bg-white rounded-2xl border-2 border-slate-200/80 hover:border-blue-600 p-8 text-left transition duration-300 shadow-sm hover:shadow-md flex flex-col justify-between h-72"
                id="select-op1-card"
              >
                <div className="space-y-4">
                  <div className="bg-blue-50 text-blue-600 p-3 rounded-xl inline-block group-hover:bg-blue-600 group-hover:text-white transition">
                    <Shield className="h-6 w-6" />
                  </div>
                  <h2 className="text-lg font-bold text-slate-900 tracking-tight">Operator 1</h2>
                  <p className="text-xs text-slate-500 leading-relaxed font-medium">
                    Data Entry & Architect Officer. Fully authorized for Census records, Physical Infrastructures, custom schema design, and visualization settings.
                  </p>
                </div>
                <span className="text-xs font-bold text-blue-600 group-hover:translate-x-1.5 transition flex items-center gap-1 mt-4">
                  <span>Enter Admin Portal</span>
                  <span>&rarr;</span>
                </span>
              </button>

              {/* Operator 2 Card */}
              <button
                onClick={() => {
                  setRole('operator2');
                  setOp2Tab('home');
                  setOp2Mode('official');
                }}
                className="group bg-white rounded-2xl border-2 border-slate-200/80 hover:border-amber-500 p-8 text-left transition duration-300 shadow-sm hover:shadow-md flex flex-col justify-between h-72"
                id="select-op2-card"
              >
                <div className="space-y-4">
                  <div className="bg-amber-50 text-amber-600 p-3 rounded-xl inline-block group-hover:bg-amber-500 group-hover:text-slate-950 transition">
                    <Eye className="h-6 w-6" />
                  </div>
                  <h2 className="text-xl font-bold text-slate-900 tracking-tight">Operator 2</h2>
                  <p className="text-xs text-slate-500 leading-relaxed font-medium">
                    Display & Reporting Officer. View-only access to executive projections, public tourism directories, geographic addresses, and pre-authorized metrics.
                  </p>
                </div>
                <span className="text-xs font-bold text-amber-600 group-hover:translate-x-1.5 transition flex items-center gap-1 mt-4">
                  <span>Enter Display Portal</span>
                  <span>&rarr;</span>
                </span>
              </button>
            </div>

            {/* Quick pre-load helper panel */}
            <div className="mt-16 text-center">
              <button
                onClick={handleResetDemoData}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-slate-600 bg-slate-100 hover:bg-slate-200 px-4 py-2 rounded-full transition"
              >
                <RefreshCw className="h-3 w-3" />
                <span>Reset / Load Sample Datasets</span>
              </button>
            </div>
          </div>
        )}

        {/* ====================================================================
            2. OPERATOR 1 WORKSPACE (ADMINISTRATIVE CENTRAL)
            ==================================================================== */}
        {role === 'operator1' && (
          <div className="space-y-6 animate-fadeIn" id="operator1-workspace">
            {/* Operator 1 Home Screen */}
            {op1Tab === 'home' && (
              <div className="space-y-8 py-4" id="op1-home-screen">
                {/* Hero Greeting banner */}
                <div className="bg-slate-900 text-white rounded-2xl p-6 md:p-8 border border-slate-800 shadow relative overflow-hidden">
                  <div className="relative z-10 space-y-3 max-w-xl">
                    <div className="bg-blue-600 text-white px-2.5 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wider inline-block">
                      Data Entry Control Desk
                    </div>
                    <h2 className="text-2xl font-extrabold font-display text-slate-100 sm:text-3xl">
                      Operator 1 Administration
                    </h2>
                    <p className="text-xs text-slate-400 font-medium leading-relaxed">
                      Initialize census metrics, plot municipality addresses, design database schemas dynamically, and grant access permissions to display operators.
                    </p>
                  </div>
                  <div className="absolute right-0 bottom-0 h-40 w-40 opacity-10 pointer-events-none">
                    <Database className="h-full w-full" />
                  </div>
                </div>

                {/* Main operational choices */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Create Button card */}
                  <button
                    onClick={() => setOp1Tab('create')}
                    className="group bg-white rounded-2xl border border-slate-200 p-6 hover:border-blue-600 hover:shadow-md transition text-left space-y-4"
                    id="op1-home-create-btn"
                  >
                    <div className="bg-blue-50 text-blue-600 p-3.5 rounded-xl inline-block group-hover:bg-blue-600 group-hover:text-white transition">
                      <PlusCircle className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wide">1. Create Section</h3>
                      <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                        Input yearly demographics, physical structures, map details, or construct your own custom schemas via Custom Mode.
                      </p>
                    </div>
                    <span className="text-xs font-bold text-blue-600 flex items-center gap-1 pt-2">
                      <span>Launch Creator Workspace</span>
                      <span>&rarr;</span>
                    </span>
                  </button>

                  {/* Display Button card */}
                  <button
                    onClick={() => setOp1Tab('display')}
                    className="group bg-white rounded-2xl border border-slate-200 p-6 hover:border-blue-600 hover:shadow-md transition text-left space-y-4"
                    id="op1-home-display-btn"
                  >
                    <div className="bg-blue-50 text-blue-600 p-3.5 rounded-xl inline-block group-hover:bg-blue-600 group-hover:text-white transition">
                      <LayoutDashboard className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wide">2. Display Section</h3>
                      <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                        Compile executive dashboards, audit tabular databases, analyze custom datasets, and control display rights.
                      </p>
                    </div>
                    <span className="text-xs font-bold text-blue-600 flex items-center gap-1 pt-2">
                      <span>Launch Analytics Center</span>
                      <span>&rarr;</span>
                    </span>
                  </button>
                </div>

                {/* Back to Selection button */}
                <div className="pt-4 text-center">
                  <button
                    onClick={() => setRole(null)}
                    className="inline-flex items-center gap-1 px-4 py-2 bg-slate-200 hover:bg-slate-300 rounded-lg text-slate-700 text-xs font-semibold transition"
                    id="op1-btn-back"
                  >
                    <ArrowLeft className="h-3.5 w-3.5" />
                    <span>Change Operator Profile</span>
                  </button>
                </div>
              </div>
            )}

            {/* Create sub-view */}
            {op1Tab === 'create' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center bg-white px-4 py-3 rounded-xl border">
                  <button
                    onClick={() => setOp1Tab('home')}
                    className="flex items-center gap-1 text-xs font-bold text-slate-600 hover:text-slate-900"
                    id="op1-create-back"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    <span>Home Desk</span>
                  </button>
                  <span className="text-xs font-bold text-slate-400">Operator 1 / Creation Suite</span>
                </div>

                <Operator1Create
                  populationRecords={populationRecords}
                  onSavePopulation={handleSavePopulation}
                  infrastructureRecords={infrastructureRecords}
                  onSaveInfrastructure={handleSaveInfrastructure}
                  locationRecords={locationRecords}
                  onSaveLocation={handleSaveLocation}
                  customModules={customModules}
                  onSaveModule={handleSaveCustomModuleSchema}
                  onDeleteModule={handleDeleteCustomModule}
                  galleryItems={galleryItems}
                  onSaveGallery={handleSaveGallery}
                />
              </div>
            )}

            {/* Display sub-view */}
            {op1Tab === 'display' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center bg-white px-4 py-3 rounded-xl border">
                  <button
                    onClick={() => setOp1Tab('home')}
                    className="flex items-center gap-1 text-xs font-bold text-slate-600 hover:text-slate-900"
                    id="op1-display-back"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    <span>Home Desk</span>
                  </button>
                  <span className="text-xs font-bold text-slate-400">Operator 1 / Analytics Display</span>
                </div>

                <OperatorDisplay
                  role="operator1"
                  op2Mode="official"
                  populationRecords={populationRecords}
                  onDeletePopulation={handleDeletePopulation}
                  infrastructureRecords={infrastructureRecords}
                  onDeleteInfrastructure={handleDeleteInfrastructure}
                  locationRecords={locationRecords}
                  onDeleteLocation={handleDeleteLocation}
                  customModules={customModules}
                  onDeleteCustomRow={handleDeleteCustomRow}
                  galleryItems={galleryItems}
                  onDeleteGalleryItem={handleDeleteGalleryItem}
                />
              </div>
            )}
          </div>
        )}

        {/* ====================================================================
            3. OPERATOR 2 WORKSPACE (DISPLAY GATEWAY)
            ==================================================================== */}
        {role === 'operator2' && (
          <div className="space-y-6 animate-fadeIn" id="operator2-workspace">
            {/* Operator 2 Home Screen */}
            {op2Tab === 'home' && (
              <div className="space-y-8 py-4" id="op2-home-screen">
                {/* Hero Greeting banner */}
                <div className="bg-slate-900 text-white rounded-2xl p-6 md:p-8 border border-slate-800 shadow relative overflow-hidden">
                  <div className="relative z-10 space-y-3 max-w-xl">
                    <div className="bg-blue-600 text-white px-2.5 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wider inline-block">
                      Display Control Desk
                    </div>
                    <h2 className="text-2xl font-extrabold font-display text-slate-100 sm:text-3xl">
                      Operator 2 Workspace
                    </h2>
                    <p className="text-xs text-slate-400 font-medium leading-relaxed">
                      Toggle official dashboards or launch public municipal portals. Read-only view ensures absolute data protection.
                    </p>
                  </div>
                  <div className="absolute right-0 bottom-0 h-40 w-40 opacity-10 pointer-events-none">
                    <Eye className="h-full w-full" />
                  </div>
                </div>

                {/* Main operational choices */}
                <div className="grid grid-cols-1 max-w-md mx-auto">
                  {/* Display Button card */}
                  <button
                    onClick={() => setOp2Tab('display')}
                    className="group bg-white rounded-2xl border-2 border-slate-200 p-6 hover:border-blue-600 hover:shadow-md transition text-left space-y-4"
                    id="op2-home-display-btn"
                  >
                    <div className="bg-blue-50 text-blue-600 p-3.5 rounded-xl inline-block group-hover:bg-blue-600 group-hover:text-white transition">
                      <LayoutDashboard className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wide">Display Module</h3>
                      <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                        Access official reports, geographic addresses, visiting spots directory, and pre-permitted municipal datasets.
                      </p>
                    </div>
                    <span className="text-xs font-bold text-blue-600 flex items-center gap-1 pt-2">
                      <span>Launch Display Workspace</span>
                      <span>&rarr;</span>
                    </span>
                  </button>
                </div>

                {/* Back to Selection button */}
                <div className="pt-4 text-center">
                  <button
                    onClick={() => setRole(null)}
                    className="inline-flex items-center gap-1 px-4 py-2 bg-slate-200 hover:bg-slate-300 rounded-lg text-slate-700 text-xs font-semibold transition"
                    id="op2-btn-back"
                  >
                    <ArrowLeft className="h-3.5 w-3.5" />
                    <span>Change Operator Profile</span>
                  </button>
                </div>
              </div>
            )}

            {/* Display sub-view */}
            {op2Tab === 'display' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center bg-white px-4 py-3 rounded-xl border shadow-sm">
                  <button
                    onClick={() => setOp2Tab('home')}
                    className="flex items-center gap-1 text-xs font-bold text-slate-600 hover:text-slate-900"
                    id="op2-display-back"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    <span>Home Desk</span>
                  </button>
                  <span className="text-xs font-bold text-slate-400">
                    Operator 2 / Display Panel • Mode: {op2Mode === 'official' ? 'Official' : 'Public'}
                  </span>
                </div>

                <OperatorDisplay
                  role="operator2"
                  op2Mode={op2Mode}
                  populationRecords={populationRecords}
                  infrastructureRecords={infrastructureRecords}
                  locationRecords={locationRecords}
                  customModules={customModules}
                  galleryItems={galleryItems}
                />
              </div>
            )}
          </div>
        )}
      </main>

      {/* Humble Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 text-center text-xs text-slate-400 font-medium">
          <p>© 2026 Municipal Administration. All administrative rights reserved under Operator 1 control.</p>
        </div>
      </footer>
    </div>
  );
}

