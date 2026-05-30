const sourceUrl = "https://www.woodlandspark.com/your-visit/information/opening-times/";

const offPeakDates = new Set([
  "2026-04-20",
  "2026-04-24",
  "2026-04-27",
  "2026-05-01",
  "2026-05-05",
  "2026-05-06",
  "2026-05-07",
  "2026-05-08",
  "2026-05-11",
  "2026-05-12",
  "2026-05-13",
  "2026-05-14",
  "2026-05-15",
  "2026-05-18",
  "2026-05-19",
  "2026-05-20",
  "2026-05-21",
  "2026-05-22",
  "2026-09-07",
  "2026-09-11",
  "2026-09-14",
  "2026-09-18",
  "2026-09-21",
  "2026-09-25",
  "2026-09-28",
  "2026-10-02",
  "2026-10-05",
  "2026-10-09",
  "2026-10-12",
  "2026-10-16",
  "2026-10-19",
  "2026-10-23",
]);

const closedDates = new Set([
  "2026-04-21",
  "2026-04-22",
  "2026-04-23",
  "2026-04-28",
  "2026-04-29",
  "2026-04-30",
  "2026-09-08",
  "2026-09-09",
  "2026-09-10",
  "2026-09-15",
  "2026-09-16",
  "2026-09-17",
  "2026-09-22",
  "2026-09-23",
  "2026-09-24",
  "2026-09-29",
  "2026-09-30",
  "2026-10-01",
  "2026-10-06",
  "2026-10-07",
  "2026-10-08",
  "2026-10-13",
  "2026-10-14",
  "2026-10-15",
  "2026-10-20",
  "2026-10-21",
  "2026-10-22",
]);

const winterFunDates = new Set([
  "2026-11-07",
  "2026-11-08",
  "2026-11-14",
  "2026-11-15",
  "2026-11-21",
  "2026-11-22",
  "2026-11-28",
  "2026-11-29",
]);

export const openingTimesSource = {
  title: "Opening Times",
  sourceUrl,
  calendarDocument: "opening-times/2026-calendar.jpg",
  calendarImages: [
    "opening-times/april-2026.jpg",
    "opening-times/may-2026.jpg",
    "opening-times/june-2026.jpg",
    "opening-times/july-2026.jpg",
    "opening-times/august-2026.jpg",
    "opening-times/september-2026.jpg",
    "opening-times/october-2026.jpg",
    "opening-times/november-2026.jpg",
  ],
  oldPageText: [
    "For our full 2026 calendar please click here",
    "Rides closed during 'Off Peak':",
    "Watercoasters, Pedal Boat, Toboggan run, Arctic Gliders, Dune Buggies, Avalanche, Bumper Boats, Jumping Pillow, Nuttys Treehouse.",
    "Please note, some rides are closed during off-peak weekdays: Mon 20th, Fri 24th, Mon 27th April, Fri 1st May, Tues 5th to Fri 8th May, Mon 11th to Fri 15th May, Mon 18th to Fri 22nd May, Mon 7th, Fri 11th, Mon 14th, Fri 18th, Mon 21st, Fri 25th, Mon 28th Sept, Fri 2nd, Mon 5th, Fri 9th, Mon 12th, Fri 16th, Mon 19th & Fri 23rd Oct 2026. The rides not open during these off peak dates are: Watercoasters, Toboggan Run, Pedal Boats, Arctic Gliders, Dune Buggies, Avalanche, Bumper Boats, Nutty’s Treehouse, Jumping Pillow, Safari Adventure Golf.",
    "The Family Theme Park is not open: Tues, Wednes & Thurs: 21st, 22nd, 23rd, 28th, 29th & 30th April, 8th, 9th, 10th, 15th, 16th, 17th, 22nd, 23rd, 24th, 29th & 30th Sept, 1st, 6th, 7th, 8th, 13th, 14th, 15th, 20th, 21st & 22nd Oct 2026.",
  ],
  openingText: [
    "During the main season and off-peak weekdays the park opens at 9:30am, the rides from 10am and closes at 5pm.",
    "In the winter fun season the park is open from 10:30am to 4:30pm",
  ],
};

export const openingLegend = [
  { id: "main", label: "Main Season", className: "opening-day-main" },
  { id: "off-peak", label: "Off Peak Weekdays", className: "opening-day-off-peak" },
  { id: "winter", label: "Winter Fun", className: "opening-day-winter" },
  { id: "closed", label: "Park Closed", className: "opening-day-closed" },
];

export const openingMonths = [
  { label: "April 2026", year: 2026, month: 3 },
  { label: "May 2026", year: 2026, month: 4 },
  { label: "June 2026", year: 2026, month: 5 },
  { label: "July 2026", year: 2026, month: 6 },
  { label: "August 2026", year: 2026, month: 7 },
  { label: "September 2026", year: 2026, month: 8 },
  { label: "October 2026", year: 2026, month: 9 },
  { label: "November 2026", year: 2026, month: 10 },
];

export function dateKey(year, month, day) {
  return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

export function openingStatusForDate(year, month, day) {
  const key = dateKey(year, month, day);
  if (closedDates.has(key)) return "closed";
  if (offPeakDates.has(key)) return "off-peak";
  if (winterFunDates.has(key)) return "winter";
  if (month === 10) return "closed";
  if (month >= 3 && month <= 9) return "main";
  return "closed";
}

export function buildMonthDays(monthData) {
  const first = new Date(monthData.year, monthData.month, 1);
  const daysInMonth = new Date(monthData.year, monthData.month + 1, 0).getDate();
  const firstOffset = (first.getDay() + 6) % 7;
  const cells = Array.from({ length: firstOffset }, (_, index) => ({ id: `blank-${index}`, blank: true }));

  for (let day = 1; day <= daysInMonth; day += 1) {
    const status = openingStatusForDate(monthData.year, monthData.month, day);
    cells.push({
      id: dateKey(monthData.year, monthData.month, day),
      day,
      status,
    });
  }

  return cells;
}
