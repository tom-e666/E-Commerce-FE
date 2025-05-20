'use client'

import React from 'react';
import {
  FaTruck,
  FaMapMarkerAlt,
  FaClock,
  FaCheckCircle,
  FaPhone,
  FaBoxOpen,
  FaShieldAlt,
  FaHandshake
} from 'react-icons/fa';
import { MdOutlinePolicy, MdLocalShipping } from 'react-icons/md';
import { GiDeliveryDrone } from 'react-icons/gi';
import { BsCheck2Circle, BsShieldCheck } from 'react-icons/bs';

const TransferPolicy = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 w-full to-white py-12">
      <div className="container mx-auto px-4">
        {/* Header with decorative elements */}
        <div className="text-center mb-16 relative">
          <div className="absolute -top-11 left-1/2 transform -translate-x-1/2">
            <GiDeliveryDrone className="text-blue-300 text-5xl opacity-80" />
          </div>
          <h1 className="text-4xl font-bold text-blue-900 mb-4 relative z-10">
            <span className="flex items-center justify-center">
              <MdLocalShipping className="mr-3 text-blue-700" />
              Chính Sách Vận Chuyển
              <FaTruck className="ml-3 text-blue-700" />
            </span>
          </h1>
          <p className="text-lg text-blue-800 mb-4 max-w-2xl mx-auto">
            Cam kết giao hàng nhanh chóng, an toàn và minh bạch
          </p>
          <div className="w-32 h-1.5 bg-gradient-to-r from-blue-500 to-blue-700 mx-auto rounded-full"></div>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Phạm vi áp dụng */}
          <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300 border-l-4 border-blue-600">
            <div className="flex items-center mb-4">
              <div className="bg-blue-100 p-3 rounded-full mr-4">
                <FaMapMarkerAlt className="text-2xl text-blue-700" />
              </div>
              <h2 className="text-2xl font-semibold text-blue-900">1. Phạm vi áp dụng</h2>
            </div>
            <div className="pl-16 space-y-4 text-gray-700">
              <p className="text-gray-700 mb-2 leading-relaxed">
                Think5 thực hiện giao hàng trên <span className="font-medium text-blue-700">63 tỉnh thành</span> trong cả nước. Bất kỳ lúc nào khách hàng cũng có thể tra cứu, kiểm tra lộ trình hay tình trạng của những đơn hàng đã đặt mua qua các công cụ của các đối tác:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li className="flex items-start">
                  <BsCheck2Circle className="text-green-500 mr-2 mt-1 flex-shrink-0" />
                  <span>GIAOHANGNHANH (GHN)</span>
                </li>
                <li className="flex items-start">
                  <BsCheck2Circle className="text-green-500 mr-2 mt-1 flex-shrink-0" />
                  <span>EMS VietNamPost</span>
                </li>
              </ul>

            </div>
          </div>

          {/* Thời gian giao nhận */}
          <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300 border-l-4 border-blue-600">
            <div className="flex items-center mb-4">
              <div className="bg-blue-100 p-3 rounded-full mr-4">
                <FaClock className="text-2xl text-blue-700" />
              </div>
              <h2 className="text-2xl font-semibold text-blue-900">2. Thời gian giao – nhận hàng</h2>
            </div>
            <div className="pl-16 space-y-4 text-gray-700">
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                <p className="flex items-center text-blue-800 font-medium">
                  <FaClock className="mr-2 text-blue-600" />
                  <span>Nội thành TPHCM:</span>
                  <span className="ml-2 font-bold">1-2 ngày</span>
                  <span className="text-sm text-blue-600 ml-2">(tùy khu vực)</span>
                </p>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                <p className="flex items-center text-blue-800 font-medium">
                  <FaClock className="mr-2 text-blue-600" />
                  <span>Ngoại thành TPHCM:</span>
                  <span className="ml-2 font-bold">3-4 ngày</span>
                  <span className="text-sm text-blue-600 ml-2">(tùy khu vực)</span>
                </p>
              </div>
              <div className="mt-2 text-sm text-gray-500 italic">
                * Thời gian trên được tính từ khi đơn hàng được xác nhận
              </div>
            </div>
          </div>

          {/* Hình thức giao hàng */}
          <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300 border-l-4 border-blue-600">
            <div className="flex items-center mb-4">
              <div className="bg-blue-100 p-3 rounded-full mr-4">
                <FaTruck className="text-2xl text-blue-700" />
              </div>
              <h2 className="text-2xl font-semibold text-blue-900">3. Hình thức giao hàng</h2>
            </div>
            <div className="pl-16 space-y-6 text-gray-700">
              <div className="flex items-start">
                <div className="bg-blue-100 p-2 rounded-full mr-3 mt-1">
                  <FaMapMarkerAlt className="text-blue-600 text-sm" />
                </div>
                <div>
                  <p className="font-semibold text-gray-800">– Đối với khách tỉnh xa:</p>
                  <p>Sử dụng dịch vụ giao hàng tiết kiệm hoặc nhanh tùy chọn.</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="bg-green-100 p-2 rounded-full mr-3 mt-1">
                  <FaTruck className="text-green-600 text-sm" />
                </div>
                <div>
                  <p className="font-semibold text-gray-800">– Đối với khách nội thành:</p>
                  <p>Sử dụng dịch vụ giao hàng hoặc giao gấp trong ngày bằng Ahamove, Grab,... (chi phí giao bằng Ahamove hoặc Grab có thể cao hơn dịch vụ GHTK).</p>
                </div>
              </div>

              <div className="bg-blue-50 p-5 rounded-lg border border-blue-100 mt-4">
                <div className="flex items-center mb-3">
                  <FaShieldAlt className="text-blue-600 mr-2" />
                  <p className="font-semibold text-blue-800">Phân định trách nhiệm:</p>
                </div>
                <p>Đơn vị cung cấp dịch vụ logistic có trách nhiệm cung cấp bằng chứng giao nhận hàng hóa (ảnh chụp và chữ ký người nhận hàng) tới người mua và người bán khi có yêu cầu.</p>
              </div>
            </div>
          </div>

          {/* Chính sách kiểm hàng */}
          <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300 border-l-4 border-blue-600">
            <div className="flex items-center mb-4">
              <div className="bg-blue-100 p-3 rounded-full mr-4">
                <MdOutlinePolicy className="text-2xl text-blue-700" />
              </div>
              <h2 className="text-2xl font-semibold text-blue-900">4. Chính sách kiểm hàng</h2>
            </div>
            <div className="pl-16 space-y-6 text-gray-700">
              <div className="flex items-start">
                <div className="bg-blue-100 p-2 rounded-full mr-3 mt-1">
                  <FaBoxOpen className="text-blue-600 text-sm" />
                </div>
                <p>Khi nhận hàng quý khách có quyền yêu cầu nhân viên giao hàng mở cho kiểm và quay video lại toàn bộ quá trình kiểm hàng.</p>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                <div className="flex items-center mb-3">
                  <BsShieldCheck className="text-blue-600 mr-2 text-xl" />
                  <p className="font-semibold text-blue-800">Cam kết của chúng tôi:</p>
                </div>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <FaCheckCircle className="text-blue-500 mr-2 mt-1 flex-shrink-0" />
                    <span>Trường hợp đơn hàng đặt mà bên bán giao không đúng loại sản phẩm quý khách có quyền trả hàng và không thanh toán tiền.</span>
                  </li>
                  <li className="flex items-start">
                    <FaCheckCircle className="text-blue-500 mr-2 mt-1 flex-shrink-0" />
                    <span>Trường hợp quý khách đã thanh toán trước nhưng đơn hàng không đúng quý khách yêu cầu hoàn toàn hoặc giao lại đơn mới như đã đặt.</span>
                  </li>
                </ul>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                <div className="flex items-center mb-3">
                  <FaHandshake className="text-blue-600 mr-2" />
                  <p className="font-semibold text-blue-800">Liên hệ hỗ trợ:</p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <div className="bg-white p-1.5 rounded-full mr-3">
                      <FaCheckCircle className="text-green-500" />
                    </div>
                    <span>FACEBOOK: Think5</span>
                  </div>
                  <div className="flex items-center">
                    <div className="bg-white p-1.5 rounded-full mr-3">
                      <FaCheckCircle className="text-green-500" />
                    </div>
                    <span>Zalo: 09777699113 - Think5</span>
                  </div>
                  <div className="flex items-center">
                    <div className="bg-white p-1.5 rounded-full mr-3">
                      <FaPhone className="text-blue-500" />
                    </div>
                    <span>Hotline: <span className="font-semibold">032 8998 113</span></span>
                  </div>
                </div>
                <p className="mt-4 italic text-blue-700 text-center">
                  Chúng tôi cam kết sẽ giải quyết mọi yêu cầu của quý khách trong thời gian sớm nhất!
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Decorative Footer */}
        <div className="mt-12 text-center">
          <div className="inline-flex items-center justify-center bg-blue-200 px-6 py-3 rounded-full shadow-md hover:shadow-lg transition-shadow duration-300">
            <FaTruck className="text-blue-700 mr-2" />
            <span className="text-blue-900 font-medium">Think5 - Giao hàng tận tâm</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransferPolicy;
