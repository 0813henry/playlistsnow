// Cambio de prueba para disparar pipeline
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// MongoDB Atlas connection with Docker Secrets
const fs = require("fs");

const readSecret = (filePath) => {
  try {
    if (fs.existsSync(filePath)) {
      return fs.readFileSync(filePath, "utf8").trim();
    }
  } catch (error) {
    console.error(`Error reading secret from ${filePath}:`, error.message);
  }
  return null;
};

const connectDB = async () => {
  try {
    let mongoUri;

    // Try to read from Docker secrets first
    const dbUserFile = process.env.DB_USER_FILE;
    const dbPasswordFile = process.env.DB_PASSWORD_FILE;
    const dbCluster = process.env.DB_CLUSTER;
    const dbName = process.env.DB_NAME;

    if (dbUserFile && dbPasswordFile && dbCluster && dbName) {
      const username = readSecret(dbUserFile);
      const password = readSecret(dbPasswordFile);

      if (username && password) {
        mongoUri = `mongodb+srv://${username}:${password}@${dbCluster}/${dbName}?retryWrites=true&w=majority`;
        console.log("✅ Usando credenciales de Docker Secrets");
      }
    }

    // Fallback to environment variable
    if (!mongoUri && process.env.MONGODB_URI) {
      mongoUri = process.env.MONGODB_URI;
      console.log("✅ Usando MONGODB_URI de variable de entorno");
    }

    if (mongoUri) {
      await mongoose.connect(mongoUri);
      console.log("✅ Conectado a MongoDB Atlas");
    } else {
      console.log(
        "⚠️  No se encontraron credenciales de DB, usando datos en memoria"
      );
    }
  } catch (error) {
    console.error("❌ Error conectando a MongoDB:", error.message);
    console.log("⚠️  Continuando con datos en memoria");
  }
};

// Song Schema for MongoDB
const songSchema = new mongoose.Schema({
  title: { type: String, required: true },
  artist: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const Song = mongoose.model("Song", songSchema);

// In-memory data store (for fallback)
let songs = [
  { id: 1, title: "Bohemian Rhapsody", artist: "Queen" },
  { id: 2, title: "Hotel California", artist: "Eagles" },
  { id: 3, title: "Stairway to Heaven", artist: "Led Zeppelin" },
];

let playlists = [
  {
    id: 1,
    name: "Rock Classics",
    description: "The best rock songs of all time",
    songs: [1, 2, 3],
    createdAt: new Date(),
  },
];

// Health check
app.get("/api/health", (req, res) => {
  const mongoStatus =
    mongoose.connection.readyState === 1 ? "connected" : "disconnected";
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    mongodb: mongoStatus,
  });
});

// Get all songs
app.get("/api/songs", async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      // Use MongoDB
      const mongoSongs = await Song.find().sort({ createdAt: -1 });
      res.json(mongoSongs);
    } else {
      // Use in-memory data
      res.json(songs);
    }
  } catch (error) {
    console.error("Error getting songs:", error);
    res.status(500).json({ error: "Error al obtener canciones" });
  }
});

// Create a new song
app.post("/api/songs", async (req, res) => {
  const { title, artist } = req.body;

  if (!title || !artist) {
    return res.status(400).json({ error: "Título y artista son requeridos" });
  }

  try {
    if (mongoose.connection.readyState === 1) {
      // Use MongoDB
      const newSong = new Song({ title, artist });
      const savedSong = await newSong.save();
      res.status(201).json(savedSong);
    } else {
      // Use in-memory data
      const id =
        songs.length > 0 ? Math.max(...songs.map((song) => song.id)) + 1 : 1;
      const newSong = { id, title, artist };
      songs.push(newSong);
      res.status(201).json(newSong);
    }
  } catch (error) {
    console.error("Error creating song:", error);
    res.status(500).json({ error: "Error al crear canción" });
  }
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

// Start server
const startServer = async () => {
  await connectDB();

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 Servidor ejecutándose en puerto ${PORT}`);
    console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
    console.log(`🎵 API Songs: http://localhost:${PORT}/api/songs`);
  });
};

startServer().catch(console.error);
