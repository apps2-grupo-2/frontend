import type { Pagination } from './common';

export type MedicalCentersRequest = {
  lat?: string;
  lng?: string;
  specialty_id?: number;
};

export type GetMedicalCentersResponse = {
  medicalCenters: MedicalCenter[];
  pagination: Pagination;
};

export type MedicalCenter = {
  id: number;
  name: string;
  city: string;
  lat: string;
  lng: string;
};

export type MedicalCenterOptionsResponse = {
  value: string;
  label: string;
  city: string;
}[];

export type GetMedicalCenterByIdResponse = {
  id: number;
  name: string;
};