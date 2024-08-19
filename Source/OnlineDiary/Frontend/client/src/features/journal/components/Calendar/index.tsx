import "react-datepicker/dist/react-datepicker.css";
import "./Calendar.css";
import DatePicker from "react-datepicker";
import { useNavigate } from "react-router-dom";
import { formatDate, getTodayDate, getAvailableDate } from "../../../../common/helpers";

interface CalendarProps {
  value: Date | null;
  disabledDays: (date: string) => boolean;
  minDate: Date | null;
  dates: Date[];
}

const Calendar: React.FC<CalendarProps> = ({ value, disabledDays, minDate, dates }) => {
  const navigate = useNavigate();
  const today: string = formatDate(getTodayDate());

  const changeHandler = (date: Date | null): void => {
    if (date) {
      const formattedDate: string = formatDate(date);
      const available: boolean = !disabledDays(formattedDate);
      if (available) {
        navigate(`/journal/${formattedDate}`);
      } else {
        const formattedDates = dates.map(d => formatDate(d));
        const day: string = getAvailableDate(formattedDate, formattedDates);
        navigate(`/journal/${day}`);
      }
    }
  };

  const getDayClassName = (date: Date): string => {
    const formattedDate: string = formatDate(date);
    let className: string = "";
    if (dates.some(d => formatDate(d) === formattedDate)) {
      className += " react-datepicker__day--highlighted";
    }
    if (formattedDate === today) {
      className += " react-datepicker__day--today";
    }
    return className;
  };

  return (
    <div className="calendar-container">
      <DatePicker
        selected={value}
        onChange={changeHandler}
        minDate={minDate}
        excludeDates={dates.filter(date => disabledDays(formatDate(date)))}
        inline
        calendarClassName="custom-calendar"
        dayClassName={getDayClassName}
      />
    </div>
  );
};

export default Calendar;

