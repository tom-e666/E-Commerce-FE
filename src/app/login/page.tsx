'use client'
import { toast } from "sonner";
import React, { useEffect } from "react";
import { gql, useApolloClient } from "@apollo/client";
import Image from "next/image";
const Page = () => {
  const [identifier, setIdentifier] = React.useState<string>('');
  const [password, setPassword] = React.useState<string>('');
  const [counter, setCounter] = React.useState(-1);
  const client = useApolloClient();
  const handleLogin = async () => {
    const LOGIN_MUTATION = gql`
        mutation Login($user: UserLogInput!){
            login(user: $user){
                code
                message
                token
            }
        }`;
    return toast.promise(
      async () => {
        const response = await client.mutate({
          mutation: LOGIN_MUTATION,
          variables: {
            user: {
              username: identifier,
              password: password
            }
          }
        });
        const { code, message, token } = response.data.login;
        if (code === 200) {
          localStorage.setItem('token', token)
          setCounter(60);
          window.location.href = '/';
          return "Login sucessful"
        } else {
          throw new Error(message);
        }
      }, {
      loading: 'Signing you in...',
      success: 'Great! You\'re in. Redirecting...',
      error: (error) => `${error.message}`
    }
    )

  }

  useEffect(() => {
    if (counter < 0) return;
    const interval = setInterval(() => {
      setCounter((prev) => (prev - 1))
    }, 1000);
    return () => clearInterval(interval);
  }, [counter]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await handleLogin();
  };

  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center bg-white border-s-orange-600">

      <Image
        alt="DARE"
        src="/logo.png"
        width={100}
        height={100}
        className="mx-auto object-contain top-0"
        priority
      />
      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm/6 font-medium text-gray-900">
              username/email/phone
            </label>
            <div className="mt-2">
              <input
                id="email"
                name="email"
                type="text"
                required
                autoComplete="email"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="username/email/phone"
                className="block w-full border-b-2 rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label htmlFor="password" className="block text-sm/6 font-medium text-gray-900">
                Mật khẩu
              </label>
              <div className="text-sm">
                <a href="#" className="font-semibold text-indigo-600 hover:text-indigo-500">
                  Quên mật khẩu?
                </a>
              </div>
            </div>
            <div className="mt-2">
              <input
                id="password"
                name="password"
                type="password"
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full border-b-2 rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                placeholder="Mật khẩu"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Đăng nhập
            </button>
          </div>
        </form>

        <p className="mt-10 text-center text-sm/6 text-gray-500">
          hoặc{' '}
          <a href="#" className="font-semibold text-indigo-600 hover:text-indigo-500">
            đăng ký tại đây!
          </a>
        </p>
      </div>
    </div>
  )
}

export default Page;
