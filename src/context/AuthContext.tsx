// src/context/AuthContext.tsx
import axiosInstance from '@/config/axios';
import React, { createContext, useState, useEffect, ReactNode } from 'react';

// Definir los tipos para el usuario y las funciones del contexto
interface User {
    username: string;
}

interface AuthContextProps {
    user: User | null;
    login: ({ username, password }: { username: string; password: string }) => Promise<void>;
    logout: () => void;
}

// Crear el contexto con un valor inicial vacío
export const AuthContext = createContext<AuthContextProps>({
    user: null,
    login: async () => {},
    logout: () => {},
});

// Definir las props para el proveedor
interface AuthProviderProps {
    children: ReactNode;
}

// Implementación del proveedor
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);

    const login = async ({ username, password }: { username: string; password: string }): Promise<void> => {
        try {
            const response = await axiosInstance.post('http://localhost:3000/auth/login', { username, password });
            const { token } = response.data;
            localStorage.setItem('token', token);
            setUser({ username });
        } catch (err) {
            console.error((err as Error).message);
            throw new Error((err as Error).message);
        }
    };

    const logout = (): void => {
        localStorage.removeItem('token');
        setUser(null);
    };

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            // Aquí podrías decodificar el token y establecer el usuario real
            setUser({ username: 'test' }); // Esto es solo un ejemplo simplificado
        }
    }, []);

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
