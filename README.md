# 🎮 HangOut & Hangman – Multiplayer Word Game

HangOut & Hangman is a real-time multiplayer implementation of the classic Hangman game.  
The project focuses on real-time synchronization, clean game-state management, and room-based multiplayer gameplay.

---

## 🧠 Key Design Choices

### Real-Time Multiplayer (Socket.io)
Hangman is a turn-based game where all players must see updates instantly.  
Socket.io was chosen to synchronize guesses in real time, broadcast game state changes efficiently, and support multiple rooms simultaneously.

### Room-Based Architecture
Each game runs inside a unique room identified by a room code.  
This enables easy friend invitations, allows multiple games to run in parallel, and keeps game state isolated per room.

### Server-Controlled Game State
The backend acts as the single source of truth.  
All guesses and word selections are validated server-side to prevent cheating, desynchronization, and unfair gameplay.

### Turn-Based Role System
Players rotate between:
- **Word Master** – selects the secret word
- **Guessers** – attempt to guess letters

This ensures balanced and replayable gameplay.

### Word Validation
Words selected by the Word Master are validated using DictionaryAPI.dev to ensure only valid English words are allowed.

### UI & UX Design
TailwindCSS is used for scalable styling, glassmorphism UI for a modern look, and Framer Motion for smooth animations and feedback.

### Authentication & Security
JWT-based authentication secures user sessions and protects game actions and socket events.

---

## 🛠️ Technologies Used

**Frontend**
- React (Vite)
- TailwindCSS
- Framer Motion
- Socket.io Client

**Backend**
- Node.js
- Express.js
- Socket.io
- MongoDB (Mongoose)
- JWT Authentication

---

## 🧪 How to Test the Game

### Prerequisites
- Node.js (v14 or later)
- MongoDB running via cloud (MongoDB Atlas)

---

## 📦 Installation & Setup

### Step 1: Clone the Repository
```bash
git clone git@github.com:Rachit-31/Cautio_Assignment.git
cd hangout-hangman
```

### Step 2: Backend Setup
```bash
cd server
npm install
npm run dev
```
### Step 3: Frontend Setup
```bash
cd client
npm install
npm run dev
```
---
## 📌 Conclusion
### HangOut & Hangman demonstrates:

- real-time multiplayer system design
- scalable room-based architecture
- secure client-server communication
- clean separation of concerns
---