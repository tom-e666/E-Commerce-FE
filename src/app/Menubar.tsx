'use client'
import Image from "next/image";

import { useRouter } from "next/navigation";
import Paper from '@mui/material/Paper';
import InputBase from '@mui/material/InputBase';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';

import { Button } from "@/components/ui/button";
import { useAuthContext } from "@/contexts/AuthContext";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/useAuth";
const Menubar = () => {
    const { user } = useAuthContext();
    const router = useRouter();
    const { logout } = useAuth();
    const handleLogout = async () => {
        try {
            await logout();
            setTimeout(() => {
                router.push("/login");
            }, 100);
        } catch (error) {
            console.log(error)
        }
    }
    return (
        <div className="flex flex-col w-full h-fit ">
            <div className="w-screen h-20 top-0 bg-gray-900 text-white font-semibold flex justify-center items-center gap-6">
                <Image src="/gaming.png" alt="logo" width={80} height={40} className="mr-2" onClick={() => {
                    router.push("/")
                }} />
                <Paper
                    component="form"
                    sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', width: 400, height: 37 }}
                    className="mr-3"
                >
                    <IconButton sx={{ p: '10px' }} aria-label="menu">
                        <MenuIcon />
                    </IconButton>
                    <InputBase
                        sx={{ ml: 1, flex: 1 }}
                        placeholder="Search Google Maps"
                        inputProps={{ 'aria-label': 'search google maps' }}
                    />
                    <IconButton type="button" sx={{ p: '10px' }} aria-label="search">
                        <SearchIcon />
                    </IconButton>
                </Paper>
                <div className="h-full w-20 flex justify-center items-center">
                    <Button variant={"outline"}
                        className="bg-transparent border-0"
                        onClick={() => { router.push("/hotline") }}
                    >
                        Hotline
                    </Button>
                </div>
                <div className="h-full w-20 flex justify-center items-center">
                    <Button variant={"outline"}
                        className="bg-transparent border-0"
                        onClick={() => { router.push("/showroom") }}
                    >                        Showroom
                    </Button>

                </div>
                <div className="h-full w-20 flex justify-center items-center">
                    <Button variant={"outline"}
                        className="bg-transparent border-0"
                        onClick={() => { router.push("/Order") }}
                    >                        Đơn hàng
                    </Button>
                </div>
                <div className="h-full w-20 flex justify-center items-center">
                    <Button variant={"outline"}
                        className="bg-transparent border-0"
                        onClick={() => { router.push("/cart") }}
                    >                        Giỏ hàng
                    </Button>
                </div>
                <div className="h-full w-20 flex justify-center items-center" onClick={() => { router.push("/login") }}>
                    {!user && <Button variant={"outline"}
                        className="bg-transparent border-0"
                        onClick={() => { router.push("/login") }}
                    >                        Login
                    </Button>}
                    {user && (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant={"outline"} className="bg-transparent border-0">
                                    Xin chào, {user.full_name.split(" ").pop()}
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                <DropdownMenuItem onClick={() => router.push("/profile")}>
                                    Trang cá nhân
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => router.push("/orders")}>
                                    Đơn hàng của tôi
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={handleLogout}>
                                    Đăng xuất
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    )}
                </div>
            </div>

        </div>
    );
};
export default Menubar;
