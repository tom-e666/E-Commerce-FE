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
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { motion, useMotionValue, AnimatePresence } from "framer-motion";
import { 
    Shield, 
    User, 
    UserCog, 
    CheckCircle, 
    XCircle, 
    Search, 
    RefreshCw, 
    Users, 
    UserCheck, 
    UserX,
    X,
    Edit
} from "lucide-react";

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
    const { users, getUsers, updateUserRole } = useUser();
    const [forceUpdateKey, setForceUpdateKey] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [filteredUsers, setFilteredUsers] = useState<typeof User[]>([]);
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const { left, top } = e.currentTarget.getBoundingClientRect();
        mouseX.set(e.clientX - left);
        mouseY.set(e.clientY - top);
    };

    const [colDefs] = useState([
        { field: "id", headerName: "ID", width: 100 },
        { field: "email", headerName: "Email", flex: 1 },
        { field: "full_name", headerName: "Họ và tên", flex: 1 },
        { field: "phone", headerName: "Số điện thoại", flex: 1 },
        {
            field: "role",
            headerName: "Vai trò",
            width: 140,
            // @ts-expect-error any
            cellRenderer: (params) => {
                const role = params.value || "user";
                // const roleClass =
                //     role === "admin" ? "bg-blue-100 text-blue-800" :
                //         role === "staff" ? "bg-purple-100 text-purple-800" :
                //             "bg-gray-100 text-gray-800";

                const roleText =
                    role === "admin" ? "Quản trị viên" :
                        role === "staff" ? "Nhân viên" :
                            "Người dùng";

                // return `
                //     <div class="flex items-center justify-center px-2 py-1 rounded-full ${roleClass}">
                //         <span class="text-xs font-medium">${roleText}</span>
                //     </div>
                // `;
                return `${roleText}`;
            }
        },
        {
            field: "email_verified",
            headerName: "Đã xác thực",
            width: 140,
            // @ts-expect-error any
            cellRenderer: (params) => {
                const verified = params.value === true;
                // const statusClass = verified
                //     ? "bg-green-100 text-green-800"
                //     : "bg-red-100 text-red-800";
                const statusText = verified ? "Đã xác thực" : "Chưa xác thực";
                
                return `${statusText}`;
            }
        },
    ]);

    useEffect(() => {
        setFilteredUsers(users);
        forceUpdate();
    }, [users]);

    useEffect(() => {
        const filtered = users.filter(user => 
            user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.phone?.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setFilteredUsers(filtered);
    }, [searchQuery, users]);

    const forceUpdate = () => {
        setForceUpdateKey(prev => prev + 1);
    };
    const loadUsers = async () => {
        try {
            setIsLoading(true);
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
            console.error("Error loading users:", error);
        } finally {
            setIsLoading(false);
        }
    };
    useEffect(() => {
        loadUsers();
    },[]);



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
        <motion.div 
            className="w-full min-h-screen p-8 bg-gradient-to-br from-blue-50 to-indigo-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            onMouseMove={handleMouseMove}
        >
            {/* Glossy header */}
            <motion.div 
                className="relative p-6 mb-8 rounded-xl bg-white/40 backdrop-blur-sm border border-white/30 shadow-xl overflow-hidden"
                initial={{ y: -20 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
            >
                <motion.div 
                    className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 pointer-events-none"
                    style={{
                        background: `radial-gradient(
                            circle at ${mouseX}px ${mouseY}px,
                            rgba(79, 70, 229, 0.15) 0%,
                            rgba(79, 70, 229, 0.05) 40%,
                            transparent 60%
                        )`
                    }}
                />
                
                <div className="relative z-10 flex justify-between items-center">
                    <div className="flex items-center">
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", stiffness: 300, damping: 25, delay: 0.3 }}
                            className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mr-4 shadow-lg"
                        >
                            <UserCog className="text-white w-6 h-6" />
                        </motion.div>
                        <div>
                            <motion.h1 
                                className="text-2xl font-bold text-indigo-900"
                                initial={{ x: -20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ duration: 0.3, delay: 0.4 }}
                            >
                                Quản lý người dùng
                            </motion.h1>
                            <motion.p 
                                className="text-gray-500"
                                initial={{ x: -20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ duration: 0.3, delay: 0.5 }}
                            >
                                Quản lý vai trò và quyền hạn người dùng trong hệ thống
                            </motion.p>
                        </div>
                    </div>
                    
                    <div className="flex gap-3">
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <Button 
                                variant="outline" 
                                onClick={loadUsers}
                                className="flex items-center gap-2 text-indigo-700 border-indigo-200 hover:bg-indigo-100"
                            >
                                <RefreshCw className="w-4 h-4" />
                                <span>Làm mới</span>
                            </Button>
                        </motion.div>
                    </div>
                </div>
            </motion.div>
            
            {/* Search bar */}
            <motion.div 
                className="mb-6 relative"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.6 }}
            >
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <Input
                        type="text"
                        placeholder="Tìm kiếm người dùng..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 pr-4 py-2 rounded-full border-gray-200 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    />
                    {searchQuery && (
                        <motion.button
                            whileTap={{ scale: 0.9 }}
                            onClick={() => setSearchQuery("")}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                            <X className="h-4 w-4" />
                        </motion.button>
                    )}
                </div>
            </motion.div>

            {/* Loading overlay */}
            <AnimatePresence>
                {isLoading && (
                    <motion.div 
                        className="absolute inset-0 bg-white/60 backdrop-blur-sm flex items-center justify-center z-50"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                    >
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                        >
                            <RefreshCw className="h-8 w-8 text-indigo-600" />
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Data grid with glossy effect */}
            <motion.div 
                className="relative overflow-hidden rounded-xl shadow-xl bg-white/80 backdrop-blur-md mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.7 }}
            >
                <motion.div 
                    className="absolute inset-0 bg-gradient-to-tr from-indigo-100/30 via-transparent to-purple-100/30 pointer-events-none"
                    style={{
                        background: `radial-gradient(
                            circle at ${mouseX}px ${mouseY}px,
                            rgba(99, 102, 241, 0.1) 0%,
                            rgba(168, 85, 247, 0.05) 25%,
                            transparent 50%
                        )`
                    }}
                />
                
                <div className="relative z-10 p-0.5">
                    <div className="ag-theme-alpine w-full h-[500px] rounded-lg overflow-hidden">
                        <AgGridReact
                            key={`users-${forceUpdateKey}`}
                            rowData={filteredUsers}
                            // @ts-expect-error any
                            columnDefs={colDefs}
                            onRowClicked={handleRowClick}
                            pagination={false}
                            animateRows={true}
                            domLayout="normal"
                            defaultColDef={{
                                resizable: true,
                                sortable: true
                            }}
                            rowHeight={56}
                            headerHeight={48}
                            suppressColumnVirtualisation={true}
                            overlayNoRowsTemplate={
                                searchQuery 
                                    ? "<div class='flex items-center justify-center h-full text-gray-500'>Không tìm thấy người dùng nào phù hợp</div>"
                                    : "<div class='flex items-center justify-center h-full text-gray-500'>Chưa có người dùng nào</div>"
                            }
                        />
                    </div>
                </div>
                
                {filteredUsers.length > 0 && (
                    <motion.div 
                        className="p-3 flex items-center justify-between border-t border-indigo-100/50 bg-white/50 backdrop-blur-sm"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.9 }}
                    >
                        <span className="text-sm text-gray-500">
                            Hiển thị {filteredUsers.length} người dùng
                        </span>
                        
                        <div className="flex items-center space-x-1">
                            <Button 
                                variant="ghost" 
                                size="sm"
                                className="text-xs h-8 px-3 text-indigo-600"
                                disabled
                            >
                                Xem tất cả
                            </Button>
                        </div>
                    </motion.div>
                )}
            </motion.div>

            {/* Statistics cards */}
            <motion.div 
                className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.9 }}
            >
                <StatCard 
                    title="Tổng người dùng" 
                    value={users.length} 
                    icon={<Users className="w-5 h-5 text-blue-500" />}
                    delay={1.0}
                />
                <StatCard 
                    title="Quản trị viên" 
                    value={users.filter(u => u.role === 'admin').length} 
                    icon={<Shield className="w-5 h-5 text-purple-500" />}
                    delay={1.1}
                />
                <StatCard 
                    title="Đã xác thực" 
                    value={users.filter(u => u.email_verified).length} 
                    icon={<UserCheck className="w-5 h-5 text-green-500" />}
                    delay={1.2}
                />
                <StatCard 
                    title="Chưa xác thực" 
                    value={users.filter(u => !u.email_verified).length} 
                    icon={<UserX className="w-5 h-5 text-red-500" />}
                    delay={1.3}
                />
            </motion.div>
            
            <style jsx global>{`
                .ag-theme-alpine {
                    --ag-background-color: transparent;
                    --ag-odd-row-background-color: rgba(240, 245, 255, 0.5);
                    --ag-header-background-color: rgba(224, 231, 255, 0.7);
                    --ag-row-hover-color: rgba(224, 231, 255, 0.7);
                    --ag-selected-row-background-color: rgba(199, 210, 254, 0.5);
                    --ag-font-family: 'Inter', sans-serif;
                    --ag-border-color: rgba(199, 210, 254, 0.5);
                }
                
                .ag-theme-alpine .ag-header {
                    font-weight: 600;
                    color: #4F46E5;
                }
                
                .ag-theme-alpine .ag-row {
                    cursor: pointer;
                    transition: all 0.2s ease;
                    border-bottom: 1px solid rgba(224, 231, 255, 0.7);
                }
                
                .ag-theme-alpine .ag-row:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
                    z-index: 2;
                }
                
                /* Custom scrollbar for modern browsers */
                .ag-theme-alpine ::-webkit-scrollbar {
                    width: 8px;
                    height: 8px;
                }
                
                .ag-theme-alpine ::-webkit-scrollbar-track {
                    background: rgba(240, 245, 255, 0.5);
                    border-radius: 8px;
                }
                
                .ag-theme-alpine ::-webkit-scrollbar-thumb {
                    background-color: rgba(99, 102, 241, 0.3);
                    border-radius: 8px;
                    transition: background-color 0.2s;
                }
                
                .ag-theme-alpine ::-webkit-scrollbar-thumb:hover {
                    background-color: rgba(99, 102, 241, 0.5);
                }
            `}</style>

            <UserRoleDialog
                open={openForm}
                onClose={handleCloseForm}
                user={selectedUser}
                onSubmit={loadUsers}
                updateUserRole={updateUserRole}
            />
        </motion.div>
    );
}

