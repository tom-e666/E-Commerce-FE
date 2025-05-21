'use client'

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { MouseEvent, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Home, ShoppingCart } from "lucide-react";

export default function NotFound() {
  const router = useRouter();
  const [isHovering, setIsHovering] = useState(false);
  
  const goBack = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    router.back();
  };

  return (
    <div className="w-screen min-h-screen flex flex-col items-center justify-center p-4 text-center bg-gradient-to-b to-blue-300 from-gray-100">
      <div 
        className={`transition-transform duration-700 ease-in-out transform ${isHovering ? 'scale-110 rotate-3' : 'scale-100 rotate-0'}`}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        <div className="text-9xl font-bold text-blue-600 mb-6">404</div>
      </div>
      
      <h1 className="text-3xl font-bold mb-4">Oops! Trang không tồn tại</h1>
      
      <p className="text-gray-600 max-w-md mb-8">
        Rất tiếc, chúng tôi không thể tìm thấy trang bạn đang tìm kiếm. 
        Có thể nó đã bị xóa, đổi tên hoặc tạm thời không khả dụng.
      </p>
      
      <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
        <Button 
          className="flex-1" 
          onClick={goBack}
          variant="outline"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Quay lại
        </Button>
        
        <Button asChild className="flex-1">
          <Link href="/">
            <Home className="mr-2 h-4 w-4" />
            Trang chủ
          </Link>
        </Button>
      </div>
      
      <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-6 w-full max-w-3xl">
        <Link 
          href="/product" 
          className="p-6 border border-gray-200 rounded-lg bg-white shadow-sm hover:shadow-md transition-all"
        >
          <ShoppingCart className="h-8 w-8 mx-auto mb-3 text-blue-500" />
          <h3 className="font-medium">Xem sản phẩm</h3>
          <p className="text-sm text-gray-500">Khám phá các sản phẩm của chúng tôi</p>
        </Link>
        
        <Link 
          href="/guide" 
          className="p-6 border border-gray-200 rounded-lg bg-white shadow-sm hover:shadow-md transition-all"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-8 w-8 mx-auto mb-3 text-blue-500"
            width="24" 
            height="24" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
            <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
          </svg>
          <h3 className="font-medium">Hướng dẫn mua hàng</h3>
          <p className="text-sm text-gray-500">Tìm hiểu cách đặt hàng</p>
        </Link>
        
        <Link 
          href="/support" 
          className="p-6 border border-gray-200 rounded-lg bg-white shadow-sm hover:shadow-md transition-all"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-8 w-8 mx-auto mb-3 text-blue-500"
            width="24" 
            height="24" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <path d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.479m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z"></path>
          </svg>
          <h3 className="font-medium">Hỗ trợ khách hàng</h3>
          <p className="text-sm text-gray-500">Liên hệ với chúng tôi</p>
        </Link>
      </div>
      
      <div className="mt-12 text-gray-500 text-sm">
        <p>Bạn cần hỗ trợ thêm? <Link href="/support" className="text-blue-600 underline underline-offset-2">Liên hệ với chúng tôi</Link></p>
      </div>
    </div>
  );
}
