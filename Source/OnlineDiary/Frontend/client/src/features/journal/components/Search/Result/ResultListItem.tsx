import { Card, Elevation } from "@blueprintjs/core";
import { useNavigate } from "react-router-dom";
import { getResultDate } from "common/helpers";
import React from "react";

interface ResultListItemProps {
  date: string;
  title?: string;
}

const ResultListItem: React.FC<ResultListItemProps> = ({ date, title }) => {
  const navigate = useNavigate();
  const clickHandler = () => navigate(`/journal/${date}`);

  return (
    <Card onClick={clickHandler} interactive={true} elevation={Elevation.TWO}>
      <h5>{getResultDate(date)}</h5>
      <p>{title || "Untitled"}</p>
    </Card>
  );
};

export default ResultListItem;
