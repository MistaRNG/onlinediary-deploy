import "./Editor.css";
import React, { useState, useEffect } from "react";
import { Editor, EditorState } from "draft-js";
import Title from "./Title";
import DateComponent from "./Date";
import { Switch, Button, Dialog } from "@blueprintjs/core";
import axios from "axios";
import useMode from "common/hooks/useMode";

interface MainProps {
  onChange: (editorState: EditorState) => void;
  editorState: EditorState;
  editor: React.RefObject<Editor>;
  focusEditor: () => void;
  date: string | Date;
  titleRef: React.RefObject<HTMLTextAreaElement>;
  titleKeyDownHandler: (event: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  titleKeyUpHandler: (event: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  isPublic: boolean;
  toggleIsPublic: () => void;
}

const Main: React.FC<MainProps> = ({
  onChange,
  editorState,
  editor,
  focusEditor,
  date,
  titleRef,
  titleKeyDownHandler,
  titleKeyUpHandler,
  isPublic,
  toggleIsPublic,
}) => {
  const { darkMode } = useMode();
  const parsedDate = typeof date === 'string' ? new Date(date) : date;
  const [likes, setLikes] = useState<string[]>([]);
  const [comments, setComments] = useState<{ username: string; content: string; deleted?: boolean; edited?: boolean; }[]>([]);
  const [journalId, setJournalId] = useState<number | null>(null);
  const [isLikesModalOpen, setIsLikesModalOpen] = useState(false);
  const [isCommentsModalOpen, setIsCommentsModalOpen] = useState(false);

  useEffect(() => {
    const fetchJournalId = async () => {
      try {
        const response = await axios.get(`http://localhost:3005/api/journals/get-id-by-date`, {
          params: { date: parsedDate.toISOString().split('T')[0] }
        });
        setJournalId(response.data.journalId);
      } catch (error) {
        console.error("Error fetching journal ID:", error);
      }
    };

    fetchJournalId();
  }, [parsedDate]);

  const fetchLikes = async () => {
    if (!journalId) {
      console.warn("Journal ID is undefined, cannot fetch likes.");
      return;
    }
  
    try {
      const response = await axios.get(`http://localhost:3003/api/likes/users/${journalId}`, {
        withCredentials: true,
      });
      setLikes(response.data);
    } catch (error) {
      console.error("Error fetching likes:", error);
    }
  };
  
  const fetchComments = async () => {
    if (!journalId) {
      console.warn("Journal ID is undefined, cannot fetch comments.");
      return;
    }
  
    try {
      const response = await axios.get(`http://localhost:3002/api/comments/${journalId}`, {
        withCredentials: true,
      });
      setComments(response.data);
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  const openLikesModal = () => {
    fetchLikes();
    setIsLikesModalOpen(true);
  };

  const openCommentsModal = () => {
    fetchComments();
    setIsCommentsModalOpen(true);
  };

  const closeLikesModal = () => {
    setIsLikesModalOpen(false);
  };

  const closeCommentsModal = () => {
    setIsCommentsModalOpen(false);
  };

  return (
    <div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          marginBottom: "1em",
          flexWrap: "wrap",
        }}
      >
        <Switch
          checked={isPublic}
          label="Public"
          onChange={toggleIsPublic}
          style={{ marginRight: "1em", marginBottom: "0.5em" }}
        />
        {isPublic && (
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
            }}
          >
            <Button
              icon="thumbs-up"
              onClick={openLikesModal}
              disabled={!journalId}
              style={{ marginRight: "0.5em", marginBottom: "0.5em" }}
            >
              Show Likes
            </Button>
            <Button
              icon="comment"
              onClick={openCommentsModal}
              disabled={!journalId}
              style={{ marginBottom: "0.5em" }}
            >
              Show Comments
            </Button>
          </div>
        )}
      </div>
      <DateComponent date={parsedDate} />
      <Title
        {...{
          titleRef,
          keyDownHandler: titleKeyDownHandler,
          keyUpHandler: titleKeyUpHandler,
        }}
      />
      <Editor
        {...{
          onChange,
          editorState,
          ref: editor,
          placeholder: "How was your day?",
          onClick: focusEditor,
        }}
      />
      <Dialog
        isOpen={isLikesModalOpen}
        onClose={closeLikesModal}
        className={`modal-container ${darkMode ? "dark" : "bright"}`}
        style={{
          fontSize: "1.2em",
          backgroundColor: darkMode ? "#1c1c1e" : "#ffffff",
          color: darkMode ? "#e5e5ea" : "#000000",
          border: darkMode ? "1px solid #333" : "1px solid #ddd",
          boxShadow: darkMode ? "0 4px 8px rgba(0, 0, 0, 0.3)" : "0 4px 8px rgba(0, 0, 0, 0.1)",
        }}
      >
        <div className="bp4-dialog-body" style={{ padding: "20px", lineHeight: "1.6", maxHeight: "60vh", overflowY: "auto" }}>
          <h2
            style={{
              color: darkMode ? "#ffffff" : "#000000",
              fontSize: "1.6em",
              fontWeight: "bold",
              textShadow: darkMode
                ? "1px 1px 3px rgba(0, 0, 0, 0.7)"
                : "1px 1px 3px rgba(200, 200, 200, 0.7)",
              marginBottom: "0.5em",
            }}
          >
            Likes
          </h2>
          {likes.length ? (
            <ul>
              {likes.map((username, index) => (
                <li key={index}>{username}</li>
              ))}
            </ul>
          ) : (
            <p>No one has liked this entry yet.</p>
          )}
        </div>
        <div className="bp4-dialog-footer">
          <Button className="close-button" onClick={closeLikesModal}>
            Close
          </Button>
        </div>
      </Dialog>
      <Dialog
        isOpen={isCommentsModalOpen}
        onClose={closeCommentsModal}
        className={`modal-container ${darkMode ? "dark" : "bright"}`}
        style={{
          fontSize: "1.2em",
          backgroundColor: darkMode ? "#1c1c1e" : "#ffffff",
          color: darkMode ? "#e5e5ea" : "#000000",
          border: darkMode ? "1px solid #333" : "1px solid #ddd",
          boxShadow: darkMode ? "0 4px 8px rgba(0, 0, 0, 0.3)" : "0 4px 8px rgba(0, 0, 0, 0.1)",
        }}
      >
        <div className="bp4-dialog-body" style={{ padding: "20px", lineHeight: "1.6", maxHeight: "60vh", overflowY: "auto" }}>
          <h2
            style={{
              color: darkMode ? "#ffffff" : "#000000",
              fontSize: "1.6em",
              fontWeight: "bold",
              textShadow: darkMode
                ? "1px 1px 3px rgba(0, 0, 0, 0.7)"
                : "1px 1px 3px rgba(200, 200, 200, 0.7)",
              marginBottom: "0.5em",
            }}
          >
            Comments
          </h2>
          {comments.length ? (
            <ul style={{ paddingLeft: "1em" }}>
              {comments.map((comment, index) => (
                <li key={index} style={{ marginBottom: "0.8em" }}>
                  <strong>{comment.username}: </strong> 
                  {comment.deleted ? (
                    <span style={{ fontStyle: "italic" }}>
                      Comment was deleted by user
                    </span>
                  ) : (
                    <>
                      {comment.content}
                      {comment.edited && (
                        <span style={{ fontStyle: "italic", fontSize: "0.8em", color: "gray" }}>
                          {" "}
                          (edited)
                        </span>
                      )}
                    </>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p>No comments for this entry yet.</p>
          )}
        </div>
        <div className="bp4-dialog-footer">
          <Button className="close-button" onClick={closeCommentsModal}>
            Close
          </Button>
        </div>
      </Dialog>
    </div>
  );  
};

export default Main;
