/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface PopulationRecord {
  id: string;
  year: number;
  totalPopulation: number;
  genderMale: number;
  genderFemale: number;
  genderOthers: number;
  childrenTotal: number;
  childrenMale: number;
  childrenFemale: number;
  oldAgeTotal: number;
  oldAgeMale: number;
  oldAgeFemale: number;
  visualizationSetup?: VisualizationSetup;
}

export interface VisualizationSetup {
  chartType: 'Table' | 'Bar' | 'Pie' | 'Line' | 'All';
  xAxis: string;
  yAxis: string;
  attributes: string[];
}

export interface InfrastructureRecord {
  id: string;
  name: string; // e.g. "School", "Hospital"
  count: number;
  ownership: 'Government' | 'Private' | 'Trust';
  properties: string[]; // Property names
  contactNumbers: string[];
}

export interface InfrastructureLocationRecord {
  id: string;
  proprietaryName: string;
  ownership: 'Government' | 'Private' | 'Trust';
  address: string;
  contactNumbers: string[];
  imageUrl: string;
}

export interface CustomColumn {
  id: string;
  label: string;
  dataType: 'Text' | 'Number' | 'Date' | 'Image';
  rowRequirement: boolean; // Add button rows or sub row to column select position
}

export interface CustomModule {
  id: string;
  name: string;
  columns: CustomColumn[];
  visualizationSetup: {
    chartType: 'Table' | 'Bar' | 'Pie' | 'Line' | 'All';
    attributes: string[]; // list of custom column ids/labels
    xAxis: string; // column label or id
    yAxis: string; // column label or id
  };
  data: Record<string, any>[]; // Entered rows
  allowedForOperator2: boolean; // Granted permission to Operator 2
}

export interface GalleryItem {
  id: string;
  title: string;
  category: string;
  description: string;
  images: string[]; // main images
  mapImage?: string; // Map location/direction image
  address?: string; // visiting address
}
