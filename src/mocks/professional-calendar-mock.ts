// TODO: reemplazar con GET /professionals (del módulo Core)
// TODO: reemplazar schedule con GET /professionals/:id/schedule?weekStart=YYYY-MM-DD

export type ScheduleSlot = {
  time: string;
  type: 'appointment' | 'available' | 'blocked';
  appointment?: {
    id: string;
    patientName: string;
    patientDni: string;
    specialty: string;
    status: 'confirmed' | 'pending' | 'cancelled';
  };
};

export type DaySchedule = {
  date: string; // 'YYYY-MM-DD'
  slots: ScheduleSlot[];
};

export const MOCK_CALENDAR_PROFESSIONALS = [
  { value: '1', label: 'Dr. Fernandez Juan Pablo' },
  { value: '3', label: 'Dr. Rodríguez Martín Eduardo' },
  { value: '4', label: 'Dra. Vásquez Laura Beatriz' },
  { value: '7', label: 'Dra. García Silvia Alejandra' },
  { value: '9', label: 'Dra. Sánchez Patricia Noemí' },
];

export const MOCK_WEEK_SCHEDULE: DaySchedule[] = [
  {
    date: '2026-04-07',
    slots: [
      { time: '09:00', type: 'appointment', appointment: { id: 'TUR-8801', patientName: 'González María Elena', patientDni: '28.345.671', specialty: 'Cardiología', status: 'confirmed' } },
      { time: '09:30', type: 'appointment', appointment: { id: 'TUR-8802', patientName: 'Ramírez Jorge Luis', patientDni: '30.112.450', specialty: 'Cardiología', status: 'confirmed' } },
      { time: '10:00', type: 'available' },
      { time: '10:30', type: 'available' },
      { time: '11:00', type: 'appointment', appointment: { id: 'TUR-8803', patientName: 'Torres Ana Sofía', patientDni: '35.678.901', specialty: 'Electrofisiología', status: 'pending' } },
      { time: '11:30', type: 'blocked' },
      { time: '14:00', type: 'appointment', appointment: { id: 'TUR-8804', patientName: 'Díaz Roberto Ariel', patientDni: '22.456.789', specialty: 'Cardiología', status: 'confirmed' } },
      { time: '14:30', type: 'available' },
      { time: '15:00', type: 'appointment', appointment: { id: 'TUR-8805', patientName: 'Flores Valentina', patientDni: '40.234.567', specialty: 'Cardiología', status: 'cancelled' } },
      { time: '15:30', type: 'available' },
      { time: '16:00', type: 'blocked' },
    ],
  },
  {
    date: '2026-04-08',
    slots: [
      { time: '09:00', type: 'available' },
      { time: '09:30', type: 'appointment', appointment: { id: 'TUR-8810', patientName: 'Moreno Pablo Sebastián', patientDni: '27.890.123', specialty: 'Electrofisiología', status: 'confirmed' } },
      { time: '10:00', type: 'appointment', appointment: { id: 'TUR-8811', patientName: 'Castro Luciana Beatriz', patientDni: '33.567.890', specialty: 'Cardiología', status: 'confirmed' } },
      { time: '10:30', type: 'available' },
      { time: '11:00', type: 'available' },
      { time: '11:30', type: 'blocked' },
      { time: '14:00', type: 'appointment', appointment: { id: 'TUR-8812', patientName: 'Herrera Martín', patientDni: '29.345.678', specialty: 'Cardiología', status: 'pending' } },
      { time: '14:30', type: 'appointment', appointment: { id: 'TUR-8813', patientName: 'López Daniela', patientDni: '38.901.234', specialty: 'Electrofisiología', status: 'confirmed' } },
      { time: '15:00', type: 'available' },
      { time: '15:30', type: 'available' },
    ],
  },
  {
    date: '2026-04-09',
    slots: [
      { time: '09:00', type: 'appointment', appointment: { id: 'TUR-8820', patientName: 'Vega Camila Inés', patientDni: '42.123.456', specialty: 'Cardiología', status: 'confirmed' } },
      { time: '09:30', type: 'available' },
      { time: '10:00', type: 'blocked' },
      { time: '10:30', type: 'blocked' },
      { time: '11:00', type: 'appointment', appointment: { id: 'TUR-8821', patientName: 'Suárez Fernando', patientDni: '25.678.901', specialty: 'Cardiología', status: 'confirmed' } },
      { time: '11:30', type: 'available' },
      { time: '14:00', type: 'available' },
      { time: '14:30', type: 'appointment', appointment: { id: 'TUR-8822', patientName: 'Ortega Silvia', patientDni: '31.234.567', specialty: 'Electrofisiología', status: 'pending' } },
      { time: '15:00', type: 'available' },
      { time: '15:30', type: 'available' },
    ],
  },
  {
    date: '2026-04-10',
    slots: [
      { time: '09:00', type: 'appointment', appointment: { id: 'TUR-8830', patientName: 'Peralta Carlos Alberto', patientDni: '26.789.012', specialty: 'Cardiología', status: 'confirmed' } },
      { time: '09:30', type: 'appointment', appointment: { id: 'TUR-8831', patientName: 'Ibáñez Rosa María', patientDni: '19.345.678', specialty: 'Cardiología', status: 'confirmed' } },
      { time: '10:00', type: 'available' },
      { time: '10:30', type: 'appointment', appointment: { id: 'TUR-8832', patientName: 'Mendoza Rodrigo', patientDni: '36.890.123', specialty: 'Electrofisiología', status: 'pending' } },
      { time: '11:00', type: 'available' },
      { time: '11:30', type: 'blocked' },
      { time: '14:00', type: 'appointment', appointment: { id: 'TUR-8833', patientName: 'Acosta Paula', patientDni: '44.012.345', specialty: 'Cardiología', status: 'confirmed' } },
      { time: '14:30', type: 'available' },
      { time: '15:00', type: 'available' },
      { time: '15:30', type: 'appointment', appointment: { id: 'TUR-8834', patientName: 'Ríos Gustavo', patientDni: '23.456.789', specialty: 'Cardiología', status: 'cancelled' } },
    ],
  },
  {
    date: '2026-04-11',
    slots: [
      { time: '09:00', type: 'available' },
      { time: '09:30', type: 'available' },
      { time: '10:00', type: 'appointment', appointment: { id: 'TUR-8840', patientName: 'Cabrera Nicolás', patientDni: '39.123.456', specialty: 'Cardiología', status: 'confirmed' } },
      { time: '10:30', type: 'available' },
      { time: '11:00', type: 'available' },
      { time: '11:30', type: 'available' },
      { time: '14:00', type: 'blocked' },
      { time: '14:30', type: 'blocked' },
      { time: '15:00', type: 'appointment', appointment: { id: 'TUR-8841', patientName: 'Medina Florencia', patientDni: '41.567.890', specialty: 'Electrofisiología', status: 'confirmed' } },
      { time: '15:30', type: 'available' },
    ],
  },
];
