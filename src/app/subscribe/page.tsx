'use client'
import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Loader2, Mail } from "lucide-react";
import { toast } from "sonner";
import Script from "next/script";

export default function SubscribePage() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSuccess(false);

    try {
      await subscribeEmail(email);
      setSuccess(true);
      toast.success("Đăng ký thành công!");
      setEmail("");
    } catch {
      toast.error("Đăng ký thất bại, vui lòng thử lại.");
    } finally {
      setIsSubmitting(false);
    }
  };

  function subscribeEmail(email: string): Promise<unknown> {
    return new Promise((resolve, reject) => {
      const formId = "161703884111217919";
      const callbackName = `ml_subscribe_${Date.now()}`;
      window[callbackName] = (response: unknown) => {
        delete window[callbackName];
        resolve(response);
      };
      const script = document.createElement("script");
      script.src = `https://assets.mailerlite.com/jsonp/1710093/forms/${formId}/subscribe?fields[email]=${encodeURIComponent(
        email
      )}&callback=${callbackName}`;
      script.onerror = () => {
        delete window[callbackName];
        reject(new Error("Network error"));
      };
      document.body.appendChild(script);
    });
  }

  return (
    <>
      <div className="w-full min-h-screen flex items-center justify-center bg-muted/40 px-4 py-16">
        <div className="w-full max-w-md">
          <Card className="border shadow-md rounded-xl">
            <CardHeader className="flex flex-col items-center space-y-2">
              <Mail className="h-10 w-10 text-primary mb-2" />
              <CardTitle className="text-2xl font-bold text-center">Đăng ký nhận bản tin</CardTitle>
            </CardHeader>
            <CardContent>
              {success ? (
                <div className="text-center py-8">
                  <h4 className="text-xl font-semibold mb-2 text-green-600">Cảm ơn bạn!</h4>
                  <p className="text-muted-foreground">Bạn đã đăng ký nhận bản tin thành công.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      required
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="Nhập email của bạn"
                      className="w-full"
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isSubmitting || !email}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Đang đăng ký...
                      </>
                    ) : (
                      "Đăng ký"
                    )}
                  </Button>
                </form>
              )}
            </CardContent>
            <CardFooter className="flex flex-col items-center pt-2">
              <p className="text-xs text-muted-foreground text-center">
                Đăng ký để nhận tin tức, ưu đãi và cập nhật mới nhất từ chúng tôi.
              </p>
            </CardFooter>
          </Card>
        </div>
      </div>

      <Script
        id="mailerlite-universal"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            (function(w,d,e,u,f,l,n){
              w[f]=w[f]||function(){(w[f].q=w[f].q||[]).push(arguments);},
              l=d.createElement(e),l.async=1,l.src=u,
              n=d.getElementsByTagName(e)[0],n.parentNode.insertBefore(l,n);
            })(window,document,'script','https://assets.mailerlite.com/js/universal.js','ml');
            ml('account', '1710093');
          `,
        }}
      />
    </>
  );
}