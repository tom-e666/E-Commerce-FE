'use client'
import React, {useEffect} from "react";
import Image from "next/image";

interface Banner
{
    id:string,
    path:string,
    redirect?:string,
}
const mockData:Banner[]=[
    {id:"1",path:"https://file.hstatic.net/200000722513/file/thang_01_laptop_banner_side_web_6d0e637fae384e25959c50330a51bb0a.png",redirect:"/homepage"}
]
export default function Page(){
    const [BannerData,setBannerData]=React.useState<Banner[]>([]);
    useEffect(() => {
        //load banner data from the firestore for quicker response
        setBannerData(mockData)
    }, []);
    return (
        <div className="w-screen scroll-auto flex flex-col items-center justify-center bg-blue-400">
            


        </div>
    )
}