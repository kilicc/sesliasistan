export interface Student {
  name: string;
  phone: string;
}

export interface TimeSlot {
  start: string; // HH:mm format
  end: string; // HH:mm format
}

export interface Availability {
  Pazartesi?: TimeSlot[];
  Salı?: TimeSlot[];
  Çarşamba?: TimeSlot[];
  Perşembe?: TimeSlot[];
  Cuma?: TimeSlot[];
}

export interface ScheduleRequest {
  student: Student;
  weekStart: string; // YYYY-MM-DD format
  availability: Availability;
}

export interface ScheduleResponse {
  result: "scheduled" | "no_availability";
  day?: string;
  start?: string;
  end?: string;
  trainerName?: string;
}

export interface Config {
  workStart: string; // HH:mm
  workEnd: string; // HH:mm
  slotDuration: number; // minutes
  trainers: string[];
}

export interface ScheduleRow {
  week: string; // YYYY_WW format
  trainer: string;
  day: string;
  start: string; // HH:mm
  end: string; // HH:mm
  student: string;
  phone: string;
}

export interface Slot {
  day: string;
  start: string;
  end: string;
  trainer: string;
}

