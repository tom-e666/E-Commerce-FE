'use client'
import Image from "next/image";

import { useRouter } from "next/navigation";
import Paper from '@mui/material/Paper';
import InputBase from '@mui/material/InputBase';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import FmdGoodOutlinedIcon from '@mui/icons-material/FmdGoodOutlined';
import LocalMallOutlinedIcon from '@mui/icons-material/LocalMallOutlined';


import HeadsetMicOutlinedIcon from '@mui/icons-material/HeadsetMicOutlined';interface BannerProps {
    path: string;
    redirect?: string;
}
// ✅ Correctly initialize the Map
const BannerData = new Map<string, BannerProps>([
    [
        "B001",
        {
            path: "https://file.hstatic.net/200000636033/file/logo_fd11946b31524fbe98765f34f3de0628.svg",
        },
    ],
    [
        "B002",
        {
            path: "https://example.com/banner2.svg",
        },
    ],
]);

const Menubar = () => {
    const router = useRouter();
    return (
        <div className="flex flex-col w-full h-fit ">
            <div className="w-screen h-20 top-0 bg-blue-400 text-white font-semibold flex justify-center items-center gap-6">
                <Image src={BannerData.get("B001")!.path} alt="logo" width={150} height={80} className="m-2 mr-6" />
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
                    <div className="flex">
                    <HeadsetMicOutlinedIcon/>
                    <p className="ml-1">hotline</p>
                    </div>
                    
                </div>
                <div className="h-full w-20 flex justify-center items-center">
                    <div className="flex ml-4">
                    <FmdGoodOutlinedIcon/>    
                    <p className="ml-1">showroom</p> 
                    </div>
                    
                </div>
                <div className="h-full w-20 flex justify-center items-center">
                    <div className="flex ml-6">
                    <LocalMallOutlinedIcon/>
                    <p className="ml-1">order</p> 
                    </div>
                    
                </div>
                <div className="h-full w-20 flex justify-center items-center">
                    <div className="flex ">
                    <ShoppingCartOutlinedIcon/>
                    <p className="ml-1">cart</p>
                    </div>
                    
                </div>
                <div className="h-full w-20 flex justify-center items-center" onClick={() => { router.push("/login") }}>
                    <div className="flex border-1  bg-slate-400 bg-opacity-80 rounded-md p-2 ">
                        <PersonOutlineOutlinedIcon/>
                        <p className="ml-1">login</p>
                    </div>
                    
                </div>
            </div>
            <div className="w-screen h-4 grid grid-cols-3 divide-x-2 divide-gray-400 bg-white text-center text-gray-700 text-xs">
                <div>News</div>
                <div>Technical Support</div>
                <div>Upgrade you PC</div>
            </div>
        </div>
    );
};

export default Menubar;
