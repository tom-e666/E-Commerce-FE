"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useOrder } from "@/hooks/useOrder";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";

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
  const [statusMessage, setStatusMessage] = useState("Đang tải thông tin...");
  const [order, setOrder] = useState<Order | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    const fetchOrder = async () => {
      if (!vnpTxnRef) return;
      try {
        const response = await getOrderByTransaction(vnpTxnRef);
        console.log("Response from getOrderByTransaction:", response);
        if (response.code === 200 && response.order && response.order.status === "CONFIRMED") {
          setOrder(response.order);
          setStatusMessage("Thanh toán thành công!");
          setIsSuccess(true);
        } else {
          setStatusMessage("Thanh toán thất bại");
          setIsSuccess(false);
        }
      } catch (error) {
        setStatusMessage("Lỗi khi lấy thông tin thanh toán");
        setIsSuccess(false);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [vnpTxnRef]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-gray-50 p-4">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center animate-pulse">
          <div className="flex justify-center mb-6">
            <Loader2 className="h-12 w-12 text-blue-500 animate-spin" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Đang xử lý</h1>
          <p className="text-gray-600">{statusMessage}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-gray-50 p-4">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden w-full max-w-2xl">
        {/* Status Header */}
        <div className={`p-6 text-center ${isSuccess ? 'bg-green-500' : 'bg-red-500'}`}>
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
                      order.status === 'completed' 
                        ? 'bg-green-100 text-green-800' 
                        : order.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {order.status}
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
                          <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
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
              <p className="text-gray-600">Không tìm thấy thông tin đơn hàng</p>
            </div>
          )}

          <div className="pt-4">
            <button
              onClick={() => window.location.href = '/'}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition duration-150 ease-in-out"
            >
              Quay lại trang chủ
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}