'use client'
import { AgGridReact } from 'ag-grid-react';
import { useState, useEffect } from 'react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { ClientSideRowModelModule } from 'ag-grid-community';
import { ModuleRegistry } from 'ag-grid-community';
ModuleRegistry.registerModules([ClientSideRowModelModule]);
import { useBrand } from "@/hooks/useBrand";
import { useProduct } from "@/hooks/useProduct";
import { toast } from "sonner";
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
import { useForm } from "react-hook-form";
import * as z from "zod";

import { provideGlobalGridOptions } from 'ag-grid-community';
provideGlobalGridOptions({
    theme: "legacy",
});

const productFormSchema = z.object({
    name: z.string().min(2, {
        message: "Tên sản phẩm phải có ít nhất 2 ký tự.",
    }),
    price: z.coerce.number().min(0, {
        message: "Giá sản phẩm phải lớn hơn hoặc bằng 0.",
    }),
    stock: z.coerce.number().int().min(0, {
        message: "Số lượng tồn kho phải là số nguyên không âm.",
    }),
    status: z.boolean().default(true),
    brand_id: z.string().min(1, {
        message: "Vui lòng chọn thương hiệu.",
    }),
    description: z.string().min(10, {
        message: "Mô tả sản phẩm phải có ít nhất 10 ký tự.",
    }),
    images: z.array(z.string()).default([]),
    keywords: z.array(z.string()).default([]),
    specifications: z.array(
        z.object({
            name: z.string().min(1, {
                message: "Tên thông số không được để trống.",
            }),
            value: z.string().min(1, {
                message: "Giá trị thông số không được để trống.",
            })
        })
    ).default([]),
});

interface Product {
    id: string;
    name: string;
    price: number;
    stock: number;
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
}

export default function ProductManagement() {
    const [openForm, setOpenForm] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const { getProducts, products, createProduct, updateProduct, deleteProduct } = useProduct();
    const { getBrands, brands } = useBrand();
    const [forceUpdateKey, setForceUpdateKey] = useState(0);
    const [gridData, setGridData] = useState<Product[]>([]);

    const [colDefs] = useState([
        { field: "id", headerName: "ID", width: 100 },
        { field: "name", headerName: "Tên sản phẩm", flex: 1 },
        {
            field: "price",
            headerName: "Giá (VNĐ)",
            width: 150,
            valueFormatter: (params) => {
                return new Intl.NumberFormat('vi-VN').format(params.value);
            }
        },
        { field: "stock", headerName: "Tồn kho", width: 120 },
        {
            field: "status",
            headerName: "Trạng thái",
            width: 150,
            cellRenderer: (params) => {
                return params.value ?
                    'Đang bán' : 'Ngừng bán';
            }
        },
        {
            field: "brand_id",
            headerName: "Thương hiệu",
            width: 150,
            valueFormatter: (params) => {
                const brand = brands.find(b => b.id === params.value);
                return brand ? brand.name : params.value;
            }
        }
    ]);

    useEffect(() => {
        setGridData(products);
        forceUpdate();
    }, [products]);

    const forceUpdate = () => {
        setForceUpdateKey(prev => prev + 1);
    };

    useEffect(() => {
        loadProducts();
        getBrands();
    }, []);

    const loadProducts = async () => {
        try {
            await toast.promise(
                getProducts(),
                {
                    loading: "Đang tải danh sách sản phẩm...",
                    success: "Tải danh sách sản phẩm thành công",
                    error: "Không thể tải danh sách sản phẩm"
                }
            );
            forceUpdate();
        } catch (error) {
            toast.error("Không thể tải danh sách sản phẩm");
            console.error(error);
        }
    };

    const handleRowClick = (event) => {
        setSelectedProduct(event.data);
        setOpenForm(true);
    };

    const handleAddNew = () => {
        setSelectedProduct(null);
        setOpenForm(true);
    };

    const handleCloseForm = () => {
        setOpenForm(false);
        setSelectedProduct(null);
    };

    return (
        <div className="w-full min-h-screen p-8 bg-gray-50">
            <div className="flex justify-between items-center mb-6">
                <Button
                    variant="outline"
                    className="text-2xl font-bold py-6 px-6 cursor-default"
                    onClick={() => { }}
                >
                    Quản lý sản phẩm
                </Button>
                <Button onClick={handleAddNew}>Thêm sản phẩm mới</Button>
            </div>

            <div className="ag-theme-alpine w-full h-[600px] rounded-md overflow-hidden">
                <AgGridReact
                    key={`products-${forceUpdateKey}`}
                    rowData={gridData}
                    columnDefs={colDefs}
                    onRowClicked={handleRowClick}
                    pagination={true}
                    paginationAutoPageSize={true}
                    animateRows={true}
                    domLayout="autoHeight"
                />
            </div>
            <ProductFormDialog
                open={openForm}
                onClose={handleCloseForm}
                product={selectedProduct}
                onSubmit={() => { loadProducts() }}
                createProduct={createProduct}
                updateProduct={updateProduct}
                deleteProduct={deleteProduct}
                brands={brands}
            />
        </div>
    );
}

