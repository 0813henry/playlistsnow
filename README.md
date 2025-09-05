# PlaylistsNow

A simple web application for creating and managing music playlists.

## Project Structure

```
playlistsnow/
│
├── frontend/                # React application
│   ├── Dockerfile           # Frontend Docker config
│   ├── src/                 # React source code
│   ├── public/              # Static assets
│   └── package.json         # Frontend dependencies
│
├── backend/                 # Node.js + Express API
│   ├── Dockerfile           # Backend Docker config
│   ├── src/                 # Backend source code
│   └── package.json         # Backend dependencies
│
├── docker-compose.yml       # Docker Compose configuration
└── README.md                # This documentation
```

## Features

- View a list of songs in the playlist
- Add new songs to the playlist
- Delete songs from the playlist

## Requirements

- Docker
- Docker Compose

## Running the Application

### Using Docker Compose (Recommended)

To start both frontend and backend services:

```bash
docker-compose up -d
```

The application will be available at:

- Frontend: http://localhost:3000
- Backend API: http://localhost:8080/api

To stop the services:

```bash
docker-compose down
```

### Running Services Individually

#### Backend

```bash
cd backend
npm install
npm start
```

The API will be available at http://localhost:8080/api

#### Frontend

```bash
cd frontend
npm install
npm start
```

The React app will be available at http://localhost:3000

## API Endpoints

- `GET /api/health`: Health check endpoint
- `GET /api/songs`: Get all songs
- `POST /api/songs`: Create a new song
  - Request body: `{ "title": "Song Name", "artist": "Artist Name" }`
- `DELETE /api/songs/:id`: Delete a song by ID
