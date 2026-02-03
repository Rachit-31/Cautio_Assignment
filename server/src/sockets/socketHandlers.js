const Room = require('../models/Room');
const User = require('../models/User');
const axios = require('axios'); 

const isValidWord = async (word) => {
    try {
        const res = await axios.get(`https://dictionaryapi.dev/api/v2/entries/en/${word}`);
        return Array.isArray(res.data) && res.data.length > 0;
    } catch (err) {
        return false;
    }
};

module.exports = (io, socket) => {
    socket.on('join_room', async ({ roomId, userId, username }) => {
        try {
            let room = await Room.findOne({ roomId });

            
            if (!room) {
                room = await Room.create({
                    roomId,
                    host: userId,
                    players: [{ user: userId, username, socketId: socket.id }]
                });
            } else {
                // Check if user already in room
                const existingPlayer = room.players.find(p => p.user.toString() === userId);
                if (existingPlayer) {
                    existingPlayer.socketId = socket.id; // Update socket
                } else {
                    room.players.push({ user: userId, username, socketId: socket.id });
                }
                await room.save();
            }

            socket.join(roomId);
            io.to(roomId).emit('room_update', room);
        } catch (err) {
            console.error(err);
            socket.emit('error', 'Could not join room');
        }
    });

    socket.on('start_game', async ({ roomId }) => {
        try {
            const room = await Room.findOne({ roomId });
            if (!room) return;

            
            room.gameStatus = 'selection';
            room.wrongGuesses = 0;
            room.guessedLetters = [];
            room.currentWord = '';
            room.maskedWord = '';
            room.winner = null;

           
            let masterIndex = 0;
            if (room.wordMaster) {
                const currentMasterIndex = room.players.findIndex(p => p.user.toString() === room.wordMaster.toString());
                masterIndex = (currentMasterIndex + 1) % room.players.length;
            }
            room.wordMaster = room.players[masterIndex].user;

            await room.save();
            io.to(roomId).emit('room_update', room);
        } catch (err) {
            console.error(err);
        }
    });

  
    socket.on('select_word', async ({ roomId, word }) => {
        try {
            const room = await Room.findOne({ roomId });
            if (!room) return;

        
            if (!word || word.length < 3) return socket.emit('error', 'Word too short');

            const valid = await isValidWord(word);
            if (!valid) return socket.emit('error', 'Invalid word (check dictionary)');

         
            room.currentWord = word.toUpperCase();
            room.maskedWord = '_'.repeat(word.length);
            room.gameStatus = 'guessing';
            await room.save();

            io.to(roomId).emit('room_update', room);
        } catch (err) {
            console.error(err);
        }
    });


    socket.on('guess_letter', async ({ roomId, letter, userId }) => {
        try {
            const room = await Room.findOne({ roomId });
            if (!room) return;
            if (room.gameStatus !== 'guessing') return;

            const upperLetter = letter.toUpperCase();
            if (room.guessedLetters.includes(upperLetter)) return;

            room.guessedLetters.push(upperLetter);

            if (room.currentWord.includes(upperLetter)) {
                // Correct guess
                let newMasked = '';
                for (let i = 0; i < room.currentWord.length; i++) {
                    if (room.currentWord[i] === upperLetter || room.guessedLetters.includes(room.currentWord[i])) {
                        newMasked += room.currentWord[i];
                    } else {
                        newMasked += '_';
                    }
                }
                room.maskedWord = newMasked;

               
                if (!newMasked.includes('_')) {
                    room.gameStatus = 'finished';
                    room.winner = 'guessers'; 
                    
                }
            } else {
            
                room.wrongGuesses += 1;
                if (room.wrongGuesses >= room.maxWrongGuesses) {
                    room.gameStatus = 'finished';
                    room.winner = 'wordmaster';
                }
            }

            await room.save();
            io.to(roomId).emit('room_update', room);

        } catch (err) {
            console.error(err);
        }
    });

  
    socket.on('leave_room', async ({ roomId, userId }) => {
        
    });
};
