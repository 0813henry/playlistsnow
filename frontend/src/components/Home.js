import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="home">
      <h1>Bienvenido a PlaylistsNow</h1>
      <p>Crea, comparte y descubre playlists de música</p>
      <div className="action-buttons">
        <Link to="/playlists" className="button">
          Explorar Playlists
        </Link>
        <Link to="/create" className="button">
          Crear Playlist
        </Link>
      </div>
    </div>
  );
};

export default Home;
