import { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import clsx from 'clsx'; 
import { motion } from 'framer-motion';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useContext(AuthContext);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const res = await login(username, password);
        if (!res.success) {
            setError(res.message);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 via-purple-900 to-slate-900">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="backdrop-blur-lg bg-white/10 p-8 rounded-2xl shadow-2xl w-96 border border-white/20"
            >
                <h2 className="text-3xl font-bold text-center text-white mb-6">HangOut</h2>
                {error && <div className="bg-red-500/20 text-red-200 p-2 rounded mb-4 text-center">{error}</div>}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-slate-300 mb-1">Username</label>
                        <input
                            type="text"
                            className="w-full bg-slate-800/50 border border-slate-600 rounded px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-slate-300 mb-1">Password</label>
                        <input
                            type="password"
                            className="w-full bg-slate-800/50 border border-slate-600 rounded px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <button className="w-full bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white font-bold py-2 rounded transition-all transform hover:scale-105">
                        Login
                    </button>
                </form>
                <p className="mt-4 text-center text-slate-400 text-sm">
                    Don't have an account? <Link to="/register" className="text-purple-400 hover:text-purple-300">Sign up</Link>
                </p>
            </motion.div>
        </div>
    );
};

export default Login;
