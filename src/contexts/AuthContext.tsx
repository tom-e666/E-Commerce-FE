'use client'
import { useContext, createContext, useState, useEffect } from "react"
import { refreshTokenAPI } from "@/services/auth/endpoints";
interface User {
    id: string,
    full_name: string
}
interface AuthContextType {
    user: User | null;
    access_token: string | null;
    refresh_token: string | null;
    onSuccessLogIn: (user: User, token: string, refresh_token: string, expires_at: number) => Promise<void>;
    onSuccessLogout: () => Promise<void>;
}
const AuthContext = createContext<AuthContextType | undefined>(undefined);
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [access_token, setAcccess_token] = useState<string | null>(null);
    const [refresh_token, setRefresh_token] = useState<string | null>(null);
    // const [expires_at, setExpires_at] = useState<number | null>(null);
    const onSuccessLogIn = async (user: User, access_token: string, refresh_token: string, expires_at: number) => {
        const next_expire = new Date().getTime() + expires_at;
        setUser(user);
        setAcccess_token(access_token);
        setRefresh_token(refresh_token);
        // setExpires_at(next_expire);
        localStorage.setItem("user", JSON.stringify(user));
        localStorage.setItem("access_token", access_token);
        localStorage.setItem("refresh_token", refresh_token);
        localStorage.setItem("expires_at", JSON.stringify(next_expire));
    }
    const onSuccessLogout = async () => {
        setUser(null);
        setAcccess_token(null);
        setRefresh_token(null);
        localStorage.removeItem("user");
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        localStorage.removeItem("expires_at");
    }
    useEffect(() => {
        const storedAccessToken = localStorage.getItem("access_token");
        const storedUser = localStorage.getItem("user");
        const storedRefreshToken = localStorage.getItem("refresh_token");
        const storedExpires_at = localStorage.getItem("expires_at");
        if (storedAccessToken && storedUser && storedRefreshToken && storedExpires_at) {
            const now = new Date();
            const temp = JSON.parse(storedExpires_at);
            const next_expire = new Date(temp);
            if (now > next_expire) {
                (async () => {
                    try {
                        const res = await refreshTokenAPI(storedRefreshToken);
                        const { code, user, access_token, refresh_token, expires_at } = res.data;
                        if (code === 200) {
                            onSuccessLogIn(JSON.parse(user), access_token, refresh_token, expires_at);
                        } else {
                            await onSuccessLogout();
                        }
                    } catch {
                        await onSuccessLogout();
                    }
                }
                )();//IIFE
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

