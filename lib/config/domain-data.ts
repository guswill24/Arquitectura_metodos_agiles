// Datos del dominio: Sistema de Citas Médicas

export type Specialty = {
  id: string;
  name: string;
};

export type Doctor = {
  id: string;
  name: string;
  specialty: string;
  available: boolean;
};

export type TimeSlot = {
  id: string;
  time: string;
  available: boolean;
};

export const SPECIALTIES: Specialty[] = [
  { id: "general", name: "Medicina General" },
  { id: "cardio", name: "Cardiología" },
  { id: "derma", name: "Dermatología" },
  { id: "pediatria", name: "Pediatría" },
  { id: "ortopedia", name: "Ortopedia" },
];

export const DOCTORS: Doctor[] = [
  { id: "d1", name: "Dra. Ana Gómez", specialty: "general", available: true },
  { id: "d2", name: "Dr. Carlos Ruiz", specialty: "general", available: true },
  { id: "d3", name: "Dra. Lucía Torres", specialty: "cardio", available: true },
  { id: "d4", name: "Dr. Mateo Silva", specialty: "cardio", available: false },
  { id: "d5", name: "Dra. Sofía Reyes", specialty: "derma", available: true },
  { id: "d6", name: "Dr. Andrés López", specialty: "pediatria", available: true },
  { id: "d7", name: "Dra. Paula Mora", specialty: "ortopedia", available: true },
];

export const TIME_SLOTS: TimeSlot[] = [
  { id: "t1", time: "8:00 AM", available: true },
  { id: "t2", time: "9:00 AM", available: false },
  { id: "t3", time: "10:00 AM", available: true },
  { id: "t4", time: "11:00 AM", available: true },
  { id: "t5", time: "2:00 PM", available: true },
  { id: "t6", time: "3:00 PM", available: false },
  { id: "t7", time: "4:00 PM", available: true },
];

export function getDoctorsBySpecialty(specialtyId: string): Doctor[] {
  return DOCTORS.filter((d) => d.specialty === specialtyId);
}
