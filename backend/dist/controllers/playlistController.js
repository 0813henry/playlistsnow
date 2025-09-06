"use strict";

var _this = this;

var Playlist = require("../models/playlistModel");

// Get all playlists
exports.getAllPlaylists = function callee$0$0(req, res) {
  var playlists;
  return regeneratorRuntime.async(function callee$0$0$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        context$1$0.prev = 0;
        context$1$0.next = 3;
        return regeneratorRuntime.awrap(Playlist.find());

      case 3:
        playlists = context$1$0.sent;

        res.status(200).json(playlists);
        context$1$0.next = 10;
        break;

      case 7:
        context$1$0.prev = 7;
        context$1$0.t0 = context$1$0["catch"](0);

        res.status(500).json({ message: context$1$0.t0.message });

      case 10:
      case "end":
        return context$1$0.stop();
    }
  }, null, _this, [[0, 7]]);
};

// Get a single playlist
exports.getPlaylistById = function callee$0$0(req, res) {
  var playlist;
  return regeneratorRuntime.async(function callee$0$0$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        context$1$0.prev = 0;
        context$1$0.next = 3;
        return regeneratorRuntime.awrap(Playlist.findById(req.params.id));

      case 3:
        playlist = context$1$0.sent;

        if (playlist) {
          context$1$0.next = 6;
          break;
        }

        return context$1$0.abrupt("return", res.status(404).json({ message: "Playlist not found" }));

      case 6:
        res.status(200).json(playlist);
        context$1$0.next = 12;
        break;

      case 9:
        context$1$0.prev = 9;
        context$1$0.t0 = context$1$0["catch"](0);

        res.status(500).json({ message: context$1$0.t0.message });

      case 12:
      case "end":
        return context$1$0.stop();
    }
  }, null, _this, [[0, 9]]);
};

// Create a new playlist
exports.createPlaylist = function callee$0$0(req, res) {
  var playlist, newPlaylist;
  return regeneratorRuntime.async(function callee$0$0$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        context$1$0.prev = 0;
        playlist = new Playlist({
          name: req.body.name,
          description: req.body.description,
          songs: req.body.songs || []
        });
        context$1$0.next = 4;
        return regeneratorRuntime.awrap(playlist.save());

      case 4:
        newPlaylist = context$1$0.sent;

        res.status(201).json(newPlaylist);
        context$1$0.next = 11;
        break;

      case 8:
        context$1$0.prev = 8;
        context$1$0.t0 = context$1$0["catch"](0);

        res.status(400).json({ message: context$1$0.t0.message });

      case 11:
      case "end":
        return context$1$0.stop();
    }
  }, null, _this, [[0, 8]]);
};

// Update a playlist
exports.updatePlaylist = function callee$0$0(req, res) {
  var playlist, updatedPlaylist;
  return regeneratorRuntime.async(function callee$0$0$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        context$1$0.prev = 0;
        context$1$0.next = 3;
        return regeneratorRuntime.awrap(Playlist.findById(req.params.id));

      case 3:
        playlist = context$1$0.sent;

        if (playlist) {
          context$1$0.next = 6;
          break;
        }

        return context$1$0.abrupt("return", res.status(404).json({ message: "Playlist not found" }));

      case 6:

        if (req.body.name) playlist.name = req.body.name;
        if (req.body.description) playlist.description = req.body.description;
        if (req.body.songs) playlist.songs = req.body.songs;

        context$1$0.next = 11;
        return regeneratorRuntime.awrap(playlist.save());

      case 11:
        updatedPlaylist = context$1$0.sent;

        res.status(200).json(updatedPlaylist);
        context$1$0.next = 18;
        break;

      case 15:
        context$1$0.prev = 15;
        context$1$0.t0 = context$1$0["catch"](0);

        res.status(400).json({ message: context$1$0.t0.message });

      case 18:
      case "end":
        return context$1$0.stop();
    }
  }, null, _this, [[0, 15]]);
};

// Delete a playlist
exports.deletePlaylist = function callee$0$0(req, res) {
  var playlist;
  return regeneratorRuntime.async(function callee$0$0$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        context$1$0.prev = 0;
        context$1$0.next = 3;
        return regeneratorRuntime.awrap(Playlist.findById(req.params.id));

      case 3:
        playlist = context$1$0.sent;

        if (playlist) {
          context$1$0.next = 6;
          break;
        }

        return context$1$0.abrupt("return", res.status(404).json({ message: "Playlist not found" }));

      case 6:
        context$1$0.next = 8;
        return regeneratorRuntime.awrap(Playlist.findByIdAndDelete(req.params.id));

      case 8:
        res.status(200).json({ message: "Playlist deleted successfully" });
        context$1$0.next = 14;
        break;

      case 11:
        context$1$0.prev = 11;
        context$1$0.t0 = context$1$0["catch"](0);

        res.status(500).json({ message: context$1$0.t0.message });

      case 14:
      case "end":
        return context$1$0.stop();
    }
  }, null, _this, [[0, 11]]);
};