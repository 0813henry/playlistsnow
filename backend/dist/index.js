"use strict";

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }

var express = require("express");
var cors = require("cors");
var morgan = require("morgan");
require("dotenv").config();

var app = express();
var PORT = process.env.PORT || 8080;

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// In-memory data store (for MVP)
var songs = [{ id: 1, title: "Song 1", artist: "Artist 1" }, { id: 2, title: "Song 2", artist: "Artist 2" }];

var playlists = [{
  id: 1,
  name: "My First Playlist",
  description: "A collection of my favorite songs",
  songs: [1, 2],
  createdAt: new Date()
}];

// Health check
app.get("/api/health", function (req, res) {
  res.json({ status: "ok" });
});

// Get all songs
app.get("/api/songs", function (req, res) {
  res.json(songs);
});

// Create a new song
app.post("/api/songs", function (req, res) {
  var _req$body = req.body;
  var title = _req$body.title;
  var artist = _req$body.artist;

  if (!title || !artist) {
    return res.status(400).json({ error: "Título y artista son requeridos" });
  }
  var id = songs.length > 0 ? Math.max.apply(Math, _toConsumableArray(songs.map(function (song) {
    return song.id;
  }))) + 1 : 1;
  var newSong = { id: id, title: title, artist: artist };
  songs.push(newSong);
  res.status(201).json(newSong);
});

// Delete a song
app["delete"]("/api/songs/:id", function (req, res) {
  var id = parseInt(req.params.id);
  var initialLength = songs.length;
  songs = songs.filter(function (song) {
    return song.id !== id;
  });

  if (songs.length === initialLength) {
    return res.status(404).json({ error: "Canción no encontrada" });
  }

  res.status(200).json({ message: "Canción eliminada exitosamente" });
});

// PLAYLIST ROUTES

// Get all playlists
app.get("/api/playlists", function (req, res) {
  res.json(playlists);
});

// Get a single playlist
app.get("/api/playlists/:id", function (req, res) {
  var id = parseInt(req.params.id);
  var playlist = playlists.find(function (p) {
    return p.id === id;
  });

  if (!playlist) {
    return res.status(404).json({ error: "Playlist no encontrada" });
  }

  // Include full song details in the response
  var playlistWithSongs = _extends({}, playlist, {
    songs: playlist.songs.map(function (songId) {
      return songs.find(function (s) {
        return s.id === songId;
      });
    }).filter(Boolean)
  });

  res.json(playlistWithSongs);
});

// Create a new playlist
app.post("/api/playlists", function (req, res) {
  var _req$body2 = req.body;
  var name = _req$body2.name;
  var description = _req$body2.description;
  var _req$body2$songs = _req$body2.songs;
  var playlistSongs = _req$body2$songs === undefined ? [] : _req$body2$songs;

  if (!name) {
    return res.status(400).json({ error: "El nombre es requerido" });
  }

  // Process songs - create new songs if they don't exist and get their IDs
  var songIds = [];

  playlistSongs.forEach(function (song) {
    if (song.title && song.artist) {
      // Check if song already exists
      var existingSong = songs.find(function (s) {
        return s.title.toLowerCase() === song.title.toLowerCase() && s.artist.toLowerCase() === song.artist.toLowerCase();
      });

      if (!existingSong) {
        // Create new song
        var _id = songs.length > 0 ? Math.max.apply(Math, _toConsumableArray(songs.map(function (s) {
          return s.id;
        }))) + 1 : 1;
        existingSong = { id: _id, title: song.title, artist: song.artist };
        songs.push(existingSong);
      }

      songIds.push(existingSong.id);
    }
  });

  var id = playlists.length > 0 ? Math.max.apply(Math, _toConsumableArray(playlists.map(function (p) {
    return p.id;
  }))) + 1 : 1;
  var newPlaylist = {
    id: id,
    name: name,
    description: description || "",
    songs: songIds,
    createdAt: new Date()
  };

  playlists.push(newPlaylist);
  res.status(201).json(newPlaylist);
});

// Update a playlist
app.put("/api/playlists/:id", function (req, res) {
  var id = parseInt(req.params.id);
  var playlistIndex = playlists.findIndex(function (p) {
    return p.id === id;
  });

  if (playlistIndex === -1) {
    return res.status(404).json({ error: "Playlist not found" });
  }

  var _req$body3 = req.body;
  var name = _req$body3.name;
  var description = _req$body3.description;
  var songIds = _req$body3.songs;

  if (name) playlists[playlistIndex].name = name;
  if (description !== undefined) playlists[playlistIndex].description = description;
  if (songIds) playlists[playlistIndex].songs = songIds;

  res.json(playlists[playlistIndex]);
});

// Delete a playlist
app["delete"]("/api/playlists/:id", function (req, res) {
  var id = parseInt(req.params.id);
  var initialLength = playlists.length;
  playlists = playlists.filter(function (p) {
    return p.id !== id;
  });

  if (playlists.length === initialLength) {
    return res.status(404).json({ error: "Playlist not found" });
  }

  res.status(200).json({ message: "Playlist deleted successfully" });
});

// Add song to playlist
app.post("/api/playlists/:id/songs", function (req, res) {
  var playlistId = parseInt(req.params.id);
  var songId = req.body.songId;

  var playlist = playlists.find(function (p) {
    return p.id === playlistId;
  });
  if (!playlist) {
    return res.status(404).json({ error: "Playlist not found" });
  }

  var song = songs.find(function (s) {
    return s.id === songId;
  });
  if (!song) {
    return res.status(404).json({ error: "Song not found" });
  }

  if (!playlist.songs.includes(songId)) {
    playlist.songs.push(songId);
  }

  res.json(playlist);
});

// Remove song from playlist
app["delete"]("/api/playlists/:id/songs/:songId", function (req, res) {
  var playlistId = parseInt(req.params.id);
  var songId = parseInt(req.params.songId);

  var playlist = playlists.find(function (p) {
    return p.id === playlistId;
  });
  if (!playlist) {
    return res.status(404).json({ error: "Playlist not found" });
  }

  playlist.songs = playlist.songs.filter(function (id) {
    return id !== songId;
  });
  res.json(playlist);
});

app.listen(PORT, function () {
  console.log("Backend is running on port " + PORT);
});