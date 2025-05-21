'use client'
import { AgGridReact } from 'ag-grid-react';
import { useState, useEffect } from 'react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { ClientSideRowModelModule } from 'ag-grid-community';
import { ModuleRegistry } from 'ag-grid-community';
ModuleRegistry.registerModules([ClientSideRowModelModule]);

import { useUser } from "@/hooks/useUser";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Shield, User, UserCog, CheckCircle, XCircle } from "lucide-react";

import { provideGlobalGridOptions } from 'ag-grid-community';
provideGlobalGridOptions({
    theme: "legacy",
});

// Define form schema for user roles
const userRoleSchema = z.object({
    role: z.string().min(1, {
        message: "Vui lòng chọn một vai trò.",
    }),
});
export default function UserManagement() {
    const [openForm, setOpenForm] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const { users, getUsers, updateUserRole, User } = useUser();
    const [forceUpdateKey, setForceUpdateKey] = useState(0);
    const [gridData, setGridData] = useState<typeof User[]>([]);

    const [colDefs] = useState([
        { field: "id", headerName: "ID", width: 100 },
        { field: "email", headerName: "Email", flex: 1 },
        { field: "full_name", headerName: "Họ và tên", flex: 1 },
        { field: "phone", headerName: "Số điện thoại", flex: 1 },
        // Updates to the role cellRenderer - Update the existing code
        {
            field: "role",
            headerName: "Vai trò",
            width: 120,
            // @ts-expect-error any
            cellRenderer: (params) => {
                const role = params.value || "user";
                const roleClass =
                    role === "admin" ? "bg-blue-100 text-blue-800" :
                        role === "staff" ? "bg-purple-100 text-purple-800" :
                            "bg-gray-100 text-gray-800";

                const roleIcon =
                    role === "admin" ? <Shield className="h-4 w-4 mr-1" /> :
                        role === "staff" ? <UserCog className="h-4 w-4 mr-1" /> :
                            <User className="h-4 w-4 mr-1" />;

                const roleText =
                    role === "admin" ? "Quản trị viên" :
                        role === "staff" ? "Nhân viên" :
                            "Người dùng";

                return (
                    <div className={`flex items-center justify-center px-2 py-1 rounded-full ${roleClass}`}>
                        {roleIcon}
                        <span>{roleText}</span>
                    </div>
                );
            }
        },
        {
            field: "email_verified",
            headerName: "Đã xác thực",
            width: 120,
            // @ts-expect-error any
            cellRenderer: (params) => {
                const verified = params.value === true;
                const statusClass = verified
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800";
                return (
                    <div className={`flex items-center justify-center px-2 py-1 rounded-full ${statusClass}`}>
                        {verified
                            ? <CheckCircle className="h-4 w-4 mr-1" />
                            : <XCircle className="h-4 w-4 mr-1" />}
                        <span>{verified ? "Đã xác thực" : "Chưa xác thực"}</span>
                    </div>
                );
            }
        },
        {
            field: "created_at",
            headerName: "Ngày tạo",
            flex: 1,
            // @ts-expect-error any
            valueFormatter: (params) => {
                return params.value ? new Date(params.value).toLocaleDateString('vi-VN') : '';
            }
        }
    ]);

    useEffect(() => {
        setGridData(users);
        forceUpdate();
    }, [users]);

    const forceUpdate = () => {
        setForceUpdateKey(prev => prev + 1);
    };

    useEffect(() => {
        loadUsers();
    }, []);
    const loadUsers = async () => {
        try {
            await toast.promise(
                getUsers(),
                {
                    loading: "Đang tải danh sách người dùng...",
                    success: "Tải danh sách người dùng thành công",
                    error: "Không thể tải danh sách người dùng"
                }
            );
        } catch (error) {
            toast.error("Không thể tải danh sách người dùng");
            console.error(error);
        }
    };

    // @ts-expect-error any
    const handleRowClick = (event) => {
        setSelectedUser(event.data);
        setOpenForm(true);
    };

    const handleCloseForm = () => {
        setOpenForm(false);
        setSelectedUser(null);
    };

    return (
        <div className="w-full min-h-screen p-8 bg-gray-50">
            <div className="flex justify-between items-center mb-6">
                <Button
                    variant="outline"
                    className="text-2xl font-bold py-6 px-6 cursor-default"
                >
                    <UserCog className="mr-2 h-6 w-6" />
                    Quản lý người dùng
                </Button>
                <Button onClick={loadUsers}>Làm mới</Button>
            </div>

            <div className="ag-theme-alpine w-full h-[600px] rounded-md overflow-hidden">
                <AgGridReact
                    key={`users-${forceUpdateKey}`}
                    rowData={gridData}
                    // @ts-expect-error any
                    columnDefs={colDefs}
                    onRowClicked={handleRowClick}
                    pagination={true}
                    paginationAutoPageSize={true}
                    animateRows={true}
                    domLayout="autoHeight"
                    defaultColDef={{
                        resizable: true,
                        sortable: true
                    }}
                    suppressColumnVirtualisation={true}
                />
            </div>
            <UserRoleDialog
                open={openForm}
                onClose={handleCloseForm}
                user={selectedUser}
                onSubmit={loadUsers}
                updateUserRole={updateUserRole}
            />
        </div>
    );
}

