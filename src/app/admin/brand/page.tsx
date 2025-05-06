'use client'
import { AgGridReact } from 'ag-grid-react';
import { useState, useEffect } from 'react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { ClientSideRowModelModule } from 'ag-grid-community';
import { ModuleRegistry } from 'ag-grid-community';
ModuleRegistry.registerModules([ClientSideRowModelModule]);
import { useBrand } from "@/hooks/useBrand";
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
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { provideGlobalGridOptions } from 'ag-grid-community';
provideGlobalGridOptions({
    theme: "legacy",
});
const brandFormSchema = z.object({
    name: z.string().min(2, {
        message: "Tên thương hiệu phải có ít nhất 2 ký tự.",
    }),
});
interface Brand {
    id: string;
    name: string;
}
export default function BrandManagement() {
    const [openForm, setOpenForm] = useState(false);
    const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null);
    const { getBrands, brands, createBrand, updateBrand, deleteBrand } = useBrand();
    const [forceUpdateKey, setForceUpdateKey] = useState(0);
    const [gridData, setGridData] = useState<Brand[]>([]);
    const [colDefs] = useState([
        { field: "id", headerName: "ID", width: 100 },
        { field: "name", headerName: "Tên thương hiệu", flex: 1 }
    ]);
    useEffect(() => { setGridData(brands); forceUpdate(); }, [brands]);
    const forceUpdate = () => {
        setForceUpdateKey(prev => prev + 1);
    };
    useEffect(() => {
        toast.promise(getBrands(), {
            success: "Tải danh sách thương hiệu thành công",
            error: "Không thể tải danh sách thương hiệu"
        })
    }, []);

    const loadBrands = async () => {
        try {
            await getBrands();
        } catch (error) {
            toast.error("Không thể tải danh sách thương hiệu");
            console.error(error);
        } finally {
            forceUpdate();
        }
    };

    const handleRowClick = (event) => {
        setSelectedBrand(event.data);
        setOpenForm(true);
    };

    const handleAddNew = () => {
        setSelectedBrand(null);
        setOpenForm(true);
    };

    const handleCloseForm = () => {
        setOpenForm(false);
        setSelectedBrand(null);
    };

    return (
        <div className="w-full min-h-screen p-8 bg-gray-50">
            <div className="flex justify-between items-center mb-6">
                <Button
                    variant="outline"
                    className="text-2xl font-bold py-6 px-6 cursor-default"
                    onClick={() => { }}
                >
                    Quản lý thương hiệu
                </Button>
                <Button onClick={handleAddNew}>Thêm thương hiệu mới</Button>
            </div>

            <div className="ag-theme-alpine w-full h-[500px] rounded-md overflow-hidden">
                <AgGridReact
                    key={`brands-${forceUpdateKey}`}
                    rowData={gridData}
                    columnDefs={colDefs}
                    onRowClicked={handleRowClick}
                    pagination={true}
                    paginationAutoPageSize={true}
                    animateRows={true}
                    domLayout="autoHeight"
                />
            </div>
            <BrandFormDialog
                open={openForm}
                onClose={handleCloseForm}
                brand={selectedBrand}
                onSubmit={() => { loadBrands() }}//setTimeout(() => { loadBrands(); }, 100) }
                createBrand={createBrand}
                updateBrand={updateBrand}
                deleteBrand={deleteBrand}
            />
        </div>
    );
}
interface BrandFormProps {
    open: boolean;
    onClose: () => void;
    brand: Brand | null;
    onSubmit: () => void;
    createBrand: (name: string) => Promise<void>;
    updateBrand: (id: string, name: string) => Promise<void>;
    deleteBrand: (id: string) => Promise<string>;
}

function BrandFormDialog({ open, onClose, brand, onSubmit, createBrand, updateBrand, deleteBrand }: BrandFormProps) {

    const form = useForm<z.infer<typeof brandFormSchema>>({
        resolver: zodResolver(brandFormSchema),
        defaultValues: {
            name: brand?.name || "",
        },
    });

    useEffect(() => {
        if (brand) {
            form.reset({ name: brand.name });
        } else {
            form.reset({ name: "" });
        }
    }, [brand, form]);

    const handleSubmit = async (values: z.infer<typeof brandFormSchema>) => {
        try {
            if (brand) {
                await updateBrand(brand.id, values.name);
                toast.success("Cập nhật thành công");
            } else {

                await createBrand(values.name);
                toast.success("Tạo thành công");
            }

            onClose();
        } catch (error) {
            toast.error(" Xử lí không thành công");
            console.error(error);
        }
    };
    const handleDelete = async () => {
        if (!brand) return;

        try {
            await deleteBrand(brand.id);
            toast.success("Xóa thành công");
            onClose();
            onSubmit();
        } catch (error) {
            toast.error("Xóa thất bại");
            console.error(error);
        }
    };

    return (
        <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>
                        {brand ? "Chỉnh sửa thương hiệu" : "Thêm thương hiệu mới"}
                    </DialogTitle>
                    <DialogDescription>
                        {brand
                            ? "Chỉnh sửa thông tin thương hiệu hiện có."
                            : "Thêm một thương hiệu mới vào hệ thống."}
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Tên thương hiệu</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Nhập tên hãng" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <DialogFooter className="flex items-center justify-between w-full pt-4">
                            <div className="flex gap-2">
                                {brand && (
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
                                {brand ? "Cập nhật" : "Tạo mới"}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}