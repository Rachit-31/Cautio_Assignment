import { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token') || '');
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        if (token) {
            fetchUser();
        } else {
            setLoading(false);
        }
    }, [token]);

    const fetchUser = async () => {
        try {
            const res = await fetch('http://localhost:3000/api/auth/me', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            const data = await res.json();
            if (res.ok) {
                setUser(data);
            } else {
                logout();
            }
        } catch (err) {
            console.error(err);
            logout();
        } finally {
            setLoading(false);
        }
    };

    const login = async (username, password) => {
        const res = await fetch('http://localhost:3000/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });
        const data = await res.json();
        if (res.ok) {
            setToken(data.token);
            localStorage.setItem('token', data.token);
            setUser(data);
            navigate('/dashboard');
            return { success: true };
        } else {
            return { success: false, message: data.message };
        }
    };

    const register = async (username, password) => {
        const res = await fetch('http://localhost:3000/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });
        const data = await res.json();
        if (res.ok) {
            setToken(data.token);
            localStorage.setItem('token', data.token);
            setUser(data);
            navigate('/dashboard');
            return { success: true };
        } else {
            return { success: false, message: data.message };
        }
    };

    const logout = () => {
        setUser(null);
        setToken('');
        localStorage.removeItem('token');
        navigate('/login');
    };

    return (
        <AuthContext.Provider value={{ user, token, login, register, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