interface ProductFormProps {
    open: boolean;
    onClose: () => void;
    product: Product | null;
    onSubmit: () => void;
    createProduct: (name: string, price: number, stock: number, status: boolean, brand_id: string, details: any) => Promise<any>;
    updateProduct: (id: string, data: any) => Promise<any>;
    deleteProduct: (id: string) => Promise<any>;
    brands: { id: string; name: string }[];
}

function ProductFormDialog({
    open,
    onClose,
    product,
    onSubmit,
    createProduct,
    updateProduct,
    deleteProduct,
    brands
}: ProductFormProps) {
    const [specifications, setSpecifications] = useState<{ name: string, value: string }[]>([]);
    const [newSpecName, setNewSpecName] = useState("");
    const [newSpecValue, setNewSpecValue] = useState("");
    const [images, setImages] = useState<string[]>([]);
    const [imageUrl, setImageUrl] = useState("");
    const [keywords, setKeywords] = useState<string[]>([]);
    const [keyword, setKeyword] = useState("");

    const form = useForm<z.infer<typeof productFormSchema>>({
        resolver: zodResolver(productFormSchema),
        defaultValues: {
            name: "",
            price: 0,
            stock: 0,
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

    const addImage = () => {
        if (imageUrl && !images.includes(imageUrl)) {
            const newImages = [...images, imageUrl];
            setImages(newImages);
            form.setValue('images', newImages);
            setImageUrl("");
        }
    };

    const removeImage = (index: number) => {
        const newImages = [...images];
        newImages.splice(index, 1);
        setImages(newImages);
        form.setValue('images', newImages);
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
        // Cập nhật giá trị trong form
        form.setValue('keywords', newKeywords);
    };

    const handleSubmit = async (values: z.infer<typeof productFormSchema>) => {
        try {
            const details = {
                description: values.description,
                images: images,
                keywords: keywords,
                specifications: specifications
            };

            if (product) {
                await updateProduct(product.id, {
                    name: values.name,
                    price: values.price,
                    stock: values.stock,
                    status: values.status,
                    brand_id: values.brand_id,
                    details: details
                });
            } else {
                await createProduct(
                    values.name,
                    values.price,
                    values.stock,
                    values.status,
                    values.brand_id,
                    details
                );
            }

            onClose();
            onSubmit();
        } catch (error) {
            toast.error("Xử lí không thành công");
            console.error(error);
        }
    };
    const handleDelete = async () => {
        if (!product) return;

        try {
            await deleteProduct(product.id);
            onClose();
            onSubmit();
        } catch (error) {
            toast.error("Xóa sản phẩm thất bại");
            console.error(error);
        }
    };

    return (
        <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>
                        {product ? "Chỉnh sửa sản phẩm" : "Thêm sản phẩm mới"}
                    </DialogTitle>
                    <DialogDescription>
                        {product
                            ? "Chỉnh sửa thông tin sản phẩm hiện có."
                            : "Thêm một sản phẩm mới vào hệ thống."}
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
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
                                                {brands.map((brand) => (
                                                    <SelectItem key={brand.id} value={brand.id}>
                                                        {brand.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="price"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Giá (VNĐ)</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                placeholder="Nhập giá sản phẩm"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

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
                                <div className="flex space-x-2 mt-2">
                                    <Input
                                        placeholder="Nhập URL hình ảnh"
                                        value={imageUrl}
                                        onChange={(e) => setImageUrl(e.target.value)}
                                    />
                                    <Button type="button" onClick={addImage}>Thêm</Button>
                                </div>
                                <div className="grid grid-cols-4 gap-2 mt-2">
                                    {images.map((img, idx) => (
                                        <div key={idx} className="relative group h-24 w-full">
                                            <img
                                                src={img}
                                                alt={`Product image ${idx + 1}`}
                                                className="w-full h-full object-cover rounded-md"
                                                onError={(e) => {
                                                    e.currentTarget.src = "/laptop.png";
                                                }}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => removeImage(idx)}
                                                className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                ✕
                                            </button>
                                        </div>
                                    ))}
                                </div>
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
                                    <Button
                                        variant="destructive"
                                        type="button"
                                        onClick={handleDelete}
                                    >
                                        Xóa
                                    </Button>
                                )}
                                <Button variant="outline" type="button" onClick={onClose}>
                                    Hủy
                                </Button>
                            </div>
                            <Button type="submit">
                                {product ? "Cập nhật" : "Tạo mới"}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}