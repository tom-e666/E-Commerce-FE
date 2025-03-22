'use client';

import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { getMockProducts, Product, setMockProduct } from "@/mockData";
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { toast } from "sonner";

export default function Page() {
    const ProductId = useParams().id;
    const [product, setProduct] = useState<Product | null>(null);
    const [visibility, setVisibility] = useState<{ [key: string]: boolean }>({}); // State to track visibility of fields

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

    // Toggle visibility of a field
    const toggleVisibility = (key: string) => {
        setVisibility((prev) => ({
            ...prev,
            [key]: !prev[key], // Toggle the visibility of the specific field
        }));
    };
    const handleInputChange = (key: string, value: any) => {
        setProduct((prev) => {
            if (!prev) return prev;

            const updatedProduct = { ...prev };

            const keys = key.split('.');
            let current = updatedProduct;

            for (let i = 0; i < keys.length - 1; i++) {
                const part = keys[i];
                if (!(part in current)) (current as Record<string, any>)[part] = {}; // Ensure the path exists
                current = (current as Record<string, any>)[part];
            }

            (current as Record<string, any>)[keys[keys.length - 1]] = value;

            return updatedProduct;
        });
    };
    // Helper function to render objects recursively
    const renderObject = (obj: any, parentKey = '') => {
        return Object.entries(obj).map(([key, value]) => {
            const fullKey = parentKey ? `${parentKey}.${key}` : key; // Create a unique key for nested fields
            if (typeof value === "object" && value !== null) {
                // Render nested objects
                return (
                    <div key={fullKey} className="flex flex-col mt-4">
                        <label
                            className="font-bold capitalize cursor-pointer"
                            onClick={() => toggleVisibility(fullKey)}
                        >
                            {key}
                        </label>
                        {visibility[fullKey] && (
                            <div className="border p-2 rounded bg-gray-100">
                                {renderObject(value, fullKey)}
                            </div>
                        )}
                    </div>
                );
            } else {
                // Render primitive values with editable inputs
                return (
                    <div key={fullKey} className="flex flex-col mt-4">
                        <label className="font-bold capitalize">{key}</label>
                        <input
                            className="border p-2 rounded"
                            value={String(value)}
                            onChange={(e) => handleInputChange(fullKey, e.target.value)}
                        />
                    </div>
                );
            }
        });
    };

    // Render the page
    return (
        <div className="w-full h-full p-4">
            <h2 className="text-xl font-bold mb-4">Product Details</h2>
            <div className="flex flex-col gap-4">
                {renderObject(product)}
            </div>

            {/* Action Buttons */}
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
                    Refresh
                </button>
                <button
                    className="flex items-center gap-2 bg-gray-200 px-4 py-2 rounded hover:bg-gray-300"
                    onClick={() => {
                        const message = setMockProduct(product);
                        console.log(product);
                        toast.success(message);
                    }}
                >
                    <ArrowBackIosIcon /> Save
                </button>
            </div>
        </div>
    );
}