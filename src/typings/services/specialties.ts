export type SpecialtiesResponse = {
  specialities: Speciality[];
  pagination: SpecialitiesPagination;
};

export type SpecialitiesPagination = {
  total_specialities: number;
  total_pages: number;
  specialities_per_page: number;
};

export type Speciality = {
  id: number;
  name: string;
  is_high_complexity: number;
  type: 'CONSULTATION' | 'STUDY' | 'SURGERY';
};