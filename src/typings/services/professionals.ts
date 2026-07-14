export type ProfessionalsResponse = {
  value: string;
  label: string;
  email: string;
}[];

// Nuevo endpoint del backend propio: GET {BASE_URL}/medics.
// Devuelve todos los medicos (con su especialidad embebida, en el mismo
// espacio de ids que usa el backend de turnos). Hay ~2 medicos por especialidad.
export type Medic = {
  medic_id: number;
  fullname: string;
  email: string;
  speciality_id: number;
  speciality_name: string;
};

export type MedicsResponse = {
  data: Medic[];
};