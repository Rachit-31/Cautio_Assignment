import { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import classNames from 'clsx';

const Dashboard = () => {
    const { user, logout } = useContext(AuthContext);
    const socket = useSocket();
    const navigate = useNavigate();
    const [roomIdInput, setRoomIdInput] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        if (!socket) return;

        socket.on('room_update', (room) => {
            navigate(`/room/${room.roomId}`);
        });

        socket.on('error', (msg) => {
            setError(msg);
        });

        return () => {
            socket.off('room_update');
            socket.off('error');
        };
    }, [socket, navigate]);

    const createRoom = () => {
        if (!socket) return;
        const roomId = Math.random().toString(36).substring(2, 8).toUpperCase();
        socket.emit('join_room', { roomId, userId: user._id, username: user.username });
    };

    const joinRoom = () => {
        if (!socket) return;
        if (!roomIdInput) {
            setError("Please enter a Room ID");
            return;
        }
        socket.emit('join_room', { roomId: roomIdInput.toUpperCase(), userId: user._id, username: user.username });
    };

    return (
        <div className="min-h-screen bg-slate-900 text-white p-6">
            <header className="flex justify-between items-center mb-10 border-b border-indigo-500/20 pb-4">
                <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
                    HangOut Lobby
                </h1>
                <div className="flex items-center gap-4">
                    <span className="text-indigo-200">Welcome, {user?.username}!</span>
                    <button onClick={logout} className="bg-red-500/10 hover:bg-red-500/30 text-red-200 px-4 py-2 rounded transition border border-red-500/20">
                        Logout
                    </button>
                </div>
            </header>

            {error && (
                <div className="max-w-md mx-auto mb-6 bg-red-500/20 border border-red-500/50 text-red-200 px-4 py-3 rounded-lg flex justify-between items-center">
                    <span>{error}</span>
                    <button onClick={() => setError('')} className="text-red-300 hover:text-white">&times;</button>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
               
                <div
                    onClick={createRoom}
                    className="bg-gradient-to-br from-indigo-900/40 to-slate-800/40 p-8 rounded-2xl border border-indigo-500/30 hover:border-indigo-400/60 transition cursor-pointer group shadow-lg hover:shadow-indigo-500/20"
                >
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-2xl font-bold text-indigo-300 group-hover:text-indigo-100 transition">Create Room</h3>
                        <span className="text-4xl group-hover:scale-110 transition duration-300">🎮</span>
                    </div>
                    <p className="text-slate-400 group-hover:text-slate-300">Start a new game room instantly and get a unique code to invite your friends.</p>
                </div>

              
                <div className="bg-gradient-to-br from-purple-900/40 to-slate-800/40 p-8 rounded-2xl border border-purple-500/30 shadow-lg">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-2xl font-bold text-purple-300">Join Room</h3>
                        <span className="text-4xl">🚀</span>
                    </div>
                    <p className="text-slate-400 mb-4">Enter a Room ID to jump into an existing game.</p>
                    <div className="flex gap-2">
                        <input
                            type="text"
                            placeholder="Ex. A1B2C3"
                            className="flex-1 bg-slate-800 border border-slate-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 uppercase tracking-widest placeholder:tracking-normal"
                            value={roomIdInput}
                            onChange={(e) => setRoomIdInput(e.target.value)}
                        />
                        <button
                            onClick={joinRoom}
                            className="bg-purple-600 hover:bg-purple-500 text-white font-bold py-2 px-6 rounded-lg transition"
                        >
                            Join
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
