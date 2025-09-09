const Playlist = require("../models/playlistModel");
const Song = require("../models/songModel");

// Songs Controllers
// Get all songs
exports.getAllSongs = async (req, res) => {
  try {
    const songs = await Song.find().sort({ createdAt: -1 });
    res.status(200).json(songs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new song
exports.createSong = async (req, res) => {
  try {
    const { title, artist } = req.body;
    if (!title || !artist) {
      return res.status(400).json({ error: "Título y artista son requeridos" });
    }

    const song = new Song({
      title,
      artist,
    });

    const newSong = await song.save();
    res.status(201).json(newSong);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update a song
exports.updateSong = async (req, res) => {
  try {
    const { title, artist } = req.body;
    const song = await Song.findById(req.params.id);

    if (!song) {
      return res.status(404).json({ error: "Song not found" });
    }

    if (title) song.title = title;
    if (artist) song.artist = artist;

    const updatedSong = await song.save();
    res.json(updatedSong);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a song
exports.deleteSong = async (req, res) => {
  try {
    const song = await Song.findById(req.params.id);
    if (!song) {
      return res.status(404).json({ error: "Song not found" });
    }

    // Remove the song from all playlists
    await Playlist.updateMany(
      { songs: req.params.id },
      { $pull: { songs: req.params.id } }
    );

    await Song.findByIdAndDelete(req.params.id);
    res.json({ message: "Song deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Playlists Controllers
// Get all playlists
exports.getAllPlaylists = async (req, res) => {
  try {
    const playlists = await Playlist.find()
      .populate("songs")
      .sort({ createdAt: -1 });
    res.status(200).json(playlists);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single playlist
exports.getPlaylistById = async (req, res) => {
  try {
    const playlist = await Playlist.findById(req.params.id).populate("songs");
    if (!playlist) {
      return res.status(404).json({ message: "Playlist not found" });
    }
    res.status(200).json({
      ...playlist.toObject(),
      songsDetails: playlist.songs,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new playlist
exports.createPlaylist = async (req, res) => {
  try {
    const { name, description } = req.body;
    if (!name) {
      return res.status(400).json({ error: "El nombre es requerido" });
    }

    const playlist = new Playlist({
      name,
      description: description || "",
      songs: [],
    });

    const newPlaylist = await playlist.save();
    res.status(201).json(newPlaylist);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update a playlist
exports.updatePlaylist = async (req, res) => {
  try {
    const { name, description } = req.body;
    const playlist = await Playlist.findById(req.params.id);

    if (!playlist) {
      return res.status(404).json({ message: "Playlist not found" });
    }

    if (name) playlist.name = name;
    if (description !== undefined) playlist.description = description;

    const updatedPlaylist = await playlist.save();
    res.json(updatedPlaylist);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a playlist
exports.deletePlaylist = async (req, res) => {
  try {
    const playlist = await Playlist.findById(req.params.id);
    if (!playlist) {
      return res.status(404).json({ message: "Playlist not found" });
    }

    await Playlist.findByIdAndDelete(req.params.id);
    res.json({ message: "Playlist deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add song to playlist
exports.addSongToPlaylist = async (req, res) => {
  try {
    const playlist = await Playlist.findById(req.params.id);
    if (!playlist) {
      return res.status(404).json({ error: "Playlist not found" });
    }

    const song = await Song.findById(req.params.songId);
    if (!song) {
      return res.status(404).json({ error: "Song not found" });
    }

    // Don't add if already in playlist
    if (!playlist.songs.includes(req.params.songId)) {
      playlist.songs.push(req.params.songId);
      await playlist.save();
    }

    const updatedPlaylist = await Playlist.findById(req.params.id).populate(
      "songs"
    );
    res.json(updatedPlaylist);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Remove song from playlist
exports.removeSongFromPlaylist = async (req, res) => {
  try {
    const playlist = await Playlist.findById(req.params.id);
    if (!playlist) {
      return res.status(404).json({ error: "Playlist not found" });
    }

    playlist.songs = playlist.songs.filter(
      (songId) => songId.toString() !== req.params.songId
    );
    await playlist.save();

    const updatedPlaylist = await Playlist.findById(req.params.id).populate(
      "songs"
    );
    res.json(updatedPlaylist);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
