import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const PlaylistsList = () => {
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPlaylists = async () => {
      try {
        const API_URL =
          process.env.REACT_APP_API_URL || "http://localhost:8080/api";
        const res = await axios.get(`${API_URL}/playlists`);
        setPlaylists(res.data);
        setLoading(false);
      } catch (err) {
        console.error("Error al obtener playlists:", err);
        setError("Error al cargar las playlists");
        setLoading(false);
      }
    };

    fetchPlaylists();
  }, []);

  if (loading) return <div>Cargando...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="playlists-list">
      <h2>Todas las Playlists</h2>
      {playlists.length === 0 ? (
        <p>No se encontraron playlists. ¡Crea una!</p>
      ) : (
        playlists.map((playlist) => (
          <div key={playlist.id} className="playlist-card">
            <h3>{playlist.name}</h3>
            <p>{playlist.description}</p>
            <Link to={`/playlists/${playlist.id}`} className="button">
              Ver Detalles
            </Link>
          </div>
        ))
      )}
    </div>
  );
};

export default PlaylistsList;
