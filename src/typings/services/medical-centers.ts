import type { Pagination } from './common';

export type MedicalCentersRequest = {
  lat: string;
  lng: string;
  speciality_id?: number;
  sort_by?: 'distance' | 'first_availability' | 'name';
};

export type GetMedicalCentersResponse = {
  medical_centers: MedicalCenter[];
  pagination: Pagination;
};

export type MedicalCenter = {
  id: number;
  name: string;
  city: string;
  lat: string;
  lng: string;
  distance_km?: number;
};

export type MedicalCenterOptionsResponse = {
  value: string;
  label: string;
  city: string;
  distance_km?: number;
}[];

export type GetMedicalCenterByIdResponse = {
  id: number;
  name: string;
};