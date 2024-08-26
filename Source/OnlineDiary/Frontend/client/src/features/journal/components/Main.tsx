import Calendar from "./Calendar/";
import Editor from "./Editor/";
import Search from "./Search/";

interface ContentProps {
  disabledDays: (date: string | Date) => boolean;
  minDate: Date | null;
  value: Date | null;
  date: string | Date;
  dates: string[];
}

const Content: React.FC<ContentProps> = ({ disabledDays, minDate, value, date, dates }) => {
  const parsedDates = dates.map(d => new Date(d));

  return (
    <div className="Journal">
      <div className="calendar-container">
        <Search />
        <Calendar {...{ disabledDays, minDate, value, dates: parsedDates }} />
      </div>
      <Editor date={date} />
    </div>
  );
};

export default Content;
