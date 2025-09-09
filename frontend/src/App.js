import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import "./App.css";
import Navbar from "./components/Navbar";
import SongList from "./components/SongList";
import AddSongForm from "./components/AddSongForm";

function App() {
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);

  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8080/api";

  const fetchSongs = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/songs`);
      setSongs(response.data);
      setError("");
    } catch (err) {
      setError("Error al cargar canciones. Por favor intenta de nuevo.");
      console.error("Error al obtener canciones:", err);
    } finally {
      setLoading(false);
    }
  }, [API_URL]);

  useEffect(() => {
    fetchSongs();
  }, [fetchSongs]);

  const addSong = async (song) => {
    try {
      const response = await axios.post(`${API_URL}/songs`, song);
      setSongs([response.data, ...songs]);
      setShowForm(false);
      return true;
    } catch (err) {
      setError("Error al agregar canción. Por favor intenta de nuevo.");
      console.error("Error al agregar canción:", err);
      return false;
    }
  };

  return (
    <div className="App">
      <Navbar />
      <main className="container">
        <div className="header">
          <h1>🎵 PlaylistsNow</h1>
          <p>¡Descubre y comparte tus canciones favoritas!</p>
        </div>

        {error && <div className="error-message">{error}</div>}

        <div className="actions">
          <button
            className="btn btn-primary"
            onClick={() => setShowForm(!showForm)}
          >
            {showForm ? "Cancelar" : "Agregar Canción"}
          </button>
        </div>

        {showForm && <AddSongForm onAddSong={addSong} />}

        {loading ? (
          <div className="loading">Cargando canciones...</div>
        ) : (
          <SongList songs={songs} />
        )}
      </main>
    </div>
  );
}

export default App;
