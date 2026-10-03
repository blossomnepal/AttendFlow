export const holidays2026 = {
  '2026-01-11': 'Prithvi Jayanti',
  '2026-01-15': 'Maghe Sankranti',
  '2026-01-30': "Martyrs' Day",
  '2026-02-15': 'Maha Shivaratri',
  '2026-02-19': 'National Democracy Day',
    '2026-02-21': 'National Womens Day',
    '2026-02-22': 'Gyalpo Lhosar',
    '2026-03-21': 'Holi',
  '2026-04-14': 'Nepali New Year',
  '2026-04-24': 'Loktantra Diwas',
  '2026-05-01': 'Buddha Jayanti / Labor Day',
  '2026-05-29': 'Republic Day',
  '2026-08-28': 'Janai Purnima / Raksha Bandhan',
  '2026-09-04': 'Krishna Janmashtami',
  '2026-10-19': 'Dashain - Maha Ashtami',
  '2026-10-20': 'Dashain - Maha Nawami',
  '2026-10-21': 'Dashain - Bijaya Dashami',
  '2026-10-22': 'Holiday',
  '2026-10-23': 'Holiday',
  '2026-11-09': 'Tihar - Laxmi Puja',
  '2026-11-10': 'Tihar - Gobhardan Puja',
  '2026-11-11': 'Tihar - Bhai Tika',
  '2026-11-12': 'Holiday',
  '2026-12-24': 'Udhauli-Parva',
  '2026-12-25': 'Christmas',
  '2026-12-30': 'Tamu Lhosar',
  '2027-01-11': 'Prithvi Jayanti',
  '2027-02-07': 'Sonam Lhosar',
  '2027-03-08': 'National Womens Day',
  '2027-03-09': 'Gyalpo Lhosar',
  '2027-03-22': 'Holi',
};

export function getHolidayName(dateKey) {
  return holidays2026[dateKey] || null;
}

export function isWeekend(date) {
  const day = date.getDay();
  return day === 0 || day === 6;
}

export function getRedMarkLabel(dateKey, date) {
  const holidayName = getHolidayName(dateKey);
  if (holidayName) return holidayName;
  if (isWeekend(date)) return date.getDay() === 6 ? 'Saturday' : 'Sunday';
  return null;
}