'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSupportTicket } from '@/hooks/useSupportTicket';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
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
import { Loader2 } from 'lucide-react';

// Form validation schema
const formSchema = z.object({
  subject: z.string().min(5, {
    message: 'Tiêu đề phải có ít nhất 5 ký tự',
  }).max(100, {
    message: 'Tiêu đề không được vượt quá 100 ký tự',
  }),
  message: z.string().min(10, {
    message: 'Nội dung phải có ít nhất 10 ký tự',
  }).max(1000, {
    message: 'Nội dung không được vượt quá 1000 ký tự',
  }),
});

type CreateTicketDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onTicketCreated?: () => void;
};

export default function CreateTicketDialog({ 
  open, 
  onOpenChange,
  onTicketCreated
}: CreateTicketDialogProps) {
  const { createTicket } = useSupportTicket();
  const router = useRouter();
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
      const result = await createTicket(values.subject, values.message);
      if (result) {
        toast.success('Yêu cầu hỗ trợ đã được tạo thành công');
        form.reset();
        onOpenChange(false);
        
        // Navigate to the ticket or refresh the list
        if (onTicketCreated) {
          onTicketCreated();
        } else {
          router.push(`/support/${result.id}`);
        }
      } else {
        toast.error('Không thể tạo yêu cầu hỗ trợ');
      }
    } catch (error) {
      console.error('Error creating ticket:', error);
      toast.error('Đã xảy ra lỗi khi tạo yêu cầu hỗ trợ');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Tạo yêu cầu hỗ trợ mới</DialogTitle>
          <DialogDescription>
            Hãy mô tả chi tiết vấn đề của bạn để chúng tôi có thể hỗ trợ hiệu quả
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="subject"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tiêu đề</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Nhập tiêu đề yêu cầu hỗ trợ" 
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
                  <FormLabel>Mô tả chi tiết</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Mô tả chi tiết vấn đề bạn đang gặp phải" 
                      className="min-h-[150px]" 
                      {...field} 
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}
              >
                Hủy
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Đang gửi...
                  </>
                ) : 'Gửi yêu cầu'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
