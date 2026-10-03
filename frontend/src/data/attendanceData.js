import { getHolidayName } from './holidays';

export const LATE_CUTOFF = '10:00 AM';

export function formatDateKey(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function parseDateKey(key) {
  return new Date(`${key}T00:00:00`);
}

export function calcHours(checkIn, checkOut) {
  if (!checkIn || !checkOut) return 0;
  const inTime = new Date(`2026-01-01 ${checkIn}`);
  const outTime = new Date(`2026-01-01 ${checkOut}`);
  return (outTime - inTime) / 1000 / 60 / 60;
}

export function getDayStatus(date, record) {
  const key = formatDateKey(date);
  if (getHolidayName(key)) return 'holiday';
  if (record?.leave) return 'leave';
  if (record?.checkIn) {
    const cutoff = new Date(`2026-01-01 ${LATE_CUTOFF}`);
    const actual = new Date(`2026-01-01 ${record.checkIn}`);
    return actual > cutoff ? 'late' : 'present';
  }
  const day = date.getDay();
  if (day === 0 || day === 6) return 'weekend';
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (date > today) return 'upcoming';
  return 'absent';
}

function generateSample(offset) {
  const patterns = [
    { checkIn: '09:00 AM', checkOut: '05:00 PM' },
    { checkIn: '09:10 AM', checkOut: '05:30 PM' },
    { checkIn: '10:20 AM', checkOut: '06:00 PM' },
    { checkIn: '08:55 AM', checkOut: '05:05 PM' },
    { leave: true },
    { checkIn: '09:30 AM', checkOut: '06:15 PM' },
    null,
    { checkIn: '09:05 AM', checkOut: '05:10 PM' },
  ];
  const data = {};
  let i = offset;
  for (let day = 1; day <= 28; day++) {
    const d = new Date(2026, 8, day);
    if (d.getDay() === 0 || d.getDay() === 6) continue;
    const p = patterns[i % patterns.length];
    if (p) data[formatDateKey(d)] = p;
    i++;
  }
  return data;
}

export const initialEmployees = [
  { id: 1, name: 'Sita Sharma', email: 'sita@attendflow.com', position: 'Frontend Developer', active: true, attendance: generateSample(0) },
  { id: 2, name: 'Ram Thapa', email: 'ram@attendflow.com', position: 'Backend Developer', active: true, attendance: generateSample(2) },
  { id: 3, name: 'Gita Rai', email: 'gita@attendflow.com', position: 'UI/UX Designer', active: true, attendance: generateSample(4) },
  { id: 4, name: 'Hari Gurung', email: 'hari@attendflow.com', position: 'QA Engineer', active: false, attendance: generateSample(6) },
  { id: 5, name: 'Anita Magar', email: 'anita@attendflow.com', position: 'Project Manager', active: true, attendance: generateSample(1) },
];