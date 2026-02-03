import { useContext, useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import { motion, AnimatePresence } from 'framer-motion';

const GameRoom = () => {
    const { roomId } = useParams();
    const { user } = useContext(AuthContext);
    const socket = useSocket();
    const navigate = useNavigate();
    const [room, setRoom] = useState(null);
    const [inputWord, setInputWord] = useState('');
    const [msg, setMsg] = useState('');

    useEffect(() => {
        if (!socket) return;

        socket.emit('join_room', { roomId, userId: user._id, username: user.username });

        socket.on('room_update', (updatedRoom) => {
            setRoom(updatedRoom);
        });

        socket.on('error', (message) => {
            setMsg(message);
            setTimeout(() => setMsg(''), 3000);
        });

        return () => {
            socket.off('room_update');
            socket.off('error');
        };
    }, [socket, roomId, user]);

    if (!room) return <div className="text-white text-center mt-20">Loading Game Room...</div>;

    const isHost = room.host === user._id;
    const isWordMaster = room.wordMaster === user._id;
    const isMyTurn = !isWordMaster && room.gameStatus === 'guessing';
   

    const handleStartGame = () => {
        socket.emit('start_game', { roomId });
    };

    const handleSelectWord = () => {
        socket.emit('select_word', { roomId, word: inputWord });
        setInputWord('');
    };

    const handleGuess = (letter) => {
        if (isWordMaster || room.gameStatus !== 'guessing') return;
        socket.emit('guess_letter', { roomId, letter, userId: user._id });
    };

    const keyboard = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split('');

    const parts = [
        <line x1="10" y1="250" x2="150" y2="250" />,
        <line x1="80" y1="250" x2="80" y2="20" />,
        <line x1="80" y1="20" x2="200" y2="20" />,
        <line x1="200" y1="20" x2="200" y2="50" />,
        <circle cx="200" cy="80" r="30" />,
        <line x1="200" y1="110" x2="200" y2="170" />,
        <line x1="200" y1="130" x2="170" y2="160" />,
        <line x1="200" y1="130" x2="230" y2="160" />,
        <line x1="200" y1="170" x2="180" y2="220" />,
        <line x1="200" y1="170" x2="220" y2="220" />
    ];

    const renderHangman = () => {
        const scaffold = parts.slice(0, 4);
        const errors = room.wrongGuesses;
        const bodyParts = parts.slice(4, 4 + errors);

        return (
            <svg width="300" height="300" className="stroke-white stroke-4 fill-none">
                {scaffold}
                {bodyParts}
            </svg>
        );
    };

    return (
        <div className="min-h-screen bg-slate-900 text-white p-4 flex flex-col items-center">
            {/* Header */}
            <div className="w-full max-w-5xl flex justify-between items-center mb-8 bg-slate-800/50 p-4 rounded-xl backdrop-blur-md border border-slate-700">
                <div>
                    <h2 className="text-xl font-bold text-purple-400">Room: {room.roomId}</h2>
                    <p className="text-slate-400 text-sm">Players: {room.players.length}</p>
                </div>
                <div className="text-center">
                    <span className={`px-4 py-1 rounded-full text-sm font-bold ${room.gameStatus === 'waiting' ? 'bg-yellow-500/20 text-yellow-300' :
                            room.gameStatus === 'selection' ? 'bg-blue-500/20 text-blue-300' :
                                room.gameStatus === 'guessing' ? 'bg-green-500/20 text-green-300' :
                                    'bg-red-500/20 text-red-300'
                        }`}>
                        {room.gameStatus.toUpperCase()}
                    </span>
                    {msg && <p className="text-red-400 text-xs mt-1 absolute">{msg}</p>}
                </div>
                <button onClick={() => navigate('/dashboard')} className="text-slate-400 hover:text-white">Exit</button>
            </div>

            <div className="flex flex-col md:flex-row gap-8 w-full max-w-5xl">
                {/* Game Stage */}
                <div className="flex-1 bg-slate-800 p-8 rounded-2xl shadow-xl flex flex-col items-center justify-between min-h-[500px]">

                    {/* Hangman Area */}
                    <div className="flex-1 flex items-center justify-center border-b border-slate-700 w-full mb-6 pb-6">
                        {renderHangman()}
                    </div>

                    {/* Game Info Message */}
                    <div className="mb-6 text-center">
                        {room.gameStatus === 'waiting' && isHost && (
                            <button onClick={handleStartGame} className="bg-green-600 hover:bg-green-500 px-6 py-2 rounded-lg font-bold">Start Game</button>
                        )}
                        {room.gameStatus === 'waiting' && !isHost && <p>Waiting for host to start...</p>}

                        {room.gameStatus === 'selection' && isWordMaster && (
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    className="bg-slate-700 p-2 rounded text-white"
                                    placeholder="Enter secret word..."
                                    value={inputWord}
                                    onChange={e => setInputWord(e.target.value)}
                                />
                                <button onClick={handleSelectWord} className="bg-purple-600 px-4 py-2 rounded">Set Word</button>
                            </div>
                        )}
                        {room.gameStatus === 'selection' && !isWordMaster && (
                            <p className="text-xl animate-pulse text-purple-300">
                                {room.players.find(p => p.user === room.wordMaster)?.username} is choosing a word...
                            </p>
                        )}

                        {room.gameStatus === 'guessing' && (
                            <div className="text-center">
                                <p className="text-4xl tracking-[0.5em] font-mono mb-4">{room.maskedWord}</p>
                                {isWordMaster ? (
                                    <p className="text-indigo-300">You are the Word Master! Watch them fail.</p>
                                ) : (
                                    <p className="text-green-300">Guess the word!</p>
                                )}
                            </div>
                        )}

                        {room.gameStatus === 'finished' && (
                            <div className="text-center">
                                <h3 className="text-3xl font-bold mb-2">
                                    {room.winner === 'guessers' ? "🎉 Guessers Win! 🎉" : "💀 Word Master Wins! 💀"}
                                </h3>
                                <p className="text-slate-400">The word was: <span className="text-white font-bold">{room.currentWord}</span></p>
                                {isHost && <button onClick={handleStartGame} className="mt-4 bg-indigo-600 px-6 py-2 rounded">Play Again</button>}
                            </div>
                        )}
                    </div>

                    {/* Keyboard */}
                    {room.gameStatus === 'guessing' && !isWordMaster && (
                        <div className="flex flex-wrap gap-2 justify-center max-w-lg">
                            {keyboard.map(char => {
                                const isGuessed = room.guessedLetters.includes(char);
                                const isCorrect = room.currentWord.includes(char); 
                                return (
                                    <button
                                        key={char}
                                        onClick={() => handleGuess(char)}
                                        disabled={isGuessed}
                                        className={`w-10 h-10 rounded font-bold transition ${isGuessed
                                                ? 'bg-slate-700 text-slate-500 cursor-not-allowed'
                                                : 'bg-slate-600 hover:bg-purple-500 text-white shadow-md'
                                            }`}
                                    >
                                        {char}
                                    </button>
                                )
                            })}
                        </div>
                    )}
                </div>

                <div className="w-full md:w-80 bg-slate-800 p-6 rounded-2xl shadow-xl border border-slate-700 h-fit">
                    <h3 className="text-lg font-bold mb-4 text-purple-300 border-b border-slate-700 pb-2">Players</h3>
                    <ul className="space-y-3">
                        {room.players.map(p => (
                            <li key={p.user} className="flex justify-between items-center bg-slate-700/50 p-3 rounded-lg">
                                <div className="flex items-center gap-2">
                                    {p.user === room.wordMaster && <span>👑</span>}
                                    <span className={p.user === user._id ? "text-white font-bold" : "text-slate-300"}>{p.username}</span>
                                </div>
                            </li>
                        ))}
                    </ul>

                    <div className="mt-8">
                        <h3 className="text-lg font-bold mb-2 text-indigo-300">Game Log</h3>
                        <div className="bg-slate-900/50 p-4 rounded-lg h-40 overflow-y-auto text-xs text-slate-400 font-mono">
                            <p>Room created...</p>
                            {room.guessedLetters.map((l, i) => (
                                <p key={i}>Someone guessed {l}</p>
                            ))}
                           
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GameRoom;