// Stat Card Component (same as brand page)
const StatCard = ({ title, value, icon, delay = 0 }) => {
    return (
        <motion.div 
            className="bg-white/70 backdrop-blur-sm rounded-xl shadow-md p-6 border border-white/30 relative overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay }}
            whileHover={{ 
                boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                y: -5
            }}
        >
            <motion.div 
                className="absolute -right-4 -top-4 w-24 h-24 rounded-full bg-indigo-100/50"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, delay: delay + 0.2 }}
            />
            
            <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-gray-600 font-medium">{title}</h3>
                    <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center">
                        {icon}
                    </div>
                </div>
                <div>
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: delay + 0.3 }}
                    >
                        <span className="text-3xl font-bold text-indigo-900">{value}</span>
                    </motion.div>
                </div>
            </div>
        </motion.div>
    );
};

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
    } | null;
    onSubmit: () => void;
    //@ts-expect-error any
    updateUserRole: (userId: string, role: string) => Promise<unknown>;
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
            <DialogContent className="sm:max-w-[500px] border border-indigo-100 bg-white/95 backdrop-blur-sm shadow-xl">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold text-indigo-900 flex items-center gap-2">
                        <UserCog className="h-5 w-5 text-indigo-600" />
                        Quản lý vai trò người dùng
                    </DialogTitle>
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
                                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                    <Button variant="outline" type="button" onClick={onClose} disabled={isSubmitting} className="border-gray-200">
                                        <X className="h-4 w-4 mr-2" />
                                        Hủy
                                    </Button>
                                </motion.div>
                                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                    <Button type="submit" disabled={isSubmitting} className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
                                        {isSubmitting ? (
                                            <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                                        ) : (
                                            <Edit className="h-4 w-4 mr-2" />
                                        )}
                                        Cập nhật vai trò
                                    </Button>
                                </motion.div>
                            </DialogFooter>
                        </form>
                    </Form>
                </div>
            </DialogContent>
        </Dialog>
    );
}