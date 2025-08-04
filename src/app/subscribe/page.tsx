'use client'
import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Loader2, Mail, CheckCircle, Bell, Gift } from "lucide-react";
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
      <div className="w-full min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 px-4 py-16">
        <div className="w-full max-w-lg">
          <Card className="border-0 shadow-2xl rounded-3xl overflow-hidden bg-white/80 backdrop-blur-sm">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 to-purple-600/5"></div>
            <CardHeader className="relative flex flex-col items-center space-y-4 pt-8 pb-6">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                <Mail className="h-10 w-10 text-white" />
              </div>
              <div className="text-center space-y-2">
                <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Đăng ký nhận bản tin
                </CardTitle>
                <p className="text-gray-600 text-sm max-w-xs mx-auto leading-relaxed">
                  Nhận thông tin sản phẩm mới, ưu đãi độc quyền và tin tức công nghệ hàng tuần
                </p>
              </div>
            </CardHeader>
            
            <CardContent className="relative px-8 pb-8">
              {success ? (
                <div className="text-center py-12 space-y-6">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle className="h-8 w-8 text-green-600" />
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-2xl font-bold text-gray-900">Thành công!</h4>
                    <p className="text-gray-600 max-w-sm mx-auto">
                      Cảm ơn bạn đã đăng ký! Kiểm tra email để xác nhận đăng ký.
                    </p>
                  </div>
                  <Button 
                    onClick={() => setSuccess(false)}
                    variant="outline"
                    className="mt-4"
                  >
                    Đăng ký email khác
                  </Button>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Benefits */}
                  <div className="grid grid-cols-1 gap-4 mb-6">
                    <div className="flex items-center space-x-3 p-3 bg-blue-50/50 rounded-xl">
                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Bell className="h-4 w-4 text-blue-600" />
                      </div>
                      <span className="text-sm text-gray-700 font-medium">Tin tức công nghệ mới nhất</span>
                    </div>
                    <div className="flex items-center space-x-3 p-3 bg-purple-50/50 rounded-xl">
                      <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                        <Gift className="h-4 w-4 text-purple-600" />
                      </div>
                      <span className="text-sm text-gray-700 font-medium">Ưu đãi độc quyền và giảm giá</span>
                    </div>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="space-y-3">
                      <Label htmlFor="email" className="text-sm font-semibold text-gray-700">
                        Địa chỉ email
                      </Label>
                      <div className="relative">
                        <Input
                          id="email"
                          type="email"
                          required
                          value={email}
                          onChange={e => setEmail(e.target.value)}
                          placeholder="Nhập email của bạn"
                          className="w-full h-12 pl-12 pr-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-blue-500/20 transition-all duration-200"
                        />
                        <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      </div>
                    </div>
                    
                    <Button
                      type="submit"
                      className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02]"
                      disabled={isSubmitting || !email}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                          Đang đăng ký...
                        </>
                      ) : (
                        <>
                          <Mail className="mr-2 h-5 w-5" />
                          Đăng ký ngay
                        </>
                      )}
                    </Button>
                  </form>
                </div>
              )}
            </CardContent>
            
            <CardFooter className="relative px-8 pb-8 pt-0">
              <div className="w-full text-center space-y-2">
                <p className="text-xs text-gray-500 leading-relaxed">
                  Bằng cách đăng ký, bạn đồng ý với 
                  <span className="text-blue-600 hover:underline cursor-pointer"> Điều khoản dịch vụ </span>
                  và 
                  <span className="text-blue-600 hover:underline cursor-pointer"> Chính sách bảo mật</span>
                </p>
                <p className="text-xs text-gray-400">
                  ✉️ Không spam • 🔒 Bảo mật thông tin • 📧 Hủy đăng ký bất cứ lúc nào
                </p>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>

      {/* Background decoration */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 -right-32 w-80 h-80 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-32 w-80 h-80 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse delay-1000"></div>
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