'use client'
import { useContext, createContext, useState, useEffect, useRef } from "react"
import { refreshTokenAPI } from "@/services/auth/endpoints";

interface User {
    id: string,
    full_name: string
}

interface AuthContextType {
    user: User | null;
    access_token: string | null;
    refresh_token: string | null;
    loading: boolean;
    onSuccessLogIn: (user: User, token: string, refresh_token: string, expires_at: number) => Promise<void>;
    onSuccessLogout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [access_token, setAccessToken] = useState<string | null>(null);
    const [refresh_token, setRefreshToken] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true); // Thêm trạng thái loading

    const refreshPromiseRef = useRef<Promise<string> | null>(null);

    const onSuccessLogIn = async (user: User, access_token: string, refresh_token: string, expires_at: number) => {
        const next_expire = new Date().getTime() + expires_at;
        setUser(user);
        setAccessToken(access_token);
        setRefreshToken(refresh_token);

        localStorage.setItem("user", JSON.stringify(user));
        localStorage.setItem("access_token", access_token);
        localStorage.setItem("refresh_token", refresh_token);
        localStorage.setItem("expires_at", JSON.stringify(next_expire));
    }

    const onSuccessLogout = async () => {
        setUser(null);
        setAccessToken(null);
        setRefreshToken(null);

        localStorage.removeItem("user");
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        localStorage.removeItem("expires_at");
    }

    const refreshToken = async (): Promise<string> => {
        if (refreshPromiseRef.current) return refreshPromiseRef.current;

        const storedRefreshToken = localStorage.getItem("refresh_token");
        if (!storedRefreshToken) return Promise.reject("No refresh token");

        refreshPromiseRef.current = new Promise<string>(async (resolve, reject) => {
            try {
                const res = await refreshTokenAPI(storedRefreshToken);
                const { code, user, access_token, refresh_token, expires_at } = res.data;

                if (code === 200) {
                    await onSuccessLogIn(JSON.parse(user), access_token, refresh_token, expires_at);
                    console.log("Token refresh success");
                    resolve(access_token);
                } else {
                    await onSuccessLogout();
                    console.log("Token refresh failed");
                    reject("Failed to refresh token");
                }
            } catch (error) {
                await onSuccessLogout();
                console.log("Token refresh error");
                reject(error);
            } finally {
                // Reset promise cache khi hoàn thành
                refreshPromiseRef.current = null;
            }
        });

        return refreshPromiseRef.current;
    };

    // Đồng bộ giữa các tab
    useEffect(() => {
        const handleStorageChange = (e: StorageEvent) => {
            if (e.key === 'access_token' && e.newValue === null) {
                // Một tab khác đã đăng xuất
                onSuccessLogout();
            } else if (e.key === 'access_token' && e.newValue) {
                // Một tab khác đã refresh token
                const storedUser = localStorage.getItem("user");
                const storedRefreshToken = localStorage.getItem("refresh_token");
                if (storedUser && e.newValue && storedRefreshToken) {
                    setUser(JSON.parse(storedUser));
                    setAccessToken(e.newValue);
                    setRefreshToken(storedRefreshToken);
                }
            }
        };

        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

    useEffect(() => {
        const initAuth = async () => {
            setLoading(true);
            try {
                const storedAccessToken = localStorage.getItem("access_token");
                const storedUser = localStorage.getItem("user");
                const storedRefreshToken = localStorage.getItem("refresh_token");
                const storedExpires_at = localStorage.getItem("expires_at");

                if (storedAccessToken && storedUser && storedRefreshToken && storedExpires_at) {
                    const now = new Date();
                    const temp = JSON.parse(storedExpires_at);
                    const next_expire = new Date(temp);

                    if (now > next_expire) {
                        // Token đã hết hạn - cần refresh
                        try {
                            await refreshToken();
                        } catch (error) {
                            console.error("Failed to refresh token during init:", error);
                        }
                    } else {
                        // Token còn hiệu lực - set state
                        setAccessToken(storedAccessToken);
                        setUser(JSON.parse(storedUser));
                        setRefreshToken(storedRefreshToken);
                    }
                }
            } finally {
                setLoading(false);
            }
        };

        initAuth();
    }, []);

    return (
        <AuthContext.Provider
            value={{
                user,
                access_token,
                refresh_token,
                loading,
                onSuccessLogIn,
                onSuccessLogout
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export const useAuthContext = () => {
    const context = useContext(AuthContext);
    if (context === undefined)
        throw new Error('AuthContext must be used within an AuthProvider');
    return context;
}