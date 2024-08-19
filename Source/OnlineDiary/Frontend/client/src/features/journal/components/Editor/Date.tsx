import { getLongDate } from "common/helpers";

interface DateProps {
  date: Date;
}

const LongDateDisplay: React.FC<DateProps> = ({ date }) => {
  return <div>{getLongDate(date)}</div>;
};

export default LongDateDisplay;
