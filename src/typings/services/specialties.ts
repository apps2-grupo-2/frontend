import type { Pagination } from './common';

export type SpecialtiesResponse = {
  specialities: Speciality[];
  pagination: Pagination;
};

export type Speciality = {
  id: number;
  name: string;
  is_high_complexity: number;
};