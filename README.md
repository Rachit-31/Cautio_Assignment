# HangOut & Hangman: Multiplayer Word Game

Welcome to **HangOut & Hangman**, a real-time multiplayer implementation of the classic Hangman game. Compete with friends, take turns being the "Word Master", and see who can guess the word before the hangman is complete!

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Stack](https://img.shields.io/badge/stack-MERN-green.svg)

## 🚀 Features

-   **Real-Time Multiplayer**: Built with Socket.io for instant game state synchronization.
-   **Game Rooms**: specialized rooms with unique IDs to invite friends.
-   **Turn-Based Gameplay**: Players rotate roles between "Word Master" (setter) and "Guessers".
-   **Word Validation**: Integration with `DictionaryAPI.dev` ensures all chosen words are valid English words.
-   **Interactive UI**: Beautiful glassmorphism design using TailwindCSS and Framer Motion.
-   **Secure Auth**: JWT-based authentication for user sessions.

## 🛠️ Tech Stack

-   **Frontend**: React (Vite), TailwindCSS, Framer Motion
-   **Backend**: Node.js, Express, Socket.io
-   **Database**: MongoDB (Mongoose)
-   **External API**: [Dictionary API](https://dictionaryapi.dev/)

## 📦 Installation & Setup

### Prerequisites
-   Node.js (v14+)
-   MongoDB (Running locally on default port `27017` or provide URI)

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/hangout-hangman.git
cd hangout-hangman
```

### 2. Backend Setup
Navigate to the server directory and install dependencies:
```bash
cd server
npm install
```

Create a `.env` file in the `server` directory:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/hangout-hangman
JWT_SECRET=your_super_secret_jwt_key
```

Start the server:
```bash
npm run dev
```
*Server runs on http://localhost:5000 by default (Socket.io also listens here).*

### 3. Frontend Setup
Open a new terminal, navigate to the client directory:
```bash
cd ../client
npm install
```

Start the React application:
```bash
npm run dev
```
*Client runs on http://localhost:5173 (Vite default).*

> **Note**: If you change the Server PORT, ensure you update the API/Socket URL in `client/src/context/AuthContext.jsx` and `client/src/context/SocketContext.jsx`.

## 🎮 How to Play

1.  **Register/Login**: Create an account to track your stats.
2.  **Lobby**:
    -   **Create Room**: Generates a unique Room Code (e.g., `AB12CD`).
    -   **Join Room**: Enter a friend's Room Code to join.
3.  **Gameplay**:
    -   **Waiting**: Host starts the game when everyone is ready.
    -   **Selection**: The "Word Master" types a secret word.
    -   **Guessing**: Guessers click letters to reveal the word.
    -   **Winning**: Guess the word before 6 wrong attempts!

## 📡 API Documentation

### Authentication

| Method | Endpoint | Description | Body |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Register new user | `{ "username": "...", "password": "..." }` |
| `POST` | `/api/auth/login` | Login user | `{ "username": "...", "password": "..." }` |
| `GET` | `/api/auth/me` | Get current user info | Headers: `Authorization: Bearer <token>` |

### Sockets (Events)

| Event Name | Direction | Payload | Description |
| :--- | :--- | :--- | :--- |
| `join_room` | Client -> Server | `{ roomId, userId, username }` | Join specific room. |
| `start_game` | Client -> Server | `{ roomId }` | Host starts the game. |
| `select_word` | Client -> Server | `{ roomId, word }` | Master submits secret word. |
| `guess_letter`| Client -> Server | `{ roomId, letter, userId }` | Player sends a guess. |
| `room_update` | Server -> Client | `Room Object` | Broadcasts full game state. |

## 🛡️ Disclaimer

This project is for educational and assessment purposes only.
-   Hangman Game Logic © 2024
-   Design inspired by modern UI trends.