interface UserRoleDialogProps {
    open: boolean;
    onClose: () => void;
    user: {
        id: string;
        email: string;
        full_name: string;
        phone: string;
        role?: string;
        email_verified?: boolean;
        created_at?: string;
    } | null;
    onSubmit: () => void;
    //@ts-expect-error any
    updateUserRole: (userId: string, role: string) => Promise<any>;
}

function UserRoleDialog({
    open,
    onClose,
    user,
    onSubmit,
    updateUserRole
}: UserRoleDialogProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const form = useForm<z.infer<typeof userRoleSchema>>({
        resolver: zodResolver(userRoleSchema),
        defaultValues: {
            role: "user",
        },
    });

    useEffect(() => {
        if (user) {
            form.reset({
                role: user.role || "user",
            });
        }
    }, [user, form]);

    const handleSubmit = async (values: z.infer<typeof userRoleSchema>) => {
        if (!user) return;

        setIsSubmitting(true);
        try {
            await toast.promise(
                updateUserRole(user.id, values.role),
                {
                    loading: "Đang cập nhật vai trò người dùng...",
                    success: "Cập nhật vai trò thành công",
                    error: "Không thể cập nhật vai trò người dùng"
                }
            );

            onClose();
            onSubmit();
        } catch (error) {
            console.error("Error updating user role:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!user) return null;

    return (
        <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Quản lý vai trò người dùng</DialogTitle>
                    <DialogDescription>
                        Thay đổi vai trò cho người dùng {user.full_name || user.email}
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    <div className="bg-muted p-4 rounded-lg">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <div className="text-sm font-medium text-muted-foreground">Email:</div>
                                <div className="font-medium">{user.email}</div>
                            </div>
                            <div>
                                <div className="text-sm font-medium text-muted-foreground">Họ và tên:</div>
                                <div className="font-medium">{user.full_name || "Chưa cung cấp"}</div>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4 mt-3">
                            <div>
                                <div className="text-sm font-medium text-muted-foreground">Số điện thoại:</div>
                                <div className="font-medium">{user.phone || "Chưa cung cấp"}</div>
                            </div>
                            <div>
                                <div className="text-sm font-medium text-muted-foreground">Trạng thái email:</div>
                                <div className="font-medium flex items-center">
                                    {user.email_verified ? (
                                        <>
                                            <CheckCircle className="h-4 w-4 mr-1 text-green-500" />
                                            <span className="text-green-600">Đã xác thực</span>
                                        </>
                                    ) : (
                                        <>
                                            <XCircle className="h-4 w-4 mr-1 text-red-500" />
                                            <span className="text-red-600">Chưa xác thực</span>
                                        </>
                                    )}
                                </div>
                            </div>
                            <div>
                                <div className="text-sm font-medium text-muted-foreground">Ngày tạo:</div>
                                <div className="font-medium">
                                    {user.created_at
                                        ? new Date(user.created_at).toLocaleDateString('vi-VN')
                                        : "Không rõ"}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-2">
                        <div className="text-sm font-medium mb-2">Vai trò hiện tại:</div>
                        <Badge className={
                            user.role === "admin" ? "bg-blue-100 text-blue-800" :
                                user.role === "staff" ? "bg-purple-100 text-purple-800" :
                                    "bg-gray-100 text-gray-800"
                        }>
                            {user.role === "admin" ? <Shield className="h-4 w-4 mr-1" /> :
                                user.role === "staff" ? <UserCog className="h-4 w-4 mr-1" /> :
                                    <User className="h-4 w-4 mr-1" />}
                            {user.role === "admin" ? "Quản trị viên" :
                                user.role === "staff" ? "Nhân viên" :
                                    "Người dùng thường"}
                        </Badge>
                    </div>

                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                            <FormField
                                control={form.control}
                                name="role"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Thay đổi vai trò</FormLabel>
                                        <Select
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                            value={field.value}
                                            disabled={isSubmitting}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Chọn vai trò" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="user">Người dùng thường</SelectItem>
                                                <SelectItem value="staff">Nhân viên</SelectItem>
                                                <SelectItem value="admin">Quản trị viên</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <DialogFooter>
                                <Button variant="outline" type="button" onClick={onClose} disabled={isSubmitting}>
                                    Hủy
                                </Button>
                                <Button type="submit" disabled={isSubmitting}>
                                    Cập nhật vai trò
                                </Button>
                            </DialogFooter>
                        </form>
                    </Form>
                </div>
            </DialogContent>
        </Dialog>
    );
}