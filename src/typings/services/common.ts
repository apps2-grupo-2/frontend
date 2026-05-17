export type Pagination = {
  appointments_per_page: number;
  total_appointments: number;
  total_pages: number;
};

export type OptionsResponse = {
  value: string;
  label: string;
}[];