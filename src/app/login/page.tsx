'use client'
import {useRouter} from "next/navigation";

const Page=()=>{
    const router=useRouter()
    return (
        <>
        <div>This is the login page</div>
            <button onClick={()=>{router.back()}}>return</button>
        </>
    )
}
export default Page;