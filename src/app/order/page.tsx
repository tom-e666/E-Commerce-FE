'use client'

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { formatCurrency } from '@/lib/utils';
import { useOrder } from '@/hooks/useOrder';
import { useAuthContext } from '@/contexts/AuthContext';

// UI Components
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// Icons
import { Package, Clock, ShoppingCart, Search, CheckCircle, Truck, XCircle, ChevronRight, ChevronLeft, ChevronsLeft, ChevronsRight, AlertTriangle, Loader2 } from 'lucide-react';

// Updated order status badge map to match backend states
const getStatusBadge = (status: string) => {
  switch (status) {
    case 'pending':
      return <Badge variant="outline" className="bg-yellow-50 text-yellow-600 border-yellow-200"><Clock className="h-3 w-3 mr-1" />Chờ xác nhận</Badge>;
    case 'confirmed':
      return <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-200"><CheckCircle className="h-3 w-3 mr-1" />Đã xác nhận</Badge>;
    case 'processing':
      return <Badge variant="outline" className="bg-orange-50 text-orange-600 border-orange-200"><Loader2 className="h-3 w-3 mr-1" />Đang xử lý</Badge>;
    case 'shipping':
      return <Badge variant="outline" className="bg-purple-50 text-purple-600 border-purple-200"><Truck className="h-3 w-3 mr-1" />Đang giao hàng</Badge>;
    case 'completed':
      return <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200"><Package className="h-3 w-3 mr-1" />Hoàn thành</Badge>;
    case 'cancelled':
      return <Badge variant="outline" className="bg-red-50 text-red-600 border-red-200"><XCircle className="h-3 w-3 mr-1" />Đã hủy</Badge>;
    case 'failed':
      return <Badge variant="outline" className="bg-gray-50 text-gray-600 border-gray-200"><AlertTriangle className="h-3 w-3 mr-1" />Thất bại</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};

// Pagination configuration
const ITEMS_PER_PAGE_OPTIONS = [5, 10, 20, 50];
const DEFAULT_ITEMS_PER_PAGE = 10;

export default function OrdersPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useAuthContext();
  const { orders, getUserOrders, cancelOrder, loading } = useOrder();
  
  // State management
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredOrders, setFilteredOrders] = useState(orders || []);
  const [isCancelling, setIsCancelling] = useState('');
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(DEFAULT_ITEMS_PER_PAGE);
  const [paginatedOrders, setPaginatedOrders] = useState<any[]>([]);

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      toast.error('Vui lòng đăng nhập để xem đơn hàng của bạn');
      router.push('/login?redirect=/order');
    }
  }, [isAuthenticated, authLoading, router]);

  // Fetch orders on component mount
  useEffect(() => {
    if (isAuthenticated) {
      fetchOrders();
    }
  }, [isAuthenticated]);

  // Filter orders whenever tab changes, search query changes, or orders change
  useEffect(() => {
    if (!orders) return;

    let filtered = [...orders];

    // Filter by active tab
    if (activeTab !== 'all') {
      filtered = filtered.filter(order => order.status === activeTab);
    }

    // Apply search filter if any
    if (searchQuery.trim().length > 0) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(order => 
        order.id.toLowerCase().includes(query) || 
        order.items.some(item => item.name.toLowerCase().includes(query))
      );
    }

    // Sort by date (newest first)
    filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    setFilteredOrders(filtered);
    setCurrentPage(1); // Reset to first page when filters change
  }, [orders, activeTab, searchQuery]);

  // Handle pagination
  useEffect(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    setPaginatedOrders(filteredOrders.slice(startIndex, endIndex));
  }, [filteredOrders, currentPage, itemsPerPage]);

  const fetchOrders = async () => {
    try {
      await getUserOrders();
    } catch (error) {
      console.error('failed to fetch orders:', error);
      toast.error('Không thể tải danh sách đơn hàng');
    }
  };

  const handleCancelOrder = async (orderId: string) => {
    try {
      setIsCancelling(orderId);
      await cancelOrder(orderId);
      toast.success('Đã hủy đơn hàng thành công');
      fetchOrders(); // Refresh orders after cancellation
    } catch (error) {
      console.error('Error cancelling order:', error);
      toast.error('Không thể hủy đơn hàng');
    } finally {
      setIsCancelling('');
    }
  };

  // Pagination calculations
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const hasNextPage = currentPage < totalPages;
  const hasPrevPage = currentPage > 1;

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleItemsPerPageChange = (value: string) => {
    setItemsPerPage(parseInt(value));
    setCurrentPage(1);
  };

  // Loading state
  if (loading || authLoading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="flex flex-col items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mb-4"></div>
          <p className="text-lg text-gray-600">Đang tải đơn hàng...</p>
        </div>
      </div>
    );
  }

  // If no orders found
  if (!orders || orders.length === 0) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="text-center py-12 max-w-lg mx-auto">
          <ShoppingCart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Bạn chưa có đơn hàng nào</h2>
          <p className="text-gray-500 mb-6">
            Hãy khám phá các sản phẩm của chúng tôi và đặt hàng ngay hôm nay!
          </p>
          <Button asChild>
            <Link href="/product">Mua sắm ngay</Link>
          </Button>
        </div>
      </div>
    );
  }

  // Main content with orders
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">Đơn hàng của tôi</h1>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Tìm kiếm đơn hàng theo mã hoặc tên sản phẩm..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button variant="outline" onClick={fetchOrders}>Làm mới</Button>
      </div>

      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-4 lg:grid-cols-7 mb-6 overflow-x-auto">
          <TabsTrigger value="all">Tất cả</TabsTrigger>
          <TabsTrigger value="PENDING">Chờ xác nhận</TabsTrigger>
          <TabsTrigger value="CONFIRMED">Đã xác nhận</TabsTrigger>
          <TabsTrigger value="PROCESSING">Đang xử lý</TabsTrigger>
          <TabsTrigger value="SHIPPING">Đang giao</TabsTrigger>
          <TabsTrigger value="COMPLETED">Hoàn thành</TabsTrigger>
          <TabsTrigger value="CANCELLED">Đã hủy</TabsTrigger>
          <TabsTrigger value="FAILED" className="hidden lg:block">Thất bại</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-6">
          {/* Orders count and pagination controls */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">
                Hiển thị {Math.min((currentPage - 1) * itemsPerPage + 1, filteredOrders.length)} - {Math.min(currentPage * itemsPerPage, filteredOrders.length)} trong tổng số {filteredOrders.length} đơn hàng
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Hiển thị:</span>
              <Select value={itemsPerPage.toString()} onValueChange={handleItemsPerPageChange}>
                <SelectTrigger className="w-20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ITEMS_PER_PAGE_OPTIONS.map(option => (
                    <SelectItem key={option} value={option.toString()}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {filteredOrders.length === 0 ? (
            <div className="text-center py-8 border rounded-lg bg-gray-50">
              <Package className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <h3 className="text-lg font-medium">Không tìm thấy đơn hàng</h3>
              <p className="text-gray-500 mt-1">
                {searchQuery ? 'Không có đơn hàng nào phù hợp với tìm kiếm của bạn' : 'Không có đơn hàng nào trong mục này'}
              </p>
            </div>
          ) : (
            <>
              {/* Orders list */}
              {paginatedOrders.map(order => (
                <Card key={order.id} className="overflow-hidden">
                  <CardHeader className="p-4 pb-0">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                      <div>
                        <CardTitle className="text-lg">Đơn hàng #{order.id.substring(0, 8)}</CardTitle>
                        <CardDescription>
                          Ngày đặt: {new Date(order.created_at).toLocaleDateString('vi-VN')}
                        </CardDescription>
                      </div>
                      {getStatusBadge(order.status)}
                    </div>
                  </CardHeader>
                  
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      {/* Order items list */}
                      {order.items.map((item, index) => (
                        <div key={item.id} className="flex items-center gap-3">
                          <div className="flex-shrink-0 w-12 h-12 bg-gray-100 rounded-md flex items-center justify-center">
                            {item.image ? (
                              <img 
                                src={item.image} 
                                alt={item.name} 
                                className="max-w-full max-h-full object-contain"
                              />
                            ) : (
                              <Package className="h-6 w-6 text-gray-400" />
                            )}
                          </div>
                          <div className="flex-grow min-w-0">
                            <p className="font-medium truncate">{item.name}</p>
                            <p className="text-sm text-gray-500">Số lượng: {item.quantity}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">{formatCurrency(item.price)}</p>
                          </div>
                        </div>
                      ))}
                      
                      <Separator className="my-3" />
                      
                      {/* Order summary */}
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 font-medium">Tổng thanh toán:</span>
                        <span className="font-bold text-lg">{formatCurrency(order.total_price)}</span>
                      </div>
                    </div>
                  </CardContent>
                  
                  <CardFooter className="px-4 py-3 bg-gray-50 flex flex-wrap justify-between gap-2">
                    <div>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        asChild
                      >
                        <Link href={`/order/${order.id}`}>
                          Xem chi tiết <ChevronRight className="ml-1 h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                    
                    {order.status === 'PENDING' && (
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleCancelOrder(order.id)}
                        disabled={isCancelling === order.id}
                      >
                        {isCancelling === order.id ? 'Đang hủy...' : 'Hủy đơn hàng'}
                      </Button>
                    )}
                    
                    {order.status === 'COMPLETED' && (
                      <Button
                        variant="outline"
                        size="sm"
                        asChild
                      >
                        <Link href={`/product/${order.items[0]?.product_id}`}>
                          Mua lại
                        </Link>
                      </Button>
                    )}
                  </CardFooter>
                </Card>
              ))}

              {/* Pagination controls */}
              {totalPages > 1 && (
                <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mt-8">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(1)}
                      disabled={!hasPrevPage}
                    >
                      <ChevronsLeft className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={!hasPrevPage}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    
                    <div className="flex items-center gap-1">
                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        let pageNumber;
                        if (totalPages <= 5) {
                          pageNumber = i + 1;
                        } else if (currentPage <= 3) {
                          pageNumber = i + 1;
                        } else if (currentPage >= totalPages - 2) {
                          pageNumber = totalPages - 4 + i;
                        } else {
                          pageNumber = currentPage - 2 + i;
                        }
                        
                        return (
                          <Button
                            key={pageNumber}
                            variant={currentPage === pageNumber ? "default" : "outline"}
                            size="sm"
                            onClick={() => handlePageChange(pageNumber)}
                            className="w-10"
                          >
                            {pageNumber}
                          </Button>
                        );
                      })}
                    </div>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={!hasNextPage}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(totalPages)}
                      disabled={!hasNextPage}
                    >
                      <ChevronsRight className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <span className="text-sm text-gray-500">
                    Trang {currentPage} / {totalPages}
                  </span>
                </div>
              )}
            </>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}