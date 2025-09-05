const express = require("express");
const router = express.Router();
const playlistController = require("../controllers/playlistController");

// GET all playlists
router.get("/", playlistController.getAllPlaylists);

// GET a single playlist
router.get("/:id", playlistController.getPlaylistById);

// CREATE a new playlist
router.post("/", playlistController.createPlaylist);

// UPDATE a playlist
router.put("/:id", playlistController.updatePlaylist);

// DELETE a playlist
router.delete("/:id", playlistController.deletePlaylist);

module.exports = router;
