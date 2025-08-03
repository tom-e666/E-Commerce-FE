'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Phone, User, Package, CreditCard, Headphones, Clock, Check, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useZaloChat } from '@/hooks/useZaloChat';

interface QuickAction {
  id: string;
  label: string;
  icon: React.ReactNode;
  message: string;
  category: 'product' | 'order' | 'support' | 'info';
}

const quickActions: QuickAction[] = [
  {
    id: 'product-info',
    label: 'Tư vấn sản phẩm',
    icon: <Package className="w-4 h-4" />,
    message: 'Tôi cần tư vấn sản phẩm laptop gaming phù hợp',
    category: 'product'
  },
  {
    id: 'order-status',
    label: 'Tra cứu đơn hàng',
    icon: <CreditCard className="w-4 h-4" />,
    message: 'Tôi muốn kiểm tra tình trạng đơn hàng',
    category: 'order'
  },
  {
    id: 'warranty',
    label: 'Chế độ bảo hành',
    icon: <Headphones className="w-4 h-4" />,
    message: 'Tôi cần thông tin về chế độ bảo hành',
    category: 'support'
  },
  {
    id: 'store-info',
    label: 'Thông tin cửa hàng',
    icon: <User className="w-4 h-4" />,
    message: 'Tôi muốn biết địa chỉ và giờ hoạt động của cửa hàng',
    category: 'info'
  }
];

const ZaloChatWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [showQuickActions, setShowQuickActions] = useState(true);

  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const {
    session,
    isOnline,
    unreadCount,
    chatConfig,
    startChatSession,
    sendMessage,
    markAsRead,
    isWorkingHours
  } = useZaloChat();

  // Auto scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [session?.messages]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  // Auto open chat after delay (only once per session) - DISABLED
  useEffect(() => {
    // Disabled auto-open functionality
    // if (!hasAutoOpened && chatConfig.autoOpenDelay > 0) {
    //   const timer = setTimeout(() => {
    //     setIsOpen(true);
    //     setHasAutoOpened(true);
    //   }, chatConfig.autoOpenDelay);

    //   return () => clearTimeout(timer);
    // }
  }, [hasAutoOpened, chatConfig.autoOpenDelay]);

  // Mark messages as read when chat is opened
  useEffect(() => {
    if (isOpen) {
      markAsRead();
    }
  }, [isOpen, markAsRead]);

  const handleOpenChat = () => {
    setIsOpen(true);
    if (!session) {
      startChatSession();
    }
  };

  const handleCloseChat = () => {
    setIsOpen(false);
    setShowQuickActions(true);
  };

  const handleSendMessage = () => {
    if (inputMessage.trim() && session) {
      sendMessage(inputMessage);
      setInputMessage('');
      setShowQuickActions(false);
    }
  };

  const handleQuickAction = (action: QuickAction) => {
    if (session) {
      sendMessage(action.message);
      setShowQuickActions(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const openZaloOA = () => {
    const zaloUrl = `https://zalo.me/${chatConfig.oaId}`;
    window.open(zaloUrl, '_blank');
  };

  const makePhoneCall = () => {
    window.open(`tel:${chatConfig.phoneNumber}`, '_self');
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('vi-VN', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <>
      {/* Chat Toggle Button */}
      <motion.div
        className="fixed bottom-6 right-6 z-50 md:bottom-6 md:right-6 bottom-4 right-4"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 1, type: "spring", stiffness: 260, damping: 20 }}
      >
        <Button
          onClick={handleOpenChat}
          className="w-14 h-14 md:w-14 md:h-14 w-12 h-12 rounded-full bg-blue-600 hover:bg-blue-700 shadow-lg relative group"
          size="icon"
        >
          <MessageCircle className="w-6 h-6 md:w-6 md:h-6 w-5 h-5 text-white" />
          
          {/* Unread Count Badge */}
          {unreadCount > 0 && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold"
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </motion.div>
          )}

          {/* Online Status Indicator */}
          <div className={`absolute -top-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
            isOnline ? 'bg-green-500' : 'bg-gray-400'
          }`} />

          {/* Pulse Animation for Online Status */}
          {isOnline && (
            <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-green-500 animate-ping opacity-75" />
          )}
        </Button>

        {/* Tooltip */}
        <div className="absolute bottom-full right-0 mb-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="bg-gray-800 text-white text-sm px-3 py-2 rounded-lg whitespace-nowrap">
            {isOnline ? 'Chat với chúng tôi' : 'Để lại tin nhắn'}
            <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800" />
          </div>
        </div>
      </motion.div>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.3 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.3 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed bottom-24 right-6 w-96 h-[500px] md:w-96 md:h-[500px] w-[calc(100vw-2rem)] h-[70vh] max-w-sm bg-white rounded-2xl shadow-2xl z-50 flex flex-col overflow-hidden border border-gray-200"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <MessageCircle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold">EMS Electronics</h3>
                  <div className="flex items-center space-x-1 text-sm">
                    <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-400' : 'bg-gray-400'}`} />
                    <span>{isOnline ? 'Đang hoạt động' : 'Ngoài giờ làm việc'}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                {/* Phone Call Button */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={makePhoneCall}
                  className="text-white hover:bg-white/20 h-8 w-8 p-0"
                >
                  <Phone className="w-4 h-4" />
                </Button>
                
                {/* Close Button */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCloseChat}
                  className="text-white hover:bg-white/20 h-8 w-8 p-0"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Working Hours Notice */}
            {!isWorkingHours && (
              <div className="bg-amber-50 border-b border-amber-200 p-3">
                <div className="flex items-center space-x-2 text-amber-700 text-sm">
                  <Clock className="w-4 h-4" />
                  <span>Ngoài giờ làm việc ({chatConfig.workingHours.start} - {chatConfig.workingHours.end})</span>
                </div>
              </div>
            )}

            {/* Messages Area */}
            <div className="flex-1 p-4 overflow-y-auto">
              <div className="space-y-4">
                {session?.messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                        message.isUser
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      <p className="text-sm">{message.text}</p>
                      <div className={`flex items-center justify-end mt-1 space-x-1 ${
                        message.isUser ? 'text-blue-100' : 'text-gray-500'
                      }`}>
                        <span className="text-xs">{formatTime(message.timestamp)}</span>
                        {message.isUser && (
                          <div className="w-4 h-4">
                            {message.status === 'sending' && (
                              <Clock className="w-3 h-3" />
                            )}
                            {message.status === 'sent' && (
                              <Check className="w-3 h-3" />
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* Quick Actions */}
            {showQuickActions && session && session.messages.length <= 1 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="px-4 py-3 border-t border-gray-200 bg-gray-50"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Câu hỏi thường gặp:</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowQuickActions(false)}
                    className="h-6 w-6 p-0"
                  >
                    <ChevronDown className="w-4 h-4" />
                  </Button>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {quickActions.map((action) => (
                    <Button
                      key={action.id}
                      variant="outline"
                      size="sm"
                      onClick={() => handleQuickAction(action)}
                      className="justify-start text-xs h-auto p-2 bg-white"
                    >
                      <div className="flex items-center space-x-2">
                        {action.icon}
                        <span className="truncate">{action.label}</span>
                      </div>
                    </Button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Input Area */}
            <div className="border-t border-gray-200 p-4">
              {/* Zalo OA Button */}
              <div className="mb-3">
                <Button
                  onClick={openZaloOA}
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white text-sm"
                  size="sm"
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Chat qua Zalo Official Account
                </Button>
              </div>
              
              {/* Message Input */}
              <div className="flex space-x-2">
                <Input
                  ref={inputRef}
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Nhập tin nhắn..."
                  className="flex-1 text-sm"
                  disabled={!session}
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!inputMessage.trim() || !session}
                  size="sm"
                  className="px-3"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
              
              {/* Footer Note */}
              <p className="text-xs text-gray-500 mt-2 text-center">
                Powered by Zalo • Phản hồi trong {isOnline ? '5-10 phút' : '2-4 giờ'}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ZaloChatWidget;
