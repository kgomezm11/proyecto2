import React, { createContext, useReducer, useContext, useState } from 'react';
import { AuthState, AuthAction, AuthContextProps, AuthProviderProps } from './AuthContextTypes';

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'LOGIN':
      return { isAuthenticated: true };
    case 'LOGOUT':
      return { isAuthenticated: false };
    default:
      return state;
  }
}

const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, { isAuthenticated: false });
  const [usuario, setUsuario] = useState({});
  const [token, setToken] = useState({});
  const [rol, setRol] = useState({});
  const [dpi, setDpi] = useState({});
  const [tokensU, setTokensU] = useState({});

  return (
    <AuthContext.Provider value={{ state, dispatch, usuario, setUsuario, token, setToken, rol, setRol, dpi, setDpi, tokensU, setTokensU }}>
      {children}
    </AuthContext.Provider>
  );
}

const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider');
  }
  return context;
}

export { AuthProvider, useAuth };
