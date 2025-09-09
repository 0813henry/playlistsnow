const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 8080;

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('Connected to MongoDB Atlas');
})
.catch((error) => {
  console.error('Error connecting to MongoDB:', error);
  process.exit(1);
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// Import routes
const playlistRoutes = require('./routes/playlistRoutes');

// Use routes
app.use('/api', playlistRoutes);

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

// Get all songs
app.get("/api/songs", (req, res) => {
  res.json(songs);
});

// Create a new song
app.post("/api/songs", (req, res) => {
  const { title, artist } = req.body;
  if (!title || !artist) {
    return res.status(400).json({ error: "Título y artista son requeridos" });
  }
  const id =
    songs.length > 0 ? Math.max(...songs.map((song) => song.id)) + 1 : 1;
  const newSong = { id, title, artist };
  songs.push(newSong);
  res.status(201).json(newSong);
});

// Delete a song
app.delete("/api/songs/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const initialLength = songs.length;
  songs = songs.filter((song) => song.id !== id);

  if (songs.length === initialLength) {
    return res.status(404).json({ error: "Canción no encontrada" });
  }

  res.status(200).json({ message: "Canción eliminada exitosamente" });
});

// PLAYLIST ROUTES

// Get all playlists
app.get("/api/playlists", (req, res) => {
  res.json(playlists);
});

// Get a single playlist
app.get("/api/playlists/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const playlist = playlists.find((p) => p.id === id);

  if (!playlist) {
    return res.status(404).json({ error: "Playlist no encontrada" });
  }

  // Include full song details in the response
  const playlistWithSongs = {
    ...playlist,
    songs: playlist.songs
      .map((songId) => songs.find((s) => s.id === songId))
      .filter(Boolean),
  };

  res.json(playlistWithSongs);
});

// Create a new playlist
app.post("/api/playlists", (req, res) => {
  const { name, description, songs: playlistSongs = [] } = req.body;

  if (!name) {
    return res.status(400).json({ error: "El nombre es requerido" });
  }

  // Process songs - create new songs if they don't exist and get their IDs
  const songIds = [];

  playlistSongs.forEach((song) => {
    if (song.title && song.artist) {
      // Check if song already exists
      let existingSong = songs.find(
        (s) =>
          s.title.toLowerCase() === song.title.toLowerCase() &&
          s.artist.toLowerCase() === song.artist.toLowerCase()
      );

      if (!existingSong) {
        // Create new song
        const id =
          songs.length > 0 ? Math.max(...songs.map((s) => s.id)) + 1 : 1;
        existingSong = { id, title: song.title, artist: song.artist };
        songs.push(existingSong);
      }

      songIds.push(existingSong.id);
    }
  });

  const id =
    playlists.length > 0 ? Math.max(...playlists.map((p) => p.id)) + 1 : 1;
  const newPlaylist = {
    id,
    name,
    description: description || "",
    songs: songIds,
    createdAt: new Date(),
  };

  playlists.push(newPlaylist);
  res.status(201).json(newPlaylist);
});

// Update a playlist
app.put("/api/playlists/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const playlistIndex = playlists.findIndex((p) => p.id === id);

  if (playlistIndex === -1) {
    return res.status(404).json({ error: "Playlist not found" });
  }

  const { name, description, songs: songIds } = req.body;

  if (name) playlists[playlistIndex].name = name;
  if (description !== undefined)
    playlists[playlistIndex].description = description;
  if (songIds) playlists[playlistIndex].songs = songIds;

  res.json(playlists[playlistIndex]);
});

// Delete a playlist
app.delete("/api/playlists/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const initialLength = playlists.length;
  playlists = playlists.filter((p) => p.id !== id);

  if (playlists.length === initialLength) {
    return res.status(404).json({ error: "Playlist not found" });
  }

  res.status(200).json({ message: "Playlist deleted successfully" });
});

// Add song to playlist
app.post("/api/playlists/:id/songs", (req, res) => {
  const playlistId = parseInt(req.params.id);
  const { songId } = req.body;

  const playlist = playlists.find((p) => p.id === playlistId);
  if (!playlist) {
    return res.status(404).json({ error: "Playlist not found" });
  }

  const song = songs.find((s) => s.id === songId);
  if (!song) {
    return res.status(404).json({ error: "Song not found" });
  }

  if (!playlist.songs.includes(songId)) {
    playlist.songs.push(songId);
  }

  res.json(playlist);
});

// Remove song from playlist
app.delete("/api/playlists/:id/songs/:songId", (req, res) => {
  const playlistId = parseInt(req.params.id);
  const songId = parseInt(req.params.songId);

  const playlist = playlists.find((p) => p.id === playlistId);
  if (!playlist) {
    return res.status(404).json({ error: "Playlist not found" });
  }

  playlist.songs = playlist.songs.filter((id) => id !== songId);
  res.json(playlist);
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Backend is running on port ${PORT}`);
});
