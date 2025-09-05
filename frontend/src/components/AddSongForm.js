import React, { useState } from "react";

function AddSongForm({ onAddSong }) {
  const [title, setTitle] = useState("");
  const [artist, setArtist] = useState("");
  const [formError, setFormError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!title.trim() || !artist.trim()) {
      setFormError("Por favor ingresa tanto el título como el artista");
      return;
    }

    setFormError("");
    const success = await onAddSong({ title, artist });

    if (success) {
      // Reset form after successful submission
      setTitle("");
      setArtist("");
    }
  };

  return (
    <div className="add-song-form">
      <h2>Agregar Nueva Canción</h2>
      {formError && <p className="form-error">{formError}</p>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Título</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Ingresa el título de la canción"
          />
        </div>
        <div className="form-group">
          <label htmlFor="artist">Artista</label>
          <input
            type="text"
            id="artist"
            value={artist}
            onChange={(e) => setArtist(e.target.value)}
            placeholder="Ingresa el nombre del artista"
          />
        </div>
        <button type="submit" className="submit-btn">
          Agregar Canción
        </button>
      </form>
    </div>
  );
}

export default AddSongForm;
