'use client'
import React, { useState } from "react";
import { gql, useApolloClient } from "@apollo/client";
import { toast } from "sonner";

const Page = () => {
    const client = useApolloClient();
    const [errors, setErrors] = useState<{
        username?: string;
        password?: string;
    }>({});

    const validateForm = (username: string, password: string) => {
        const newErrors: { username?: string; password?: string } = {};

        // Username validation
        if (!username) {
            newErrors.username = "Vui lòng nhập tên đăng nhập";
        } else if (username.length < 3) {
            newErrors.username = "Tên đăng nhập phải có ít nhất 3 ký tự";
        }

        // Password validation
        if (!password) {
            newErrors.password = "Vui lòng nhập mật khẩu";
        } else if (password.length < 6) {
            newErrors.password = "Mật khẩu phải có ít nhất 6 ký tự";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const username = (e.currentTarget.elements.namedItem('username') as HTMLInputElement).value;
        const password = (e.currentTarget.elements.namedItem('password') as HTMLInputElement).value;

        if (!validateForm(username, password)) {
            return;
        }

        const SIGNUP_MUTATION = gql`
            mutation Signup($user: UserLogInput!){
                signup(user: $user){
                    code
                    message
                    token
                }
            }
        `;

        return toast.promise(
            async () => {
                const response = await client.mutate({
                    mutation: SIGNUP_MUTATION,
                    variables: {
                        user: {
                            username,
                            password
                        }
                    }
                });

                const { code, message, token } = response.data.signup;
                if (code === 200) {
                    localStorage.setItem('token', token);
                    window.location.href = '/';
                    return "Đăng ký thành công";
                } else {
                    throw new Error(message);
                }
            },
            {
                loading: 'Đang đăng ký...',
                success: 'Đăng ký thành công! Đang chuyển hướng...',
                error: (error) => `${error.message}`
            }
        );
    };

    return (
        <div className="w-full max-w-md mx-auto p-6">
            <h2 className="text-2xl font-semibold mb-6">Đăng kí người dùng mới</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="username" className="block text-sm font-medium mb-1">
                        Tên đăng nhập
                    </label>
                    <input
                        type="text"
                        id="username"
                        name="username"
                        placeholder="username"
                        className={`w-full border-b-2 p-2 ${errors.username ? 'border-red-500' : ''}`}
                    />
                    {errors.username && (
                        <p className="text-red-500 text-sm mt-1">{errors.username}</p>
                    )}
                </div>

                <div>
                    <label htmlFor="password" className="block text-sm font-medium mb-1">
                        Mật khẩu
                    </label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        placeholder="password"
                        className={`w-full border-b-2 p-2 ${errors.password ? 'border-red-500' : ''}`}
                    />
                    {errors.password && (
                        <p className="text-red-500 text-sm mt-1">{errors.password}</p>
                    )}
                </div>

                <button
                    type="submit"
                    className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-500 transition-colors"
                >
                    Đăng kí
                </button>
            </form>
        </div>
    );
};

export default Page;