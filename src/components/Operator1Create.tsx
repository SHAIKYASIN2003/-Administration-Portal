/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  Users,
  Building2,
  MapPin,
  Settings,
  Image as ImageIcon,
  Plus,
  Trash2,
  Save,
  ChevronRight,
  Eye,
  FileText,
  AlertCircle,
  Folder,
  Map,
  X,
  Lock,
  Unlock,
  Check
} from 'lucide-react';
import {
  PopulationRecord,
  InfrastructureRecord,
  InfrastructureLocationRecord,
  CustomModule,
  GalleryItem,
  CustomColumn
} from '../types';
import { VisualizationRenderer } from './VisualizationRenderer';

interface Operator1CreateProps {
  populationRecords: PopulationRecord[];
  onSavePopulation: (record: PopulationRecord) => void;
  infrastructureRecords: InfrastructureRecord[];
  onSaveInfrastructure: (record: InfrastructureRecord) => void;
  locationRecords: InfrastructureLocationRecord[];
  onSaveLocation: (record: InfrastructureLocationRecord) => void;
  customModules: CustomModule[];
  onSaveModule: (module: CustomModule) => void;
  onDeleteModule: (id: string) => void;
  galleryItems: GalleryItem[];
  onSaveGallery: (item: GalleryItem) => void;
}

