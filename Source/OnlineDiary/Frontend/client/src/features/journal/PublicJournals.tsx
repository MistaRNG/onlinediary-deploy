import React, { useEffect } from "react";
import { Card, Elevation } from "@blueprintjs/core";
import { useNavigate } from "react-router-dom";
import { getPublicJournals } from "features/journal/journalSlice";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "app/store";

const PublicJournals: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();

  const journals = useSelector((state: RootState) => state.journals.data);

  useEffect(() => {
    const fetchPublicJournals = async () => {
      await dispatch(getPublicJournals());
    };

    fetchPublicJournals();
  }, [dispatch]);

  const clickHandler = (date: string) => {
    navigate(`/journal/${date}`);
  };

  return (
    <div>
      <h2>Public entries</h2>
      {Object.keys(journals).length ? (
        Object.values(journals).map((journal: any) => (
          <Card
            key={journal.id}
            onClick={() => clickHandler(journal.date)}
            interactive={true}
            elevation={Elevation.TWO}
            className="public-journal-card"
          >
            <h5>{journal.title || "Untitled"}</h5>
            <p>{journal.date}</p>
          </Card>
        ))
      ) : (
        <p>No public entries available</p>
      )}
    </div>
  );
};

export default PublicJournals;
