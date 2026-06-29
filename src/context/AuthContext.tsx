import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { createUser, getUsers } from "../services/api";
import type { RegisterUserPayload, User } from "../types";

interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  isLoadingSession: boolean;
  login: (nickName: string, password: string) => Promise<void>;
  register: (payload: RegisterUserPayload) => Promise<User>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const SESSION_KEY = "antiSocialNetUser";
const FIXED_PASSWORD = "123456";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoadingSession, setIsLoadingSession] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem(SESSION_KEY);

    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        localStorage.removeItem(SESSION_KEY);
      }
    }

    setIsLoadingSession(false);
  }, []);

  const login = async (nickName: string, password: string) => {
    if (password !== FIXED_PASSWORD) {
      throw new Error("La contraseña ingresada no es válida.");
    }

    const users = await getUsers();

    const foundUser = users.find(
      (item) => item.nickName.toLowerCase() === nickName.trim().toLowerCase()
    );

    if (!foundUser) {
      throw new Error("No existe una persona usuaria con ese nickName.");
    }

    localStorage.setItem(SESSION_KEY, JSON.stringify(foundUser));
    setUser(foundUser);
  };

  const register = async (payload: RegisterUserPayload) => {
    return createUser(payload);
  };

  const logout = () => {
    localStorage.removeItem(SESSION_KEY);
    setUser(null);
  };

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      isLoadingSession,
      login,
      register,
      logout,
    }),
    [user, isLoadingSession]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth debe usarse dentro de AuthProvider.");
  }

  return context;
}