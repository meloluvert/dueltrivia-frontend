"use client"
import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import localStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import {IAuthContext, ILoginRequest, IRegisterRequest,IUser} from "@/types/auth";
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000",
});


const AuthContext = createContext({} as IAuthContext);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<IUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStorage();
  }, []);

  async function loadStorage() {
    try {
      const tokenStorage = await localStorage.getItem("@token-trivia");

      if (!tokenStorage) {
        setLoading(false);
        return;
      }

      setToken(tokenStorage);
      api.defaults.headers.common.Authorization = `Bearer ${tokenStorage}`;

      const { data } = await api.get("/users");

      setUser(data.user);
    } catch (e) { 

    } finally {
      setLoading(false);
    }
  }

  async function signUp(data: IRegisterRequest) {
    const response = await api.post("/users", data);

    const token = response.data.token;
    const user = response.data.user;

    await localStorage.setItem("@token-trivia", token);

    api.defaults.headers.common.Authorization = `Bearer ${token}`;
    console.log("User armazenado:", user);
    setToken(token);
    setUser(user);
  }

  async function signIn(data: ILoginRequest) {
    const response = await api.post("/users/login", data);

    const token = response.data.token;

    await localStorage.setItem("@token-trivia", token);

    api.defaults.headers.common.Authorization = `Bearer ${token}`;

    setToken(token);

    await getUser();
  }

  async function getUser() {
    const response = await api.get("/users");

    setUser(response.data.user);
  }

  async function updateUser(data: Partial<IRegisterRequest>) {
    const response = await api.put("/users", data);

    setUser(response.data);
  }

  async function sendResult(result: "win" | "lose" | "draw") {
    await api.patch("/users/result", {
      result,
    });
  }

  async function deleteUser() {
    await api.delete("/users");

    await signOut();
  }

  async function signOut() {
    await localStorage.removeItem("@token-trivia");

    delete api.defaults.headers.common.Authorization;

    setUser(null);
    setToken(null);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        authenticated: !!user,
        signIn,
        signUp,
        signOut,
        getUser,
        updateUser,
        deleteUser,
        sendResult,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

export { api };