'use client'

import React, { useEffect } from "react";
import { gql, useApolloClient } from "@apollo/client";
import Image from "next/image";
const Page = () => {
  const [identifier, setIdentifier] = React.useState<string>('');
  const [password, setPassword] = React.useState<string>('');
  const [error, setError] = React.useState<string>('');
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
    try {
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
      if (code == 200) {
        localStorage.setItem('token', token);
        // window.location.href='/';
        setError(message)
        setCounter(60);
      } else {
        setError(message);
      }
    } catch (e) {
      setError(e.message);
    }
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
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm flex justify-center">
          <Image
            alt="DARE"
            src="/logo.png"
            width={100}
            height={100}
            className="mx-auto object-contain top-0"
            priority
          />
        </div>

        {/* <h2 className="mt-2 text-center text-2xl/9 font-bold tracking-tight text-gray-900">
          Đăng nhập
        </h2> */}

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
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
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
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
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

            {error && (
              <div className="mt-2 text-sm text-red-600">
                {error}
              </div>
            )}
          </form>

          <p className="mt-10 text-center text-sm/6 text-gray-500">
            hoặc{' '}
            <a href="#" className="font-semibold text-indigo-600 hover:text-indigo-500">
              đăng ký tại đây!
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Page;
