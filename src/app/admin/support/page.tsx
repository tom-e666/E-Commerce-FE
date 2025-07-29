'use client'

import { useState, useEffect } from 'react';
import { 
  getSupportTickets, 
  getSupportTicketResponses,
  updateSupportTicket,
  createSupportTicketResponse,
  SupportTicket,
  TicketResponse 
} from '@/services/supportTicket/endpoints';
import { toast } from 'sonner';

// UI Components
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
} from "@/components/ui/select";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

// Icons
import { 
  Check, 
  Clock, 
  FileText, 
  Filter, 
  Loader2, 
  Mail, 
  MessageSquare, 
  RefreshCw, 
  Search, 
  Send, 
  User 
} from 'lucide-react';

export default function AdminSupportPage() {
  const [loading, setLoading] = useState(true);
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [filteredTickets, setFilteredTickets] = useState<SupportTicket[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [ticketResponses, setTicketResponses] = useState<TicketResponse[]>([]);
  
  // Filter states
  const [statusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [dateFilter, setDateFilter] = useState<string>('all');
  
  // Response form state
  const [responseMessage, setResponseMessage] = useState<string>('');
  const [responseSubject, setResponseSubject] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isChangingStatus, setIsChangingStatus] = useState(false);
  
  const [activeTab, setActiveTab] = useState<string>('all');

  useEffect(() => {
    fetchTickets();
  }, []);

  useEffect(() => {
    filterTickets();
  }, [tickets, statusFilter, searchQuery, dateFilter, activeTab, filterTickets]);

  const fetchTickets = async () => {
    setLoading(true);
    try {
      const response = await getSupportTickets();
      if (response.code === 200 && response.supportTickets) {
        setTickets(response.supportTickets);
      } else {
        toast.error("Không thể tải danh sách phiếu hỗ trợ");
      }
    } catch (error) {
      console.error("Error fetching support tickets:", error);
      toast.error("Đã xảy ra lỗi khi tải dữ liệu");
    } finally {
      setLoading(false);
    }
  };

  const fetchTicketResponses = async (ticketId: string) => {
    try {
      const response = await getSupportTicketResponses(ticketId);
      if (response.code === 200 && response.supportTicketResponses) {
        setTicketResponses(response.supportTicketResponses);
      } else {
        setTicketResponses([]);
      }
    } catch (error) {
      console.error("Error fetching ticket responses:", error);
      setTicketResponses([]);
    }
  };

  const filterTickets = useCallback(() => {
    let filtered = [...tickets];
    
    // Filter by tab (status groups)
    if (activeTab === 'open') {
      filtered = filtered.filter(ticket => ticket.status === 'open');
    } else if (activeTab === 'inProgress') {
      filtered = filtered.filter(ticket => ticket.status === 'in_progress');
    } else if (activeTab === 'resolved') {
      filtered = filtered.filter(ticket => ticket.status === 'resolved');
    } else if (activeTab === 'closed') {
      filtered = filtered.filter(ticket => ticket.status === 'closed');
    }
    
    // Apply status filter if not 'all'
    if (statusFilter !== 'all') {
      filtered = filtered.filter(ticket => ticket.status === statusFilter);
    }
    
    // Apply search filter
    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        ticket => 
          ticket.subject.toLowerCase().includes(query) || 
          ticket.message.toLowerCase().includes(query)
      );
    }
    
    // Apply date filter
    if (dateFilter === 'today') {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      filtered = filtered.filter(ticket => {
        const ticketDate = new Date(ticket.created_at);
        return ticketDate >= today;
      });
    } else if (dateFilter === 'week') {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      filtered = filtered.filter(ticket => {
        const ticketDate = new Date(ticket.created_at);
        return ticketDate >= weekAgo;
      });
    } else if (dateFilter === 'month') {
      const monthAgo = new Date();
      monthAgo.setMonth(monthAgo.getMonth() - 1);
      filtered = filtered.filter(ticket => {
        const ticketDate = new Date(ticket.created_at);
        return ticketDate >= monthAgo;
      });
    }
    
    setFilteredTickets(filtered);
  }, [tickets, statusFilter, searchQuery, dateFilter, activeTab]);

  const handleSelectTicket = async (ticket: SupportTicket) => {
    setSelectedTicket(ticket);
    await fetchTicketResponses(ticket.id);
  };

  const handleSubmitResponse = async () => {
    if (!selectedTicket || !responseMessage.trim()) return;
    
    setIsSubmitting(true);
    try {
      const response = await createSupportTicketResponse(
        selectedTicket.id, 
        responseMessage,
        responseSubject.trim() || 'Phản hồi từ đội ngũ hỗ trợ'
      );
      
      if (response.code === 200) {
        toast.success("Đã gửi phản hồi thành công");
        setResponseMessage('');
        setResponseSubject('');
        
        // If ticket was open, automatically change to in_progress
        if (selectedTicket.status === 'open') {
          await updateTicketStatus(selectedTicket.id, 'in_progress');
        }
        
        // Refresh ticket data
        await fetchTicketResponses(selectedTicket.id);
        await fetchTickets();
      } else {
        toast.error(response.message || "Không thể gửi phản hồi");
      }
    } catch (error) {
      console.error("Error submitting response:", error);
      toast.error("Đã xảy ra lỗi khi gửi phản hồi");
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateTicketStatus = async (ticketId: string, status: string) => {
    setIsChangingStatus(true);
    try {
      const response = await updateSupportTicket(ticketId, { status });
      if (response.code === 200 && response.supportTicket) {
        toast.success(`Đã chuyển trạng thái sang "${getStatusLabel(status)}"`);
        
        // Update local state
        setTickets(prev => 
          prev.map(ticket => 
            ticket.id === ticketId 
              ? { ...ticket, status } 
              : ticket
          )
        );
        
        if (selectedTicket && selectedTicket.id === ticketId) {
          setSelectedTicket({ ...selectedTicket, status });
        }
      } else {
        toast.error(response.message || "Không thể cập nhật trạng thái");
      }
    } catch (error) {
      console.error("Error updating ticket status:", error);
      toast.error("Đã xảy ra lỗi khi cập nhật trạng thái");
    } finally {
      setIsChangingStatus(false);
    }
  };

  const getStatusLabel = (status: string): string => {
    switch (status) {
      case 'open': return 'Đang mở';
      case 'in_progress': return 'Đang xử lý';
      case 'resolved': return 'Đã giải quyết';
      case 'closed': return 'Đã đóng';
      default: return status;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'open':
        return <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-200">Đang mở</Badge>;
      case 'in_progress':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-600 border-yellow-200">Đang xử lý</Badge>;
      case 'resolved':
        return <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">Đã giải quyết</Badge>;
      case 'closed':
        return <Badge variant="outline" className="bg-gray-50 text-gray-600 border-gray-200">Đã đóng</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('vi-VN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const getAvatarInitials = (name: string = 'User') => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  // Count tickets by status
  const openCount = tickets.filter(t => t.status === 'open').length;
  const inProgressCount = tickets.filter(t => t.status === 'in_progress').length;
  const resolvedCount = tickets.filter(t => t.status === 'resolved').length;
  const closedCount = tickets.filter(t => t.status === 'closed').length;

  if (loading) {
    return (
      <div className="container mx-auto p-4 md:p-6">
        <div className="flex items-center mb-6">
          <Skeleton className="h-8 w-64" />
          <div className="ml-auto">
            <Skeleton className="h-10 w-24" />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          {[1, 2, 3, 4].map(i => (
            <Skeleton key={i} className="h-24" />
          ))}
        </div>
        
        <div className="flex flex-col md:flex-row gap-6">
          <div className="w-full md:w-1/3">
            <Skeleton className="h-12 mb-4" />
            <div className="space-y-2">
              {[1, 2, 3, 4, 5].map(i => (
                <Skeleton key={i} className="h-16" />
              ))}
            </div>
          </div>
          
          <div className="w-full md:w-2/3">
            <Skeleton className="h-96" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 md:p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Quản lý phiếu hỗ trợ</h1>
        <Button onClick={fetchTickets} variant="outline" className="gap-2">
          <RefreshCw className="h-4 w-4" />
          Làm mới
        </Button>
      </div>

      {/* Status summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <Card className="bg-blue-50 border-blue-200">
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-blue-700 text-lg flex justify-between">
              <span>Đang mở</span>
              <Badge className="ml-2 bg-blue-100 text-blue-800 hover:bg-blue-200">{openCount}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <p className="text-sm text-blue-600">Yêu cầu mới cần xử lý</p>
          </CardContent>
        </Card>
        
        <Card className="bg-yellow-50 border-yellow-200">
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-yellow-700 text-lg flex justify-between">
              <span>Đang xử lý</span>
              <Badge className="ml-2 bg-yellow-100 text-yellow-800 hover:bg-yellow-200">{inProgressCount}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <p className="text-sm text-yellow-600">Đang được nhân viên xử lý</p>
          </CardContent>
        </Card>
        
        <Card className="bg-green-50 border-green-200">
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-green-700 text-lg flex justify-between">
              <span>Đã giải quyết</span>
              <Badge className="ml-2 bg-green-100 text-green-800 hover:bg-green-200">{resolvedCount}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <p className="text-sm text-green-600">Vấn đề đã được giải quyết</p>
          </CardContent>
        </Card>
        
        <Card className="bg-gray-50 border-gray-200">
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-gray-700 text-lg flex justify-between">
              <span>Đã đóng</span>
              <Badge className="ml-2 bg-gray-100 text-gray-800 hover:bg-gray-200">{closedCount}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <p className="text-sm text-gray-600">Yêu cầu đã được đóng</p>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left panel - Ticket list */}
        <div className="w-full lg:w-2/5 xl:w-1/3">
          <Card>
            <CardHeader className="p-4 pb-2">
              <div className="flex flex-col space-y-3">
                <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="grid grid-cols-4 h-9">
                    <TabsTrigger value="all" className="text-xs">Tất cả</TabsTrigger>
                    <TabsTrigger value="open" className="text-xs">Đang mở</TabsTrigger>
                    <TabsTrigger value="inProgress" className="text-xs">Đang xử lý</TabsTrigger>
                    <TabsTrigger value="resolved" className="text-xs">Đã giải quyết</TabsTrigger>
                  </TabsList>
                </Tabs>
                
                <div className="flex gap-2">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Tìm kiếm phiếu hỗ trợ..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-8"
                      />
                    </div>
                  </div>
                  
                  <Select value={dateFilter} onValueChange={setDateFilter}>
                    <SelectTrigger className="w-[120px]">
                      <Filter className="mr-2 h-4 w-4" />
                      <span>Thời gian</span>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tất cả</SelectItem>
                      <SelectItem value="today">Hôm nay</SelectItem>
                      <SelectItem value="week">Tuần này</SelectItem>
                      <SelectItem value="month">Tháng này</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="p-4 pt-2">
              <div className="space-y-2 max-h-[calc(100vh-19rem)] overflow-y-auto">
                {filteredTickets.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <FileText className="mx-auto h-12 w-12 text-gray-300" />
                    <p className="mt-2">Không tìm thấy phiếu hỗ trợ phù hợp</p>
                  </div>
                ) : (
                  filteredTickets.map((ticket) => (
                    <div
                      key={ticket.id}
                      className={`p-3 rounded-md border cursor-pointer transition-all hover:bg-gray-50 ${
                        selectedTicket?.id === ticket.id ? 'bg-blue-50 border-blue-200' : ''
                      }`}
                      onClick={() => handleSelectTicket(ticket)}
                    >
                      <div className="flex justify-between items-start mb-1">
                        <h3 className="font-medium line-clamp-1">{ticket.subject}</h3>
                        {getStatusBadge(ticket.status)}
                      </div>
                      <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                        {ticket.message}
                      </p>
                      <div className="flex justify-between text-xs text-gray-500">
                        <span className="flex items-center">
                          <User className="h-3 w-3 mr-1" />
                          ID: {ticket.user_id.substring(0, 8)}
                        </span>
                        <span className="flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          {formatDate(ticket.created_at)}
                        </span>
                      </div>
                    </div>
                  )
                )
              )
                }
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Right panel - Ticket details */}
        <div className="w-full lg:w-3/5 xl:w-2/3">
          {selectedTicket ? (
            <Card>
              <CardHeader className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      {getStatusBadge(selectedTicket.status)}
                      <span className="text-sm text-gray-500">
                        #{selectedTicket.id.substring(0, 8)}
                      </span>
                    </div>
                    <h2 className="text-xl font-semibold mb-1">{selectedTicket.subject}</h2>
                    <div className="flex items-center text-sm text-gray-500">
                      <User className="h-4 w-4 mr-1" />
                      <span>Người dùng: {selectedTicket.user_id}</span>
                      <span className="mx-2">•</span>
                      <Clock className="h-4 w-4 mr-1" />
                      <span>{formatDate(selectedTicket.created_at)}</span>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Select
                      disabled={isChangingStatus}
                      value={selectedTicket.status}
                      onValueChange={(value) => updateTicketStatus(selectedTicket.id, value)}
                    >
                      <SelectTrigger className="w-[140px]">
                        {isChangingStatus ? (
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        ) : (
                          <></>
                        )}
                        <span>Trạng thái</span>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="open">Đang mở</SelectItem>
                        <SelectItem value="in_progress">Đang xử lý</SelectItem>
                        <SelectItem value="resolved">Đã giải quyết</SelectItem>
                        <SelectItem value="closed">Đã đóng</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="p-4 pt-0">
                {/* Original message */}
                <div className="bg-gray-50 p-4 rounded-md mb-6 border">
                  <div className="flex items-center gap-2 mb-2">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-blue-100 text-blue-600">
                        {getAvatarInitials(selectedTicket.user_id)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">Khách hàng</p>
                      <p className="text-xs text-gray-500">Yêu cầu ban đầu</p>
                    </div>
                  </div>
                  <p className="whitespace-pre-line">{selectedTicket.message}</p>
                </div>
                
                {/* Ticket responses */}
                {ticketResponses && ticketResponses.length > 0 ? (
                  <div className="space-y-4 mb-6">
                    <h3 className="font-medium flex items-center">
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Phản hồi ({ticketResponses.length})
                    </h3>
                    
                    <div className="space-y-4 max-h-[400px] overflow-y-auto">
                      {ticketResponses.map((response) => (
                        <div key={response.id} className="p-4 rounded-md border">
                          <div className="flex items-center gap-2 mb-2">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback className={
                                response.user_id === selectedTicket.user_id
                                  ? "bg-blue-100 text-blue-600"
                                  : "bg-green-100 text-green-600"
                              }>
                                {getAvatarInitials(response.user?.full_name || response.user_id)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">
                                {response.user_id === selectedTicket.user_id
                                  ? "Khách hàng"
                                  : response.user?.full_name || "Nhân viên hỗ trợ"}
                              </p>
                              <p className="text-xs text-gray-500">{formatDate(response.created_at)}</p>
                            </div>
                          </div>
                          {response.subject && (
                            <p className="font-medium mb-1">{response.subject}</p>
                          )}
                          <p className="whitespace-pre-line">{response.message}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-6 text-gray-500 mb-6">
                    <MessageSquare className="mx-auto h-12 w-12 text-gray-300" />
                    <p className="mt-2">Chưa có phản hồi nào</p>
                  </div>
                )}
                
                {/* Response form */}
                {selectedTicket.status !== 'closed' && (
                  <div>
                    <Separator className="my-4" />
                    <h3 className="font-medium mb-3">Thêm phản hồi</h3>
                    
                    <div className="space-y-3">
                      <Input
                        placeholder="Tiêu đề phản hồi (tùy chọn)"
                        value={responseSubject}
                        onChange={(e) => setResponseSubject(e.target.value)}
                        disabled={isSubmitting}
                      />
                      
                      <Textarea
                        placeholder="Nhập nội dung phản hồi của bạn..."
                        value={responseMessage}
                        onChange={(e) => setResponseMessage(e.target.value)}
                        className="min-h-[100px]"
                        disabled={isSubmitting}
                      />
                      
                      <div className="flex justify-end">
                        <Button
                          onClick={handleSubmitResponse}
                          disabled={!responseMessage.trim() || isSubmitting}
                          className="gap-2"
                        >
                          {isSubmitting ? (
                            <>
                              <Loader2 className="h-4 w-4 animate-spin" />
                              Đang gửi...
                            </>
                          ) : (
                            <>
                              <Send className="h-4 w-4" />
                              Gửi phản hồi
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
                
                {selectedTicket.status === 'closed' && (
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center">
                    <Check className="h-8 w-8 mx-auto text-gray-500 mb-2" />
                    <h3 className="text-lg font-medium text-gray-700">Yêu cầu hỗ trợ đã đóng</h3>
                    <p className="text-gray-500 mb-4">Yêu cầu này đã được đóng và không thể thêm phản hồi mới.</p>
                    
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="outline">Mở lại yêu cầu</Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Mở lại phiếu hỗ trợ?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Bạn có chắc chắn muốn mở lại phiếu hỗ trợ này để tiếp tục xử lý?
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Hủy</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => updateTicketStatus(selectedTicket.id, 'in_progress')}
                          >
                            Mở lại
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="h-full flex items-center justify-center border rounded-lg p-12 bg-gray-50">
              <div className="text-center">
                <Mail className="mx-auto h-12 w-12 text-gray-300" />
                <h3 className="mt-4 text-lg font-medium text-gray-900">Không có phiếu nào được chọn</h3>
                <p className="mt-2 text-sm text-gray-500">
                  Chọn một phiếu hỗ trợ từ danh sách bên trái để xem chi tiết và phản hồi
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
