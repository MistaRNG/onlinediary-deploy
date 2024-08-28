import "./PublicJournals.css";
import React, { useEffect, useState } from "react";
import { Card, Elevation, Button, Dialog } from "@blueprintjs/core";
import { getPublicJournals } from "features/journal/journalSlice";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "app/store";
import { EditorState, convertFromRaw, Editor } from "draft-js";
import axios from "axios";
import moment from "moment";
import useMode from "common/hooks/useMode";
import { useNavigate } from "react-router-dom";
import SearchInput from "./components/Search/Input";
import LogoutButton from "features/auth/LogoutButton";

const PublicJournals: React.FC = () => {
  const { darkMode } = useMode();
  const dispatch: AppDispatch = useDispatch();
  const journals = useSelector((state: RootState) => state.journals.data);
  const navigate = useNavigate();

  const [isPasswordInputVisible, setIsPasswordInputVisible] = useState(false);

  useEffect(() => {
    const checkPasswordInput = () => {
      const passwordInputVisible = !!document.querySelector('input[type="password"]');
      setIsPasswordInputVisible(passwordInputVisible);
    };

    checkPasswordInput();

    const observer = new MutationObserver(checkPasswordInput);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const fetchPublicJournals = async () => {
      await dispatch(getPublicJournals());
    };

    fetchPublicJournals();
  }, [dispatch]);

  const [searchQuery, setSearchQuery] = useState("");
  const [likes, setLikes] = useState<Record<number, number>>({});
  const [userLiked, setUserLiked] = useState<Record<number, boolean>>({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedJournal, setSelectedJournal] = useState<any>(null);
  const [editorState, setEditorState] = useState<EditorState | null>(null);
  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState<string>("");

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

  const fetchComments = async (journalId: number) => {
    try {
      const response = await axios.get(`/api/comments/${journalId}`);
      setComments(response.data);
    } catch (error) {
      console.error("Error fetching comments:", error);
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

  const openJournalModal = (journal: any) => {
    const formattedDate = moment(journal.date).format("dddd, MMMM D, YYYY");

    setSelectedJournal({
      ...journal,
      formattedDate,
    });

    const contentState = convertFromRaw(journal.content);
    const editorState = EditorState.createWithContent(contentState);
    setEditorState(editorState);

    setIsModalOpen(true);

    fetchComments(journal.id);
  };

  const closeJournalModal = () => {
    setIsModalOpen(false);
    setSelectedJournal(null);
    setComments([]);
    setNewComment("");
  };

  const handleCommentSubmit = async () => {
    if (newComment.trim() === "") return;

    try {
      const response = await axios.post("/api/comments", {
        journal_id: selectedJournal.id,
        content: newComment,
      });

      setComments([...comments, response.data]);
      setNewComment("");
    } catch (error) {
      console.error("Error posting comment:", error);
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

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const cancelSearch = () => {
    setSearchQuery("");
  };

  const filteredJournals = Object.values(journals).filter((journal: any) =>
    journal.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    moment(journal.date).format("dddd, MMMM D, YYYY").toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className={darkMode ? "dark" : "bright"}>
      <LogoutButton />
      <div className="page-container">
        {!isPasswordInputVisible && (
          <>
            <div
              className="header-container"
              style={{
                position: "fixed",
                filter: isModalOpen ? "brightness(0.5)" : "none",
                margin: "70px 0 0 1px",
                zIndex: 1000,
                display: "block",
              }}
            >
              <Button
                icon="arrow-left"
                text="Back to Editor"
                onClick={() => navigate(`/journal/${moment().format("YYYY-MM-DD")}`)}
                className="back-to-editor-button"
                style={{
                  marginBottom: "30px",
                  display: "block",
                }}
              />
              <SearchInput
                search={searchQuery}
                changeHandler={handleSearchChange}
                cancel={cancelSearch}
              />
            </div>
            <h2
              style={{
                textAlign: "center",
                width: "100%",
                marginTop: "20px",
                position: "fixed",
                top: "30px",
                left: "50%",
                transform: "translateX(-50%)",
                zIndex: 999,
              }}
            >
              Public entries
            </h2>
          </>
        )}
        <div
          className="content-container"
          style={{
            filter: isModalOpen ? "brightness(0.5)" : "none",
            marginTop: "100px",
            zIndex: 0,
            position: "relative",
          }}
        >
          <div className="public-journals-container">
            {filteredJournals.length ? (
              filteredJournals.map((journal: any) => {
                return (
                  <Card
                    key={journal.id}
                    interactive={true}
                    elevation={Elevation.TWO}
                    className="public-journal-card"
                    onClick={() => openJournalModal(journal)}
                  >
                    <h5>{journal.title || "Unbenannt"}</h5>
                    <p>
                      {journal.date
                        ? moment(journal.date).format("dddd, MMMM D, YYYY")
                        : "No Date Available"}
                    </p>
                    <div className="card-actions">
                      <Button
                        icon="thumbs-up"
                        text={`Like (${likes[journal.id] || 0})`}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleLike(journal.id);
                        }}
                        active={userLiked[journal.id]}
                      />
                      <Button
                        icon="comment"
                        text="Comment"
                        onClick={(e) => {
                          e.stopPropagation();
                          openJournalModal(journal);
                        }}
                      />
                    </div>
                  </Card>
                );
              })
            ) : (
              <p>No public entries available</p>
            )}
          </div>
        </div>
      </div>
      <Dialog
        isOpen={isModalOpen}
        onClose={closeJournalModal}
        title={null}
        className={`modal-container ${darkMode ? "dark" : "bright"}`}
        style={{
          zIndex: 1002,
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          fontSize: "1.2em",
          backgroundColor: darkMode ? "#1c1c1e" : "#ffffff",
          color: darkMode ? "#e5e5ea" : "#000000",
          border: "1px solid #333",
        }}
      >
        <div
          className="bp4-dialog-body"
          style={{ padding: "20px", lineHeight: "1.6" }}
        >
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
            Öffentlich
          </h2>

          <p
            style={{
              fontSize: "1.1em",
              fontStyle: "italic",
              color: darkMode ? "#bbbbbb" : "#555555",
              marginBottom: "1.5em",
              padding: "5px 10px",
              borderRadius: "5px",
              border: darkMode ? "1px solid #444" : "1px solid #ddd",
              backgroundColor: darkMode ? "#2c2c2c" : "#f9f9f9",
            }}
          >
            <strong>Date:</strong> {selectedJournal?.formattedDate || "N/A"}
          </p>

          <div
            style={{
              backgroundColor: darkMode ? "#2a2a2a" : "#f0f0f0",
              padding: "10px",
              borderRadius: "8px",
              marginBottom: "1.5em",
            }}
          >
            <p style={{ marginBottom: "0.5em", fontWeight: "bold" }}>
              <strong>Content:</strong>
            </p>
            {editorState && (
              <div className="editor-readonly">
                <Editor editorState={editorState} readOnly={true} />
              </div>
            )}
          </div>

          <div
            style={{
              backgroundColor: darkMode ? "#2a2a2a" : "#f0f0f0",
              padding: "10px",
              borderRadius: "8px",
            }}
          >
            <p style={{ marginBottom: "0.5em", fontWeight: "bold" }}>
              <strong>Comments:</strong>
            </p>
            <div className="comments-container">
              {comments.length > 0 ? (
                comments.map((comment: any, index: number) => (
                  <p key={index} style={{ marginBottom: "0.6em" }}>
                    <strong>{comment.username}:</strong> {comment.content}
                  </p>
                ))
              ) : (
                <p>No comments yet.</p>
              )}
            </div>
          </div>

          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment..."
            className="comment-input"
            style={{
              width: "100%",
              padding: "10px",
              marginTop: "10px",
              borderRadius: "4px",
              border: "1px solid #ccc",
              backgroundColor: darkMode ? "#2c2c2e" : "#f9f9f9",
              color: darkMode ? "#e5e5ea" : "#000000",
            }}
          />
        </div>
        <div
          className="bp4-dialog-footer"
          style={{
            padding: "10px",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <Button
            onClick={(e) => {
              e.stopPropagation();
              if (selectedJournal?.id) {
                handleLike(selectedJournal.id);
              }
            }}
            className={`like-button ${
              darkMode ? "dark-mode" : "light-mode"
            } ${userLiked[selectedJournal?.id] ? "liked" : ""}`}
          >
            Like ({likes[selectedJournal?.id] || 0})
          </Button>

          <div style={{ display: "flex", gap: "10px" }}>
            <Button
              onClick={handleCommentSubmit}
              style={{
                padding: "8px 16px",
                borderRadius: "4px",
                fontSize: "1.1em",
                backgroundColor: "#007bff",
                color: "#fff",
                transition: "background-color 0.3s ease",
              }}
              onMouseOver={(e) =>
                (e.currentTarget.style.backgroundColor = "#0056b3")
              }
              onMouseOut={(e) =>
                (e.currentTarget.style.backgroundColor = "#007bff")
              }
            >
              Submit
            </Button>
            <Button
              onClick={closeJournalModal}
              style={{
                padding: "8px 16px",
                borderRadius: "4px",
                fontSize: "1.1em",
                backgroundColor: "#555555",
                color: "#fff",
                transition: "background-color 0.3s ease",
              }}
              onMouseOver={(e) =>
                (e.currentTarget.style.backgroundColor = "#333333")
              }
              onMouseOut={(e) =>
                (e.currentTarget.style.backgroundColor = "#555555")
              }
            >
              Close
            </Button>
          </div>
        </div>
      </Dialog>
    </div>
  );
};

export default PublicJournals;
