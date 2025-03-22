'use client'
import { useParams } from "next/navigation"

export default function Page() {
    
    const product_id = useParams().blob;
    return (
        <div> this is the product with id: {product_id}</div>
    )
}