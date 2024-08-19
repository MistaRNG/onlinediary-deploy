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

  }, [journals]);

  useEffect(() => {
    dispatch(getJournals() as any);
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
