'use client'
import Image from "next/image";
import Link from "next/link";
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
import { toast } from "sonner";
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
        <div className="flex flex-col w-full h-fit">
            <div className="w-screen h-20 top-0 bg-gray-900 text-white font-semibold flex justify-center items-center gap-6">
                <Link href="/">
                    <Image
                        src="/gaming.png"
                        alt="logo"
                        width={80}
                        height={40}
                        className="mr-2 cursor-pointer"
                    />
                </Link>

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
                        placeholder="Tìm kiếm sản phẩm"
                        inputProps={{ 'aria-label': 'search products' }}
                        onClick={() => { toast.info("Chức năng tìm kiếm chưa khả dụng") }}
                    />
                    <IconButton type="button" sx={{ p: '10px' }} aria-label="search">
                        <SearchIcon />
                    </IconButton>
                </Paper>

                <div className="h-full w-20 flex justify-center items-center">
                    <Link href="/hotline" passHref>
                        <Button variant={"outline"} className="bg-transparent border-0">
                            Hotline
                        </Button>
                    </Link>
                </div>

                <div className="h-full w-20 flex justify-center items-center">
                    <Link href="/showroom" passHref>
                        <Button variant={"outline"} className="bg-transparent border-0">
                            Showroom
                        </Button>
                    </Link>
                </div>

                <div className="h-full w-20 flex justify-center items-center">
                    <Link href="/Order" passHref>
                        <Button variant={"outline"} className="bg-transparent border-0">
                            Đơn hàng
                        </Button>
                    </Link>
                </div>

                <div className="h-full w-20 flex justify-center items-center">
                    <Link href="/cart" passHref>
                        <Button variant={"outline"} className="bg-transparent border-0">
                            Giỏ hàng
                        </Button>
                    </Link>
                </div>

                <div className="h-full w-20 flex justify-center items-center">
                    {!user ? (
                        <Link href="/login" passHref>
                            <Button variant={"outline"} className="bg-transparent border-0">
                                Đăng nhập
                            </Button>
                        </Link>
                    ) : (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant={"outline"} className="bg-transparent border-0">
                                    Xin chào, {user.full_name.split(" ").pop()}
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                <Link href="/profile" passHref style={{ textDecoration: 'none' }}>
                                    <DropdownMenuItem>
                                        Trang cá nhân
                                    </DropdownMenuItem>
                                </Link>
                                <Link href="/orders" passHref style={{ textDecoration: 'none' }}>
                                    <DropdownMenuItem>
                                        Đơn hàng của tôi
                                    </DropdownMenuItem>
                                </Link>
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