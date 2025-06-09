'use client'

import { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import * as z from "zod";
import { motion } from "framer-motion";
import { Plus, X, Edit, Trash2, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import ProductImagesManager from "./ProductImagesManager";

const productFormSchema = z.object({
    name: z.string().min(1, "Tên sản phẩm là bắt buộc"),
    price: z.coerce.number().min(0, "Giá phải lớn hơn 0"),
    default_price: z.coerce.number().min(0, "Giá gốc phải lớn hơn 0"),
    stock: z.coerce.number().int().min(0, "Số lượng phải lớn hơn hoặc bằng 0"),
    weight: z.coerce.number().min(0, "Trọng lượng phải lớn hơn 0"), // Thêm weight
    status: z.boolean(),
    brand_id: z.string().min(1, "Thương hiệu là bắt buộc"),
    description: z.string(),
    images: z.array(z.string()),
    keywords: z.array(z.string()),
    specifications: z.array(
        z.object({
            name: z.string(),
            value: z.string()
        })
    )
});

type ProductFormData = z.infer<typeof productFormSchema>;

type Product = {
    id: string;
    name: string;
    price: number;
    default_price: number;
    stock: number;
    weight: number;
    status: boolean;
    brand_id: string;
    details: {
        description: string;
        images: string[];
        keywords: string[];
        specifications: {
            name: string;
            value: string;
        }[];
    };
};

interface ProductDetails {
    description: string;
    images: string[];
    keywords: string[];
    specifications: {
        name: string;
        value: string;
    }[];
}

interface ProductUpdateData {
    name: string;
    price: number;
    default_price?: number;
    stock: number;
    weight: number;
    status: boolean;
    brand_id: string;
    details: ProductDetails;
}

interface ProductFormProps {
    open: boolean;
    onClose: () => void;
    product: Product | null;
    onSubmit: (action: 'create' | 'update' | 'delete', productData: Product) => void;
    createProduct: (
        name: string,
        price: number,
        default_price: number,
        stock: number,
        status: boolean,
        brand_id: string,
        details: ProductDetails,
        weight: number
    ) => Promise<Product | { id: string }>;
    updateProduct: (id: string, data: ProductUpdateData) => Promise<Product>;
    deleteProduct: (id: string) => Promise<string>;
    brands: { id: string; name: string }[];
    brandLoading?: boolean;
    newProductID: number
}

export default function ProductFormDialog({
    open,
    onClose,
    product,
    onSubmit,
    createProduct,
    updateProduct,
    deleteProduct,
    brands,
    brandLoading,
    newProductID
}: ProductFormProps) {
    const [specifications, setSpecifications] = useState<{ name: string, value: string, __typename?: string; }[]>([]);
    const [newSpecName, setNewSpecName] = useState("");
    const [newSpecValue, setNewSpecValue] = useState("");
    const [images, setImages] = useState<string[]>([]);
    const [keywords, setKeywords] = useState<string[]>([]);
    const [keyword, setKeyword] = useState("");
    const loadingToastRef = useRef<string | number | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);

    const form = useForm<ProductFormData>({
        resolver: zodResolver(productFormSchema),
        defaultValues: {
            name: "",
            price: 0,
            stock: 0,
            default_price: 0,
            weight: 0,
            status: true,
            brand_id: "",
            description: "",
            images: [],
            keywords: [],
            specifications: [],
        },
    });

    useEffect(() => {
        if (product) {
            form.reset({
                name: product.name,
                price: product.price,
                stock: product.stock,
                default_price: product.default_price,
                weight: product.weight,
                status: product.status,
                brand_id: product.brand_id,
                description: product.details.description,
                images: product.details.images,
                keywords: product.details.keywords,
                specifications: product.details.specifications,
            });
            setSpecifications(product.details.specifications);
            setImages(product.details.images);
            setKeywords(product.details.keywords);
        } else {
            form.reset({
                name: "",
                price: 0,
                stock: 0,
                default_price: 0,
                weight: 0,
                status: true,
                brand_id: "",
                description: "",
                images: [],
                keywords: [],
                specifications: [],
            });
            setSpecifications([]);
            setImages([]);
            setKeywords([]);
        }
        console.log("ProductFormDialog useEffect - product:", product);
    }, [product, form]);

    const addSpecification = () => {
        if (newSpecName && newSpecValue) {
            const newSpec = { name: newSpecName, value: newSpecValue };
            const newSpecs = [...specifications, newSpec];
            setSpecifications(newSpecs);
            form.setValue('specifications', newSpecs);
            setNewSpecName("");
            setNewSpecValue("");
        }
    };

    const removeSpecification = (index: number) => {
        const newSpecs = [...specifications];
        newSpecs.splice(index, 1);
        setSpecifications(newSpecs);
        form.setValue('specifications', newSpecs);
    };

    const addKeyword = () => {
        if (keyword && !keywords.includes(keyword)) {
            const newKeywords = [...keywords, keyword];
            setKeywords(newKeywords);
            form.setValue('keywords', newKeywords);
            setKeyword("");
        }
    };

    const removeKeyword = (index: number) => {
        const newKeywords = [...keywords];
        newKeywords.splice(index, 1);
        setKeywords(newKeywords);
        form.setValue('keywords', newKeywords);
    };

    // Cleanup loading toast on unmount
    useEffect(() => {
        const toastId = loadingToastRef.current;
        
        return () => {
            if (toastId) {
                toast.dismiss(toastId);
            }
        };
    }, []);

    // Type the submit handler correctly
    const handleSubmit: SubmitHandler<ProductFormData> = async (values) => {
        const details = {
            description: values.description,
            images: images,
            keywords: keywords,
            specifications: specifications.map((spec) => ({
                name: spec.name,
                value: spec.value
            }))
        };

        try {
            setIsProcessing(true);
            
            if (product) {
                // Update existing product
                await toast.promise(
                    updateProduct(product.id, {
                        name: values.name,
                        price: values.price,
                        default_price: values.default_price,
                        stock: values.stock,
                        weight: values.weight,
                        status: values.status,
                        brand_id: values.brand_id,
                        details: details
                    }),
                    {
                        loading: "Đang cập nhật sản phẩm...",
                        success: "Cập nhật sản phẩm thành công",
                        error: "Cập nhật sản phẩm thất bại"
                    }
                );

                const fullUpdatedProduct: Product = {
                    ...product,
                    name: values.name,
                    price: values.price,
                    default_price: values.default_price,
                    stock: values.stock,
                    weight: values.weight,
                    status: values.status,
                    brand_id: values.brand_id,
                    details: details
                };

                onClose();
                onSubmit('update', fullUpdatedProduct);
                
            } else {
                // Create new product - KHÔNG dùng toast.promise
                try {
                    // Show loading toast
                    const loadingToastId = toast.loading("Đang tạo sản phẩm mới...");
                    
                    // Call API without toast wrapper
                    const createdProductResponse = await createProduct(
                        values.name,
                        values.price,
                        values.default_price,
                        values.stock,
                        values.status,
                        values.brand_id,
                        details,
                        values.weight
                    );

                    console.log("Created product response:", createdProductResponse);

                    // Dismiss loading toast
                    toast.dismiss(loadingToastId);

                    const newProduct: Product = {
                        id: createdProductResponse.id || newProductID.toString(),
                        name: values.name,
                        price: values.price,
                        default_price: values.default_price,
                        stock: values.stock,
                        weight: values.weight,
                        status: values.status,
                        brand_id: values.brand_id,
                        details: details
                    };

                    onClose();
                    
                    onSubmit('create', newProduct);
                    
                    toast.success("Tạo sản phẩm thành công!");

                } catch (error) {
                    console.error("Error creating product:", error);
                    toast.error("Tạo sản phẩm thất bại");
                }
            }

        } catch (error) {
            console.error("Error submitting product:", error);
        } finally {
            setIsProcessing(false);
        }
    };

    const handleDelete = async () => {
        if (!product) return;

        // Confirm deletion
        const confirmed = window.confirm("Bạn có chắc chắn muốn xóa sản phẩm này?");
        if (!confirmed) return;

        setIsProcessing(true);
        try {
            await toast.promise(
                deleteProduct(product.id),
                {
                    loading: "Đang xóa sản phẩm...",
                    success: "Xóa sản phẩm thành công",
                    error: "Xóa sản phẩm thất bại"
                }
            );
            
            onClose();
            onSubmit('delete', product);
            
        } catch (error) {
            console.error("Error deleting product:", error);
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto border border-indigo-100 bg-white shadow-xl">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold text-indigo-900 flex items-center gap-2">
                        {product ? (
                            <>
                                <Edit className="h-5 w-5 text-indigo-600" />
                                Chỉnh sửa sản phẩm
                            </>
                        ) : (
                            <>
                                <Plus className="h-5 w-5 text-indigo-600" />
                                Thêm sản phẩm mới
                            </>
                        )}
                    </DialogTitle>
                    <DialogDescription className="text-gray-500">
                        {product
                            ? "Chỉnh sửa thông tin sản phẩm hiện có."
                            : "Thêm một sản phẩm mới vào hệ thống."}
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                        <div className="grid grid-cols-3 gap-4">
                            <div className="col-span-2">
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Tên sản phẩm</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Nhập tên sản phẩm" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <FormField
                                control={form.control}
                                name="brand_id"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Thương hiệu</FormLabel>
                                        <Select
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                            value={field.value}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Chọn thương hiệu" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {brandLoading ? (
                                                    <div className="px-4 py-2 text-gray-500">Đang tải...</div>
                                                ) : (
                                                    brands.map((brand) => (
                                                        <SelectItem key={brand.id} value={brand.id}>
                                                            {brand.name}
                                                        </SelectItem>
                                                    ))
                                                )}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                            <FormField
                                control={form.control}
                                name="default_price"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Giá gốc (VNĐ)</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                placeholder="Nhập giá gốc sản phẩm"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="price"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Giá bán (VNĐ)</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                placeholder="Nhập giá bán sản phẩm"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="weight"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Trọng lượng (g)</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                step="0.01"
                                                placeholder="Nhập trọng lượng sản phẩm"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormDescription>
                                            Trọng lượng tính bằng gram (VD: 500g)
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="stock"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Số lượng tồn kho</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                placeholder="Nhập số lượng tồn kho"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="status"
                                render={({ field }) => (
                                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                                        <FormControl>
                                            <Checkbox
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                            />
                                        </FormControl>
                                        <div className="space-y-1 leading-none">
                                            <FormLabel>
                                                Đang bán
                                            </FormLabel>
                                            <FormDescription>
                                                Sản phẩm sẽ được hiển thị trên trang web nếu được đánh dấu.
                                            </FormDescription>
                                        </div>
                                    </FormItem>
                                )}
                            />
                        </div>

                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Mô tả sản phẩm</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Nhập mô tả chi tiết về sản phẩm"
                                            className="min-h-[120px]"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="space-y-4">
                            <div>
                                <FormLabel>Hình ảnh sản phẩm</FormLabel>
                                <ProductImagesManager 
                                    images={images} 
                                    setImages={setImages} 
                                    productName={form.watch("name")}
                                />
                                {form.formState.errors.images && (
                                    <p className="text-sm font-medium text-destructive mt-1">
                                        {form.formState.errors.images.message}
                                    </p>
                                )}
                            </div>

                            <div>
                                <FormLabel>Từ khóa tìm kiếm</FormLabel>
                                <div className="flex space-x-2 mt-2">
                                    <Input
                                        placeholder="Nhập từ khóa"
                                        value={keyword}
                                        onChange={(e) => setKeyword(e.target.value)}
                                    />
                                    <Button type="button" onClick={addKeyword}>Thêm</Button>
                                </div>
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {keywords.map((kw, idx) => (
                                        <div key={idx} className="bg-gray-100 px-3 py-1 rounded-full flex items-center space-x-1">
                                            <span>{kw}</span>
                                            <button
                                                type="button"
                                                onClick={() => removeKeyword(idx)}
                                                className="text-gray-500 hover:text-red-500"
                                            >
                                                ✕
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <FormLabel>Thông số kỹ thuật</FormLabel>
                                <div className="grid grid-cols-2 gap-2 mt-2">
                                    <Input
                                        placeholder="Tên thông số"
                                        value={newSpecName}
                                        onChange={(e) => setNewSpecName(e.target.value)}
                                    />
                                    <Input
                                        placeholder="Giá trị"
                                        value={newSpecValue}
                                        onChange={(e) => setNewSpecValue(e.target.value)}
                                    />
                                </div>
                                <Button type="button" onClick={addSpecification} className="mt-2">
                                    Thêm thông số
                                </Button>
                                <div className="mt-2 border rounded-md divide-y">
                                    {specifications.map((spec, idx) => (
                                        <div key={idx} className="flex justify-between items-center p-2">
                                            <div>
                                                <span className="font-medium">{spec.name}: </span>
                                                <span>{spec.value}</span>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => removeSpecification(idx)}
                                                className="text-red-500"
                                            >
                                                Xóa
                                            </button>
                                        </div>
                                    ))}
                                    {specifications.length === 0 && (
                                        <p className="p-2 text-gray-500 italic">Chưa có thông số nào</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        <DialogFooter className="flex items-center justify-between w-full pt-4">
                            <div className="flex gap-2">
                                {product && (
                                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                        <Button
                                            variant="destructive"
                                            type="button"
                                            onClick={handleDelete}
                                            disabled={isProcessing}
                                            className="flex items-center gap-1"
                                        >
                                            {isProcessing ? (
                                                <RefreshCw className="h-4 w-4 animate-spin" />
                                            ) : (
                                                <Trash2 className="h-4 w-4" />
                                            )}
                                            Xóa
                                        </Button>
                                    </motion.div>
                                )}
                                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                    <Button 
                                        variant="outline" 
                                        type="button" 
                                        onClick={onClose}
                                        className="border-gray-200"
                                    >
                                        <X className="h-4 w-4 mr-2" />
                                        Hủy
                                    </Button>
                                </motion.div>
                            </div>
                            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                <Button 
                                    type="submit" 
                                    disabled={isProcessing}
                                    className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white"
                                >
                                    {isProcessing ? (
                                        <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                                    ) : (
                                        product ? <Edit className="h-4 w-4 mr-2" /> : <Plus className="h-4 w-4 mr-2" />
                                    )}
                                    {product ? "Cập nhật" : "Tạo mới"}
                                </Button>
                            </motion.div>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}