'use client'
import Image from "next/image"
import Rating from '@mui/material/Rating';
import { useEffect, useState } from "react";
import { Checkbox, FormControlLabel, Slider } from "@mui/material";

type GenericFilter = {
    [key: string]: boolean;
}
export default function Page() {
    const [manufacturer, setManufacturer] = useState<GenericFilter>({
        MSI: true,
        Lenovo: true,
        Asus: true,
        Other: true,
    }
    );
    const [type, setType] = useState<GenericFilter>({
        "gaming": true,
        "high-end": true,
        "ultrabook": true
    })
    const [priceRange, setPriceRange] = useState<number[]>([10000000, 100000000])
    const ProductList: Product[] = [...Array(20)].map(
        (_, index) => ({ ...mockProduct, product_id: index.toString() })
    )
    const [FilteredProductList, setFilteredProductList] = useState<Product[]>(ProductList);
    useEffect(() => {
        setFilteredProductList(ProductList.filter(item => {
            return manufacturer[item.name.split(' ')[0]] === true
                && type[item.type] === true
                && priceRange[0] <= item.price && item.price <= priceRange[1];
        }
        ));
    }, [manufacturer, type, priceRange]);
    return (
        <div className="w-full h-full">
            {/* Manufacturer Filter */}
            <div className="bg-gray-200 p-4 m-4 rounded flex sm:flex-col-1 md:flex-col-3 gap-4 items-center justify-center">
                <div>
                    <h3 className="font-bold mb-2">Manufacturer</h3>
                    <div className="flex flex-row space-y-1">
                        {Array.from(Object.entries(manufacturer).map(([key, value]) => (
                            <FormControlLabel
                                key={key}
                                control={
                                    <Checkbox
                                        checked={value}
                                        onChange={() => {
                                            setManufacturer((prev) => { return { ...prev, [key]: !prev[key] } })
                                        }}
                                    />
                                }
                                label={key}
                            />
                        )))}
                    </div>
                </div>
                <div>
                    <h3 className="font-bold mb-2">Type</h3>
                    <div className="flex flex-row space-y-1">
                        {Array.from(Object.entries(type).map(([key, value]) => (
                            <FormControlLabel
                                key={key}
                                control={
                                    <Checkbox
                                        checked={value}
                                        onChange={() => {
                                            setType((prev) => { return { ...prev, [key]: !prev[key] } })
                                        }}
                                    />
                                }
                                label={key}
                            />
                        )))}
                    </div>
                </div>
                <div>
                    <h3 className="font-bold mb-2">Price Range</h3>
                    <div className="flex pl-24">

                        <Slider
                            getAriaLabel={() => 'Price range'}
                            value={priceRange}
                            onChange={(
                                event: Event,
                                newValue: number | number[],
                                activeThumb: number,
                            ) => {
                                if (!Array.isArray(newValue)) {
                                    return;
                                }
                                const minDistance = 10000000;
                                if (newValue[1] - newValue[0] < minDistance) {
                                    if (activeThumb === 0) {
                                        const clamped = Math.min(newValue[0], 100 - minDistance);
                                        setPriceRange([clamped, clamped + minDistance]);
                                    } else {
                                        const clamped = Math.max(newValue[1], minDistance);
                                        setPriceRange([clamped - minDistance, clamped]);
                                    }
                                } else {
                                    setPriceRange(newValue as number[]);
                                }
                            }
                            }
                            valueLabelDisplay="on"
                            valueLabelFormat={(value) => `${(value / 1000000).toString()}tr VND `}
                            getAriaValueText={(value) => `${value.toLocaleString()} VND`}
                            min={0}
                            max={200000000}
                            step={10000000}
                            marks={[
                                { value: 0, label: '0' },
                                { value: 10000000 },
                                { value: 15000000 },
                                { value: 20000000, label: '20' },
                                { value: 30000000 },
                                { value: 50000000, label: '50' },
                                { value: 100000000, label: '100' },
                                { value: 200000000, label: '200' }
                            ]}
                            sx={{
                                width: '400px'
                            }}
                            disableSwap
                        />
                    </div>
                </div>
            </div>
            {/* Product Grid */}
            <div className="w-full h-fit grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4 p-4 content-center justify-center">
                {FilteredProductList.map(item => (<ProductItem key={item.product_id} product={item} />))}
            </div>
        </div>
    )
}
interface Product {
    product_id: string,
    img: string,
    name: string,
    rate: number,
    price: number,
    type: string,
}
const mockProduct: Product = {
    product_id: "laptop2",
    img: "data:image/avif;base64,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",
    name: "MSI gt",
    rate: 4.5, //
    price: 19000000,
    type: "gaming",
}
const ProductItem = ({ product }: { product: Product }) => {
    // Convert rate (0-10) to stars (0-5)

    return (
        <div className="w-full h-auto bg-gray-300 rounded p-4 flex flex-col items-center hover:bg-gray-500"
            onClick={() => { window.open(`/product/${product.product_id}`) }}>
            <Image src={product.img} alt={product.name} width={150} height={150} className="rounded" />
            <div className="font-serif font-bold text-lg mt-2 text-center">{product.name}</div>
            <div className="text-gray-700 text-sm mt-1">{product.price}</div>
            <Rating name="half-rating-read" defaultValue={product.rate} precision={0.5} readOnly />
        </div>
    );
};