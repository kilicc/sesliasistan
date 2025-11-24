import { Config, ScheduleRow, Availability, Slot, TimeSlot } from './types';

/**
 * Tarih string'inden hafta numarasını ve yıl bilgisini çıkarır
 * Format: YYYY-MM-DD -> YYYY_WW
 */
export function getWeekKey(dateString: string): string {
  const date = new Date(dateString);
  const year = date.getFullYear();
  
  // ISO week calculation
  const startOfYear = new Date(year, 0, 1);
  const pastDaysOfYear = (date.getTime() - startOfYear.getTime()) / 86400000;
  const weekNumber = Math.ceil((pastDaysOfYear + startOfYear.getDay() + 1) / 7);
  
  return `${year}_${weekNumber.toString().padStart(2, '0')}`;
}

/**
 * Çalışma saatleri aralığını slotlara böler
 */
export function generateTimeSlots(config: Config): TimeSlot[] {
  const slots: TimeSlot[] = [];
  const [startHour, startMinute] = config.workStart.split(':').map(Number);
  const [endHour, endMinute] = config.workEnd.split(':').map(Number);
  
  const startMinutes = startHour * 60 + startMinute;
  const endMinutes = endHour * 60 + endMinute;
  const slotDurationMinutes = config.slotDuration;
  
  let currentMinutes = startMinutes;
  
  while (currentMinutes + slotDurationMinutes <= endMinutes) {
    const slotStartMinutes = currentMinutes;
    const slotEndMinutes = currentMinutes + slotDurationMinutes;
    
    const startHourStr = Math.floor(slotStartMinutes / 60).toString().padStart(2, '0');
    const startMinStr = (slotStartMinutes % 60).toString().padStart(2, '0');
    const endHourStr = Math.floor(slotEndMinutes / 60).toString().padStart(2, '0');
    const endMinStr = (slotEndMinutes % 60).toString().padStart(2, '0');
    
    slots.push({
      start: `${startHourStr}:${startMinStr}`,
      end: `${endHourStr}:${endMinStr}`,
    });
    
    currentMinutes += slotDurationMinutes;
  }
  
  return slots;
}

/**
 * İki zaman aralığının kesişip kesişmediğini kontrol eder
 */
function timeSlotsOverlap(slot1: TimeSlot, slot2: TimeSlot): boolean {
  const [start1Hour, start1Min] = slot1.start.split(':').map(Number);
  const [end1Hour, end1Min] = slot1.end.split(':').map(Number);
  const [start2Hour, start2Min] = slot2.start.split(':').map(Number);
  const [end2Hour, end2Min] = slot2.end.split(':').map(Number);
  
  const start1 = start1Hour * 60 + start1Min;
  const end1 = end1Hour * 60 + end1Min;
  const start2 = start2Hour * 60 + start2Min;
  const end2 = end2Hour * 60 + end2Min;
  
  return start1 < end2 && start2 < end1;
}

/**
 * Öğrencinin uygunlukları ile slotları kesiştirir
 */
export function getAvailableSlotsForStudent(
  config: Config,
  availability: Availability
): Slot[] {
  const timeSlots = generateTimeSlots(config);
  const availableSlots: Slot[] = [];
  
  const dayMapping: Record<string, keyof Availability> = {
    'Pazartesi': 'Pazartesi',
    'Salı': 'Salı',
    'Çarşamba': 'Çarşamba',
    'Perşembe': 'Perşembe',
    'Cuma': 'Cuma',
  };
  
  const days = ['Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma'];
  
  for (const day of days) {
    const dayKey = dayMapping[day];
    const studentAvailability = availability[dayKey] || [];
    
    for (const timeSlot of timeSlots) {
      // Check if this slot overlaps with any of student's available times
      const isAvailable = studentAvailability.some((studentSlot) =>
        timeSlotsOverlap(timeSlot, studentSlot)
      );
      
      if (isAvailable) {
        // Add slot for each trainer
        for (const trainer of config.trainers) {
          availableSlots.push({
            day,
            start: timeSlot.start,
            end: timeSlot.end,
            trainer,
          });
        }
      }
    }
  }
  
  return availableSlots;
}

/**
 * Mevcut schedule'dan dolu slotları filtreler
 */
export function findAvailableSlot(
  availableSlots: Slot[],
  existingSchedule: ScheduleRow[]
): Slot | null {
  // Create a set of occupied slots for quick lookup
  const occupiedSlots = new Set<string>();
  
  for (const row of existingSchedule) {
    const key = `${row.day}_${row.start}_${row.end}_${row.trainer}`;
    occupiedSlots.add(key);
  }
  
  // Find first available slot
  for (const slot of availableSlots) {
    const key = `${slot.day}_${slot.start}_${slot.end}_${slot.trainer}`;
    if (!occupiedSlots.has(key)) {
      return slot;
    }
  }
  
  return null;
}

