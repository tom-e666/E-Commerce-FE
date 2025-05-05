import AnimatedButton from "@/components/ui/animatedButton"
import Image from "next/image"
import Link from "next/link"

export default function page() {
    return (
        <div className="w-screen min-h-screen relative">
            <Image
                src={"/engineer.png"}
                width={1600}
                height={900}
                className="-z-10 absolute inset-0 w-full h-full object-cover"
                alt="engineer"
            />
            <div className="absolute  left-0 right-0 flex flex-row justify-center items-center gap-4 flex-wrap">
                <Link href="/admin/brand"><AnimatedButton>Brand</AnimatedButton></Link>
                <Link href="/admin/product"><AnimatedButton>Product</AnimatedButton></Link>
                <Link href="/admin/order"><AnimatedButton>Order</AnimatedButton></Link>
                <Link href="/admin/user"><AnimatedButton>User</AnimatedButton></Link>
            </div>
            <div >

            </div>
        </div>
    )
}