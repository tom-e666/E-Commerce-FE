"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
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
import { 
  ArrowLeft, 
  KeyRound, 
  Loader2, 
  CheckCircle, 
  ShieldAlert,
  Eye,
  EyeOff
} from "lucide-react";
import { verifyPasswordResetToken, resetPasswordWithToken } from "@/services/auth/endpoints";

// Password schema
const passwordSchema = z.object({
  password: z
    .string()
    .min(8, "Mật khẩu phải có ít nhất 8 ký tự")
    .regex(/[A-Z]/, "Mật khẩu phải có ít nhất 1 chữ hoa")
    .regex(/[a-z]/, "Mật khẩu phải có ít nhất 1 chữ thường")
    .regex(/[0-9]/, "Mật khẩu phải có ít nhất 1 số")
    .regex(/[^a-zA-Z0-9]/, "Mật khẩu phải có ít nhất 1 ký tự đặc biệt"),
  confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, {
  message: "Mật khẩu xác nhận không khớp",
  path: ["confirmPassword"],
});

export default function ResetPasswordPage() {
  const router = useRouter();
  const params = useParams();
  const [userId, setUserId] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({
    password: "",
    confirmPassword: "",
    general: ""
  });
  
  const [isValidToken, setIsValidToken] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [resetSuccess, setResetSuccess] = useState(false);
  const [countdown, setCountdown] = useState(0);

  // Get userId and token from the URL
  useEffect(() => {
    if (params) {
      if (typeof params.userId === 'string') setUserId(params.userId);
      if (typeof params.token === 'string') setToken(decodeURIComponent(params.token as string));
    }
  }, [params]);

  // Verify the token when component mounts
  useEffect(() => {
    const verifyToken = async () => {
      if (!userId || !token) return;
      
      try {
        setIsLoading(true);
        const response = await verifyPasswordResetToken(userId, token);
        
        if (response.code === 200) {
          setIsValidToken(true);
        } else {
          setIsValidToken(false);
          setErrors({
            ...errors,
            general: response.message || "Liên kết đặt lại mật khẩu không hợp lệ hoặc đã hết hạn"
          });
        }
      } catch (error) {
        console.error("Token verification error:", error);
        setIsValidToken(false);
        setErrors({
          ...errors,
          general: "Không thể xác minh yêu cầu đặt lại mật khẩu"
        });
      } finally {
        setIsLoading(false);
      }
    };

    verifyToken();
  }, [userId, token]);

  // Handle countdown for redirect after success
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(prev => prev - 1);
      }, 1000);

      return () => clearTimeout(timer);
    } else if (resetSuccess && countdown === 0) {
      router.push("/login");
    }
  }, [countdown, resetSuccess, router]);

  const validateForm = () => {
    try {
      passwordSchema.parse({ password, confirmPassword });
      setErrors({
        password: "",
        confirmPassword: "",
        general: ""
      });
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors = {
          password: "",
          confirmPassword: "",
          general: ""
        };
        
        error.errors.forEach(err => {
          if (err.path[0] === "password") {
            newErrors.password = err.message;
          } else if (err.path[0] === "confirmPassword") {
            newErrors.confirmPassword = err.message;
          }
        });
        
        setErrors(newErrors);
      }
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm() || !userId || !token) return;
    
    setIsSubmitting(true);
    
    try {
      const response = await resetPasswordWithToken(userId, token, password);
      
      if (response.code === 200) {
        toast.success("Đặt lại mật khẩu thành công!");
        setResetSuccess(true);
        setCountdown(5); // Start countdown from 5 seconds
      } else {
        toast.error(response.message || "Không thể đặt lại mật khẩu");
        setErrors({
          ...errors,
          general: response.message || "Không thể đặt lại mật khẩu"
        });
      }
    } catch (error) {
      console.error("Password reset error:", error);
      toast.error("Đã xảy ra lỗi khi đặt lại mật khẩu");
      setErrors({
        ...errors,
        general: "Đã xảy ra lỗi khi đặt lại mật khẩu"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Render loading state
  if (isLoading) {
    return (
      <div className="w-full min-h-screen flex flex-col items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
            <p>Đang xác minh yêu cầu đặt lại mật khẩu...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Render invalid token state
  if (isValidToken === false) {
    return (
      <div className="w-full min-h-screen flex flex-col items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <div className="flex justify-center mb-4">
              <ShieldAlert className="h-12 w-12 text-red-500" />
            </div>
            <CardTitle className="text-xl text-center">Yêu cầu không hợp lệ</CardTitle>
            <CardDescription className="text-center">
              {errors.general || "Liên kết đặt lại mật khẩu không hợp lệ hoặc đã hết hạn"}
            </CardDescription>
          </CardHeader>
          <CardFooter className="flex justify-center">
            <Button asChild>
              <Link href="/forgotPassword">
                Yêu cầu liên kết mới
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

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
            <KeyRound className="h-12 w-12 mx-auto mb-4 text-primary" />
            <CardTitle className="text-2xl font-bold text-center">Đặt lại mật khẩu</CardTitle>
            <CardDescription className="text-center">
              Tạo mật khẩu mới cho tài khoản của bạn
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!resetSuccess ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                {errors.general && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-md text-red-600 text-sm">
                    {errors.general}
                  </div>
                )}
                
                <div className="space-y-2">
                  <Label htmlFor="password">Mật khẩu mới</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pr-10"
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                      onClick={() => setShowPassword(!showPassword)}
                      tabIndex={-1}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-sm text-red-500">{errors.password}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Xác nhận mật khẩu</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                  {errors.confirmPassword && (
                    <p className="text-sm text-red-500">{errors.confirmPassword}</p>
                  )}
                </div>
                
                <div className="text-sm text-gray-500 space-y-1">
                  <p>Mật khẩu phải có:</p>
                  <ul className="list-disc list-inside text-xs space-y-0.5">
                    <li className={password.length >= 8 ? "text-green-600" : ""}>Ít nhất 8 ký tự</li>
                    <li className={/[A-Z]/.test(password) ? "text-green-600" : ""}>Ít nhất 1 chữ hoa</li>
                    <li className={/[a-z]/.test(password) ? "text-green-600" : ""}>Ít nhất 1 chữ thường</li>
                    <li className={/[0-9]/.test(password) ? "text-green-600" : ""}>Ít nhất 1 số</li>
                    <li className={/[^a-zA-Z0-9]/.test(password) ? "text-green-600" : ""}>Ít nhất 1 ký tự đặc biệt</li>
                  </ul>
                </div>
                
                <Button
                  type="submit"
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Đang xử lý...
                    </>
                  ) : (
                    "Đặt lại mật khẩu"
                  )}
                </Button>
              </form>
            ) : (
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Chuyển về trang đăng nhập sau</span>
                    <span>{countdown} giây</span>
                  </div>
                  <Progress value={(5 - countdown) * 20} className="h-2" />
                </div>

                <div className="bg-green-50 p-4 rounded-md border-green-200 border text-center mb-4">
                  <div className="flex items-center justify-center mb-2">
                    <CheckCircle className="h-6 w-6 text-green-500 mr-2" />
                    <span className="font-medium text-green-700">Đặt lại mật khẩu thành công!</span>
                  </div>
                  <p className="text-green-600">Bạn có thể đăng nhập bằng mật khẩu mới của mình.</p>
                </div>
                
                <Button 
                  onClick={() => router.push("/login")}
                  className="w-full"
                >
                  Đăng nhập ngay
                </Button>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-center">
            {!resetSuccess && (
              <Button variant="ghost" asChild>
                <Link href="/login" className="flex items-center text-sm">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Quay lại đăng nhập
                </Link>
              </Button>
            )}
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
