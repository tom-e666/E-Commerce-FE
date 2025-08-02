import { useState, useEffect, useCallback } from 'react';

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
    start: '08:00',
    end: '21:00',
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
          text: isWorkingHours() 
            ? 'Xin chào! Chúng tôi có thể hỗ trợ gì cho bạn?' 
            : 'Chào bạn! Hiện tại ngoài giờ làm việc. Bạn có thể để lại tin nhắn hoặc liên hệ qua Zalo.',
          isUser: false,
          timestamp: new Date(),
          type: 'text',
          status: 'sent'
        }
      ]
    };
    
    setSession(newSession);
    localStorage.setItem('zalo_chat_session', JSON.stringify(newSession));
  }, [isWorkingHours]);

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

      // Phản hồi tự động nếu ngoài giờ làm việc
      if (!isWorkingHours()) {
        setTimeout(() => {
          const autoReply: ChatMessage = {
            id: `auto_reply_${Date.now()}`,
            text: 'Cảm ơn bạn đã liên hệ! Chúng tôi sẽ phản hồi trong thời gian sớm nhất. Để được hỗ trợ nhanh hơn, bạn có thể liên hệ trực tiếp qua Zalo.',
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
        }, 1500);
      }
    }, 1000);
  }, [session, isWorkingHours]);

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
