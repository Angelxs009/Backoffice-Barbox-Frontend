import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../config/api.config';

export interface User {
  id_usuario: string;
  nombres: string;
  apellidos: string;
  correo: string;
  rol: string;
  tipo_usuario: string;
}

export interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Verificar token al montar
  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (token && storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch (error) {
        console.error('Error parsing stored user:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }

    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      
      // Modo desarrollo: simular login sin backend
      if (!process.env.REACT_APP_API_URL || process.env.REACT_APP_API_URL.includes('localhost')) {
        // Validar email y contraseña locales
        if (!email || !password) {
          throw new Error('Email y contraseña son requeridos');
        }
        
        // Crear usuario mock
        const mockUser: User = {
          id_usuario: '1',
          nombres: email.split('@')[0],
          apellidos: 'Usuario Demo',
          correo: email,
          rol: 'admin',
          tipo_usuario: 'administrador',
        };
        
        // Simular delay de red
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        localStorage.setItem('token', `mock-token-${Date.now()}`);
        localStorage.setItem('user', JSON.stringify(mockUser));
        setUser(mockUser);
        return;
      }
      
      // Modo producción: usar API real
      const response = await api.post<{ token: string; usuario: User }>('/auth/login', { email, password });
      
      const { token, usuario } = response.data;
      
      // Almacenar token en localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(usuario));
      
      setUser(usuario);
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  const value: AuthContextType = {
    isAuthenticated: !!user,
    user,
    loading,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de AuthProvider');
  }
  return context;
};
