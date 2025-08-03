import { useState, useEffect, useCallback } from 'react';
import { getResponse, getRandomResponse } from '@/utils/chatResponses';
import { getNewestProducts, getGamingLaptops, type Product } from '@/services/product/endpoint';

export interface ChatMessage {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  type?: 'text' | 'image' | 'file';
  status?: 'sending' | 'sent' | 'failed';
}

export interface ChatSession {
  id: string;
  userId?: string;
  isActive: boolean;
  startTime: Date;
  lastActivity: Date;
  messages: ChatMessage[];
}

export interface ZaloChatConfig {
  appId: string;
  oaId: string;
  phoneNumber: string;
  enableOfflineForm: boolean;
  autoOpenDelay: number;
  workingHours: {
    start: string;
    end: string;
    timezone: string;
  };
}

const defaultConfig: ZaloChatConfig = {
  appId: '',
  oaId: '4291017113463940775',
  phoneNumber: '0899888999',
  enableOfflineForm: true,
  autoOpenDelay: 3000,
  workingHours: {
    start: '00:00',
    end: '23:59',
    timezone: 'Asia/Ho_Chi_Minh'
  }
};

export const useZaloChat = (config: Partial<ZaloChatConfig> = {}) => {
  const [chatConfig] = useState<ZaloChatConfig>({ ...defaultConfig, ...config });
  const [session, setSession] = useState<ChatSession | null>(null);
  const [isOnline, setIsOnline] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);

  // Kiểm tra giờ làm việc
  const isWorkingHours = useCallback(() => {
    const now = new Date();
    const startTime = new Date();
    const endTime = new Date();
    
    const [startHour, startMinute] = chatConfig.workingHours.start.split(':').map(Number);
    const [endHour, endMinute] = chatConfig.workingHours.end.split(':').map(Number);
    
    startTime.setHours(startHour, startMinute, 0, 0);
    endTime.setHours(endHour, endMinute, 0, 0);
    
    return now >= startTime && now <= endTime;
  }, [chatConfig.workingHours]);

  // Format danh sách sản phẩm thành tin nhắn
  const formatProductsMessage = (products: Product[], title: string = "DANH SÁCH SẢN PHẨM MỚI NHẤT"): string => {
    if (products.length === 0) {
      return "😔 Hiện tại chưa có sản phẩm nào. Vui lòng quay lại sau!";
    }

    let message = `🆕 **${title}**\n\n`;
    
    products.slice(0, 5).forEach((product, index) => {
      const price = product.price.toLocaleString('vi-VN');
      message += `**${index + 1}. ${product.name}**\n`;
      message += `💰 Giá: ${price} VNĐ\n`;
      if (product.stock > 0) {
        message += `📦 Còn hàng: ${product.stock} sản phẩm\n`;
      } else {
        message += `❌ Hết hàng\n`;
      }
      message += `🔗 ID: ${product.id}\n\n`;
    });

    message += "💬 Nhắn tên sản phẩm hoặc ID để xem chi tiết!\n";
    message += "📞 Hoặc gọi hotline: 0899-888-999 để được tư vấn trực tiếp.";
    
    return message;
  };

  // Khởi tạo session chat
  const startChatSession = useCallback(() => {
    const newSession: ChatSession = {
      id: `session_${Date.now()}`,
      isActive: true,
      startTime: new Date(),
      lastActivity: new Date(),
      messages: [
        {
          id: 'welcome_msg',
          text: 'Xin chào! Tôi là trợ lý ảo của EMS Electronics. Tôi có thể hỗ trợ gì cho bạn hôm nay? 😊',
          isUser: false,
          timestamp: new Date(),
          type: 'text',
          status: 'sent'
        }
      ]
    };
    
    setSession(newSession);
    localStorage.setItem('zalo_chat_session', JSON.stringify(newSession));
  }, []);

  // Gửi tin nhắn
  const sendMessage = useCallback((text: string, type: 'text' | 'image' | 'file' = 'text') => {
    if (!session || !text.trim()) return;

    const newMessage: ChatMessage = {
      id: `msg_${Date.now()}`,
      text: text.trim(),
      isUser: true,
      timestamp: new Date(),
      type,
      status: 'sending'
    };

    const updatedSession = {
      ...session,
      messages: [...session.messages, newMessage],
      lastActivity: new Date()
    };

    setSession(updatedSession);
    localStorage.setItem('zalo_chat_session', JSON.stringify(updatedSession));

    // Mô phỏng gửi tin nhắn
    setTimeout(() => {
      const sentMessage = { ...newMessage, status: 'sent' as const };
      const sessionWithSentMessage = {
        ...updatedSession,
        messages: updatedSession.messages.map(msg => 
          msg.id === newMessage.id ? sentMessage : msg
        )
      };
      
      setSession(sessionWithSentMessage);
      localStorage.setItem('zalo_chat_session', JSON.stringify(sessionWithSentMessage));

      // Phản hồi tự động thông minh (24/7)
      setTimeout(async () => {
        // Sử dụng hệ thống phản hồi thông minh
        const responseData = getResponse(text);
        let autoReplyText = getRandomResponse(responseData.responses);

        // Xử lý action đặc biệt
        if (responseData.action === 'show_newest_products') {
          try {
            const productsResponse = await getNewestProducts(5);
            if (productsResponse.code === 200 && productsResponse.products.length > 0) {
              autoReplyText = formatProductsMessage(productsResponse.products, "DANH SÁCH SẢN PHẨM MỚI NHẤT");
            } else {
              autoReplyText = "😔 Hiện tại không thể tải danh sách sản phẩm mới. Vui lòng thử lại sau hoặc liên hệ hotline: 0899-888-999";
            }
          } catch (error) {
            console.error('Error fetching newest products:', error);
            autoReplyText = "❌ Có lỗi xảy ra khi tải sản phẩm. Vui lòng thử lại sau hoặc liên hệ trực tiếp qua Zalo.";
          }
        } else if (responseData.action === 'show_gaming_laptops') {
          try {
            const gamingResponse = await getGamingLaptops(5);
            if (gamingResponse.code === 200 && gamingResponse.products.length > 0) {
              autoReplyText = formatProductsMessage(gamingResponse.products, "🎮 DANH SÁCH LAPTOP GAMING");
            } else {
              autoReplyText = "😔 Hiện tại không thể tải danh sách laptop gaming. Vui lòng thử lại sau hoặc liên hệ hotline: 0899-888-999";
            }
          } catch (error) {
            console.error('Error fetching gaming laptops:', error);
            autoReplyText = "❌ Có lỗi xảy ra khi tải laptop gaming. Vui lòng thử lại sau hoặc liên hệ trực tiếp qua Zalo.";
          }
        }

        const autoReply: ChatMessage = {
          id: `auto_reply_${Date.now()}`,
          text: autoReplyText,
          isUser: false,
          timestamp: new Date(),
          type: 'text',
          status: 'sent'
        };

        const finalSession = {
          ...sessionWithSentMessage,
          messages: [...sessionWithSentMessage.messages, autoReply]
        };

        setSession(finalSession);
        localStorage.setItem('zalo_chat_session', JSON.stringify(finalSession));

        // Thêm follow-up suggestions nếu có (trừ khi đã hiển thị sản phẩm hoặc thông tin hỗ trợ đầy đủ)
        if (responseData.followUp && responseData.followUp.length > 0 && 
            !['show_newest_products', 'show_gaming_laptops'].includes(responseData.action || '')) {
          setTimeout(() => {
            const followUpMessage: ChatMessage = {
              id: `followup_${Date.now()}`,
              text: `Bạn có thể quan tâm đến:\n${responseData.followUp!.map(item => `• ${item}`).join('\n')}`,
              isUser: false,
              timestamp: new Date(),
              type: 'text',
              status: 'sent'
            };

            const sessionWithFollowUp = {
              ...finalSession,
              messages: [...finalSession.messages, followUpMessage]
            };

            setSession(sessionWithFollowUp);
            localStorage.setItem('zalo_chat_session', JSON.stringify(sessionWithFollowUp));
          }, 1000);
        }
      }, 1500);
    }, 1000);
  }, [session]);

  // Lấy tin nhắn chưa đọc
  const getUnreadMessages = useCallback(() => {
    if (!session) return [];
    return session.messages.filter(msg => !msg.isUser && msg.timestamp > new Date(Date.now() - 300000)); // 5 phút gần đây
  }, [session]);

  // Đánh dấu đã đọc
  const markAsRead = useCallback(() => {
    setUnreadCount(0);
  }, []);

  // Kết thúc session
  const endSession = useCallback(() => {
    if (session) {
      const endedSession = { ...session, isActive: false };
      setSession(endedSession);
      localStorage.removeItem('zalo_chat_session');
    }
  }, [session]);

  // Khôi phục session từ localStorage
  useEffect(() => {
    const savedSession = localStorage.getItem('zalo_chat_session');
    if (savedSession) {
      try {
        const parsedSession = JSON.parse(savedSession);
        // Kiểm tra session có quá cũ không (quá 24h)
        const sessionAge = Date.now() - new Date(parsedSession.startTime).getTime();
        if (sessionAge < 24 * 60 * 60 * 1000) { // 24 giờ
          setSession({
            ...parsedSession,
            startTime: new Date(parsedSession.startTime),
            lastActivity: new Date(parsedSession.lastActivity),
            messages: parsedSession.messages.map((msg: Omit<ChatMessage, 'timestamp'> & { timestamp: string }) => ({
              ...msg,
              timestamp: new Date(msg.timestamp)
            }))
          });
        } else {
          localStorage.removeItem('zalo_chat_session');
        }
      } catch (error) {
        console.error('Error parsing saved session:', error);
        localStorage.removeItem('zalo_chat_session');
      }
    }
  }, []);

  // Cập nhật trạng thái online
  useEffect(() => {
    setIsOnline(isWorkingHours());
    
    // Kiểm tra mỗi phút
    const interval = setInterval(() => {
      setIsOnline(isWorkingHours());
    }, 60000);

    return () => clearInterval(interval);
  }, [isWorkingHours]);

  // Tính số tin nhắn chưa đọc
  useEffect(() => {
    const unread = getUnreadMessages();
    setUnreadCount(unread.length);
  }, [getUnreadMessages]);

  return {
    session,
    isOnline,
    unreadCount,
    chatConfig,
    startChatSession,
    sendMessage,
    markAsRead,
    endSession,
    getUnreadMessages,
    isWorkingHours: isWorkingHours()
  };
};
