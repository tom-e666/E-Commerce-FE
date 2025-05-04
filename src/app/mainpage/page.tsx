'use client'
import React from "react";


export default function Page() {
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