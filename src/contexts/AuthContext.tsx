'use client'
import { useContext, createContext, useState } from "react"


interface User {
    id: string,
    full_name: string
}
interface AuthContextType {
    user: User | null;
    token: string | null;
    refresh_token: string | null;
    onSuccessLogIn: (user: User, token: string, refresh_token: string) => Promise<void>;
    onSuccessLogout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [refresh_token, setRefresh_token] = useState<string | null>(null);
    const onSuccessLogIn = async (user: User, token: string, refresh_token: string) => {
        setUser(user);
        setToken(token);
        setRefresh_token(refresh_token);

    }
    const onSuccessLogout = async () => {
        setUser(null);
        setToken(null);
        setRefresh_token(null);
    }
    return <AuthContext.Provider value={{ user, token, refresh_token, onSuccessLogIn, onSuccessLogout }}>{children}</AuthContext.Provider>
}
export const useAuthContext = () => {
    const context = useContext(AuthContext);
    if (context === undefined)
        throw new Error('người dùng chưa được xác thực');
    return context;
}

