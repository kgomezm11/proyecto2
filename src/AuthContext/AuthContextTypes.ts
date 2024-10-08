import { ReactNode } from 'react';

export interface AuthState {
  isAuthenticated: boolean;
}

export type AuthAction = { type: 'LOGIN' } | { type: 'LOGOUT' };

export interface AuthContextProps {
  state: AuthState;
  dispatch: React.Dispatch<AuthAction>;
  usuario: any;
  setUsuario: React.Dispatch<any>;
  token: any;
  setToken: React.Dispatch<any>;
  tokensU: any;
  setTokensU: React.Dispatch<any>;
  rol: any;
  setRol: React.Dispatch<any>;
  dpi: any;
  setDpi: React.Dispatch<any>;
}

export interface AuthProviderProps {
  children: ReactNode;
}
