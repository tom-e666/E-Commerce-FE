'use client'
import { useContext, createContext, useState, useEffect } from "react"
import { refreshToken } from "@/services/auth/mutation";
interface User {
    id: string,
    full_name: string
}
interface AuthContextType {
    user: User | null;
    access_token: string | null;
    refresh_token: string | null;
    onSuccessLogIn: (user: User, token: string, refresh_token: string) => Promise<void>;
    onSuccessLogout: () => Promise<void>;
}
const AuthContext = createContext<AuthContextType | undefined>(undefined);
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [access_token, setAcccess_token] = useState<string | null>(null);
    const [refresh_token, setRefresh_token] = useState<string | null>(null);
    const onSuccessLogIn = async (user: User, access_token: string, refresh_token: string) => {
        setUser(user);
        setAcccess_token(access_token);
        setRefresh_token(refresh_token);
        localStorage.setItem("user", JSON.stringify(user));
        localStorage.setItem("access_token", access_token);
        localStorage.setItem("refresh_token", refresh_token);
    }
    const onSuccessLogout = async () => {
        setUser(null);
        setAcccess_token(null);
        setRefresh_token(null);
        localStorage.removeItem("user");
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
    }
    useEffect(() => {
        const storedAccessToken = localStorage.getItem("access_token");
        const storedUser = localStorage.getItem("user");
        const storedRefreshToken = localStorage.getItem("refresh_token");
        if (storedAccessToken && storedUser && storedRefreshToken) {
            const now = new Date().getTime();
            const expiration = now + 3600;
            if (now > expiration) {
                try {
                    refreshToken(storedRefreshToken).then(((res) => {
                        const data = res.data;
                        onSuccessLogIn(JSON.parse(data.user), data.access_token, data.refresh_token)
                    }))
                } catch {
                    onSuccessLogout();
                }
            }
        } else {
            setAcccess_token(storedAccessToken);
            setUser(JSON.parse(storedUser!));
            setRefresh_token(storedRefreshToken);
        }

    }, [])
    return <AuthContext.Provider value={{ user, access_token, refresh_token, onSuccessLogIn, onSuccessLogout }}>{children}</AuthContext.Provider>
}
export const useAuthContext = () => {
    const context = useContext(AuthContext);
    if (context === undefined)
        throw new Error('người dùng chưa được xác thực');
    return context;
}

