'use client'

import { useState } from 'react';
import { useSupportTicket } from '@/hooks/useSupportTicket';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Loader2, Send } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

// Form validation schema
const formSchema = z.object({
  subject: z.string().min(3, {
    message: 'Tiêu đề phải có ít nhất 3 ký tự',
  }).max(100, {
    message: 'Tiêu đề không được vượt quá 100 ký tự',
  }),
  message: z.string().min(5, {
    message: 'Nội dung phải có ít nhất 5 ký tự',
  }).max(1000, {
    message: 'Nội dung không được vượt quá 1000 ký tự',
  }),
});

type AddResponseFormProps = {
  ticketId: string;
  onResponseAdded?: () => void;
};

export default function AddResponseForm({ 
  ticketId,
  onResponseAdded
}: AddResponseFormProps) {
  const { addResponse } = useSupportTicket();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      subject: '',
      message: '',
    },
  });

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    try {
      const success = await addResponse(ticketId, values.message, values.subject);
      if (success) {
        toast.success('Phản hồi đã được gửi thành công');
        form.reset();
        
        // Call callback if provided
        if (onResponseAdded) {
          onResponseAdded();
        }
      } else {
        toast.error('Không thể gửi phản hồi');
      }
    } catch (error) {
      console.error('Error adding response:', error);
      toast.error('Đã xảy ra lỗi khi gửi phản hồi');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="subject"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tiêu đề</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Nhập tiêu đề phản hồi" 
                      {...field} 
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nội dung phản hồi</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Nhập nội dung phản hồi của bạn" 
                      className="min-h-[100px]" 
                      {...field} 
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end">
              <Button type="submit" disabled={isSubmitting} className="gap-2">
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
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
