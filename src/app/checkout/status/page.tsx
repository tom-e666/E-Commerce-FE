"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState, useCallback, useRef } from "react";
import { useOrder } from "@/hooks/useOrder";
import { CheckCircle2, XCircle, Loader2, Eye } from "lucide-react";
import Image from "next/image";

interface OrderItem {
  product_id: string;
  name: string;
  price: number;
  image: string | null;
  quantity: number;
}

interface Order {
  id: string;
  status: string;
  total_price: number;
  items: OrderItem[];
}

export default function VNPayStatus() {
  const searchParams = useSearchParams();
  const { getOrderByTransaction } = useOrder();
  const vnpTxnRef = searchParams.get("vnp_TxnRef");

  const [loading, setLoading] = useState(true);
  const [statusMessage, setStatusMessage] = useState("Đang kiểm tra giao dịch...");
  const [order, setOrder] = useState<Order | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isFailed, setIsFailed] = useState(false);

  // Refs for intervals and timeouts
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const clearTimers = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  const checkOrder = useCallback(async () => {
    if (!vnpTxnRef) return;

    try {
      const response = await getOrderByTransaction(vnpTxnRef);
      console.log("Response from getOrderByTransaction:", response);

      if (response.code === 200 && response.order) {
        const orderStatus = response.order.status;
        
        if (orderStatus === "confirmed") {
          setOrder(response.order);
          setStatusMessage("Thanh toán thành công!");
          setIsSuccess(true);
          setLoading(false);
          clearTimers();
          return;
        } else if (orderStatus === "failed") {
          setOrder(response.order);
          setStatusMessage("Thanh toán thất bại");
          setIsFailed(true);
          setLoading(false);
          clearTimers();
          return;
        } else {
          // Đang chờ xử lý (pending, processing, etc.)
          setOrder(response.order);
          setStatusMessage("Đang kiểm tra giao dịch...");
          setLoading(true);
        }
      } else {
        // Không có order hoặc response không hợp lệ
        setStatusMessage("Đang kiểm tra giao dịch...");
      }
    } catch (error) {
      console.error("Error checking order:", error);
      // Không set failed ngay, vì có thể là lỗi mạng tạm thời
      setStatusMessage("Đang kiểm tra giao dịch...");
    }
  }, [vnpTxnRef, getOrderByTransaction, clearTimers]);

  useEffect(() => {
    if (!vnpTxnRef) {
      setStatusMessage("Không tìm thấy thông tin giao dịch");
      setIsFailed(true);
      setLoading(false);
      return;
    }

    // Gọi lần đầu ngay lập tức
    checkOrder();

    // Thiết lập interval kiểm tra mỗi 20 giây
    intervalRef.current = setInterval(() => {
      checkOrder();
    }, 20000); // 20 seconds

    // Thiết lập timeout 5 phút (300,000ms)
    timeoutRef.current = setTimeout(() => {
      setStatusMessage("Thanh toán thất bại - Quá thời gian chờ");
      setIsFailed(true);
      setLoading(false);
      clearTimers();
    }, 300000); // 5 minutes

    // Cleanup function
    return () => {
      clearTimers();
    };
  }, [vnpTxnRef, checkOrder, clearTimers]);

  // Function để navigate tới chi tiết đơn hàng
  const handleViewOrderDetail = () => {
    if (order?.id) {
      window.location.href = `/order/${order.id}`;
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-gray-50 p-4">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
          <div className="flex justify-center mb-6">
            <Loader2 className="h-12 w-12 text-blue-500 animate-spin" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Đang xử lý</h1>
          <p className="text-gray-600 mb-4">{statusMessage}</p>
          <p className="text-sm text-gray-500">
            Vui lòng đợi trong giây lát...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-gray-50 p-4">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden w-full max-w-2xl">
        {/* Status Header */}
        <div className={`p-6 text-center ${
          isSuccess ? 'bg-green-500' : 'bg-red-500'
        }`}>
          <div className="flex justify-center mb-4">
            {isSuccess ? (
              <CheckCircle2 className="h-12 w-12 text-white" strokeWidth={1.5} />
            ) : (
              <XCircle className="h-12 w-12 text-white" strokeWidth={1.5} />
            )}
          </div>
          <h1 className="text-2xl font-bold text-white">{statusMessage}</h1>
        </div>

        {/* Order Details */}
        <div className="p-6 space-y-6">
          {order ? (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-sm font-medium text-gray-500">Mã đơn hàng</h3>
                  <p className="mt-1 font-medium">{order.id}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-sm font-medium text-gray-500">Trạng thái</h3>
                  <p className="mt-1 font-medium capitalize">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      order.status === 'completed' || order.status === 'confirmed'
                        ? 'bg-green-100 text-green-800' 
                        : order.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-800'
                        : order.status === 'processing'
                        ? 'bg-orange-100 text-orange-800'
                        : order.status === 'shipping'
                        ? 'bg-purple-100 text-purple-800'
                        : order.status === 'failed'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {order.status === 'pending' ? 'Chờ xác nhận' :
                       order.status === 'confirmed' ? 'Đã xác nhận' :
                       order.status === 'processing' ? 'Đang xử lý' :
                       order.status === 'shipping' ? 'Đang giao hàng' :
                       order.status === 'completed' ? 'Hoàn thành' :
                       order.status === 'cancelled' ? 'Đã hủy' :
                       order.status === 'failed' ? 'Thất bại' : order.status}
                    </span>
                  </p>
                </div>
              </div>

              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-3">Chi tiết đơn hàng</h2>
                <div className="space-y-4">
                  {order.items.map((item) => (
                    <div key={item.product_id} className="flex items-start border-b pb-4 last:border-0 last:pb-0">
                      <div className="flex-shrink-0 h-16 w-16 rounded-md bg-gray-200 overflow-hidden">
                        {item.image ? (
                          <Image src={item.image} alt={item.name} width={64} height={64} className="h-full w-full object-cover" />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center text-gray-400">
                            <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          </div>
                        )}
                      </div>
                      <div className="ml-4 flex-1">
                        <h3 className="text-sm font-medium text-gray-900">{item.name}</h3>
                        <p className="text-sm text-gray-500">Số lượng: {item.quantity}</p>
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-900">
                          {(item.price * item.quantity).toLocaleString()} ₫
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="flex justify-between text-lg font-semibold">
                  <span>Tổng cộng:</span>
                  <span>{order.total_price.toLocaleString()} ₫</span>
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-600">
                {isFailed ? "Không thể xử lý thanh toán" : "Đang kiểm tra thông tin đơn hàng..."}
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="pt-4 space-y-2">
            {/* Nút xem chi tiết đơn hàng - chỉ hiện khi có order */}
            {order && (
              <button
                onClick={handleViewOrderDetail}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-md transition duration-150 ease-in-out flex items-center justify-center gap-2"
              >
                <Eye className="w-4 h-4" />
                Xem chi tiết đơn hàng
              </button>
            )}
            
            <button
              onClick={() => window.location.href = '/'}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition duration-150 ease-in-out"
            >
              Quay lại trang chủ
            </button>
            
            {isFailed && (
              <button
                onClick={() => window.location.reload()}
                className="w-full bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-md transition duration-150 ease-in-out"
              >
                Thử lại
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}