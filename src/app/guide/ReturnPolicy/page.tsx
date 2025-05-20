'use client'

import React from 'react';
import {
  FaExchangeAlt,
  FaClipboardCheck,
  FaVideo,
  FaShoppingBag,
  FaCalendarAlt,
  FaTimesCircle,
  FaCheckCircle,
  FaExclamationTriangle,
  FaHandshake,
  FaBoxOpen
} from 'react-icons/fa';
import { MdOutlinePolicy, MdOutlineShoppingBag, MdSupportAgent } from 'react-icons/md';
import { GiReturnArrow } from 'react-icons/gi';
import { BsShieldCheck, BsArrowRight, BsPatchCheck } from 'react-icons/bs';
import { BiPackage } from 'react-icons/bi';

const ReturnPolicy = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b w-full from-blue-50 to-white py-12 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-16 relative">
          <div className="absolute -top-10 left-1/2 transform -translate-x-1/2">
            <div className="relative">
              <div className="absolute -inset-4 bg-blue-100 rounded-full blur-md opacity-70"></div>
              <GiReturnArrow className="relative text-5xl text-blue-600" />
            </div>
          </div>
          <h1 className="text-4xl md:text-4xl font-bold text-gray-900 mb-4 relative z-10">
            <span className="inline-flex items-center bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              <MdOutlinePolicy className="mr-3 mb-5" />
              Chính Sách Đổi Hàng
              <FaExchangeAlt className="ml-3" />
            </span>
          </h1>
          <p className="text-lg text-gray-600 mb-6  max-w-2xl mx-auto">
            Cam kết đảm bảo quyền lợi và mang đến trải nghiệm mua sắm tốt nhất
          </p>
          <div className="relative max-w-xs mx-auto">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-300 to-indigo-300 rounded-full blur"></div>
            <div className="relative h-1 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"></div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Conditions Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-md hover:border-blue-100">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 border-b border-gray-100">
              <div className="flex items-center">
                <div className="bg-white p-3 rounded-xl shadow-sm mr-4">
                  <FaClipboardCheck className="text-2xl text-blue-600" />
                </div>
                <h2 className="text-2xl font-semibold text-gray-800">Điều Kiện Đổi Hàng</h2>
              </div>
            </div>
            <div className="p-6 space-y-5">
              <div className="flex items-start">
                <div className="flex-shrink-0 bg-blue-50 p-2 rounded-lg mr-4">
                  <FaVideo className="text-blue-600" />
                </div>
                <p className="text-gray-700">Quay video unbox sản phẩm (không chỉnh sửa, không cắt ghép)</p>
              </div>

              <div className="flex items-start">
                <div className="flex-shrink-0 bg-blue-50 p-2 rounded-lg mr-4">
                  <BiPackage className="text-blue-600" />
                </div>
                <p className="text-gray-700">Sản phẩm còn nguyên túi zip, card shop, tag hãng (nếu có)</p>
              </div>

              <div className="flex items-start">
                <div className="flex-shrink-0 bg-blue-50 p-2 rounded-lg mr-4">
                  <MdOutlineShoppingBag className="text-blue-600" />
                </div>
                <p className="text-gray-700">Đổi sang mẫu khác có giá trị tương đương hoặc cao hơn</p>
              </div>

              <div className="flex items-start">
                <div className="flex-shrink-0 bg-blue-50 p-2 rounded-lg mr-4">
                  <FaCalendarAlt className="text-blue-600" />
                </div>
                <p className="text-gray-700">Yêu cầu đổi trong vòng 7 ngày kể từ khi nhận hàng</p>
              </div>

              <div className="flex items-start">
                <div className="flex-shrink-0 bg-blue-50 p-2 rounded-lg mr-4">
                  <FaTimesCircle className="text-blue-600" />
                </div>
                <p className="text-gray-700">Sản phẩm chưa qua sử dụng, giặt tẩy, không ám mùi/vết bẩn</p>
              </div>

              {/* Important Notes */}
              <div className="mt-6 bg-gradient-to-br from-blue-50 to-indigo-50 p-5 rounded-xl border border-blue-100">
                <div className="flex items-center mb-3">
                  <BsShieldCheck className="text-blue-600 mr-2 text-xl" />
                  <h3 className="font-semibold text-gray-800">Lưu ý quan trọng</h3>
                </div>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <BsPatchCheck className="text-green-500 mr-2 mt-1 flex-shrink-0" />
                    <span>Áp dụng 01 lần đổi/01 đơn hàng</span>
                  </li>
                  <li className="flex items-start">
                    <BsPatchCheck className="text-green-500 mr-2 mt-1 flex-shrink-0" />
                    <span>Khách hàng chịu phí vận chuyển khi đổi hàng</span>
                  </li>
                  <li className="flex items-start">
                    <FaTimesCircle className="text-red-500 mr-2 mt-1 flex-shrink-0" />
                    <span>Không áp dụng trả hàng hoàn tiền</span>
                  </li>
                </ul>
              </div>

              {/* Manufacturer Defects */}
              <div className="mt-6 bg-yellow-50/80 p-5 rounded-xl border border-yellow-200">
                <div className="flex items-center mb-3">
                  <FaExclamationTriangle className="text-yellow-600 mr-2" />
                  <h3 className="font-semibold text-gray-800">Lỗi từ nhà sản xuất</h3>
                </div>
                <p className="text-gray-700 text-sm">
                  Nếu sản phẩm bị lỗi (ố màu, phai màu, chất liệu, giao nhầm sản phẩm/size, thiếu hàng), vui lòng cung cấp video unbox và báo shop trong vòng 7 ngày. Chúng tôi sẽ chịu mọi chi phí đổi trả.
                </p>
                <p className="mt-3 text-xs text-red-500 font-medium">
                  *Không có video unbox hoặc báo sau 7 ngày sẽ không được hỗ trợ
                </p>
              </div>
            </div>
          </div>

          {/* Process Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-md hover:border-indigo-100">
            <div className="bg-gradient-to-r from-indigo-50 to-blue-50 p-6 border-b border-gray-100">
              <div className="flex items-center">
                <div className="bg-white p-3 rounded-xl shadow-sm mr-4">
                  <FaHandshake className="text-2xl text-indigo-600" />
                </div>
                <h2 className="text-2xl font-semibold text-gray-800">Quy Trình Đổi Hàng</h2>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-6">
                {/* Step 1 */}
                <div className="flex">
                  <div className="flex-shrink-0 mr-4">
                    <div className="flex items-center justify-center h-10 w-10 rounded-full bg-blue-100 text-blue-600 font-bold">
                      1
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">Kiểm tra điều kiện</h3>
                    <p className="text-gray-600 mt-1">
                      Đảm bảo sản phẩm đáp ứng các điều kiện đổi hàng bên cạnh
                    </p>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="flex">
                  <div className="flex-shrink-0 mr-4">
                    <div className="flex items-center justify-center h-10 w-10 rounded-full bg-blue-100 text-blue-600 font-bold">
                      2
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">Liên hệ hỗ trợ</h3>
                    <p className="text-gray-600 mt-1">
                      Nhắn tin qua Instagram <span className="font-medium">@Think5</span> hoặc Facebook <span className="font-medium">Think5</span>
                    </p>
                    <div className="mt-2 flex items-center text-sm text-blue-600">
                      <MdSupportAgent className="mr-1" />
                      <span>Hỗ trợ từ 9:00 - 21:00 hàng ngày</span>
                    </div>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="flex">
                  <div className="flex-shrink-0 mr-4">
                    <div className="flex items-center justify-center h-10 w-10 rounded-full bg-blue-100 text-blue-600 font-bold">
                      3
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">Gửi video unbox</h3>
                    <p className="text-gray-600 mt-1">
                      Cung cấp video quá trình mở hộp sản phẩm đầy đủ, rõ nét
                    </p>
                    <div className="mt-2 flex items-center text-sm text-gray-500">
                      <FaBoxOpen className="mr-1" />
                      <span>Video cần thể hiện rõ tình trạng sản phẩm</span>
                    </div>
                  </div>
                </div>

                {/* Step 4 */}
                <div className="flex">
                  <div className="flex-shrink-0 mr-4">
                    <div className="flex items-center justify-center h-10 w-10 rounded-full bg-blue-100 text-blue-600 font-bold">
                      4
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">Mô tả vấn đề</h3>
                    <p className="text-gray-600 mt-1">
                      Cung cấp thông tin chi tiết về sản phẩm và vấn đề gặp phải
                    </p>
                  </div>
                </div>

                {/* Visual Separator */}
                <div className="relative py-4">
                  <div className="absolute inset-0 flex items-center" aria-hidden="true">
                    <div className="w-full border-t border-dashed border-gray-300"></div>
                  </div>
                  <div className="relative flex justify-center">
                    <span className="px-3 bg-white text-sm text-gray-500">
                      Sau khi hoàn tất các bước trên
                    </span>
                  </div>
                </div>

                {/* Final Step */}
                <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                  <div className="flex">
                    <div className="flex-shrink-0 mr-4">
                      <div className="flex items-center justify-center h-10 w-10 rounded-full bg-blue-200 text-blue-700 font-bold">
                        ✓
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">Xác nhận đổi hàng</h3>
                      <p className="text-gray-600 mt-1">
                        Nhân viên sẽ liên hệ để hướng dẫn các bước tiếp theo trong vòng 24h
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Thank You Section */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-3 rounded-full shadow-md hover:shadow-lg transition-all duration-300">
            <span className="font-medium text-lg">Cảm ơn quý khách đã tin tưởng Think5!</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReturnPolicy;
