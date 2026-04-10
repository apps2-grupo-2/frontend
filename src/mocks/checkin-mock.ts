// TODO: reemplazar con GET /appointments/today?centerId=X (endpoint propio del módulo)
// El módulo Core proveerá los datos del profesional vía GET /professionals/:id

export type CheckinAppointment = {
  id: string;
  time: string;
  patientName: string;
  patientDni: string;
  doctor: string;
  specialty: string;
  medicalCenter: string;
  status: 'pending' | 'arrived' | 'in-progress' | 'completed';
};

// Turnos del día: jueves 10 de abril de 2026
export const MOCK_TODAY_APPOINTMENTS: CheckinAppointment[] = [
  {
    id: 'TUR-8821',
    time: '09:30',
    patientName: 'González María Elena',
    patientDni: '28.345.671',
    doctor: 'Dr. Fernandez Juan Pablo',
    specialty: 'Cardiología',
    medicalCenter: 'Hospital Central',
    status: 'completed',
  },
  {
    id: 'TUR-9014',
    time: '10:00',
    patientName: 'Romero Carlos Andrés',
    patientDni: '31.234.567',
    doctor: 'Dr. Fernandez Juan Pablo',
    specialty: 'Cardiología',
    medicalCenter: 'Hospital Central',
    status: 'arrived',
  },
  {
    id: 'TUR-9021',
    time: '10:30',
    patientName: 'López Valentina',
    patientDni: '40.789.123',
    doctor: 'Dr. Fernandez Juan Pablo',
    specialty: 'Electrofisiología',
    medicalCenter: 'Hospital Central',
    status: 'pending',
  },
  {
    id: 'TUR-9035',
    time: '11:00',
    patientName: 'Martínez Roberto',
    patientDni: '25.456.789',
    doctor: 'Dra. Vásquez Laura Beatriz',
    specialty: 'Ginecología',
    medicalCenter: 'Hospital Central',
    status: 'pending',
  },
  {
    id: 'TUR-9042',
    time: '14:00',
    patientName: 'Suárez Ana Clara',
    patientDni: '37.890.234',
    doctor: 'Dra. García Silvia Alejandra',
    specialty: 'Endocrinología',
    medicalCenter: 'Hospital Central',
    status: 'pending',
  },
  {
    id: 'TUR-9055',
    time: '14:30',
    patientName: 'Herrera Diego',
    patientDni: '29.012.345',
    doctor: 'Dra. García Silvia Alejandra',
    specialty: 'Diabetología',
    medicalCenter: 'Hospital Central',
    status: 'pending',
  },
  {
    id: 'TUR-9061',
    time: '15:00',
    patientName: 'Torres Cecilia',
    patientDni: '33.678.901',
    doctor: 'Dr. Rodríguez Martín Eduardo',
    specialty: 'Ortopedia y traumatología',
    medicalCenter: 'Hospital Central',
    status: 'pending',
  },
];
