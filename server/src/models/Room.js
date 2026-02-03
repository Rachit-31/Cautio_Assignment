const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
    roomId: {
        type: String,
        required: true,
        unique: true
    },
    host: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    players: [{
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        username: String,
        score: { type: Number, default: 0 },
        socketId: String
    }],
    currentTurnIndex: {
        type: Number,
        default: 0
    },
    wordMaster: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    currentWord: {
        type: String,
        default: ''
    },
    maskedWord: {
        type: String,
        default: ''
    },
    guessedLetters: [{
        type: String
    }],
    wrongGuesses: {
        type: Number,
        default: 0
    },
    maxWrongGuesses: {
        type: Number,
        default: 6
    },
    gameStatus: {
        type: String, // 'waiting', 'selection', 'guessing', 'finished'
        default: 'waiting'
    },
    winner: {
        type: String,
        default: null
    }
}, { timestamps: true });

module.exports = mongoose.model('Room', roomSchema);
