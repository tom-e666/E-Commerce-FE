export const ZALO_CONFIG = {
  OA_ID: '4291017113463940775',
  
  // Số điện thoại hỗ trợ
  SUPPORT_PHONE: '0899888999',
  
  // App ID cho Zalo SDK (nếu cần)
  APP_ID: '',
  
  // Giờ làm việc
  WORKING_HOURS: {
    start: '08:00',
    end: '21:00',
    timezone: 'Asia/Ho_Chi_Minh'
  },
  
  // Cấu hình widget
  WIDGET_SETTINGS: {
    autoOpenDelay: 5000, // 5 giây
    enableOfflineForm: true,
    showQuickActions: true,
    maxMessages: 50 // Giới hạn số tin nhắn lưu trữ
  },
  
  // Tin nhắn tự động
  AUTO_MESSAGES: {
    welcome: 'Xin chào! Chúng tôi có thể hỗ trợ gì cho bạn?',
    offline: 'Chào bạn! Hiện tại ngoài giờ làm việc. Bạn có thể để lại tin nhắn hoặc liên hệ qua Zalo.',
    autoReply: 'Cảm ơn bạn đã liên hệ! Chúng tôi sẽ phản hồi trong thời gian sớm nhất. Để được hỗ trợ nhanh hơn, bạn có thể liên hệ trực tiếp qua Zalo.'
  },
  
  // Liên kết Zalo
  ZALO_LINKS: {
    oa: (oaId: string) => `https://zalo.me/${oaId}`,
    phone: (phone: string) => `tel:${phone}`,
    web: 'https://chat.zalo.me' // Zalo Web Chat
  }
};

export const QUICK_MESSAGE_TEMPLATES = {
  PRODUCT_INQUIRY: {
    laptop: 'Tôi muốn tư vấn về laptop gaming trong tầm giá {price}',
    desktop: 'Tôi cần hỗ trợ chọn cấu hình PC gaming phù hợp',
    accessories: 'Tôi muốn xem các phụ kiện gaming (bàn phím, chuột, tai nghe)'
  },
  
  ORDER_SUPPORT: {
    status: 'Tôi muốn kiểm tra tình trạng đơn hàng #{orderNumber}',
    payment: 'Tôi cần hỗ trợ về phương thức thanh toán',
    shipping: 'Khi nào đơn hàng của tôi sẽ được giao?'
  },
  
  TECHNICAL_SUPPORT: {
    warranty: 'Tôi cần thông tin về chế độ bảo hành sản phẩm',
    repair: 'Sản phẩm của tôi gặp sự cố, cần được kiểm tra',
    upgrade: 'Tôi muốn nâng cấp cấu hình máy tính hiện tại'
  },
  
  STORE_INFO: {
    location: 'Địa chỉ các showroom EMS Electronics ở đâu?',
    hours: 'Giờ hoạt động của cửa hàng là như thế nào?',
    contact: 'Các kênh liên hệ và hỗ trợ khách hàng'
  }
};

// Helper functions
export const isWorkingHours = () => {
  const now = new Date();
  const startTime = new Date();
  const endTime = new Date();
  
  const [startHour, startMinute] = ZALO_CONFIG.WORKING_HOURS.start.split(':').map(Number);
  const [endHour, endMinute] = ZALO_CONFIG.WORKING_HOURS.end.split(':').map(Number);
  
  startTime.setHours(startHour, startMinute, 0, 0);
  endTime.setHours(endHour, endMinute, 0, 0);
  
  return now >= startTime && now <= endTime;
};

export const getZaloOALink = () => ZALO_CONFIG.ZALO_LINKS.oa(ZALO_CONFIG.OA_ID);
export const getPhoneLink = () => ZALO_CONFIG.ZALO_LINKS.phone(ZALO_CONFIG.SUPPORT_PHONE);