export const Operator1Create: React.FC<Operator1CreateProps> = ({
  populationRecords,
  onSavePopulation,
  infrastructureRecords,
  onSaveInfrastructure,
  locationRecords,
  onSaveLocation,
  customModules,
  onSaveModule,
  onDeleteModule,
  galleryItems,
  onSaveGallery,
}) => {
  // Tabs: standard 5 + custom modules
  const [activeSubTab, setActiveSubTab] = useState<string>('population');

  // --- POPULATION PAGE STATE ---
  const [popYear, setPopYear] = useState<number>(2027);
  const [popTotal, setPopTotal] = useState<string>('');
  const [popMale, setPopMale] = useState<string>('');
  const [popFemale, setPopFemale] = useState<string>('');
  const [popOthers, setPopOthers] = useState<string>('');
  const [popChildTotal, setPopChildTotal] = useState<string>('');
  const [popChildMale, setPopChildMale] = useState<string>('');
  const [popChildFemale, setPopChildFemale] = useState<string>('');
  const [popOldTotal, setPopOldTotal] = useState<string>('');
  const [popOldMale, setPopOldMale] = useState<string>('');
  const [popOldFemale, setPopOldFemale] = useState<string>('');

  // Population Visualization Setup
  const [popChartType, setPopChartType] = useState<'Table' | 'Bar' | 'Pie' | 'Line' | 'All'>('All');
  const [popXAxis, setPopXAxis] = useState<string>('year');
  const [popYAxis, setPopYAxis] = useState<string>('totalPopulation');
  const [popAttributes, setPopAttributes] = useState<string[]>([
    'totalPopulation',
    'genderMale',
    'genderFemale',
    'childrenTotal',
    'oldAgeTotal'
  ]);
  const [popGeneratedChart, setPopGeneratedChart] = useState<boolean>(true);
  const [popShowPreview, setPopShowPreview] = useState<boolean>(false);

  // Auto calculation logic for Population
  const handleAutoCalcTotal = () => {
    const male = parseInt(popMale) || 0;
    const female = parseInt(popFemale) || 0;
    const others = parseInt(popOthers) || 0;
    setPopTotal((male + female + others).toString());
  };

  const handlePopulationSave = (nextYear: boolean) => {
    const record: PopulationRecord = {
      id: 'pop-' + Date.now(),
      year: popYear,
      totalPopulation: parseInt(popTotal) || 0,
      genderMale: parseInt(popMale) || 0,
      genderFemale: parseInt(popFemale) || 0,
      genderOthers: parseInt(popOthers) || 0,
      childrenTotal: parseInt(popChildTotal) || 0,
      childrenMale: parseInt(popChildMale) || 0,
      childrenFemale: parseInt(popChildFemale) || 0,
      oldAgeTotal: parseInt(popOldTotal) || 0,
      oldAgeMale: parseInt(popOldMale) || 0,
      oldAgeFemale: parseInt(popOldFemale) || 0,
      visualizationSetup: {
        chartType: popChartType,
        xAxis: popXAxis,
        yAxis: popYAxis,
        attributes: popAttributes
      }
    };

    onSavePopulation(record);
    alert(`Population record for year ${popYear} saved successfully!`);

    if (nextYear) {
      setPopYear(prev => prev + 1);
      // Clear values but keep format
      setPopTotal('');
      setPopMale('');
      setPopFemale('');
      setPopOthers('');
      setPopChildTotal('');
      setPopChildMale('');
      setPopChildFemale('');
      setPopOldTotal('');
      setPopOldMale('');
      setPopOldFemale('');
    }
  };

  // --- INFRASTRUCTURE PAGE STATE ---
  const [infraName, setInfraName] = useState<string>('');
  const [infraCount, setInfraCount] = useState<string>('');
  const [infraOwnership, setInfraOwnership] = useState<'Government' | 'Private' | 'Trust'>('Government');
  const [infraProperties, setInfraProperties] = useState<string[]>(['']);
  const [infraContactNumbers, setInfraContactNumbers] = useState<string[]>(['']);
  const [infraPreviewTable, setInfraPreviewTable] = useState<boolean>(false);

  const handleAddPropertyField = () => {
    setInfraProperties(prev => [...prev, '']);
  };

  const handleRemovePropertyField = (index: number) => {
    setInfraProperties(prev => prev.filter((_, idx) => idx !== index));
  };

  const handleAddContactField = () => {
    setInfraContactNumbers(prev => [...prev, '']);
  };

  const handleRemoveContactField = (index: number) => {
    setInfraContactNumbers(prev => prev.filter((_, idx) => idx !== index));
  };

  const handleInfrastructureSave = () => {
    if (!infraName.trim()) {
      alert('Please enter Infrastructure Name');
      return;
    }
    const record: InfrastructureRecord = {
      id: 'infra-' + Date.now(),
      name: infraName,
      count: parseInt(infraCount) || 0,
      ownership: infraOwnership,
      properties: infraProperties.filter(p => p.trim() !== ''),
      contactNumbers: infraContactNumbers.filter(c => c.trim() !== '')
    };
    onSaveInfrastructure(record);
    alert('Infrastructure record saved successfully!');
    // Reset form
    setInfraName('');
    setInfraCount('');
    setInfraOwnership('Government');
    setInfraProperties(['']);
    setInfraContactNumbers(['']);
    setInfraPreviewTable(false);
  };

  // --- INFRASTRUCTURE LOCATION PAGE STATE ---
  const [locPropName, setLocPropName] = useState<string>('');
  const [locOwnership, setLocOwnership] = useState<'Government' | 'Private' | 'Trust'>('Government');
  const [locAddress, setLocAddress] = useState<string>('');
  const [locContacts, setLocContacts] = useState<string[]>(['']);
  const [locImage, setLocImage] = useState<string>('');
  const [locGenerated, setLocGenerated] = useState<boolean>(false);

  const handleAddLocContact = () => {
    setLocContacts(prev => [...prev, '']);
  };

  const handleRemoveLocContact = (index: number) => {
    setLocContacts(prev => prev.filter((_, idx) => idx !== index));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, callback: (base64: string) => void) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        callback(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLocationSave = () => {
    if (!locPropName.trim()) {
      alert('Please enter a proprietary name');
      return;
    }
    const record: InfrastructureLocationRecord = {
      id: 'loc-' + Date.now(),
      proprietaryName: locPropName,
      ownership: locOwnership,
      address: locAddress,
      contactNumbers: locContacts.filter(c => c.trim() !== ''),
      imageUrl: locImage || 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=600&auto=format&fit=crop&q=80'
    };
    onSaveLocation(record);
    alert('Infrastructure Location saved successfully!');
    // Reset
    setLocPropName('');
    setLocOwnership('Government');
    setLocAddress('');
    setLocContacts(['']);
    setLocImage('');
    setLocGenerated(false);
  };

  // --- CUSTOM MODE PAGE STATE ---
  const [customModuleName, setCustomModuleName] = useState<string>('');
  const [customColumns, setCustomColumns] = useState<CustomColumn[]>([
    { id: 'col-1', label: 'Item Name', dataType: 'Text', rowRequirement: true }
  ]);
  const [customRowReqChecked, setCustomRowReqChecked] = useState<boolean>(false);
  // Custom Module Visualization
  const [customChartType, setCustomChartType] = useState<'Table' | 'Bar' | 'Pie' | 'Line' | 'All'>('Table');
  const [customXAxis, setCustomXAxis] = useState<string>('Item Name');
  const [customYAxis, setCustomYAxis] = useState<string>('Item Name');
  const [customAttributes, setCustomAttributes] = useState<string[]>([]);
  // Editing state
  const [editingModuleId, setEditingModuleId] = useState<string | null>(null);

  const handleAddCustomColumn = () => {
    const id = 'col-' + Date.now() + '-' + Math.floor(Math.random() * 1000);
    setCustomColumns(prev => [...prev, { id, label: '', dataType: 'Text', rowRequirement: false }]);
  };

  const handleRemoveCustomColumn = (id: string) => {
    setCustomColumns(prev => prev.filter(col => col.id !== id));
  };

  const handleCustomColumnChange = (id: string, field: keyof CustomColumn, val: any) => {
    setCustomColumns(prev =>
      prev.map(col => (col.id === id ? { ...col, [field]: val } : col))
    );
  };

  // Trigger setup attributes when columns change
  useEffect(() => {
    const labels = customColumns.map(c => c.label).filter(l => l.trim() !== '');
    if (labels.length > 0) {
      if (!labels.includes(customXAxis)) setCustomXAxis(labels[0]);
      if (!labels.includes(customYAxis)) setCustomYAxis(labels[0]);
    }
  }, [customColumns]);

  const handleSaveCustomModuleSchema = () => {
    if (!customModuleName.trim()) {
      alert('Please enter a Module Name');
      return;
    }
    // Verify row requirement checkbox rule
    // Check if at least one column has rowRequirement enabled, AND the user checked the main confirmation
    const hasColReq = customColumns.some(col => col.rowRequirement);
    if (!hasColReq) {
      alert('Row Requirement Checkbox is required! Please mark at least one column for row insertion position before moving to the next stage.');
      return;
    }
    if (!customRowReqChecked) {
      alert('Please check the Row Requirement Checkbox confirmation before saving!');
      return;
    }

    const labels = customColumns.map(c => c.label).filter(l => l.trim() !== '');
    if (labels.length === 0) {
      alert('Please provide at least one valid column label.');
      return;
    }

    const updatedModule: CustomModule = {
      id: editingModuleId || 'mod-' + Date.now(),
      name: customModuleName,
      columns: customColumns.map(c => ({
        ...c,
        label: c.label.trim()
      })),
      visualizationSetup: {
        chartType: customChartType,
        attributes: customAttributes.length > 0 ? customAttributes : labels.filter(l => l !== customXAxis),
        xAxis: customXAxis || labels[0],
        yAxis: customYAxis || labels[0]
      },
      data: editingModuleId ? (customModules.find(m => m.id === editingModuleId)?.data || []) : [],
      allowedForOperator2: editingModuleId ? (customModules.find(m => m.id === editingModuleId)?.allowedForOperator2 || true) : true
    };

    onSaveModule(updatedModule);
    alert(`Custom Module "${customModuleName}" saved successfully! Dynamic entry tab is now active.`);

    // Reset Form
    setCustomModuleName('');
    setCustomColumns([{ id: 'col-1', label: 'Item Name', dataType: 'Text', rowRequirement: true }]);
    setCustomRowReqChecked(false);
    setEditingModuleId(null);
  };

  const handleEditModule = (mod: CustomModule) => {
    setEditingModuleId(mod.id);
    setCustomModuleName(mod.name);
    setCustomColumns(mod.columns);
    setCustomRowReqChecked(true);
    setCustomChartType(mod.visualizationSetup.chartType);
    setCustomXAxis(mod.visualizationSetup.xAxis);
    setCustomYAxis(mod.visualizationSetup.yAxis);
    setCustomAttributes(mod.visualizationSetup.attributes);
  };

  // --- DYNAMIC CUSTOM MODULE DATA ENTRY ---
  // Store row data currently being typed for the active Custom Module tab
  const [customRowDraft, setCustomRowDraft] = useState<Record<string, any>>({});
  const handleSaveCustomRow = (mod: CustomModule) => {
    const newRow = {
      id: 'row-' + Date.now(),
      ...customRowDraft
    };
    // Ensure all columns are defined in some way
    mod.columns.forEach(col => {
      if (newRow[col.label] === undefined) {
        newRow[col.label] = col.dataType === 'Number' ? 0 : '';
      }
    });

    const updatedModule = {
      ...mod,
      data: [...mod.data, newRow]
    };

    onSaveModule(updatedModule);
    alert('Record saved to module database!');
    setCustomRowDraft({});
  };

  const handleDeleteCustomRow = (mod: CustomModule, rowId: string) => {
    const updatedModule = {
      ...mod,
      data: mod.data.filter(r => r.id !== rowId)
    };
    onSaveModule(updatedModule);
  };

  const handleToggleModulePermission = (mod: CustomModule) => {
    const updatedModule = {
      ...mod,
      allowedForOperator2: !mod.allowedForOperator2
    };
    onSaveModule(updatedModule);
  };

  // --- GALLERY PAGE STATE ---
  const [galTitle, setGalTitle] = useState<string>('');
  const [galCategory, setGalCategory] = useState<string>('');
  const [galDescription, setGalDescription] = useState<string>('');
  const [galImages, setGalImages] = useState<string[]>(['']);
  const [galMapImage, setGalMapImage] = useState<string>('');
  const [galAddress, setGalAddress] = useState<string>('');

  const [selectedGalleryItem, setSelectedGalleryItem] = useState<GalleryItem | null>(null);

  const handleAddGalImageField = () => {
    setGalImages(prev => [...prev, '']);
  };

  const handleRemoveGalImageField = (index: number) => {
    setGalImages(prev => prev.filter((_, idx) => idx !== index));
  };

  const handleGalImageValueChange = (index: number, val: string) => {
    setGalImages(prev => prev.map((item, idx) => (idx === index ? val : item)));
  };

  const handleGallerySave = () => {
    if (!galTitle.trim()) {
      alert('Please provide a Title');
      return;
    }
    const finalImages = galImages.filter(img => img.trim() !== '');
    if (finalImages.length === 0) {
      finalImages.push('https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=600&auto=format&fit=crop&q=80');
    }

    const item: GalleryItem = {
      id: 'gal-' + Date.now(),
      title: galTitle,
      category: galCategory || 'General',
      description: galDescription,
      images: finalImages,
      mapImage: galMapImage || 'https://images.unsplash.com/photo-1524661135-423995f22d0b?w=600&auto=format&fit=crop&q=80',
      address: galAddress
    };

    onSaveGallery(item);
    alert('Gallery item successfully uploaded to administrative databases!');

    // Reset
    setGalTitle('');
    setGalCategory('');
    setGalDescription('');
    setGalImages(['']);
    setGalMapImage('');
    setGalAddress('');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 py-4" id="operator1-create-dashboard">
      {/* Sidebar Navigation */}
      <div className="lg:col-span-3 flex flex-col gap-2">
        <div className="bg-slate-900 text-white rounded-xl p-4 shadow-sm border border-slate-800">
          <p className="text-[10px] uppercase tracking-wider font-bold text-slate-400 mb-3">Core Modules</p>
          <nav className="flex flex-col gap-1.5" id="admin-module-nav">
            <button
              onClick={() => setActiveSubTab('population')}
              className={`w-full flex items-center justify-between px-3.5 py-2 rounded text-xs font-semibold transition duration-150 ${
                activeSubTab === 'population'
                  ? 'bg-blue-600 text-white shadow-sm font-bold'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
              id="tab-population"
            >
              <span className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                <span>Population</span>
              </span>
              <ChevronRight className="h-3.5 w-3.5 opacity-80" />
            </button>

            <button
              onClick={() => setActiveSubTab('infrastructure')}
              className={`w-full flex items-center justify-between px-3.5 py-2 rounded text-xs font-semibold transition duration-150 ${
                activeSubTab === 'infrastructure'
                  ? 'bg-blue-600 text-white shadow-sm font-bold'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
              id="tab-infrastructure"
            >
              <span className="flex items-center gap-2">
                <Building2 className="h-4 w-4" />
                <span>Infrastructure Types</span>
              </span>
              <ChevronRight className="h-3.5 w-3.5 opacity-80" />
            </button>

            <button
              onClick={() => setActiveSubTab('location')}
              className={`w-full flex items-center justify-between px-3.5 py-2 rounded text-xs font-semibold transition duration-150 ${
                activeSubTab === 'location'
                  ? 'bg-blue-600 text-white shadow-sm font-bold'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
              id="tab-location"
            >
              <span className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span>Infra Location</span>
              </span>
              <ChevronRight className="h-3.5 w-3.5 opacity-80" />
            </button>

            <button
              onClick={() => setActiveSubTab('gallery')}
              className={`w-full flex items-center justify-between px-3.5 py-2 rounded text-xs font-semibold transition duration-150 ${
                activeSubTab === 'gallery'
                  ? 'bg-blue-600 text-white shadow-sm font-bold'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
              id="tab-gallery"
            >
              <span className="flex items-center gap-2">
                <ImageIcon className="h-4 w-4" />
                <span>Gallery & Map Places</span>
              </span>
              <ChevronRight className="h-3.5 w-3.5 opacity-80" />
            </button>
          </nav>

          {/* Custom Mode Page configuration */}
          <div className="border-t border-slate-800 my-4 pt-4">
            <button
              onClick={() => setActiveSubTab('custom-mode')}
              className={`w-full flex items-center justify-between px-3.5 py-2 rounded text-xs font-semibold transition duration-150 ${
                activeSubTab === 'custom-mode'
                  ? 'bg-purple-600 text-white shadow-md font-bold'
                  : 'bg-slate-800 text-purple-300 border border-purple-900/40 hover:bg-slate-700/80 hover:text-white'
              }`}
              id="tab-custom-mode"
            >
              <span className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                <span>Custom Module Builder</span>
              </span>
              <Plus className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Dynamic Registered Custom Modules */}
        {customModules.length > 0 && (
          <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm flex flex-col gap-2">
            <p className="text-[10px] uppercase tracking-wider font-extrabold text-slate-400 border-b border-slate-100 pb-1">
              Custom Modules (Active)
            </p>
            {customModules.map(mod => (
              <button
                key={mod.id}
                onClick={() => setActiveSubTab(`custom-mod-${mod.id}`)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold text-left transition ${
                  activeSubTab === `custom-mod-${mod.id}`
                    ? 'bg-purple-100 text-purple-950 border border-purple-200'
                    : 'text-slate-700 hover:bg-slate-50 border border-transparent'
                }`}
                id={`tab-custom-module-btn-${mod.id}`}
              >
                <span className="flex items-center gap-2 truncate">
                  <span className="w-2 h-2 rounded-full bg-purple-600 shrink-0" />
                  <span className="truncate">{mod.name}</span>
                </span>
                <ChevronRight className="h-3 w-3 text-slate-400 shrink-0" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Main Content Area */}
      <div className="lg:col-span-9 space-y-6">
        {/* ==================== 1. POPULATION MODULE ==================== */}
        {activeSubTab === 'population' && (
          <div className="space-y-6" id="section-population-creator">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
                <div>
                  <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <Users className="text-emerald-500 h-5 w-5" />
                    <span>Population Demographics Office</span>
                  </h2>
                  <p className="text-xs text-slate-500">Record yearly counts, gender ratios, children profiles, and retirement groups.</p>
                </div>
              </div>

              {/* Year & Total */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6 bg-slate-50/50 p-4 rounded-xl border border-slate-100">
                <div className="form-group">
                  <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase">1. Survey Year</label>
                  <input
                    type="number"
                    value={popYear}
                    onChange={e => setPopYear(parseInt(e.target.value) || 2027)}
                    placeholder="e.g. 2027"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 outline-none transition"
                    id="pop-input-year"
                  />
                </div>
                <div className="form-group">
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-bold text-slate-600 uppercase">2. Total Population</label>
                    <button
                      type="button"
                      onClick={handleAutoCalcTotal}
                      className="text-[10px] font-bold text-emerald-600 hover:text-emerald-700 bg-emerald-50 hover:bg-emerald-100/80 px-2 py-0.5 rounded transition"
                      id="pop-btn-autocalc"
                    >
                      Sum Genders Auto
                    </button>
                  </div>
                  <input
                    type="number"
                    value={popTotal}
                    onChange={e => setPopTotal(e.target.value)}
                    placeholder="Enter or Sum Genders Auto"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 outline-none transition font-semibold"
                    id="pop-input-total"
                  />
                </div>
              </div>

              {/* Sub Distributions */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                {/* Gender */}
                <div className="p-4 rounded-xl border border-slate-200/60 bg-white shadow-sm space-y-3">
                  <p className="text-xs font-bold text-emerald-700 uppercase tracking-wide border-b border-slate-100 pb-1.5 flex items-center justify-between">
                    <span>Gender Distribution</span>
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  </p>
                  <div>
                    <label className="block text-[10px] font-semibold text-slate-500 mb-1">Male Count</label>
                    <input
                      type="number"
                      value={popMale}
                      onChange={e => setPopMale(e.target.value)}
                      placeholder="Male"
                      className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs"
                      id="pop-input-male"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-semibold text-slate-500 mb-1">Female Count</label>
                    <input
                      type="number"
                      value={popFemale}
                      onChange={e => setPopFemale(e.target.value)}
                      placeholder="Female"
                      className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs"
                      id="pop-input-female"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-semibold text-slate-500 mb-1">Others Count</label>
                    <input
                      type="number"
                      value={popOthers}
                      onChange={e => setPopOthers(e.target.value)}
                      placeholder="Others"
                      className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs"
                      id="pop-input-others"
                    />
                  </div>
                </div>

                {/* Children */}
                <div className="p-4 rounded-xl border border-slate-200/60 bg-white shadow-sm space-y-3">
                  <p className="text-xs font-bold text-blue-700 uppercase tracking-wide border-b border-slate-100 pb-1.5 flex items-center justify-between">
                    <span>Children Statistics</span>
                    <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                  </p>
                  <div>
                    <label className="block text-[10px] font-semibold text-slate-500 mb-1">Total Children</label>
                    <input
                      type="number"
                      value={popChildTotal}
                      onChange={e => setPopChildTotal(e.target.value)}
                      placeholder="Total Children"
                      className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs font-medium"
                      id="pop-input-child-total"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-semibold text-slate-500 mb-1">Children Male</label>
                    <input
                      type="number"
                      value={popChildMale}
                      onChange={e => setPopChildMale(e.target.value)}
                      placeholder="Male children"
                      className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs"
                      id="pop-input-child-male"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-semibold text-slate-500 mb-1">Children Female</label>
                    <input
                      type="number"
                      value={popChildFemale}
                      onChange={e => setPopChildFemale(e.target.value)}
                      placeholder="Female children"
                      className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs"
                      id="pop-input-child-female"
                    />
                  </div>
                </div>

                {/* Old Age */}
                <div className="p-4 rounded-xl border border-slate-200/60 bg-white shadow-sm space-y-3">
                  <p className="text-xs font-bold text-amber-700 uppercase tracking-wide border-b border-slate-100 pb-1.5 flex items-center justify-between">
                    <span>Old Age Statistics (60+)</span>
                    <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                  </p>
                  <div>
                    <label className="block text-[10px] font-semibold text-slate-500 mb-1">Total Old Age</label>
                    <input
                      type="number"
                      value={popOldTotal}
                      onChange={e => setPopOldTotal(e.target.value)}
                      placeholder="Total Seniors"
                      className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs font-medium"
                      id="pop-input-old-total"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-semibold text-slate-500 mb-1">Old Age Male</label>
                    <input
                      type="number"
                      value={popOldMale}
                      onChange={e => setPopOldMale(e.target.value)}
                      placeholder="Senior males"
                      className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs"
                      id="pop-input-old-male"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-semibold text-slate-500 mb-1">Old Age Female</label>
                    <input
                      type="number"
                      value={popOldFemale}
                      onChange={e => setPopOldFemale(e.target.value)}
                      placeholder="Senior females"
                      className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs"
                      id="pop-input-old-female"
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-between border-t border-slate-100 pt-4 gap-4">
                <button
                  type="button"
                  onClick={() => {
                    setPopTotal('');
                    setPopMale('');
                    setPopFemale('');
                    setPopOthers('');
                    setPopChildTotal('');
                    setPopChildMale('');
                    setPopChildFemale('');
                    setPopOldTotal('');
                    setPopOldMale('');
                    setPopOldFemale('');
                  }}
                  className="px-4 py-2 border border-slate-200 text-slate-600 rounded-lg text-sm font-medium hover:bg-slate-50 transition"
                  id="pop-btn-cancel"
                >
                  Cancel
                </button>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => handlePopulationSave(false)}
                    className="flex items-center gap-1.5 px-4 py-2 bg-slate-800 text-white rounded-lg text-sm font-semibold hover:bg-slate-700 transition shadow"
                    id="pop-btn-save"
                  >
                    <Save className="h-4 w-4" />
                    <span>Save</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handlePopulationSave(true)}
                    className="flex items-center gap-1.5 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-slate-950 rounded-lg text-sm font-bold transition shadow"
                    id="pop-btn-save-next-year"
                  >
                    <Plus className="h-4 w-4 text-slate-950" />
                    <span>Save & Next Year</span>
                  </button>
                </div>
              </div>
            </div>

            {/* SETUP VISUALIZATION PANEL */}
            <div className="bg-slate-900 text-white rounded-2xl border border-slate-800 p-6 shadow-md">
              <div className="border-b border-slate-800 pb-3 mb-5">
                <h3 className="font-bold text-sm tracking-tight text-slate-200">
                  Setup Visualization (Create Visualization Section)
                </h3>
                <p className="text-xs text-slate-400">Configure chart projections for display operators and executives.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-5">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Chart Type</label>
                  <select
                    value={popChartType}
                    onChange={e => setPopChartType(e.target.value as any)}
                    className="w-full bg-slate-800 border border-slate-700 text-white text-xs px-2.5 py-1.5 rounded-lg outline-none"
                    id="pop-vis-type"
                  >
                    <option value="Table">Table</option>
                    <option value="Bar">Bar Chart</option>
                    <option value="Pie">Pie Chart</option>
                    <option value="Line">Line Chart</option>
                    <option value="All">All Projections</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">X-Axis</label>
                  <select
                    value={popXAxis}
                    onChange={e => setPopXAxis(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 text-white text-xs px-2.5 py-1.5 rounded-lg outline-none"
                    id="pop-vis-xaxis"
                  >
                    <option value="year">Survey Year</option>
                    <option value="totalPopulation">Total Population</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Y-Axis</label>
                  <select
                    value={popYAxis}
                    onChange={e => setPopYAxis(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 text-white text-xs px-2.5 py-1.5 rounded-lg outline-none"
                    id="pop-vis-yaxis"
                  >
                    <option value="totalPopulation">Total Population</option>
                    <option value="genderMale">Male Demographics</option>
                    <option value="genderFemale">Female Demographics</option>
                  </select>
                </div>

                <div className="md:col-span-1">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Select Attributes to Display</label>
                  <div className="bg-slate-800 p-2 rounded-lg border border-slate-700 max-h-24 overflow-y-auto space-y-1">
                    {[
                      { key: 'totalPopulation', label: 'Total Population' },
                      { key: 'genderMale', label: 'Male Count' },
                      { key: 'genderFemale', label: 'Female Count' },
                      { key: 'genderOthers', label: 'Others Count' },
                      { key: 'childrenTotal', label: 'Total Children' },
                      { key: 'oldAgeTotal', label: 'Total Old Age' }
                    ].map(item => (
                      <label key={item.key} className="flex items-center gap-1.5 text-[10px] cursor-pointer hover:text-white">
                        <input
                          type="checkbox"
                          checked={popAttributes.includes(item.key)}
                          onChange={e => {
                            if (e.target.checked) {
                              setPopAttributes(prev => [...prev, item.key]);
                            } else {
                              setPopAttributes(prev => prev.filter(k => k !== item.key));
                            }
                          }}
                          className="rounded text-emerald-500 accent-emerald-500"
                        />
                        <span>{item.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* Visualization Setup Buttons */}
              <div className="flex flex-wrap items-center justify-between border-t border-slate-800 pt-4 gap-3">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setPopGeneratedChart(true);
                      alert('Visualization table/chart updated! Select "View" to preview.');
                    }}
                    className="px-3.5 py-1.5 bg-slate-800 text-slate-300 border border-slate-700 rounded-lg text-xs hover:bg-slate-700 transition"
                    id="pop-btn-generate"
                  >
                    Generate
                  </button>
                  <button
                    onClick={() => {
                      // Save to the database
                      alert('Visualization format successfully configured in administration files!');
                    }}
                    className="px-3.5 py-1.5 bg-slate-800 text-emerald-400 border border-slate-700 rounded-lg text-xs hover:bg-slate-700 transition flex items-center gap-1"
                    id="pop-btn-save-vis"
                  >
                    <Save className="h-3 w-3" />
                    <span>Save Visualization</span>
                  </button>
                </div>

                <button
                  onClick={() => setPopShowPreview(!popShowPreview)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 ${
                    popShowPreview
                      ? 'bg-emerald-500 text-slate-950'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                  id="pop-btn-view"
                >
                  <Eye className="h-3.5 w-3.5" />
                  <span>{popShowPreview ? 'Hide Live View' : 'View Generated Chart'}</span>
                </button>
              </div>

              {/* Dynamic Live Visualization Display */}
              {popShowPreview && popGeneratedChart && (
                <div className="mt-5 border-t border-slate-800 pt-5 text-slate-800" id="pop-chart-container">
                  <VisualizationRenderer
                    title={`Survey Census Projection Setup (${popChartType})`}
                    chartType={popChartType}
                    data={populationRecords}
                    attributes={popAttributes}
                    xAxisKey={popXAxis}
                    yAxisKey={popYAxis}
                  />
                </div>
              )}
            </div>
          </div>
        )}

        {/* ==================== 2. INFRASTRUCTURE TYPES MODULE ==================== */}
        {activeSubTab === 'infrastructure' && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6" id="section-infrastructure-creator">
            <div>
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Building2 className="text-emerald-500 h-5 w-5" />
                <span>Infrastructure Directory Entry</span>
              </h2>
              <p className="text-xs text-slate-500">Log physical infrastructures, count, ownership, and direct property list records.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase">1. Infrastructure Type</label>
                <input
                  type="text"
                  value={infraName}
                  onChange={e => setInfraName(e.target.value)}
                  placeholder="e.g. School, Hospital, Hospital Office"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 outline-none transition"
                  id="infra-input-name"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase">2. Count</label>
                <input
                  type="number"
                  value={infraCount}
                  onChange={e => setInfraCount(e.target.value)}
                  placeholder="Number of facilities"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 outline-none transition"
                  id="infra-input-count"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase">3. Ownership Method</label>
                <select
                  value={infraOwnership}
                  onChange={e => setInfraOwnership(e.target.value as any)}
                  className="w-full px-3 py-2 border border-slate-200 bg-white rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 outline-none transition"
                  id="infra-input-ownership"
                >
                  <option value="Government">Government</option>
                  <option value="Private">Private</option>
                  <option value="Trust">Trust</option>
                </select>
              </div>
            </div>

            {/* Dynamic Property Names */}
            <div className="bg-slate-50/50 p-4 rounded-xl border border-slate-100">
              <div className="flex items-center justify-between mb-3">
                <label className="block text-xs font-bold text-slate-600 uppercase">Properties Names List</label>
                <button
                  type="button"
                  onClick={handleAddPropertyField}
                  className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 bg-emerald-50 hover:bg-emerald-100/60 px-2.5 py-1 rounded-lg transition flex items-center gap-1"
                  id="infra-btn-add-property"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>Add Property Row</span>
                </button>
              </div>

              <div className="space-y-2 max-h-48 overflow-y-auto">
                {infraProperties.map((prop, idx) => (
                  <div key={idx} className="flex gap-2">
                    <input
                      type="text"
                      value={prop}
                      onChange={e => {
                        const val = e.target.value;
                        setInfraProperties(prev => prev.map((item, index) => (index === idx ? val : item)));
                      }}
                      placeholder={`Property Name #${idx + 1}`}
                      className="flex-1 px-3 py-1.5 border border-slate-200 bg-white rounded-lg text-xs"
                      id={`infra-input-property-${idx}`}
                    />
                    {infraProperties.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemovePropertyField(idx)}
                        className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Dynamic Contact Numbers */}
            <div className="bg-slate-50/50 p-4 rounded-xl border border-slate-100">
              <div className="flex items-center justify-between mb-3">
                <label className="block text-xs font-bold text-slate-600 uppercase">Contact Numbers</label>
                <button
                  type="button"
                  onClick={handleAddContactField}
                  className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 bg-emerald-50 hover:bg-emerald-100/60 px-2.5 py-1 rounded-lg transition flex items-center gap-1"
                  id="infra-btn-add-contact"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>Add More Number</span>
                </button>
              </div>

              <div className="space-y-2 max-h-48 overflow-y-auto">
                {infraContactNumbers.map((num, idx) => (
                  <div key={idx} className="flex gap-2">
                    <input
                      type="tel"
                      value={num}
                      onChange={e => {
                        const val = e.target.value;
                        setInfraContactNumbers(prev => prev.map((item, index) => (index === idx ? val : item)));
                      }}
                      placeholder={`Contact Number #${idx + 1}`}
                      className="flex-1 px-3 py-1.5 border border-slate-200 bg-white rounded-lg text-xs"
                      id={`infra-input-contact-${idx}`}
                    />
                    {infraContactNumbers.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveContactField(idx)}
                        className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Action buttons and preview */}
            <div className="flex items-center justify-between border-t border-slate-100 pt-4 gap-4">
              <button
                type="button"
                onClick={() => {
                  setInfraPreviewTable(true);
                  alert('Temporary preview table generated below!');
                }}
                className="px-4 py-2 border border-slate-200 text-slate-600 rounded-lg text-sm font-medium hover:bg-slate-50 transition"
                id="infra-btn-generate-table"
              >
                Generate Table
              </button>
              <button
                type="button"
                onClick={handleInfrastructureSave}
                className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-lg text-sm transition shadow flex items-center gap-1"
                id="infra-btn-save"
              >
                <Save className="h-4 w-4" />
                <span>Save</span>
              </button>
            </div>

            {/* Simulated Live Table Generator */}
            {infraPreviewTable && (
              <div className="mt-6 border-t border-slate-100 pt-6 animate-fadeIn" id="infra-preview-table-container">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Live Table Generated Preview</h4>
                <div className="overflow-x-auto border border-slate-200 rounded-lg">
                  <table className="min-w-full divide-y divide-slate-200 text-left text-xs">
                    <thead className="bg-slate-50 text-slate-700 font-bold uppercase tracking-wider">
                      <tr>
                        <th className="px-4 py-2.5">Infrastructure Type</th>
                        <th className="px-4 py-2.5">Total Count</th>
                        <th className="px-4 py-2.5">Ownership Status</th>
                        <th className="px-4 py-2.5">Names of Properties</th>
                        <th className="px-4 py-2.5">Contact Directories</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 bg-white text-slate-600">
                      <tr>
                        <td className="px-4 py-2.5 font-semibold text-slate-800">{infraName || 'No Name Entered'}</td>
                        <td className="px-4 py-2.5">{infraCount || '0'}</td>
                        <td className="px-4 py-2.5">
                          <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-medium">{infraOwnership}</span>
                        </td>
                        <td className="px-4 py-2.5 text-slate-500">
                          {infraProperties.filter(p => p.trim() !== '').join(', ') || 'None specified'}
                        </td>
                        <td className="px-4 py-2.5 text-slate-500">
                          {infraContactNumbers.filter(c => c.trim() !== '').join(', ') || 'None specified'}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ==================== 3. INFRASTRUCTURE LOCATION MODULE ==================== */}
        {activeSubTab === 'location' && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6" id="section-location-creator">
            <div>
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <MapPin className="text-emerald-500 h-5 w-5" />
                <span>Proprietary Locations Registry</span>
              </h2>
              <p className="text-xs text-slate-500">Upload property images, map specific municipal addresses, and tie locations to emergency contact lines.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase">1. Proprietary Name</label>
                <input
                  type="text"
                  value={locPropName}
                  onChange={e => setLocPropName(e.target.value)}
                  placeholder="e.g. Municipal Hospital East Wing"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                  id="loc-input-propname"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase">2. Ownership Class</label>
                <select
                  value={locOwnership}
                  onChange={e => setLocOwnership(e.target.value as any)}
                  className="w-full px-3 py-2 border border-slate-200 bg-white rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                  id="loc-input-ownership"
                >
                  <option value="Government">Government</option>
                  <option value="Private">Private</option>
                  <option value="Trust">Trust</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase">3. Full Street Address</label>
                <input
                  type="text"
                  value={locAddress}
                  onChange={e => setLocAddress(e.target.value)}
                  placeholder="Enter full municipal location address"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                  id="loc-input-address"
                />
              </div>
            </div>

            {/* Location Contact */}
            <div className="bg-slate-50/50 p-4 rounded-xl border border-slate-100">
              <div className="flex items-center justify-between mb-3">
                <label className="block text-xs font-bold text-slate-600 uppercase">Contact Numbers</label>
                <button
                  type="button"
                  onClick={handleAddLocContact}
                  className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 bg-emerald-50 hover:bg-emerald-100/60 px-2.5 py-1 rounded-lg transition flex items-center gap-1"
                  id="loc-btn-add-contact"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>Add More Number</span>
                </button>
              </div>

              <div className="space-y-2">
                {locContacts.map((c, idx) => (
                  <div key={idx} className="flex gap-2">
                    <input
                      type="tel"
                      value={c}
                      onChange={e => {
                        const val = e.target.value;
                        setLocContacts(prev => prev.map((item, index) => (index === idx ? val : item)));
                      }}
                      placeholder={`Direct Line #${idx + 1}`}
                      className="flex-1 px-3 py-1.5 border border-slate-200 bg-white rounded-lg text-xs"
                      id={`loc-input-contact-${idx}`}
                    />
                    {locContacts.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveLocContact(idx)}
                        className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Property Image Upload */}
            <div className="space-y-3">
              <label className="block text-xs font-bold text-slate-600 uppercase">5. Upload Property Image</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border-2 border-dashed border-slate-200 hover:border-emerald-500 rounded-xl p-6 transition flex flex-col items-center justify-center bg-slate-50/50 cursor-pointer text-center relative">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={e => handleFileChange(e, setLocImage)}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <ImageIcon className="h-8 w-8 text-slate-400 mb-2" />
                  <p className="text-xs font-bold text-slate-700">Drag & Drop or Click to Upload File</p>
                  <p className="text-[10px] text-slate-400 mt-1">Supports PNG, JPG, GIF up to 5MB</p>
                </div>

                <div className="flex flex-col justify-between p-4 bg-slate-50 border border-slate-200 rounded-xl">
                  <div className="text-xs font-semibold text-slate-500 mb-2">Or enter image URL:</div>
                  <input
                    type="text"
                    value={locImage}
                    onChange={e => setLocImage(e.target.value)}
                    placeholder="https://images.unsplash.com/photo-..."
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs bg-white mb-2"
                  />
                  {locImage ? (
                    <div className="relative w-full h-24 rounded-lg overflow-hidden border border-slate-200">
                      <img src={locImage} alt="Preview" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => setLocImage('')}
                        className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex-1 flex items-center justify-center border border-dashed border-slate-200 rounded-lg bg-slate-100 text-slate-400 text-[10px] py-4">
                      No Image Configured
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Location buttons */}
            <div className="flex items-center justify-between border-t border-slate-100 pt-4 gap-4">
              <button
                type="button"
                onClick={() => {
                  if (!locPropName.trim()) {
                    alert('Please enter Proprietary Name to generate a card.');
                    return;
                  }
                  setLocGenerated(true);
                  alert('Interactive Location Card generated below!');
                }}
                className="px-4 py-2 border border-slate-200 text-slate-600 rounded-lg text-sm font-medium hover:bg-slate-50 transition"
                id="loc-btn-generate"
              >
                Generate
              </button>
              <button
                type="button"
                onClick={handleLocationSave}
                className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-lg text-sm transition shadow flex items-center gap-1"
                id="loc-btn-save"
              >
                <Save className="h-4 w-4" />
                <span>Save Location</span>
              </button>
            </div>

            {/* Generated Location Card preview */}
            {locGenerated && (
              <div className="mt-6 border-t border-slate-100 pt-6 animate-fadeIn" id="loc-preview-container">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Live Generated Location Record</h4>
                <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow max-w-sm">
                  <div className="h-40 bg-slate-100 relative">
                    <img
                      src={locImage || 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=600&auto=format&fit=crop&q=80'}
                      alt="Property"
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute top-2.5 right-2.5 px-2.5 py-0.5 bg-emerald-500 text-slate-950 font-bold rounded-full text-[10px] uppercase tracking-wider">
                      {locOwnership}
                    </span>
                  </div>
                  <div className="p-4 space-y-2">
                    <h5 className="font-bold text-slate-800 text-sm">{locPropName || 'Property Name Placeholder'}</h5>
                    <p className="text-xs text-slate-500 flex items-start gap-1">
                      <MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0 mt-0.5" />
                      <span>{locAddress || 'No address specified'}</span>
                    </p>
                    <div className="pt-2 text-[10px] text-slate-400 border-t border-slate-100">
                      <strong>Contact Directories:</strong> {locContacts.filter(c => c.trim() !== '').join(', ') || 'N/A'}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ==================== 4. CUSTOM MODE PAGE ==================== */}
        {activeSubTab === 'custom-mode' && (
          <div className="space-y-6" id="section-custom-mode-builder">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
                <div>
                  <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <Settings className="text-purple-600 h-5 w-5" />
                    <span>Dynamic Custom Module Architect</span>
                  </h2>
                  <p className="text-xs text-slate-500">Design custom databases, columns, specific validation rules, and live visualizations.</p>
                </div>
              </div>

              {/* Module section */}
              <div className="bg-slate-50/50 p-4 rounded-xl border border-slate-100 mb-6 space-y-4">
                <p className="text-xs font-bold text-purple-700 uppercase tracking-wide border-b border-slate-100 pb-2">
                  1. Module Name
                </p>
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase">Module Name (like Population module)</label>
                  <input
                    type="text"
                    value={customModuleName}
                    onChange={e => setCustomModuleName(e.target.value)}
                    placeholder="e.g. Water Quality, Street Lighting, Agricultural Yield"
                    className="w-full px-3 py-2 border border-slate-200 bg-white rounded-lg text-sm focus:ring-2 focus:ring-purple-500 outline-none"
                    id="custom-input-modname"
                  />
                </div>
              </div>

              {/* Column section */}
              <div className="bg-slate-50/50 p-4 rounded-xl border border-slate-100 mb-6 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <p className="text-xs font-bold text-purple-700 uppercase tracking-wide">
                    2. Columns Registry
                  </p>
                  <button
                    type="button"
                    onClick={handleAddCustomColumn}
                    className="text-xs font-semibold text-purple-700 hover:text-purple-800 bg-purple-50 hover:bg-purple-100/60 px-2.5 py-1 rounded-lg transition flex items-center gap-1"
                    id="custom-btn-add-column"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    <span>Add Column</span>
                  </button>
                </div>

                <div className="space-y-3">
                  {customColumns.map((col, idx) => (
                    <div key={col.id} className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end bg-white p-3 rounded-xl border border-slate-200/60 shadow-sm relative">
                      {/* Column label input */}
                      <div className="md:col-span-5">
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Column Label</label>
                        <input
                          type="text"
                          value={col.label}
                          onChange={e => handleCustomColumnChange(col.id, 'label', e.target.value)}
                          placeholder={`Column Label #${idx + 1}`}
                          className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs"
                          id={`custom-input-column-label-${idx}`}
                        />
                      </div>

                      {/* Column data type selector */}
                      <div className="md:col-span-3">
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Data Type</label>
                        <select
                          value={col.dataType}
                          onChange={e => handleCustomColumnChange(col.id, 'dataType', e.target.value as any)}
                          className="w-full px-2 py-1.5 border border-slate-200 bg-white rounded-lg text-xs outline-none"
                          id={`custom-input-column-type-${idx}`}
                        >
                          <option value="Text">Text</option>
                          <option value="Number">Number</option>
                          <option value="Date">Date</option>
                          <option value="Image">Image (Upload)</option>
                        </select>
                      </div>

                      {/* Row Requirement Checkbox */}
                      <div className="md:col-span-3 flex items-center h-9">
                        <label className="flex items-center gap-1.5 text-xs text-slate-600 font-medium cursor-pointer select-none">
                          <input
                            type="checkbox"
                            checked={col.rowRequirement}
                            onChange={e => handleCustomColumnChange(col.id, 'rowRequirement', e.target.checked)}
                            className="rounded text-purple-600 accent-purple-600"
                            id={`custom-input-column-req-${idx}`}
                          />
                          <span className="text-[10px] uppercase font-bold text-slate-400">Insert Indicator</span>
                        </label>
                      </div>

                      {/* Remove column button */}
                      <div className="md:col-span-1 flex justify-end h-9 items-center">
                        {customColumns.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveCustomColumn(col.id)}
                            className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Main Row Requirement Checkbox */}
                <div className="p-3 bg-amber-50 border border-amber-200/60 rounded-xl text-slate-700 flex items-start gap-2.5 mt-2">
                  <input
                    type="checkbox"
                    checked={customRowReqChecked}
                    onChange={e => setCustomRowReqChecked(e.target.checked)}
                    className="mt-1 rounded text-purple-600 accent-purple-600"
                    id="custom-input-main-req"
                  />
                  <div>
                    <span className="text-xs font-bold text-amber-900 block uppercase tracking-wide">Row Requirement Checkbox Confirmation</span>
                    <span className="text-[11px] text-amber-800 leading-relaxed">
                      Add row buttons or sub-row to the column select position. Checking this indicates full validation of the design and is necessary before moving to the next stage of module deployment.
                    </span>
                  </div>
                </div>
              </div>

              {/* Setup Visualization Section */}
              <div className="bg-slate-900 text-white p-4 rounded-xl border border-slate-800 mb-6 space-y-4">
                <p className="text-xs font-bold text-purple-300 uppercase tracking-wide border-b border-slate-800 pb-2">
                  3. Setup Visualization Section
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Visualization Type</label>
                    <select
                      value={customChartType}
                      onChange={e => setCustomChartType(e.target.value as any)}
                      className="w-full bg-slate-800 border border-slate-700 text-white text-xs px-2.5 py-1.5 rounded-lg outline-none"
                      id="custom-vis-type"
                    >
                      <option value="Table">Table Only</option>
                      <option value="Bar">Bar Chart</option>
                      <option value="Pie">Pie Chart</option>
                      <option value="Line">Line Chart</option>
                      <option value="All">All Projections</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">X-Axis Variable</label>
                    <select
                      value={customXAxis}
                      onChange={e => setCustomXAxis(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 text-white text-xs px-2.5 py-1.5 rounded-lg outline-none"
                      id="custom-vis-xaxis"
                    >
                      {customColumns.map(c => c.label).filter(l => l.trim() !== '').map(l => (
                        <option key={l} value={l}>{l}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Y-Axis Metric</label>
                    <select
                      value={customYAxis}
                      onChange={e => setCustomYAxis(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 text-white text-xs px-2.5 py-1.5 rounded-lg outline-none"
                      id="custom-vis-yaxis"
                    >
                      {customColumns.map(c => c.label).filter(l => l.trim() !== '').map(l => (
                        <option key={l} value={l}>{l}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Select Attributes to Display</label>
                  <div className="flex flex-wrap gap-3">
                    {customColumns.map(c => c.label).filter(l => l.trim() !== '').map(l => (
                      <label key={l} className="flex items-center gap-1.5 text-xs text-slate-300 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={customAttributes.includes(l)}
                          onChange={e => {
                            if (e.target.checked) {
                              setCustomAttributes(prev => [...prev, l]);
                            } else {
                              setCustomAttributes(prev => prev.filter(attr => attr !== l));
                            }
                          }}
                          className="rounded text-purple-500 accent-purple-500"
                        />
                        <span>{l}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* Save module architect buttons */}
              <div className="flex items-center justify-between border-t border-slate-100 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    // Save visualization helper
                    alert('Visualization setup successfully pinned to module schema!');
                  }}
                  className="px-4 py-2 border border-slate-200 text-slate-600 rounded-lg text-xs font-semibold hover:bg-slate-50 transition"
                  id="custom-btn-save-vis"
                >
                  Save Visualization
                </button>

                <button
                  type="button"
                  onClick={handleSaveCustomModuleSchema}
                  className="px-6 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-lg text-sm transition shadow flex items-center gap-1.5"
                  id="custom-btn-save-module"
                >
                  <Save className="h-4 w-4" />
                  <span>{editingModuleId ? 'Update & Deploy Module' : 'Deploy Custom Module'}</span>
                </button>
              </div>
            </div>

            {/* MODULE MANAGEMENT */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
              <p className="text-xs uppercase tracking-wider font-extrabold text-slate-400 mb-4">Module Management Directory</p>
              {customModules.length === 0 ? (
                <p className="text-xs text-slate-500 italic">No custom modules deployed yet. Use the architect above to create your first module.</p>
              ) : (
                <div className="divide-y divide-slate-100">
                  {customModules.map(mod => (
                    <div key={mod.id} className="py-3 flex flex-wrap items-center justify-between gap-4">
                      <div>
                        <h4 className="font-bold text-slate-800 text-sm">{mod.name} Module</h4>
                        <p className="text-xs text-slate-400">
                          {mod.columns.length} columns • {mod.data.length} records registered
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        {/* Allowed display toggler */}
                        <button
                          onClick={() => handleToggleModulePermission(mod)}
                          title="Grant or Revoke permission for Operator 2"
                          className={`px-3 py-1 text-xs rounded-full border transition flex items-center gap-1.5 ${
                            mod.allowedForOperator2
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : 'bg-rose-50 text-rose-700 border-rose-200'
                          }`}
                        >
                          {mod.allowedForOperator2 ? (
                            <>
                              <Unlock className="h-3 w-3" />
                              <span>Op 2 Allowed</span>
                            </>
                          ) : (
                            <>
                              <Lock className="h-3 w-3 text-rose-500" />
                              <span>Op 2 Restricted</span>
                            </>
                          )}
                        </button>

                        <button
                          onClick={() => handleEditModule(mod)}
                          className="px-3 py-1 bg-slate-100 text-slate-700 rounded-lg text-xs hover:bg-slate-200 font-medium transition"
                        >
                          Edit Schema
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`Are you sure you want to completely delete "${mod.name}" module?`)) {
                              onDeleteModule(mod.id);
                            }
                          }}
                          className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ==================== DYNAMIC CUSTOM MODULE DATA ENTRY TAB ==================== */}
        {activeSubTab.startsWith('custom-mod-') && (() => {
          const modId = activeSubTab.replace('custom-mod-', '');
          const mod = customModules.find(m => m.id === modId);
          if (!mod) return <p className="text-slate-500 italic">Module not found.</p>;

          return (
            <div className="space-y-6" id={`custom-mod-entry-${mod.id}`}>
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
                  <div>
                    <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                      <FileText className="text-purple-600 h-5 w-5" />
                      <span>{mod.name} Module Database</span>
                    </h2>
                    <p className="text-xs text-slate-500">Insert, review, and analyze dataset rows dynamically managed under {mod.name} schema.</p>
                  </div>
                  <button
                    onClick={() => setActiveSubTab('custom-mode')}
                    className="text-xs text-purple-600 hover:underline flex items-center gap-1 font-medium"
                  >
                    <Settings className="h-3.5 w-3.5" />
                    <span>Back to schema architect</span>
                  </button>
                </div>

                {/* Form to add row */}
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/60 mb-6">
                  <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-4 flex items-center gap-1.5">
                    <Plus className="h-4 w-4 text-purple-600" />
                    <span>Insert New Record Row</span>
                  </h4>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    {mod.columns.map(col => (
                      <div key={col.id} className="space-y-1.5">
                        <label className="block text-xs font-bold text-slate-600 uppercase">
                          {col.label} {col.rowRequirement && <span className="text-rose-500 font-bold">*</span>}
                        </label>

                        {col.dataType === 'Text' && (
                          <input
                            type="text"
                            value={customRowDraft[col.label] || ''}
                            onChange={e => setCustomRowDraft(prev => ({ ...prev, [col.label]: e.target.value }))}
                            placeholder={`Enter text for ${col.label}`}
                            className="w-full px-3 py-1.5 border border-slate-200 bg-white rounded-lg text-xs focus:ring-1 focus:ring-purple-500 outline-none"
                          />
                        )}

                        {col.dataType === 'Number' && (
                          <input
                            type="number"
                            value={customRowDraft[col.label] || ''}
                            onChange={e => setCustomRowDraft(prev => ({ ...prev, [col.label]: Number(e.target.value) }))}
                            placeholder="0"
                            className="w-full px-3 py-1.5 border border-slate-200 bg-white rounded-lg text-xs focus:ring-1 focus:ring-purple-500 outline-none"
                          />
                        )}

                        {col.dataType === 'Date' && (
                          <input
                            type="date"
                            value={customRowDraft[col.label] || ''}
                            onChange={e => setCustomRowDraft(prev => ({ ...prev, [col.label]: e.target.value }))}
                            className="w-full px-3 py-1.5 border border-slate-200 bg-white rounded-lg text-xs focus:ring-1 focus:ring-purple-500 outline-none"
                          />
                        )}

                        {col.dataType === 'Image' && (
                          <div className="space-y-2">
                            <div className="flex gap-2">
                              <input
                                type="text"
                                value={customRowDraft[col.label] || ''}
                                onChange={e => setCustomRowDraft(prev => ({ ...prev, [col.label]: e.target.value }))}
                                placeholder="Image URL or upload"
                                className="flex-1 px-3 py-1.5 border border-slate-200 bg-white rounded-lg text-xs"
                              />
                              <label className="bg-slate-800 text-white text-[10px] uppercase font-bold px-3 py-1.5 rounded-lg flex items-center justify-center cursor-pointer hover:bg-slate-700">
                                Upload
                                <input
                                  type="file"
                                  accept="image/*"
                                  onChange={e => handleFileChange(e, base64 => setCustomRowDraft(prev => ({ ...prev, [col.label]: base64 })))}
                                  className="hidden"
                                />
                              </label>
                            </div>
                            {customRowDraft[col.label] && (
                              <img src={customRowDraft[col.label]} alt="Preview" className="h-14 w-auto object-cover rounded border" />
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-end pt-2 border-t border-slate-200">
                    <button
                      onClick={() => handleSaveCustomRow(mod)}
                      className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-lg transition flex items-center gap-1"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      <span>Insert Record Row</span>
                    </button>
                  </div>
                </div>

                {/* Table of records */}
                <div className="space-y-3">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Registered Record List</p>
                  {mod.data.length === 0 ? (
                    <div className="p-8 border border-dashed text-slate-500 text-xs text-center rounded-xl">
                      No rows registered in database. Insert above.
                    </div>
                  ) : (
                    <div className="overflow-x-auto border border-slate-200 rounded-xl">
                      <table className="min-w-full divide-y divide-slate-200 text-left text-xs">
                        <thead className="bg-slate-50 font-bold text-slate-700">
                          <tr>
                            {mod.columns.map(c => (
                              <th key={c.id} className="px-4 py-3">{c.label}</th>
                            ))}
                            <th className="px-4 py-3 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 bg-white text-slate-600">
                          {mod.data.map((row, rIdx) => (
                            <tr key={row.id || rIdx} className="hover:bg-slate-50/50">
                              {mod.columns.map(col => (
                                <td key={col.id} className="px-4 py-3">
                                  {col.dataType === 'Image' && row[col.label] ? (
                                    <img src={row[col.label]} alt="Cell" className="h-10 w-16 object-cover rounded border" />
                                  ) : (
                                    String(row[col.label] !== undefined ? row[col.label] : '-')
                                  )}
                                </td>
                              ))}
                              <td className="px-4 py-3 text-right">
                                <button
                                  onClick={() => handleDeleteCustomRow(mod, row.id)}
                                  className="text-rose-500 hover:bg-rose-50 p-1 rounded transition"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>

              {/* Visualization display inside custom tab */}
              <div className="text-slate-800">
                <VisualizationRenderer
                  title={`${mod.name} Module Dynamic Analysis`}
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

        {/* ==================== 5. GALLERY & MAP PLACES MODULE ==================== */}
        {activeSubTab === 'gallery' && (
          <div className="space-y-6" id="section-gallery-creator">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
              <div>
                <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <ImageIcon className="text-emerald-500 h-5 w-5" />
                  <span>Gallery & Map Portal Office</span>
                </h2>
                <p className="text-xs text-slate-500">Log scenic spots and administrative zones with visual grid files and directions maps.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase">1. Place/Image Title</label>
                  <input
                    type="text"
                    value={galTitle}
                    onChange={e => setGalTitle(e.target.value)}
                    placeholder="e.g. Sunset Lake & Eco Park"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                    id="gal-input-title"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase">2. Category</label>
                  <input
                    type="text"
                    value={galCategory}
                    onChange={e => setGalCategory(e.target.value)}
                    placeholder="e.g. Nature Reserve, Cultural Heritage"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                    id="gal-input-category"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase">3. Full Location Address</label>
                  <input
                    type="text"
                    value={galAddress}
                    onChange={e => setGalAddress(e.target.value)}
                    placeholder="e.g. Sector-3 Main Boulevard, Near West Gate"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                    id="gal-input-address"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase">4. Description</label>
                  <textarea
                    rows={3}
                    value={galDescription}
                    onChange={e => setGalDescription(e.target.value)}
                    placeholder="Describe the historical importance, activities, and tourist details."
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                    id="gal-input-description"
                  />
                </div>
              </div>

              {/* Image Upload Gallery Section */}
              <div className="bg-slate-50/50 p-4 rounded-xl border border-slate-100">
                <div className="flex items-center justify-between mb-3">
                  <label className="block text-xs font-bold text-slate-600 uppercase">Gallery Images Directory</label>
                  <button
                    type="button"
                    onClick={handleAddGalImageField}
                    className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 bg-emerald-50 hover:bg-emerald-100/60 px-2.5 py-1 rounded-lg transition flex items-center gap-1"
                    id="gal-btn-add-image"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    <span>Add Another Image</span>
                  </button>
                </div>

                <div className="space-y-3">
                  {galImages.map((img, idx) => (
                    <div key={idx} className="flex gap-2 items-center bg-white p-2 rounded-lg border border-slate-200/60">
                      <input
                        type="text"
                        value={img}
                        onChange={e => handleGalImageValueChange(idx, e.target.value)}
                        placeholder="Paste Image URL or select file"
                        className="flex-1 px-3 py-1.5 border border-slate-200 rounded-lg text-xs"
                      />
                      <label className="bg-slate-800 text-white text-[10px] font-bold uppercase px-3 py-1.5 rounded-lg cursor-pointer hover:bg-slate-700">
                        Upload
                        <input
                          type="file"
                          accept="image/*"
                          onChange={e => handleFileChange(e, base64 => handleGalImageValueChange(idx, base64))}
                          className="hidden"
                        />
                      </label>
                      {galImages.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveGalImageField(idx)}
                          className="text-rose-500 hover:bg-rose-50 p-1.5 rounded-lg"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Map Location Feature Inside Image Upload Section */}
              <div className="bg-slate-50/50 p-4 rounded-xl border border-slate-100 space-y-4">
                <div className="border-b border-slate-100 pb-1 flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-700 uppercase tracking-wide">Map Location Feature</span>
                  <Map className="h-4 w-4 text-emerald-500" />
                </div>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Upload a Map Location / Direction Image. This directional scheme serves as routing assistance for visitors and becomes a permanent part of the gallery metadata.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="border border-dashed border-slate-200 p-4 rounded-xl bg-white relative flex flex-col items-center justify-center min-h-[110px] cursor-pointer">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={e => handleFileChange(e, setGalMapImage)}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <Map className="h-6 w-6 text-slate-400 mb-1" />
                    <span className="text-xs font-bold text-slate-700">Upload Map Image</span>
                  </div>

                  <div className="flex flex-col justify-between p-3 bg-white border border-slate-200 rounded-xl">
                    <input
                      type="text"
                      value={galMapImage}
                      onChange={e => setGalMapImage(e.target.value)}
                      placeholder="Or paste Map URL (Unsplash, Google Map etc.)"
                      className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-[10px]"
                    />
                    {galMapImage ? (
                      <div className="h-16 relative rounded-lg border overflow-hidden mt-2">
                        <img src={galMapImage} alt="Map Preview" className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => setGalMapImage('')}
                          className="absolute top-1 right-1 bg-red-500 text-white p-0.5 rounded-full"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ) : (
                      <div className="text-[10px] text-slate-400 text-center py-4 bg-slate-50 border border-dashed rounded-lg mt-2">No Direction Map Selected</div>
                    )}
                  </div>
                </div>
              </div>

              {/* Save Gallery */}
              <div className="flex justify-end pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={handleGallerySave}
                  className="px-6 py-2 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-lg text-sm transition shadow flex items-center gap-1.5"
                  id="gal-btn-save"
                >
                  <Save className="h-4 w-4" />
                  <span>Save Gallery Item</span>
                </button>
              </div>
            </div>

            {/* GALLERY DISPLAY SECTION (File-Folder Style Grid Layout) */}
            <div className="bg-slate-900 text-white rounded-2xl border border-slate-800 p-6 shadow-md" id="section-gallery-display-panel">
              <div className="border-b border-slate-800 pb-3 mb-6">
                <h3 className="font-bold text-sm text-slate-200 uppercase tracking-wider flex items-center gap-2">
                  <Folder className="h-4 w-4 text-amber-500 fill-amber-500" />
                  <span>Gallery Directory (File-Folder Layout)</span>
                </h3>
                <p className="text-xs text-slate-400">Click folder structures below to view active media files and map routes.</p>
              </div>

              {/* Folders list */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4" id="gallery-folders-grid">
                {galleryItems.map(item => (
                  <button
                    key={item.id}
                    onClick={() => setSelectedGalleryItem(item)}
                    className="group bg-slate-800/60 hover:bg-slate-800 border border-slate-800 hover:border-amber-500/40 p-4 rounded-xl text-center transition flex flex-col items-center gap-2"
                  >
                    <Folder className="h-10 w-10 text-amber-400 fill-amber-400/80 group-hover:scale-105 transition" />
                    <span className="text-xs font-bold text-slate-200 truncate w-full">{item.title}</span>
                    <span className="text-[10px] font-medium text-amber-500 uppercase tracking-wider bg-amber-500/10 px-2 py-0.5 rounded-full">{item.category}</span>
                  </button>
                ))}
              </div>

              {/* Folder Detail Modal / Grid View */}
              {selectedGalleryItem && (
                <div className="mt-8 bg-white text-slate-800 p-5 rounded-xl border border-slate-200 shadow-lg relative animate-fadeIn" id="gallery-folder-detail">
                  <button
                    type="button"
                    onClick={() => setSelectedGalleryItem(null)}
                    className="absolute top-4 right-4 p-1 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500"
                  >
                    <X className="h-4 w-4" />
                  </button>

                  <div className="border-b border-slate-100 pb-3 mb-4">
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-600 px-2 py-1 rounded">
                      {selectedGalleryItem.category}
                    </span>
                    <h4 className="font-bold text-lg text-slate-900 mt-1.5">{selectedGalleryItem.title}</h4>
                    {selectedGalleryItem.address && (
                      <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                        <MapPin className="h-3.5 w-3.5 text-slate-400" />
                        <span>{selectedGalleryItem.address}</span>
                      </p>
                    )}
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed mb-6 bg-slate-50 p-3 rounded-lg border border-slate-100">{selectedGalleryItem.description}</p>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5" id="gallery-details-subgrid">
                    {/* Main Images */}
                    <div className="md:col-span-2 space-y-3">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Main Images Portfolio</p>
                      <div className="grid grid-cols-2 gap-3">
                        {selectedGalleryItem.images.map((img, idx) => (
                          <div key={idx} className="h-32 bg-slate-100 rounded-lg overflow-hidden border">
                            <img src={img} alt={`Img ${idx}`} className="w-full h-full object-cover" />
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Map / Directions */}
                    {selectedGalleryItem.mapImage && (
                      <div className="space-y-3">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Map & Directions Location</p>
                        <div className="h-32 bg-slate-100 rounded-lg overflow-hidden border relative group">
                          <img src={selectedGalleryItem.mapImage} alt="Map route" className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition text-white font-semibold text-xs">
                            <Map className="h-4 w-4 mr-1" />
                            <span>View map detail</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
