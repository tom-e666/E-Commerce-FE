'use client'

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Minimize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Image from 'next/image';
import { getResponse, getRandomResponse } from '@/utils/chatResponses';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

interface ZaloChatWidgetProps {
  zaloOAId?: string; // Zalo Official Account ID
  phoneNumber?: string; // Số điện thoại hỗ trợ
  position?: 'bottom-right' | 'bottom-left';
}

export default function ZaloChatWidget({ 
  zaloOAId = '4291017113463940775', // OA ID mặc định (thay bằng OA ID thực tế)
  phoneNumber = '0899888999',
  position = 'bottom-right'
}: ZaloChatWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Xin chào! Tôi là trợ lý ảo của EMS Electronics. Tôi có thể hỗ trợ gì cho bạn hôm nay? 😊',
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');

  // Tự động hiển thị widget sau 3 giây
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsOpen(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      text: inputMessage,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, newMessage]);
    const userInput = inputMessage;
    setInputMessage('');

    // Sử dụng hệ thống phản hồi thông minh
    setTimeout(() => {
      const responseData = getResponse(userInput);
      const responseText = getRandomResponse(responseData.responses);
      
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: responseText,
        isUser: false,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botResponse]);

      // Thêm follow-up suggestions nếu có
      if (responseData.followUp && responseData.followUp.length > 0) {
        setTimeout(() => {
          const followUpMessage: Message = {
            id: (Date.now() + 2).toString(),
            text: `Bạn có thể quan tâm đến:\n${responseData.followUp!.map(item => `• ${item}`).join('\n')}`,
            isUser: false,
            timestamp: new Date()
          };
          setMessages(prev => [...prev, followUpMessage]);
        }, 800);
      }
    }, 1000);
  };

  const handleZaloRedirect = () => {
    // Chuyển hướng đến Zalo OA hoặc tin nhắn Zalo
    const zaloUrl = `https://zalo.me/${phoneNumber}`;
    window.open(zaloUrl, '_blank');
  };

  const handleZaloOARedirect = () => {
    // Chuyển hướng đến Official Account
    const oaUrl = `https://page.zalo.me/${zaloOAId}`;
    window.open(oaUrl, '_blank');
  };

  const quickActions = [
    { label: 'Tư vấn sản phẩm', action: () => { setInputMessage('Tôi cần tư vấn sản phẩm'); handleQuickAction('Tôi cần tư vấn sản phẩm'); } },
    { label: 'Kiểm tra đơn hàng', action: () => { setInputMessage('Tôi muốn kiểm tra đơn hàng'); handleQuickAction('Tôi muốn kiểm tra đơn hàng'); } },
    { label: 'Hỗ trợ kỹ thuật', action: () => { setInputMessage('Tôi cần hỗ trợ kỹ thuật'); handleQuickAction('Tôi cần hỗ trợ kỹ thuật'); } },
  ];

  const handleQuickAction = (message: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      text: message,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, newMessage]);

    // Sử dụng hệ thống phản hồi thông minh
    setTimeout(() => {
      const responseData = getResponse(message);
      const responseText = getRandomResponse(responseData.responses);
      
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: responseText,
        isUser: false,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botResponse]);

      // Thêm follow-up suggestions nếu có
      if (responseData.followUp && responseData.followUp.length > 0) {
        setTimeout(() => {
          const followUpMessage: Message = {
            id: (Date.now() + 2).toString(),
            text: `Bạn có thể quan tâm đến:\n${responseData.followUp!.map(item => `• ${item}`).join('\n')}`,
            isUser: false,
            timestamp: new Date()
          };
          setMessages(prev => [...prev, followUpMessage]);
        }, 800);
      }
    }, 1000);
  };

  const positionClasses = position === 'bottom-right' 
    ? 'bottom-4 right-4' 
    : 'bottom-4 left-4';

  return (
    <div className={`fixed ${positionClasses} z-50`}>
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Button
              onClick={() => setIsOpen(true)}
              className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-lg hover:shadow-xl transition-all duration-300"
              size="icon"
            >
              <MessageCircle className="w-8 h-8 text-white" />
            </Button>
          </motion.div>
        )}

        {isOpen && (
          <motion.div
            initial={{ scale: 0, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0, opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="w-80 shadow-2xl border-0">
              {/* Header */}
              <CardHeader className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 rounded-t-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Avatar className="w-10 h-10">
                      <AvatarImage src="/logo.png" alt="EMS Support" />
                      <AvatarFallback className="bg-white text-blue-600 font-bold">
                        EMS
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold">Hỗ trợ khách hàng</h3>
                      <p className="text-xs opacity-90">Trực tuyến</p>
                    </div>
                  </div>
                  <div className="flex space-x-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-white hover:bg-white/20"
                      onClick={() => setIsMinimized(!isMinimized)}
                    >
                      <Minimize2 className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-white hover:bg-white/20"
                      onClick={() => setIsOpen(false)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>

              {/* Content */}
              {!isMinimized && (
                <CardContent className="p-0">
                  {/* Messages */}
                  <div className="h-80 overflow-y-auto p-4 space-y-3">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[70%] p-3 rounded-lg ${
                            message.isUser
                              ? 'bg-blue-500 text-white'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          <p className="text-sm">{message.text}</p>
                          <p className={`text-xs mt-1 ${
                            message.isUser ? 'text-blue-100' : 'text-gray-500'
                          }`}>
                            {message.timestamp.toLocaleTimeString('vi-VN', {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Quick Actions */}
                  <div className="p-4 border-t">
                    <p className="text-sm font-medium mb-2">Bạn có thể:</p>
                    <div className="space-y-2">
                      {quickActions.map((action, index) => (
                        <Button
                          key={index}
                          variant="outline"
                          size="sm"
                          className="w-full justify-start text-xs"
                          onClick={action.action}
                        >
                          {action.label}
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Zalo Integration */}
                  <div className="p-4 border-t bg-gray-50">
                    <p className="text-sm font-medium mb-3">Hoặc chat trực tiếp qua:</p>
                    <div className="space-y-2">
                      <Button
                        className="w-full bg-[#0068FF] hover:bg-[#0056CC] text-white"
                        onClick={handleZaloOARedirect}
                      >
                        <Image
                          src="/zalo.webp"
                          alt="Zalo"
                          width={20}
                          height={20}
                          className="mr-2"
                        />
                        Chat qua Zalo OA
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={handleZaloRedirect}
                      >
                        <Image
                          src="/zalo.webp"
                          alt="Zalo"
                          width={20}
                          height={20}
                          className="mr-2"
                        />
                        Gọi Zalo: {phoneNumber}
                      </Button>
                    </div>
                  </div>

                  {/* Input */}
                  <div className="p-4 border-t">
                    <div className="flex space-x-2">
                      <Input
                        placeholder="Nhập tin nhắn..."
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                        className="flex-1"
                      />
                      <Button
                        onClick={handleSendMessage}
                        size="icon"
                        className="bg-blue-500 hover:bg-blue-600"
                      >
                        <Send className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              )}
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
