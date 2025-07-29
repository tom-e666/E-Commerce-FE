'use client'

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'sonner';
import { formatCurrency } from '@/lib/utils';
import { useAuthContext } from '@/contexts/AuthContext';
import { useOrder } from '@/hooks/useOrder';

// UI Components
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from '@/components/ui/breadcrumb';

// Icons
import { Package, Clock, ArrowLeft, CheckCircle, Truck, XCircle, ChevronRight, Home, Loader2, AlertTriangle } from 'lucide-react';
import { useShipping } from '@/hooks/useShipping';
import { Shipping } from '@/services/shipping/endpoints';
import Image from 'next/image';

// Order status badge map
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
    case 'delivery_failed':
      return <Badge variant="outline" className="bg-red-50 text-red-600 border-red-200"><Truck className="h-3 w-3 mr-1" />Giao hàng thất bại</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};

export default function OrderDetailPage() {
  const router = useRouter();
  const params = useParams();
  const [orderId, setOrderId] = useState<string | null>(null);
  const { isAuthenticated, isLoading: authLoading } = useAuthContext();
  const { loading, getOrder, currentOrder, cancelOrder } = useOrder();
  const [isCancelling, setIsCancelling] = useState(false);
  const { handleFetchShippingByOrderId } = useShipping();
  const [orderStatusHistory, setOrderStatusHistory] = useState<{status: string, date: string}[]>([]);
  const [shippingData, setShippingData] = useState<Shipping | null>(null);

  // Extract order ID from params
  useEffect(() => {
    async function extractOrderId() {
      try {
        // Handle params as Promise in Next.js 15
        if (params instanceof Promise) {
          const resolvedParams = await params;
          setOrderId(resolvedParams.id as string);
        } else {
          // Fallback for older versions
          setOrderId(params.id as string);
        }
      } catch (error) {
        console.error("Error extracting params:", error);
        router.push('/order');
      }
    }

    extractOrderId();
  }, [params, router]);

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      toast.error('Vui lòng đăng nhập để xem chi tiết đơn hàng');
      router.push('/login?redirect=/order');
      return;
    }

    if (isAuthenticated && orderId) {
      fetchOrderDetails();
    }
      const fetchOrderDetails = async () => {
    try {
      await getOrder(orderId);
    } catch (error) {
      console.error('Failed to fetch order details:', error);
      toast.error('Không thể tải thông tin đơn hàng');
    }
  };
  }, [isAuthenticated, authLoading, orderId, router, getOrder]);

  // Generate status history when order details load
  useEffect(() => {
    if (currentOrder) {
      // In a real application, this data should come from the API
      // This is a simplification for demonstration purposes
      const history = [
        { status: 'pending', date: currentOrder.created_at }
      ];

      if (currentOrder.status !== 'pending' && currentOrder.status !== 'cancelled') {
        history.push({ 
          status: 'confirmed', 
          date: new Date(new Date(currentOrder.created_at).getTime() + 24*60*60*1000).toISOString() 
        });
      }

      if (currentOrder.status === 'shipping') {
        history.push({ 
          status: 'shipping', 
          date: new Date(new Date(currentOrder.created_at).getTime() + 2*24*60*60*1000).toISOString() 
        });
      }

      if (currentOrder.status === 'completed') {
        history.push({ 
          status: 'shipping', 
          date: new Date(new Date(currentOrder.created_at).getTime() + 5*24*60*60*1000).toISOString() 
        });
        history.push({ 
          status: 'completed', 
          date: new Date(new Date(currentOrder.created_at).getTime() + 5*24*60*60*1000).toISOString() 
        });
      }

      if (currentOrder.status === 'cancelled') {
        history.push({ 
          status: 'cancelled', 
          date: new Date(new Date(currentOrder.created_at).getTime() + 12*60*60*1000).toISOString() 
        });
      }

      if (currentOrder.status === 'delivery_failed') {
        history.push({
          status: 'shipping',
          date: new Date(new Date(currentOrder.created_at).getTime() + 2*24*60*60*1000).toISOString()
        });
        history.push({
          status: 'delivery_failed',
          date: new Date(new Date(currentOrder.created_at).getTime() + 3*24*60*60*1000).toISOString()
        });
      }

      if (currentOrder.status === 'failed'){
        history.push({
          status: 'failed',
          date: new Date(new Date(currentOrder.created_at).getTime() + 12*60*60*1000).toISOString()
        });
      }

      setOrderStatusHistory(history);
      fetchShippingData(); // Fetch shipping data when order details are available
    }
     const fetchShippingData = async () => {
    try{
      if (currentOrder) {
        const shipping = await handleFetchShippingByOrderId(currentOrder.id);
        setShippingData(shipping);
      }
    }catch{
      toast.error('Không thể tải thông tin vận chuyển');
    }
  }
  }, [currentOrder, handleFetchShippingByOrderId]);



  const handleCancelOrder = async () => {
    if (!currentOrder) return;
    
    try {
      setIsCancelling(true);
      await cancelOrder(currentOrder.id);
      toast.success('Đã hủy đơn hàng thành công');
      fetchOrderDetails(); // Refresh order after cancellation
    } catch (error) {
      console.error('Error cancelling order:', error);
      toast.error('Không thể hủy đơn hàng');
    } finally {
      setIsCancelling(false);
    }
  };

  // Loading state
  if (loading || authLoading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <Skeleton className="h-8 w-64" />
          </div>
          
          <Card>
            <CardHeader>
              <div className="flex justify-between">
                <div>
                  <Skeleton className="h-6 w-48 mb-2" />
                  <Skeleton className="h-4 w-32" />
                </div>
                <Skeleton className="h-6 w-24" />
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center gap-3">
                    <Skeleton className="w-12 h-12 rounded-md" />
                    <div className="flex-grow">
                      <Skeleton className="h-5 w-full max-w-md mb-1" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                    <Skeleton className="h-5 w-20" />
                  </div>
                ))}
              </div>
              
              <Separator />
              
              <div className="flex justify-between items-center">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-6 w-24" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Not found state
  if (!currentOrder) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="max-w-md mx-auto text-center py-12">
          <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Không tìm thấy đơn hàng</h2>
          <p className="text-gray-500 mb-6">
            Đơn hàng không tồn tại hoặc bạn không có quyền truy cập đơn hàng này.
          </p>
          <Button asChild variant="outline">
            <Link href="/order">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Quay lại danh sách đơn hàng
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Breadcrumb */}
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">
                <Home className="h-4 w-4 mr-2" />
                Trang chủ
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator>
              <ChevronRight className="h-4 w-4" />
            </BreadcrumbSeparator>
            <BreadcrumbItem>
              <BreadcrumbLink href="/order">
                Đơn hàng của tôi
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator>
              <ChevronRight className="h-4 w-4" />
            </BreadcrumbSeparator>
            <BreadcrumbItem>
              <BreadcrumbLink>
                Đơn hàng #{currentOrder.id.substring(0, 8)}
              </BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Chi tiết đơn hàng</h1>
          {getStatusBadge(currentOrder.status)}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {/* Order Information */}
          <Card className="md:col-span-2">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Thông tin đơn hàng</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-1 text-sm">
                <div className="flex justify-between py-1">
                  <span className="text-gray-500">Mã đơn hàng:</span>
                  <span className="font-medium">{currentOrder.id}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-gray-500">Ngày đặt hàng:</span>
                  <span>{new Date(currentOrder.created_at).toLocaleString('vi-VN')}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-gray-500">Trạng thái đơn hàng:</span>
                  <span>{getStatusBadge(currentOrder.status)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Additional Order Information */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Thông tin giao hàng</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-2 text-sm">
                <p><span className="text-gray-500">Người nhận:</span> {shippingData?.recipient_name || 'Không có thông tin'}</p>
                <p><span className="text-gray-500">Số điện thoại:</span> {shippingData?.recipient_phone || 'Không có thông tin'}</p>
                <p><span className="text-gray-500">Địa chỉ:</span> {
                  [
                    shippingData?.address,
                    shippingData?.ward_name,
                    shippingData?.district_name,
                    shippingData?.province_name
                  ].filter(Boolean).join(', ') || 'Không có thông tin'}</p>
                {currentOrder.notes && (
                  <p><span className="text-gray-500">Ghi chú:</span> {currentOrder.notes}</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Order Status Timeline */}
        <Card className="mb-6">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Trạng thái đơn hàng</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative pb-4">
              {orderStatusHistory.map((historyItem, index) => (
                <div key={historyItem.status} className="flex mb-6 last:mb-0 relative">
                  {/* Timeline connector line */}
                  {index < orderStatusHistory.length - 1 && (
                    <div className="absolute top-7 left-[10px] w-[2px] h-[calc(100%-12px)] bg-gray-200"></div>
                  )}
                  
                  {/* Status indicator */}
                  <div className={`w-5 h-5 rounded-full z-10 mt-1 mr-3 border-2 ${
                    historyItem.status === 'cancelled' ? 'bg-red-100 border-red-400' : 
                    'bg-green-100 border-green-400'
                  }`}></div>
                  
                  {/* Status details */}
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">
                          {historyItem.status === 'pending' && 'Đơn hàng đã được tạo'}
                          {historyItem.status === 'confirmed' && 'Đơn hàng đã được xác nhận'}
                          {historyItem.status === 'shipping' && 'Đơn hàng đang được giao'}
                          {historyItem.status === 'completed' && 'Đơn hàng đã giao thành công'}
                          {historyItem.status === 'cancelled' && 'Đơn hàng đã bị hủy'}
                          {historyItem.status === 'failed' && 'Đơn hàng đã thất bại'}
                          {historyItem.status === 'delivery_failed' && 'Giao hàng thất bại'}
                        </p>
                        <p className="text-sm text-gray-500">
                          {new Date(historyItem.date).toLocaleString('vi-VN')}
                        </p>
                      </div>
                      {getStatusBadge(historyItem.status)}
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      {historyItem.status === 'pending' && 'Đơn hàng của bạn đã được tạo và đang chờ xác nhận.'}
                      {historyItem.status === 'confirmed' && 'Đơn hàng của bạn đã được xác nhận và đang được chuẩn bị.'}
                      {historyItem.status === 'shipping' && 'Đơn hàng của bạn đã được giao cho đơn vị vận chuyển.'}
                      {historyItem.status === 'completed' && 'Đơn hàng của bạn đã được giao thành công.'}
                      {historyItem.status === 'cancelled' && 'Đơn hàng của bạn đã bị hủy.'}
                      {historyItem.status === 'failed' && 'Đơn hàng của bạn đã thất bại do lỗi thanh toán.'}
                      {historyItem.status === 'delivery_failed' && 'Đơn vị vận chuyển không thể giao hàng đến địa chỉ của bạn.'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Order Items */}
        <Card className="mb-6">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Sản phẩm đã đặt</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {currentOrder.items.map((item) => (
                <div key={item.id} className="flex items-center p-3 border rounded-md">
                  <div className="flex-shrink-0 w-16 h-16 bg-gray-100 rounded-md flex items-center justify-center">
                    {item.image ? (
                      <Image
                        src={item.image || "/laptop.png"}
                        alt={item.name}
                        width={80}
                        height={80}
                        className="object-contain rounded"
                      />
                    ) : (
                      <Package className="h-8 w-8 text-gray-400" />
                    )}
                  </div>
                  <div className="flex-grow ml-4 min-w-0">
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-gray-500">Đơn giá: {formatCurrency(item.price)}</p>
                    <p className="text-sm text-gray-500">Số lượng: {item.quantity}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">{formatCurrency(item.price * item.quantity)}</p>
                  </div>
                </div>
              ))}
              
              <Separator className="my-4" />
              
              {/* Order Summary */}
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Tạm tính:</span>
                  <span>{formatCurrency(currentOrder.total_price)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Phí vận chuyển:</span>
                  <span>Miễn phí</span>
                </div>
                <div className="flex justify-between font-bold text-lg pt-2">
                  <span>Tổng cộng:</span>
                  <span>{formatCurrency(currentOrder.total_price)}</span>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between pt-0">
            <Button variant="outline" asChild>
              <Link href="/order">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Quay lại
              </Link>
            </Button>

            {currentOrder.status === 'pending' && (
              <Button 
                variant="destructive" 
                onClick={handleCancelOrder}
                disabled={isCancelling}
              >
                {isCancelling ? 'Đang hủy...' : 'Hủy đơn hàng'}
              </Button>
            )}
            
            {currentOrder.status === 'confirmed' && currentOrder.items[0]?.product_id && (
              <Button asChild>
                <Link href={`/product/${currentOrder.items[0].product_id}`}>
                  Mua lại
                </Link>
              </Button>
            )}
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
