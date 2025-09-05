import React from "react";

function SongList({ songs, onDeleteSong }) {
  if (songs.length === 0) {
    return <p>No hay canciones en la playlist aún. ¡Agrega una!</p>;
  }

  return (
    <div className="song-list">
      <h2>Playlist Actual</h2>
      {songs.map((song) => (
        <div key={song.id} className="song-item">
          <div className="song-info">
            <h3>{song.title}</h3>
            <p>Por {song.artist}</p>
          </div>
          <button className="delete-btn" onClick={() => onDeleteSong(song.id)}>
            Eliminar
          </button>
        </div>
      ))}
    </div>
  );
}

export default SongList;
