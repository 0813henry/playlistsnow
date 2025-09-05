import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="logo">
        <Link to="/">PlaylistsNow</Link>
      </div>
      <div className="nav-links">
        <Link to="/">Inicio</Link>
        <Link to="/playlists">Playlists</Link>
        <Link to="/create">Crear Playlist</Link>
      </div>
    </nav>
  );
};

export default Navbar;
