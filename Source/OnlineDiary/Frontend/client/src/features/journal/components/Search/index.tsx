import Input from "./Input";
import useSearch from "common/hooks/useSearch";
import Result from "./Result/ResultList";
import "./Search.css";
import React from "react";

interface SearchProps {}

const Search: React.FC<SearchProps> = () => {
  const { search, changeHandler, cancel, results } = useSearch();

  return (
    <div className="search">
      <Input {...{ search, changeHandler, cancel }} />
      <Result results={results} />
    </div>
  );
};

export default Search;
