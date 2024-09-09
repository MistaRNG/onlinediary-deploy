import moment, { Moment } from "moment";
import { convertFromRaw, RawDraftContentState } from "draft-js";

const numOfAlarmMinutes = 3;
const beforeToday = 1;

const getMonth = (date: string | Date): string => {
  return moment(date).format("YYYY-MM");
};

/**
 * Finds the first available date within a list of dates that matches the month of the given date.
 *
 * This function is useful for locating a date within a specific month when iterating over available dates.
 *
 * @param {string | Date} date - The date to find a matching month for.
 * @param {string[]} dates - An array of date strings to search through.
 * @returns {string | undefined} - The first matching date string, or undefined if no match is found.
 */
export const getAvailableDate = (date: string | Date, dates: string[]): string | undefined => {
  const month = getMonth(date);
  return dates.find((d) => d.includes(month));
};

const convertTimeToStr = (time: Moment): string => {
  return time.toISOString();
};

export const getAlarm = (): string => {
  const alarm = moment().add(numOfAlarmMinutes, "minutes");
  return convertTimeToStr(alarm);
};

/**
 * Compares two dates and returns true if the first date is less than or equal to the second.
 *
 * @param {string | Date} date1 - The first date to compare.
 * @param {string | Date} date2 - The second date to compare.
 * @returns {boolean} - True if date1 is less than or equal to date2, otherwise false.
 */
export const compareDate = (date1: string | Date, date2: string | Date): boolean => {
  return moment(date1).toDate() <= moment(date2).toDate();
};

export const getLatestMinDate = (): string => {
  return formatDate(
    moment().subtract(beforeToday, "months").add(beforeToday, "days").toDate()
  );
};

export const getStyledDate = (date: string | Date): string => {
  return moment(date).format("ddd MMM DD YYYY");
};

export const getMinDate = (date: string | Date): Date => {
  const beforeNow = moment(getLatestMinDate()).toDate();
  const dateIsEarlier = compareDate(date, beforeNow);
  if (dateIsEarlier) return moment(date).toDate();
  return beforeNow;
};

export const today = (): Date => moment().toDate();
export const toDate = (date: string | Date): Date => moment(date).toDate();
export const getTodayDate = (): string => moment().format("YYYY-MM-DD");
export const formatDate = (date: string | Date): string => moment(date).format("YYYY-MM-DD");
const checkIfValid = (date: string | Date): boolean => moment(date).isValid();
export const getResultDate = (date: string | Date): string => moment(date).format("MMMM D, YYYY");
export const getLongDate = (date: string | Date): string =>
  moment(date).format("dddd, MMMM D, YYYY");

export const isTimeUp = (date: string | Date): boolean => compareDate(date, new Date());

export const getFormattedDate = (date: string | Date): string | false =>
  checkIfValid(date) ? formatDate(date) : false;

export const getText = (content: RawDraftContentState): string => {
  return convertFromRaw(content).getPlainText();
};

export const getNextDay = (date: string | Date): string => {
  return formatDate(moment(date).add(1, "days").toDate());
};

export interface JournalData {
  id: number;
  content: any;
  title: string;
  text: string;
  isPublic: boolean;
}

/**
 * Formats an array of journal entries into a structured record and list of dates.
 *
 * Converts raw data from journal entries into a more manageable format for the application,
 * extracting and formatting fields such as ID, date, content, title, and public status.
 *
 * @param {Array} data - Array of journal entries with fields id, date, content, title, and optional is_public.
 * @returns {[Record<string, JournalData>, string[]]} - A tuple containing a record of formatted journal data
 * and a list of formatted dates.
 */
export const formatJournals = (
  data: { id: number; date: string; content: RawDraftContentState; title: string; is_public?: boolean }[]
): [Record<string, JournalData>, string[]] => {
  const result: Record<string, JournalData> = {};
  const dates: string[] = [];
  for (const row of data) {
    const { id, date, content, title, is_public } = row;
    const text = getText(content);
    const formattedDate = formatDate(date);
    const isPublic = is_public || false;
    result[formattedDate] = { id, title, content, text, isPublic };
    dates.push(formattedDate);
  }
  return [result, dates];
};

export const removeContent = (journals: Record<string, JournalData>, date: string): Record<string, JournalData> => {
  const result = { ...journals };
  delete result[date];
  return result;
};

export const countWords = (str: string): number => {
  const regex = / |\n/;
  return str.split(regex).filter((word) => word).length;
};

export const getStatusStr = (saved: boolean | null): string | false => {
  return saved ? "Saved" : saved === false ? "Saving..." : false;
};

export const getStyle = (date: string | Date): string => {
  const formattedDate = getStyledDate(date);
  return `
    .calendar-container
    .DayPicker-Day[aria-label="${formattedDate}"][aria-disabled="false"][aria-selected="false"]
   .bp4-datepicker-day-wrapper {
    color: #4f82bd;
   }
   `;
};
