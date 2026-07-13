/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { PopulationRecord, InfrastructureRecord, InfrastructureLocationRecord, CustomModule, GalleryItem } from './types';

export const INITIAL_POPULATION_DATA: PopulationRecord[] = [
  {
    id: 'pop-1',
    year: 2024,
    totalPopulation: 1450,
    genderMale: 710,
    genderFemale: 720,
    genderOthers: 20,
    childrenTotal: 310,
    childrenMale: 150,
    childrenFemale: 160,
    oldAgeTotal: 180,
    oldAgeMale: 85,
    oldAgeFemale: 95,
    visualizationSetup: {
      chartType: 'All',
      xAxis: 'year',
      yAxis: 'totalPopulation',
      attributes: ['totalPopulation', 'genderMale', 'genderFemale', 'childrenTotal', 'oldAgeTotal']
    }
  },
  {
    id: 'pop-2',
    year: 2025,
    totalPopulation: 1520,
    genderMale: 740,
    genderFemale: 760,
    genderOthers: 20,
    childrenTotal: 330,
    childrenMale: 160,
    childrenFemale: 170,
    oldAgeTotal: 195,
    oldAgeMale: 90,
    oldAgeFemale: 105,
    visualizationSetup: {
      chartType: 'All',
      xAxis: 'year',
      yAxis: 'totalPopulation',
      attributes: ['totalPopulation', 'genderMale', 'genderFemale', 'childrenTotal', 'oldAgeTotal']
    }
  },
  {
    id: 'pop-3',
    year: 2026,
    totalPopulation: 1610,
    genderMale: 790,
    genderFemale: 800,
    genderOthers: 20,
    childrenTotal: 350,
    childrenMale: 170,
    childrenFemale: 180,
    oldAgeTotal: 210,
    oldAgeMale: 100,
    oldAgeFemale: 110,
    visualizationSetup: {
      chartType: 'All',
      xAxis: 'year',
      yAxis: 'totalPopulation',
      attributes: ['totalPopulation', 'genderMale', 'genderFemale', 'childrenTotal', 'oldAgeTotal']
    }
  }
];

export const INITIAL_INFRASTRUCTURE_DATA: InfrastructureRecord[] = [
  {
    id: 'infra-1',
    name: 'Government Primary School',
    count: 3,
    ownership: 'Government',
    properties: ['GPS Sector 2', 'GPS West Wing', 'GPS Lakeside'],
    contactNumbers: ['+1-555-0192', '+1-555-0193']
  },
  {
    id: 'infra-2',
    name: 'Community Hospital',
    count: 1,
    ownership: 'Trust',
    properties: ['Panchayat Health Care'],
    contactNumbers: ['+1-555-0111', '+1-555-0112']
  },
  {
    id: 'infra-3',
    name: 'Private IT Training Center',
    count: 2,
    ownership: 'Private',
    properties: ['TechBridge Center', 'Apex Academy'],
    contactNumbers: ['+1-555-0144']
  }
];

export const INITIAL_INFRASTRUCTURE_LOCATION_DATA: InfrastructureLocationRecord[] = [
  {
    id: 'loc-1',
    proprietaryName: 'Government Primary School - Sector 2',
    ownership: 'Government',
    address: 'Plot 45, Main Market Road, Sector 2, City Center',
    contactNumbers: ['+1-555-0192'],
    imageUrl: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'loc-2',
    proprietaryName: 'Panchayat Health Care Clinic',
    ownership: 'Trust',
    address: 'Opposite Community Ground, Ward No. 5, East Panchayat',
    contactNumbers: ['+1-555-0111', '+1-555-0112'],
    imageUrl: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=600&auto=format&fit=crop&q=80'
  }
];

export const INITIAL_CUSTOM_MODULES: CustomModule[] = [
  {
    id: 'mod-1',
    name: 'Water Resources',
    columns: [
      { id: 'col-1', label: 'Source Name', dataType: 'Text', rowRequirement: true },
      { id: 'col-2', label: 'TDS Level (ppm)', dataType: 'Number', rowRequirement: true },
      { id: 'col-3', label: 'Last Safety Check', dataType: 'Date', rowRequirement: false },
      { id: 'col-4', label: 'Source Image', dataType: 'Image', rowRequirement: false }
    ],
    visualizationSetup: {
      chartType: 'Bar',
      attributes: ['TDS Level (ppm)'],
      xAxis: 'Source Name',
      yAxis: 'TDS Level (ppm)'
    },
    data: [
      { id: 'row-1', 'Source Name': 'North Borewell', 'TDS Level (ppm)': 180, 'Last Safety Check': '2026-05-12', 'Source Image': 'https://images.unsplash.com/photo-1622322482620-7595914c9f13?w=600&auto=format&fit=crop&q=80' },
      { id: 'row-2', 'Source Name': 'Lakeside Reservoir', 'TDS Level (ppm)': 340, 'Last Safety Check': '2026-06-01', 'Source Image': 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=600&auto=format&fit=crop&q=80' },
      { id: 'row-3', 'Source Name': 'Public Water Tank B', 'TDS Level (ppm)': 220, 'Last Safety Check': '2026-07-10', 'Source Image': '' }
    ],
    allowedForOperator2: true
  }
];

export const INITIAL_GALLERY_DATA: GalleryItem[] = [
  {
    id: 'gal-1',
    title: 'Sunset Lake & Eco-Park',
    category: 'Nature Reserve',
    description: 'A beautiful natural lake surrounded by jogging paths, lush greenery, and seating areas. A favorite spot for residents to unwind during evening hours and watch birds.',
    images: [
      'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=600&auto=format&fit=crop&q=80'
    ],
    mapImage: 'https://images.unsplash.com/photo-1524661135-423995f22d0b?w=600&auto=format&fit=crop&q=80',
    address: 'Lakefront Road, Sector 3 (Near West Gate)'
  },
  {
    id: 'gal-2',
    title: 'Panchayat Heritage Temple',
    category: 'Cultural Heritage',
    description: 'A 200-year-old beautifully preserved stone temple showcasing ancient architecture. It serves as a historical monument and a calm venue for daily spiritual gatherings.',
    images: [
      'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=600&auto=format&fit=crop&q=80'
    ],
    mapImage: 'https://images.unsplash.com/photo-1524661135-423995f22d0b?w=600&auto=format&fit=crop&q=80',
    address: 'Old Town Square, Ward No. 2'
  }
];

export function getStoredData<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error('Error reading localStorage', error);
    return defaultValue;
  }
}

export function setStoredData<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error('Error writing localStorage', error);
  }
}
