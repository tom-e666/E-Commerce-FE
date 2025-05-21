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
import { useSearch } from "@/hooks/useSearch";
import { toast } from "sonner";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const Menubar = () => {
    const { user } = useAuthContext();
    const router = useRouter();
    const { logout } = useAuth();
    const { query, setQuery, handleSubmit } = useSearch();

    const handleLogout = async () => {
        try {
            const result = await logout();
            toast.success(result.message);
            
            // Use router.replace instead of push to prevent back navigation to protected pages
            router.replace("/login");
        } catch (error) {
            console.error("Logout error:", error);
            toast.error("Có lỗi xảy ra khi đăng xuất");
            
            // Still try to redirect even if there was an error
            router.replace("/login");
        }
    }

    // Hàm xử lý tìm kiếm
    const handleSearchSubmit = async (e?: React.FormEvent) => {
        if (e) {
            e.preventDefault();
        }

        try {
            // Thực hiện tìm kiếm và đợi kết quả
            await handleSubmit(e, false);

            // Chuyển hướng đến trang kết quả tìm kiếm
            if (query.trim()) {
                router.push(`/smartSearch?q=${encodeURIComponent(query)}`);
            }
        } catch (error) {
            console.error('Error in handleSearchSubmit:', error);
            toast.error('Có lỗi xảy ra khi tìm kiếm. Vui lòng thử lại sau.');
        }
    }

    return (
        <div className="flex flex-col w-full h-fit">
            {/* Desktop & Tablet View */}
            <div className="w-full h-20 top-0 bg-gray-900 text-white font-semibold">
                {/* Desktop Menu - Large screens */}
                <div className="hidden lg:flex justify-center items-center gap-4 h-full px-4">
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
                        onSubmit={handleSearchSubmit}
                    >
                        <IconButton sx={{ p: '10px' }} aria-label="menu">
                            <MenuIcon />
                        </IconButton>
                        <InputBase
                            sx={{ ml: 1, flex: 1 }}
                            placeholder="tìm kiếm với Gemini AI"
                            inputProps={{ 'aria-label': 'search products' }}
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    e.preventDefault();
                                    handleSearchSubmit();
                                }
                            }}
                        />
                        <IconButton
                            type="submit"
                            sx={{ p: '10px' }}
                            aria-label="search"
                        >
                            <SearchIcon />
                        </IconButton>
                    </Paper>

                    {/* Added Sản phẩm menu item */}
                    <div className="h-full w-20 flex justify-center items-center">
                        <Link href="/product" passHref>
                            <Button variant={"outline"} className="bg-transparent border-0">
                                Sản phẩm
                            </Button>
                        </Link>
                    </div>

                    {/* Add Support menu item */}
                    <div className="h-full w-20 flex justify-center items-center">
                        <Link href="/support" passHref>
                            <Button variant={"outline"} className="bg-transparent border-0">
                                Hỗ trợ
                            </Button>
                        </Link>
                    </div>

                    <div className="h-full w-20 flex justify-center items-center">
                        <Link href="/hotline" passHref>
                            <Button variant={"outline"} className="bg-transparent border-0">
                                Hotline
                            </Button>
                        </Link>
                    </div>

                    <div className="h-full w-20 flex justify-center items-center">
                        <Link href="/news" passHref>
                            <Button variant={"outline"} className="bg-transparent border-0">
                                Bản tin
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

                {/* Mobile & Tablet Menu - Medium and small screens */}
                <div className="lg:hidden flex justify-between items-center h-full px-4">
                    <div className="flex items-center">
                        <Link href="/">
                            <Image
                                src="/gaming.png"
                                alt="logo"
                                width={60}
                                height={30}
                                className="cursor-pointer"
                            />
                        </Link>
                    </div>

                    <div className="flex-1 mx-4">
                        <Paper
                            component="form"
                            sx={{ 
                                p: '2px 4px', 
                                display: 'flex', 
                                alignItems: 'center', 
                                width: '100%', 
                                height: 37 
                            }}
                            onSubmit={handleSearchSubmit}
                        >
                            <InputBase
                                sx={{ ml: 1, flex: 1 }}
                                placeholder="tìm kiếm với Gemini AI"
                                inputProps={{ 'aria-label': 'search products' }}
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        e.preventDefault();
                                        handleSearchSubmit();
                                    }
                                }}
                            />
                            <IconButton
                                type="submit"
                                sx={{ p: '10px' }}
                                aria-label="search"
                            >
                                <SearchIcon />
                            </IconButton>
                        </Paper>
                    </div>

                    <Sheet>
                        <SheetTrigger asChild>
                            <Button variant="outline" size="icon" className="bg-transparent border-0">
                                <MenuIcon />
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="right" className="bg-gray-900 text-white">
                            <div className="mt-8 flex flex-col gap-4">
                                {/* Added Sản phẩm menu item to mobile menu */}
                                <Link href="/product" passHref>
                                    <Button variant="ghost" className="w-full justify-start text-white">
                                        Sản phẩm
                                    </Button>
                                </Link>
                                
                                {/* Add Support menu item to mobile menu */}
                                <Link href="/support" passHref>
                                    <Button variant="ghost" className="w-full justify-start text-white">
                                        Hỗ trợ
                                    </Button>
                                </Link>
                                
                                <Link href="/hotline" passHref>
                                    <Button variant="ghost" className="w-full justify-start text-white">
                                        Hotline
                                    </Button>
                                </Link>
                                
                                <Link href="/news" passHref>
                                    <Button variant="ghost" className="w-full justify-start text-white">
                                        Bản tin
                                    </Button>
                                </Link>
                                
                                <Link href="/showroom" passHref>
                                    <Button variant="ghost" className="w-full justify-start text-white">
                                        Showroom
                                    </Button>
                                </Link>
                                
                                <Link href="/Order" passHref>
                                    <Button variant="ghost" className="w-full justify-start text-white">
                                        Đơn hàng
                                    </Button>
                                </Link>
                                
                                <Link href="/cart" passHref>
                                    <Button variant="ghost" className="w-full justify-start text-white">
                                        Giỏ hàng
                                    </Button>
                                </Link>
                                
                                {!user ? (
                                    <Link href="/login" passHref>
                                        <Button variant="ghost" className="w-full justify-start text-white">
                                            Đăng nhập
                                        </Button>
                                    </Link>
                                ) : (
                                    <>
                                        <div className="px-4 py-2 text-white font-medium">
                                            Xin chào, {user.full_name.split(" ").pop()}
                                        </div>
                                        <Link href="/profile" passHref>
                                            <Button variant="ghost" className="w-full justify-start text-white">
                                                Trang cá nhân
                                            </Button>
                                        </Link>
                                        <Link href="/orders" passHref>
                                            <Button variant="ghost" className="w-full justify-start text-white">
                                                Đơn hàng của tôi
                                            </Button>
                                        </Link>
                                        <Button
                                            variant="ghost"
                                            className="w-full justify-start text-white"
                                            onClick={handleLogout}
                                        >
                                            Đăng xuất
                                        </Button>
                                    </>
                                )}
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>
        </div>
    );
};

export default Menubar;