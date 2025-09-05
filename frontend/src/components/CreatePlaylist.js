import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const CreatePlaylist = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [songs, setSongs] = useState([{ title: "", artist: "" }]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const addSong = () => {
    setSongs([...songs, { title: "", artist: "" }]);
  };

  const removeSong = (index) => {
    const updatedSongs = [...songs];
    updatedSongs.splice(index, 1);
    setSongs(updatedSongs);
  };

  const handleSongChange = (index, field, value) => {
    const updatedSongs = [...songs];
    updatedSongs[index][field] = value;
    setSongs(updatedSongs);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Filter out empty songs
    const validSongs = songs.filter((song) => song.title && song.artist);

    const API_URL =
      process.env.REACT_APP_API_URL || "http://localhost:8080/api";

    try {
      await axios.post(`${API_URL}/playlists`, {
        name,
        description,
        songs: validSongs,
      });
      navigate("/playlists");
    } catch (err) {
      console.error("Error al crear playlist:", err);
      setError("Error al crear la playlist");
    }
  };

  return (
    <div className="create-playlist">
      <h2>Crear Nueva Playlist</h2>
      {error && <div className="error">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Nombre de la Playlist:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Descripción:</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <h3>Canciones:</h3>
        {songs.map((song, index) => (
          <div key={index} className="song-input">
            <input
              type="text"
              placeholder="Título"
              value={song.title}
              onChange={(e) => handleSongChange(index, "title", e.target.value)}
            />
            <input
              type="text"
              placeholder="Artista"
              value={song.artist}
              onChange={(e) =>
                handleSongChange(index, "artist", e.target.value)
              }
            />
            <button type="button" onClick={() => removeSong(index)}>
              Eliminar
            </button>
          </div>
        ))}
        <button type="button" onClick={addSong}>
          Agregar Canción
        </button>
        <button type="submit" className="button">
          Crear Playlist
        </button>
      </form>
    </div>
  );
};

export default CreatePlaylist;
