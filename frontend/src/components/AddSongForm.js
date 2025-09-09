import React, { useState } from "react";

function AddSongForm({ onAddSong }) {
  const [title, setTitle] = useState("");
  const [artist, setArtist] = useState("");
  const [formError, setFormError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!title.trim() || !artist.trim()) {
      setFormError("Por favor ingresa tanto el título como el artista");
      return;
    }

    setFormError("");
    setIsSubmitting(true);

    try {
      const success = await onAddSong({
        title: title.trim(),
        artist: artist.trim(),
      });

      if (success) {
        // Reset form after successful submission
        setTitle("");
        setArtist("");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="add-song-form">
      <h2>➕ Agregar Nueva Canción</h2>
      {formError && <div className="form-error">{formError}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">🎵 Título</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Ej: Bohemian Rhapsody"
            disabled={isSubmitting}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="artist">🎤 Artista</label>
          <input
            type="text"
            id="artist"
            value={artist}
            onChange={(e) => setArtist(e.target.value)}
            placeholder="Ej: Queen"
            disabled={isSubmitting}
            required
          />
        </div>
        <button
          type="submit"
          className="btn btn-success"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Agregando..." : "Agregar Canción"}
        </button>
      </form>
    </div>
  );
}

export default AddSongForm;
