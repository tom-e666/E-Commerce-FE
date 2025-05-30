'use client'

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Send, Loader2 } from "lucide-react";

interface AddResponseFormProps {
  ticketId: string;
  onResponseAdded: () => void;
}

export default function Addresponseform({
  ticketId,
  onResponseAdded
}: AddResponseFormProps) {
  const [response, setResponse] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!response.trim()) return;

    setIsSubmitting(true);
    try {
      // Add your API call here
      console.log('Adding response to ticket:', ticketId, response);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setResponse('');
      onResponseAdded();
    } catch (error) {
      console.error('Error adding response:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Thêm phản hồi</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Textarea
            placeholder="Nhập phản hồi của bạn..."
            value={response}
            onChange={(e) => setResponse(e.target.value)}
            rows={4}
            required
          />
          <Button type="submit" disabled={isSubmitting || !response.trim()} className="gap-2">
            {isSubmitting ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Send className="mr-2 h-4 w-4" />
            )}
            Gửi phản hồi
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
