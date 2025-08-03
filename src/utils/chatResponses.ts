export interface ChatResponse {
  pattern: RegExp;
  responses: string[];
  followUp?: string[];
  action?: 'redirect_zalo' | 'show_products' | 'show_contact' | 'escalate' | 'show_newest_products' | 'show_gaming_laptops' | 'show_phone_support';
}

export const chatResponses: ChatResponse[] = [
  // Chào hỏi
  {
    pattern: /(xin chào|chào|hello|hi|hey|chào bạn)/i,
    responses: [
      "Xin chào! Cảm ơn bạn đã quan tâm đến EMS Electronics. Tôi có thể hỗ trợ gì cho bạn hôm nay? 😊",
      "Chào bạn! Tôi là trợ lý ảo của EMS Electronics. Bạn cần tư vấn về sản phẩm nào không? 💻",
      "Hi! Chào mừng bạn đến với EMS Electronics. Hãy cho tôi biết bạn đang tìm kiếm gì nhé! 🛍️"
    ],
    followUp: ["💻 Xem sản phẩm mới", "🎮 Laptop gaming", "📞 Gọi tư vấn", "💬 Chat với nhân viên"]
  },

  // Xem sản phẩm mới
  {
    pattern: /(xem sản phẩm mới|sản phẩm mới|mới nhất|hàng mới|💻 xem sản phẩm mới)/i,
    responses: [
      "🆕 Đang tải danh sách sản phẩm mới nhất cho bạn...",
      "⏳ Vui lòng chờ một chút, tôi đang lấy thông tin sản phẩm mới nhất từ hệ thống...",
      "🔄 Đang cập nhật danh sách sản phẩm mới nhất..."
    ],
    action: 'show_newest_products'
  },

  // Laptop Gaming
  {
    pattern: /(laptop gaming|gaming laptop|🎮 laptop gaming|🎮 gaming|🎮 Gaming|máy gaming|laptop chơi game|pc gaming)/i,
    responses: [
      "🎮 Đang tải danh sách laptop gaming mới nhất cho bạn...",
      "⏳ Vui lòng chờ một chút, tôi đang lấy thông tin laptop gaming từ hệ thống...",
      "🔄 Đang cập nhật danh sách laptop gaming..."
    ],
    action: 'show_gaming_laptops'
  },

  // Gọi tư vấn / Hỗ trợ điện thoại
  {
    pattern: /(gọi tư vấn|📞 gọi tư vấn|số điện thoại|hotline|liên hệ điện thoại|gọi điện|điện thoại tư vấn)/i,
    responses: [
      "📞 **HOTLINE TƯ VẤN EMS ELECTRONICS**\n\n🔥 **Hotline chính:** 0899-888-999\n⏰ **Thời gian:** 24/7 - Luôn sẵn sàng hỗ trợ\n\n📍 **Các dịch vụ hỗ trợ:**\n• Tư vấn sản phẩm miễn phí\n• Báo giá chi tiết\n• Hỗ trợ kỹ thuật\n• Tra cứu bảo hành\n• Hướng dẫn sử dụng\n\n💬 **Hoặc chat trực tiếp qua Zalo để được hỗ trợ nhanh nhất!**"
    ],
    action: 'show_phone_support',
    followUp: ["💬 Chat Zalo", "🏪 Địa chỉ showroom", "📧 Email hỗ trợ", "🛒 Xem sản phẩm"]
  },

  // Tư vấn sản phẩm  
  {
    pattern: /(tư vấn sản phẩm|tư vấn laptop|laptop văn phòng|máy tính văn phòng|laptop học tập|mua laptop|cần laptop)/i,
    responses: [
      "Tuyệt vời! EMS có đầy đủ các dòng laptop từ văn phòng đến gaming. Để tư vấn chính xác nhất, bạn có thể cho tôi biết: 🤔",
      "Tôi sẽ giúp bạn tìm laptop phù hợp nhất! Hãy chia sẻ thêm về nhu cầu sử dụng: 💡",
      "EMS có nhiều dòng laptop chất lượng cao. Bạn quan tâm đến loại nào: 🔍"
    ],
    followUp: [
      "💰 Ngân sách: Dưới 15 triệu", 
      "💰 Ngân sách: 15-30 triệu", 
      "💰 Ngân sách: Trên 30 triệu",
      "🎮 Gaming", 
      "💼 Văn phòng", 
      "🎨 Đồ họa"
    ],
    action: 'show_products'
  },

  // Giá cả
  {
    pattern: /(giá|bao nhiêu|cost|price|tiền|giá tiền)/i,
    responses: [
      "Về giá cả, EMS luôn cam kết giá tốt nhất thị trường! 💰\n\n📊 Bảng giá tham khảo:\n• Laptop Gaming: 15-50 triệu\n• Laptop Văn phòng: 8-25 triệu\n• Laptop Đồ họa: 25-60 triệu",
      "Giá sản phẩm tại EMS rất cạnh tranh với nhiều chương trình ưu đãi. Bạn quan tâm dòng nào để tôi báo giá cụ thể? 💸",
      "EMS có nhiều mức giá phù hợp mọi túi tiền. Hãy cho tôi biết ngân sách của bạn để tư vấn chính xác nhé! 💳"
    ],
    followUp: ["Dưới 15 triệu", "15-25 triệu", "25-40 triệu", "Trên 40 triệu", "Xem khuyến mãi"]
  },

  // Bảo hành
  {
    pattern: /(bảo hành|warranty|lỗi|sửa chữa|đổi trả)/i,
    responses: [
      "🛡️ Chính sách bảo hành tại EMS rất uy tín:\n\n✅ Bảo hành chính hãng 12-36 tháng\n✅ Hỗ trợ kỹ thuật trọn đời\n✅ Đổi mới trong 7 ngày nếu có lỗi\n✅ Bảo hành tại nhà cho sản phẩm > 20 triệu",
      "EMS cam kết bảo hành chính hãng đầy đủ với nhiều quyền lợi đặc biệt cho khách hàng! 🔧",
      "Về bảo hành, EMS luôn đặt quyền lợi khách hàng lên hàng đầu với chính sách minh bạch và uy tín! 💯"
    ],
    followUp: ["Chi tiết bảo hành", "Trung tâm bảo hành", "Quy trình đổi trả", "Liên hệ kỹ thuật"]
  },

  // Giao hàng
  {
    pattern: /(giao hàng|ship|delivery|vận chuyển|nhận hàng)/i,
    responses: [
      "🚚 Dịch vụ giao hàng EMS:\n\n📦 Miễn phí giao hàng toàn quốc\n⏰ Giao hàng trong 1-2 ngày tại TP.HCM và Hà Nội\n⏰ 2-3 ngày tại các tỉnh thành khác\n📞 Nhân viên gọi trước khi giao 30 phút",
      "EMS hỗ trợ giao hàng toàn quốc với nhiều hình thức linh hoạt! 🛵",
      "Về vận chuyển, EMS có các options nhanh chóng và tiện lợi nhất! ⚡"
    ],
    followUp: ["Phí ship", "Thời gian giao", "COD", "Theo dõi đơn hàng"]
  },

  // Khuyến mãi
  {
    pattern: /(khuyến mãi|giảm giá|sale|promotion|ưu đãi|discount)/i,
    responses: [
      "🎉 Tin tốt! EMS đang có nhiều chương trình khuyến mãi siêu hấp dẫn:\n\n🔥 Giảm đến 20% laptop gaming\n💻 Tặng chuột + bàn phím cơ\n🎯 Trade-in máy cũ lấy máy mới\n💳 Trả góp 0% lãi suất",
      "🔥 Hiện tại EMS có các ưu đãi đặc biệt dành riêng cho bạn! Đừng bỏ lỡ cơ hội tuyệt vời này! 🎁",
      "💝 Các chương trình khuyến mãi hot nhất tại EMS đang chờ bạn khám phá! ✨"
    ],
    followUp: ["Xem tất cả KM", "Laptop giảm giá", "Phụ kiện khuyến mãi", "Trả góp 0%"]
  },

  // Kiểm tra đơn hàng
  {
    pattern: /(đơn hàng|order|kiểm tra|tra cứu|tình trạng)/i,
    responses: [
      "📋 Để kiểm tra đơn hàng, bạn cần cung cấp:\n\n🔍 Mã đơn hàng\n📞 Số điện thoại đặt hàng\n📧 Email đặt hàng\n\nBạn có thể kiểm tra online hoặc liên hệ hotline để được hỗ trợ trực tiếp!",
      "Tôi sẽ giúp bạn kiểm tra tình trạng đơn hàng ngay! Vui lòng cung cấp mã đơn hàng hoặc số điện thoại đặt hàng. 📱",
      "EMS có hệ thống theo dõi đơn hàng realtime. Bạn muốn kiểm tra theo cách nào? 🔍"
    ],
    followUp: ["Tra cứu online", "Gọi hotline", "Chat với nhân viên", "Email hỗ trợ"]
  },

  // Hỗ trợ kỹ thuật
  {
    pattern: /(hỗ trợ|kỹ thuật|lỗi|không hoạt động|sửa|fix)/i,
    responses: [
      "🔧 Đội ngũ kỹ thuật EMS sẵn sàng hỗ trợ bạn 24/7!\n\n💻 Hỗ trợ từ xa qua TeamViewer\n🏠 Hỗ trợ tại nhà (nội thành)\n📞 Hotline kỹ thuật: 1900-xxxx\n💬 Chat trực tiếp với kỹ thuật viên",
      "Tôi hiểu bạn đang gặp vấn đề kỹ thuật. Hãy mô tả chi tiết để tôi hỗ trợ tốt nhất! 🛠️",
      "EMS có đội ngũ kỹ thuật chuyên nghiệp, kinh nghiệm cao sẵn sàng giải quyết mọi vấn đề cho bạn! ⚡"
    ],
    followUp: ["Hỗ trợ từ xa", "Hẹn lịch sửa chữa", "Gọi kỹ thuật", "Mô tả chi tiết lỗi"]
  },

  // Liên hệ/Thông tin cửa hàng
  {
    pattern: /(liên hệ|contact|địa chỉ|cửa hàng|showroom|hotline|điện thoại)/i,
    responses: [
      "📍 Thông tin liên hệ EMS Electronics:\n\n📞 Hotline: 0899-888-999\n🏪 Showroom 1: 123 Nguyễn Văn Linh, Q7, TP.HCM\n🏪 Showroom 2: 456 Lê Văn Việt, Q9, TP.HCM\n🕐 Giờ làm việc: 8:00 - 21:00 hàng ngày",
      "EMS có nhiều kênh hỗ trợ 24/7 để phục vụ bạn tốt nhất! 📱",
      "Để được hỗ trợ nhanh nhất, bạn có thể liên hệ qua các kênh sau: 📞"
    ],
    followUp: ["📞 Gọi hotline", "🏪 Xem địa chỉ", "💬 Chat Zalo", "📧 Email"],
    action: 'show_contact'
  },

  // Thanh toán
  {
    pattern: /(thanh toán|payment|trả góp|installment|thẻ|card|chuyển khoản)/i,
    responses: [
      "💳 EMS hỗ trợ đa dạng phương thức thanh toán:\n\n💰 Tiền mặt tại cửa hàng\n💳 Thẻ tín dụng/ghi nợ\n🏧 Chuyển khoản ngân hàng\n📱 Ví điện tử (Momo, ZaloPay)\n🏠 COD (Thanh toán khi nhận hàng)\n💳 Trả góp 0% lãi suất",
      "Về thanh toán, EMS rất linh hoạt và thuận tiện cho khách hàng! 💸",
      "Bạn muốn thanh toán theo hình thức nào? EMS hỗ trợ tất cả các cách thức phổ biến! 💰"
    ],
    followUp: ["Trả góp 0%", "COD", "Chuyển khoản", "Thẻ tín dụng", "Ví điện tử"]
  },

  // Thương hiệu
  {
    pattern: /(asus|msi|acer|dell|hp|lenovo|gigabyte|thương hiệu|hãng|brand)/i,
    responses: [
      "🏷️ EMS là đại lý chính hãng của các thương hiệu hàng đầu:\n\n💻 ASUS - MSI - ACER\n💻 DELL - HP - LENOVO\n💻 GIGABYTE - RAZER\n\nTất cả sản phẩm đều 100% chính hãng, nguyên seal với đầy đủ chế độ bảo hành!",
      "EMS hợp tác với tất cả các thương hiệu laptop uy tín nhất thế giới! 🌟",
      "Bạn có thương hiệu ưa thích nào không? Tôi sẽ tư vấn chi tiết! 🎯"
    ],
    followUp: ["ASUS", "MSI", "ACER", "DELL", "HP", "So sánh thương hiệu"]
  },

  // Cảm ơn
  {
    pattern: /(cảm ơn|thank|thanks|cám ơn)/i,
    responses: [
      "Cảm ơn bạn đã tin tưởng EMS Electronics! Chúng tôi luôn sẵn sàng hỗ trợ bạn 24/7! 🙏",
      "Rất vui được hỗ trợ bạn! Hãy liên hệ bất cứ khi nào cần nhé! 😊",
      "EMS luôn đồng hành cùng bạn! Chúc bạn có trải nghiệm tuyệt vời! ✨"
    ],
    followUp: ["Xem sản phẩm khác", "Liên hệ tư vấn", "Theo dõi khuyến mãi"]
  },

  // Mặc định
  {
    pattern: /.*/,
    responses: [
      "Xin lỗi, tôi chưa hiểu rõ câu hỏi của bạn 😅. Bạn có thể chọn một trong các chủ đề dưới đây hoặc liên hệ trực tiếp với nhân viên tư vấn qua Zalo để được hỗ trợ tốt nhất!",
      "Tôi cần thêm thông tin để hỗ trợ bạn tốt hơn. Hãy chọn chủ đề bạn quan tâm hoặc mô tả chi tiết hơn nhé! 🤔",
      "Để hỗ trợ chính xác nhất, bạn có thể chọn một trong các câu hỏi thường gặp hoặc chat trực tiếp với nhân viên tư vấn! 💬"
    ],
    followUp: ["🛍️ Tư vấn sản phẩm", "💰 Bảng giá", "🛡️ Bảo hành", "🚚 Giao hàng", "📞 Liên hệ nhân viên"],
    action: 'escalate'
  }
];

export function getResponse(message: string): ChatResponse {
  console.log('Searching response for message:', message); // Debug log
  
  for (const response of chatResponses) {
    if (response.pattern.test(message)) {
      console.log('Found matching pattern:', response.pattern); // Debug log
      return response;
    }
  }
  
  console.log('Using default response'); // Debug log
  return chatResponses[chatResponses.length - 1]; // Default response
}

export function getRandomResponse(responses: string[]): string {
  return responses[Math.floor(Math.random() * responses.length)];
}
