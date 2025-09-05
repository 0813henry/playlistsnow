import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const PlaylistDetail = () => {
  const [playlist, setPlaylist] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPlaylist = async () => {
      try {
        const API_URL =
          process.env.REACT_APP_API_URL || "http://localhost:8080/api";
        const res = await axios.get(`${API_URL}/playlists/${id}`);
        setPlaylist(res.data);
        setLoading(false);
      } catch (err) {
        console.error("Error al obtener detalles de playlist:", err);
        setError("Error al cargar los detalles de la playlist");
        setLoading(false);
      }
    };

    if (id && id !== "undefined") {
      fetchPlaylist();
    } else {
      setError("ID de playlist inválido");
      setLoading(false);
    }
  }, [id]);

  const handleDelete = async () => {
    if (
      window.confirm("¿Estás seguro de que quieres eliminar esta playlist?")
    ) {
      try {
        const API_URL =
          process.env.REACT_APP_API_URL || "http://localhost:8080/api";
        await axios.delete(`${API_URL}/playlists/${id}`);
        navigate("/playlists");
      } catch (err) {
        console.error("Error al eliminar playlist:", err);
        setError("Error al eliminar la playlist");
      }
    }
  };

  if (loading) return <div>Cargando...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!playlist) return <div>Playlist no encontrada</div>;

  return (
    <div className="playlist-detail">
      <h2>{playlist.name}</h2>
      <p>{playlist.description}</p>
      <h3>Canciones:</h3>
      {playlist.songs.length === 0 ? (
        <p>No hay canciones en esta playlist</p>
      ) : (
        <ul>
          {playlist.songs.map((song, index) => (
            <li key={index}>
              {song.title} - {song.artist}
            </li>
          ))}
        </ul>
      )}
      <button
        onClick={() => navigate(`/playlists/${id}/edit`)}
        className="button"
      >
        Editar
      </button>
      <button onClick={handleDelete} className="button">
        Eliminar
      </button>
    </div>
  );
};

export default PlaylistDetail;
