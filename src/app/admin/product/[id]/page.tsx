'use client';

import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { getMockProducts, Product } from "@/mockData";
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { toast } from "sonner";

export default function Page() {
    const ProductId = useParams().id;
    const [product, setProduct] = useState<Product | null>(null);

    // Fetch product data based on the ProductId
    useEffect(() => {
        const searchProduct = getMockProducts().find((item) => item.id === ProductId);

        if (!searchProduct) {
            toast.error("There is an error. We can't find any product matching the given ID.");
            return;
        }

        setProduct(searchProduct);
    }, [ProductId]);

    // Handle case where product is not found
    if (!product) {
        return <div>Loading...</div>;
    }

    // Helper function to render objects recursively
    const renderObject = (obj: any) => {
        return Object.entries(obj).map(([key, value]) => {
            if (typeof value === "object" && value !== null) {
                // Render nested objects
                return (
                    <>
                        <div key={key} className="border p-2 rounded bg-gray-100 w-fit">
                            <label className="font-bold capitalize border-b-2 w-full">{key}</label>
                            {renderObject(value)}
                        </div>
                    </>
                );
            } else {
                return (
                    <div key={key} className="flex flex-col mt-2">
                        <label className="font-bold capitalize">{key}</label>
                        <input
                            className="border p-2 rounded min-w-96 w-fit overflow-y-auto"
                            placeholder={String(value)}
                            value={String(value)}
                            onChange={(e) => {
                                setProduct((prev) => {
                                    if (!prev) return product;
                                    return { ...prev, [e.target.name]: e.target.value };
                                })
                            }}
                        />
                    </div>
                );
            }
        });
    };

    // Render the page
    return (
        <div className="w-full h-full p-4">
            {/* Render product details */}
            <div className="gap-2 grid grid-col-2">
                {renderObject(product)}
            </div>

            {/* Action buttons */}
            <div className="flex flex-row gap-4 mt-6">
                <button
                    className="flex items-center gap-2 bg-gray-200 px-4 py-2 rounded hover:bg-gray-300"
                    onClick={() => window.history.back()}
                >
                    <ArrowBackIosIcon /> Return
                </button>
                <button
                    className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    onClick={() => window.location.reload()}
                >
                    <ArrowBackIosIcon /> Refresh
                </button>
            </div>
        </div>
    );
}