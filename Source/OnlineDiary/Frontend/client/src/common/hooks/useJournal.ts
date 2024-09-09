import { useNavigate } from "react-router-dom";
import {
  toDate,
  getFormattedDate,
  getTodayDate,
  formatDate,
  getMinDate,
  compareDate,
  getLatestMinDate,
  getNextDay,
  getStyle,
  getAvailableDate,
} from "common/helpers";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getJournals } from "features/journal/journalSlice";
import { RootState } from "app/store";

type JournalData = Record<string, any>;

/**
 * Custom hook for managing journal-related data and navigation.
 * 
 * This hook handles loading journal entries, managing dates, and navigating to available 
 * journal entries. It also manages styles and checks for valid journal dates.
 * 
 * @param {string} date - The current date string to be used in the journal context.
 * 
 * @returns {Object} - An object containing:
 * - `gotData`: Boolean indicating if the journal data has been successfully loaded.
 * - `validDate`: Boolean indicating if the current date is a valid journal date.
 * - `disabledDays`: A function that checks if a date is disabled for journal entries.
 * - `minDate`: The earliest available date in the journal data.
 * - `value`: The JavaScript Date object corresponding to the provided date string.
 * - `date`: The original date string passed to the hook.
 * - `css`: A string of CSS styles related to the journal dates.
 * - `dates`: An array of available dates in the journal.
 */
const useJournal = (date: string) => {
  const [css, setCss] = useState<string>("");

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { journals, gotData, prevDates } = useSelector((state: RootState) => ({
    journals: state.journals.data as JournalData,
    gotData: state.journals.gotData,
    prevDates: state.journals.prevDates as string[],
  }));

  const disabledDays = (date: string | Date): boolean => {
    const formatted = formatDate(date);
    const hasJournal = Array.isArray(dates) && dates.includes(formatDate(date));
    const isToday = formatted === getTodayDate();
    const afterMinDate = compareDate(getLatestMinDate(), date);
    const inPreviousDate = Array.isArray(prevDates) && prevDates.includes(formatted);
    return !hasJournal && !isToday && !afterMinDate && !inPreviousDate;
  };

  const formattedDate = getFormattedDate(date);
  const dates = (Object.keys(journals) as string[])
    .concat(prevDates)
    .sort((date, date2) => (compareDate(date, date2) ? -1 : 1));

  const minDate = getMinDate(dates.length ? dates[0] : new Date());
  const dateIsAvailable = !disabledDays(date);
  const correctDateFormat = formattedDate === date;
  const validDate = Boolean(formattedDate && dateIsAvailable && correctDateFormat);

  useEffect(() => {
    const cssArr: string[] = [];
    for (let i = dates[0]; compareDate(i, getTodayDate()); i = getNextDay(i)) {
      const hasJournal = i in journals;
      if (hasJournal) {
        const style = getStyle(i);
        cssArr.push(style);
      }
    }
    setCss(cssArr.join(""));
    // eslint-disable-next-line
  }, [journals]);

  useEffect(() => {
    dispatch(getJournals() as any);
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (gotData) {
      if (!formattedDate) {
        navigate(`/journal/${getTodayDate()}`);
      } else if (!dateIsAvailable) {
        const day = getAvailableDate(formattedDate, dates) || getTodayDate();
        navigate(`/journal/${day}`);
      } else if (!correctDateFormat) {
        navigate(`/journal/${formattedDate}`);
      }
    }
    // eslint-disable-next-line
  }, [gotData, formattedDate, dateIsAvailable, correctDateFormat]);

  return {
    gotData,
    validDate,
    disabledDays,
    minDate,
    value: toDate(date),
    date,
    css,
    dates,
  };
};

export default useJournal;
