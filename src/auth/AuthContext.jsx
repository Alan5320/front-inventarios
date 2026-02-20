import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { authApi } from '../api/authApi';
import { decodeJwt, isTokenExpired } from '../utils/jwt';

const AuthContext = createContext(null);

const STORAGE_KEY = 'inventory_auth';

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { token: null, email: null, role: null };
    const saved = JSON.parse(raw);
    if (!saved.token || isTokenExpired(saved.token)) {
      localStorage.removeItem(STORAGE_KEY);
      return { token: null, email: null, role: null };
    }
    return saved;
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (auth.token) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(auth));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [auth]);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const response = await authApi.login({ email, password });
      const payload = decodeJwt(response.token);
      setAuth({ token: response.token, email: payload?.sub || email, role: payload?.role || null });
      return true;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => setAuth({ token: null, email: null, role: null });

  const value = useMemo(
    () => ({
      ...auth,
      loading,
      login,
      logout,
      isAuthenticated: Boolean(auth.token),
      hasRole: (roles) => roles.includes(auth.role)
    }),
    [auth, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used inside AuthProvider');
  return context;
}
