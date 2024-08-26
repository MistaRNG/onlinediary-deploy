import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { compareDate } from "common/helpers";
import { RootState } from "app/store";

const useSearch = () => {
  const [search, setSearch] = useState<string>("");
  const [results, setResults] = useState<{ id: string; date: string; title: string }[]>([]);

  const data = useSelector((state: RootState) => state.journals.data);

  const updateResults = () => {
    const newResults = [];
  
    const searchLower = search.toLowerCase();
    for (const date in data) {
      const { title, text } = data[date];
  
      const formattedDate = new Date(date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }).toLowerCase();
  
      if (searchLower) {
        const foundInTitle = title && title.toLowerCase().includes(searchLower);
        const foundInContent = text && text.toLowerCase().includes(searchLower);
        const foundInDate = formattedDate.includes(searchLower);
  
        if (foundInTitle || foundInContent || foundInDate) {
          newResults.push({ id: date, date, title });
        }
      } else {
        newResults.push({ id: date, date, title });
      }
    }
  
    const sorted = newResults.sort(({ date }, { date: date2 }) => {
      return compareDate(date, date2) ? 1 : -1;
    });
  
    setResults(sorted);
  };

  useEffect(() => {
    const t = setTimeout(updateResults, 500);
    return () => clearTimeout(t);
  }, [search, data]);

  const changeHandler = (e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value);

  const cancel = () => setSearch("");

  return { search, changeHandler, cancel, results };
};

export default useSearch;
