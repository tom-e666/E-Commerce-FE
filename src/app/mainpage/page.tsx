'use client'
import React, {useEffect} from "react";
import Image from "next/image";

interface BannerProps
{
    id:string,
    path:string,
    redirect?:string,
}
const mockData:BannerProps[]=[
    {id:"1",path:"https://file.hstatic.net/200000722513/file/thang_01_laptop_banner_side_web_6d0e637fae384e25959c50330a51bb0a.png",redirect:"/homepage"}
]
export default function Page(){
    const [BannerData,setBannerData]=React.useState<BannerProps[]>([]);

    useEffect(() => {
        //load banner data from the firestore for quicker response
        setBannerData(mockData)
    }, []);
    return (
        <div
            className="w-screen h-screen overflow-y-auto scroll-auto flex flex-col items-center justify-center bg-pink-400 gap-1">
            <div className="w-screen h-64 flex flex-row items-center justify-center gap-1">
                <div className="w-32 h-full bg-blue-400 ">menu</div>
                <div className="w-full h-full bg-green-400">main scrollable banner</div>
            </div>
            <div className="w-fit h-full grid grid-cols-4 py-1  gap-1 text-gray-700">
                <div className=" w-48 h-32 bg-white items-center justify-center flex">banner sample</div>
                <div className=" w-48 h-32 bg-white items-center justify-center flex">banner sample</div>
                <div className=" w-48 h-32 bg-white items-center justify-center flex">banner sample</div>
                <div className=" w-48 h-32 bg-white items-center justify-center flex">banner sample</div>
                <div className=" w-48 h-32 bg-white items-center justify-center flex">banner sample</div>
                <div className=" w-48 h-32 bg-white items-center justify-center flex">banner sample</div>

            </div>
            <div className="h-96 w-fit min-w-96 bg-white items-center justify-center flex text-gray-700 "> banner</div>
            <div className="h-96 w-fit min-w-96 bg-white items-center justify-center flex text-gray-700"> banner</div>
            <div className="h-96 w-fit min-w-96 bg-white items-center justify-center flex text-gray-700"> banner</div>
            <div className="h-96 w-fit min-w-96 bg-white items-center justify-center flex text-gray-700"> banner</div>
            <div className="h-96 w-fit min-w-96 bg-white items-center justify-center flex text-gray-700"> product list</div>

        </div>

    )

}