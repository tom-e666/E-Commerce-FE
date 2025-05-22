"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";
import { z } from "zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, Mail, Loader2, CheckCircle, Info } from "lucide-react";
import { forgotPassword } from "@/services/auth/endpoints";

// Form schema
const formSchema = z.object({
  email: z.string().email("Email không hợp lệ"),
});

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({ email: "" });
  const [countdown, setCountdown] = useState(0);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  // Handle countdown when email is sent
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);

      return () => clearTimeout(timer);
    } else if (emailSent && countdown === 0) {
      setShowSuccessPopup(true);
    }
  }, [countdown, emailSent]);

  const validateForm = () => {
    try {
      formSchema.parse({ email });
      setErrors({ email: "" });
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const emailError = error.errors.find((e) => e.path[0] === "email");
        setErrors({
          email: emailError ? emailError.message : "",
        });
      }
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSubmitting(true);

    try {
      const response = await forgotPassword(email);

      if (response.code === 200) {
        toast.success("Đã gửi yêu cầu đặt lại mật khẩu!", {
          description: "Vui lòng kiểm tra email của bạn để tiếp tục.",
        });
        setEmailSent(true);
        setCountdown(5); // Start countdown from 5 seconds

        // You could also store the email in sessionStorage for use in the check-email page
        sessionStorage.setItem("resetPasswordEmail", email);
      } else {
        toast.error(
          response.message || "Không thể gửi yêu cầu đặt lại mật khẩu",
          {
            description: "Vui lòng kiểm tra email và thử lại.",
          }
        );
      }
    } catch (error) {
      console.error("Error sending reset email:", error);
      toast.error("Không thể kết nối đến máy chủ", {
        description: "Vui lòng thử lại sau hoặc liên hệ hỗ trợ.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Redirect after successful reset request
  const handleContinue = () => {
    router.push(`/check-email?email=${encodeURIComponent(email)}`);
  };

  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center p-4 py-16">
      <Image
        src="/shapelined.jpg"
        fill={true}
        className="object-cover w-full h-full -z-10"
        alt="background"
      />
      <div className="w-full max-w-md">
        <Card className="border shadow-md">
          <CardHeader className="space-y-1 flex flex-col items-center">
            <Image
              alt="icon"
              src="/gaming.png"
              width={80}
              height={80}
              className="mx-auto object-contain mb-4"
              priority
            />
            <CardTitle className="text-2xl font-bold text-center">
              Quên mật khẩu
            </CardTitle>
            <CardDescription className="text-center">
              Nhập email của bạn để nhận liên kết đặt lại mật khẩu
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!emailSent ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="Nhập email của bạn"
                      className="pl-10"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  {errors.email && (
                    <p className="text-sm text-red-500">{errors.email}</p>
                  )}
                </div>
                <Button
                  type="submit"
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Đang gửi yêu cầu...
                    </>
                  ) : (
                    "Gửi liên kết đặt lại mật khẩu"
                  )}
                </Button>
              </form>
            ) : (
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Đang chuyển hướng</span>
                    <span>{countdown > 0 ? countdown : 0}</span>
                  </div>
                  <Progress value={(5 - countdown) * 20} className="h-2" />
                </div>

                <div
                  className={`bg-green-50 p-4 rounded-md border-green-200 border text-center ${
                    showSuccessPopup ? "block" : "hidden"
                  } mb-4`}
                >
                  <div className="flex items-center justify-center mb-2">
                    <CheckCircle className="h-6 w-6 text-green-500 mr-2" />
                    <span className="font-medium text-green-700">
                      Yêu cầu đã được gửi thành công!
                    </span>
                  </div>
                  <p className="text-green-600">
                    Vui lòng kiểm tra hộp thư đến của bạn để tiếp tục.
                  </p>
                </div>

                <div className="bg-blue-50 p-4 rounded-md border border-blue-200 text-blue-700 text-sm">
                  <div className="flex">
                    <Info className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0" />
                    <div>
                      <p className="font-medium mb-1">Lưu ý:</p>
                      <ul className="list-disc list-inside space-y-1 text-blue-600">
                        <li>Liên kết đặt lại mật khẩu chỉ có hiệu lực trong 15 phút</li>
                        <li>
                          Nếu bạn không nhận được email, vui lòng kiểm tra thư mục
                          spam
                        </li>
                        <li>Đảm bảo email bạn đã nhập là chính xác</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <Button onClick={handleContinue} className="w-full">
                  Tiếp tục
                </Button>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-center">
            {!emailSent && (
              <Button variant="ghost" asChild>
                <Link href="/login" className="flex items-center text-sm">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Quay lại đăng nhập
                </Link>
              </Button>
            )}
          </CardFooter>
        </Card>
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600">
            Cần hỗ trợ?{" "}
            <Link href="/hotline" className="text-blue-600 hover:underline">
              Liên hệ hỗ trợ
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}