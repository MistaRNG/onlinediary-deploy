import "./Result.css";
import ResultListItem from "./ResultListItem";
import React from "react";

interface ResultProps {
  results: Array<{
    id: string;
    title: string;
    date: string;
  }>;
}

const Result: React.FC<ResultProps> = ({ results }) => {
  const resultElms = results.map((info, i) => (
    <ResultListItem {...info} key={i} />
  ));

  return (
    <div className="search-result">
      {results.length ? resultElms : "No journal is found"}
    </div>
  );
};

export default Result;
