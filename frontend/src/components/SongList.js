import React from "react";

function SongList({ songs }) {
  if (songs.length === 0) {
    return (
      <div className="empty-state">
        <h2>🎵 Lista de Canciones</h2>
        <p>No hay canciones aún. ¡Agrega la primera canción!</p>
      </div>
    );
  }

  return (
    <div className="song-list">
      <h2>🎵 Lista de Canciones ({songs.length})</h2>
      <div className="songs-grid">
        {songs.map((song) => (
          <div key={song._id || song.id} className="song-card">
            <div className="song-info">
              <h3 className="song-title">{song.title}</h3>
              <p className="song-artist">🎤 {song.artist}</p>
              {song.createdAt && (
                <p className="song-date">
                  📅 {new Date(song.createdAt).toLocaleDateString()}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SongList;
