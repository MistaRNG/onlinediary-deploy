import { Card, Elevation, Button, Icon } from "@blueprintjs/core";
import { useNavigate } from "react-router-dom";
import { getResultDate } from "common/helpers";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { deleteJournal } from "features/journal/journalSlice";
import { AppDispatch } from "app/store";

interface ResultListItemProps {
  date: string;
  title?: string;
}

const ResultListItem: React.FC<ResultListItemProps> = ({ date, title }) => {
  const navigate = useNavigate();
  const dispatch: AppDispatch = useDispatch();

  const [hovered, setHovered] = useState(false);

  const clickHandler = () => navigate(`/journal/${date}`);

  const deleteHandler = (event: React.MouseEvent) => {
    event.stopPropagation();

    const confirmed = window.confirm("Are you sure you want to delete this journal entry?");
    if (confirmed) {
      dispatch(deleteJournal(date));
    }
  };

  return (
    <Card onClick={clickHandler} interactive={true} elevation={Elevation.TWO} className="result-list-item">
      <div className="result-content">
        <h5>{getResultDate(date)}</h5>
        <p>{title || "Untitled"}</p>
      </div>
      <Button 
        icon={<Icon icon="trash" style={{ color: hovered ? '#fb3030' : '#fd5d5d' }} />} 
        minimal={true} 
        onClick={deleteHandler} 
        className="delete-button"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      />
    </Card>
  );
};

export default ResultListItem;
