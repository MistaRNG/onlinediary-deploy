import React, { useEffect, useState } from "react";
import { Card, Elevation, Button } from "@blueprintjs/core";
import { getPublicJournals } from "features/journal/journalSlice";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "app/store";
import axios from "axios";

const PublicJournals: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const journals = useSelector((state: RootState) => state.journals.data);

  useEffect(() => {
    const fetchPublicJournals = async () => {
      await dispatch(getPublicJournals());
    };

    fetchPublicJournals();
  }, [dispatch]);

  const [likes, setLikes] = useState<Record<number, number>>({});
  const [userLiked, setUserLiked] = useState<Record<number, boolean>>({});

  const fetchLikes = async (journalId: number) => {
    try {
      const response = await axios.get(`/api/likes/${journalId}`);
      setLikes((prev) => ({ ...prev, [journalId]: response.data.count || 0 }));
      setUserLiked((prev) => ({ ...prev, [journalId]: response.data.userLiked || false }));
    } catch (error) {
      if (error.response && error.response.status === 404) {
        setLikes((prev) => ({ ...prev, [journalId]: 0 }));
        setUserLiked((prev) => ({ ...prev, [journalId]: false }));
      } else {
        console.error("Error fetching likes:", error);
      }
    }
  };  

  const handleLike = async (journalId: number) => {
    if (!userLiked[journalId]) {
      await axios.post("/api/likes", { journal_id: journalId });
  
      setUserLiked((prev) => ({ ...prev, [journalId]: true }));
      setLikes((prev) => ({ ...prev, [journalId]: prev[journalId] + 1 }));
    } else {
      await axios.delete("/api/likes", { data: { journal_id: journalId } });
  
      setUserLiked((prev) => ({ ...prev, [journalId]: false }));
      setLikes((prev) => ({ ...prev, [journalId]: prev[journalId] - 1 }));
    }
  };

  useEffect(() => {    
    Object.values(journals).forEach((journal: any) => {
      if (journal.id) {
        fetchLikes(journal.id);
      } else {
        console.error("Journal ID is undefined:", journal);
      }
    });
  }, [journals]);  

  return (
    <div>
      <h2>Public entries</h2>
      {Object.keys(journals).length ? (
        Object.values(journals).map((journal: any) => (
          <Card
            key={journal.id}
            interactive={true}
            elevation={Elevation.TWO}
            className="public-journal-card"
          >
            <h5>{journal.title || "Unbenannt"}</h5>
            <p>{journal.date}</p>
            <Button
              icon="thumbs-up"
              text={`Like (${likes[journal.id] || 0})`}
              onClick={() => handleLike(journal.id)}
              active={userLiked[journal.id]}
            />
          </Card>
        ))
      ) : (
        <p>No public entries available</p>
      )}
    </div>
  );
};

export default PublicJournals;
