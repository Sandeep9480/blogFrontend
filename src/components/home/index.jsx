import React, { useEffect, useState } from "react";
import "./index.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../..";

const HomePage = () => {
  // State to store all notes
  const [allNotes, setAllNotes] = useState([]);
  // State to handle loading, error, and new note inputs
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [noteTitle, setNoteTitle] = useState(""); // For note title input
  const [noteBody, setNoteBody] = useState(""); // For note body input
  const [userDetails, setUserDetails] = useState(null);
  const [editingNote, setEditingNote] = useState(null); // State for editing note

  const navigate = useNavigate();
  // Fetch user details on component mount
  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/getUserDetails`, {
          params: { token: localStorage.getItem("token") },
        });
        setUserDetails(response.data);
      } catch (error) {
        setError("Failed to get User Details");
        setLoading(false);
        console.error(error);
      }
    };

    fetchUserDetails(); // Fetch user details on mount
  }, []);

  // Fetch notes on component mount
  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/get_all_note`);
        setAllNotes(response.data.allNotes); // Correct merging
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch notes");
        setLoading(false);
        console.error(err);
      }
    };

    fetchNotes(); // Fetch notes on mount
  }, []);

  // Create new note
  const createNote = async () => {
    if (!noteTitle || !noteBody) {
      setError("Please fill out both title and body");
      return;
    }

    try {
      // Create the note
      const response = await axios.post(`${BASE_URL}/create_note`, {
        token: localStorage.getItem("token"),
        title: noteTitle,
        body: noteBody,
      });

      setNoteTitle(""); // Reset note title
      setNoteBody(""); // Reset note body
      setError(""); // Clear any previous error

      // Optionally, refetch all notes to update the state
      const fetchResponse = await axios.get(`${BASE_URL}/get_all_note`);
      if (fetchResponse.data.allNotes) {
        setAllNotes(fetchResponse.data.allNotes); // Update the state with all notes
      } else {
        setError("Failed to fetch notes after creation");
      }
    } catch (err) {
      setError("Failed to create note");
      console.error(err);
    }
  };

  // Delete a note
  const deleteNote = async (noteId) => {
    try {
      await axios.delete(`${BASE_URL}/delete_note`, {
        data: {
          token: localStorage.getItem("token"),
          note_id: noteId,
        },
      });
      setAllNotes((prevNotes) =>
        prevNotes.filter((note) => note._id !== noteId)
      ); // Remove deleted note from the UI
    } catch (err) {
      setError("Failed to delete note");
      console.error(err);
    }
  };

  // Edit a note
  const editNote = (note) => {
    setEditingNote(note); // Set the note for editing
    setNoteTitle(note.title); // Populate title
    setNoteBody(note.body); // Populate body
  };

  // Save edited note
  const saveEditedNote = async () => {
    if (!noteTitle || !noteBody) {
      setError("Please fill out both title and body");
      return;
    }

    try {
      // Update the note on the server
      const response = await axios.post(`${BASE_URL}/update_note`, {
        note_id: editingNote._id,
        title: noteTitle,
        body: noteBody,
      });

      // Clear editing state and inputs
      setEditingNote(null);
      setNoteTitle("");
      setNoteBody("");
      setError(""); // Clear any previous error

      // Optionally, refetch all notes to update the state
      const fetchResponse = await axios.get(`${BASE_URL}/get_all_note`);
      if (fetchResponse.data.allNotes) {
        setAllNotes(fetchResponse.data.allNotes); // Update the state with all notes
      } else {
        setError("Failed to fetch notes after update");
      }
    } catch (err) {
      setError("Failed to update note");
      console.error(err);
    }
  };

  return (
    <>
      <div>
        <div
          onClick={() => {
            navigate("/");
          }}
          style={{
            cursor: "pointer",
            textAlign: "end",
            marginBottom: "1.2rem",
          }}
        >
          Logout
        </div>
        {/* Note creation section */}
        <div className="createNote">
          <input
            type="text"
            placeholder="Enter note title"
            value={noteTitle}
            onChange={(e) => setNoteTitle(e.target.value)} // Update title
          />
          <textarea
            placeholder="What's on your mind?"
            className="textArea"
            value={noteBody}
            onChange={(e) => setNoteBody(e.target.value)} // Update body
          ></textarea>

          <div
            className="create-btn"
            onClick={editingNote ? saveEditedNote : createNote}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 8.25H7.5a2.25 2.25 0 0 0-2.25 2.25v9a2.25 2.25 0 0 0 2.25 2.25h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25H15m0-3-3-3m0 0-3 3m3-3V15"
              />
            </svg>
          </div>
        </div>

        {/* Notes display section */}
        <div className="container">
          {loading && <p className="loading">Loading...</p>}
          {error && <p className="error">{error}</p>}

          {!loading && !error && (
            <div>
              {allNotes.length === 0 ? (
                <p className="no-notes">No notes available.</p>
              ) : (
                <ul>
                  {allNotes
                    .slice()
                    .reverse()
                    .map(
                      (
                        note // Reverse the notes
                      ) => (
                        <li key={note._id}>
                          {userDetails?.user._id === note.userId?._id && (
                            <div className="operations">
                              {/* Delete icon */}
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={1.5}
                                stroke="currentColor"
                                className="size-6"
                                onClick={() => deleteNote(note._id)}
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                                />
                              </svg>
                              {/* Edit icon */}
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={1.5}
                                stroke="currentColor"
                                className="size-6"
                                onClick={() => editNote(note)}
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                                />
                              </svg>
                            </div>
                          )}
                          <h3>{note.title}</h3>
                          <p>{note.body}</p>
                          <div className="writer">
                            <p>Created By: @{note.userId?.username}</p>
                          </div>
                        </li>
                      )
                    )}
                </ul>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default HomePage;
