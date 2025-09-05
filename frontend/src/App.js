import React, { useState, useEffect, useCallback } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import axios from "axios";
import "./App.css";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import PlaylistsList from "./components/PlaylistsList";
import PlaylistDetail from "./components/PlaylistDetail";
import CreatePlaylist from "./components/CreatePlaylist";
import SongList from "./components/SongList";
import AddSongForm from "./components/AddSongForm";

function App() {
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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
      setSongs([...songs, response.data]);
      return true;
    } catch (err) {
      setError("Error al agregar canción. Por favor intenta de nuevo.");
      console.error("Error al agregar canción:", err);
      return false;
    }
  };

  const deleteSong = async (id) => {
    try {
      await axios.delete(`${API_URL}/songs/${id}`);
      setSongs(songs.filter((song) => song.id !== id));
    } catch (err) {
      setError("Error al eliminar canción. Por favor intenta de nuevo.");
      console.error("Error al eliminar canción:", err);
    }
  };

  return (
    <Router>
      <div className="App">
        <Navbar />
        <main className="container">
          <div className="header">
            <h1>PlaylistsNow</h1>
            <p>¡Agrega tus canciones favoritas a la playlist!</p>
          </div>

          {error && <div className="error-message">{error}</div>}

          <AddSongForm onAddSong={addSong} />

          {loading ? (
            <p>Cargando canciones...</p>
          ) : (
            <SongList songs={songs} onDeleteSong={deleteSong} />
          )}

          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/playlists" element={<PlaylistsList />} />
            <Route path="/playlists/:id" element={<PlaylistDetail />} />
            <Route path="/create" element={<CreatePlaylist />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
