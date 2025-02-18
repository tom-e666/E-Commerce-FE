import Image from "next/image";

interface BannerProps {
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

    return (
        <div className="w-screen h-16 top-0 bg-blue-400 text-white font-bold flex justify-center items-center gap-1">

            <Image src={BannerData.get("B001")!.path} alt="logo" width={100} height={100} className="m-2"/>
            <input placeholder=" type here to search" className="text-gray-700 font-light"/>
            <div className="h-full w-20 flex justify-center items-center"> hotline</div>
            <div className="h-full w-20 flex justify-center items-center"> showroom</div>
            <div className="h-full w-20 flex justify-center items-center"> order</div>
            <div className="h-full w-20 flex justify-center items-center"> package</div>
            <div className="h-full w-20 flex justify-center items-center"> login</div>
        </div>
    );
};

export default Menubar;
