const dateToString = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // months are 0-based
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const stringToDate = (dateStr: string): Date => {
  const [year, month, day] = dateStr.split('-').map(Number);
  return new Date(year, month - 1, day); // months are 0-based
};

const getDatesOfCurrentWeek = (): Date[] => {
  const today = new Date();
  const day = today.getDay();

  const diff = day === 0 ? -6 : 1 - day;

  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() + diff);

  const dates: Date[] = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(startOfWeek);
    d.setDate(startOfWeek.getDate() + i);
    dates.push(d);
  }
  return dates;
};

const Utils = { dateToString, stringToDate, getDatesOfCurrentWeek };

export default Utils;
