export type ProfessionalsResponse = {
  value: string;
  label: string;
  email: string;
}[];

export type MedicsResponse = {
  medic_id: number;
  fullname: string;
  email: string;
  speciality_id: number;
  speciality_name: string;
}[];
