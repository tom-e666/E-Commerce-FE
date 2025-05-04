'use client'
import React from "react";
import Image from "next/image";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
const Page = () => {
  const [username, setusername] = React.useState<string>('');
  const [password, setPassword] = React.useState<string>('');
  const { login, loading } = useAuth();
  const router = useRouter();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await login(username, password).then()
  };
  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center bg-white border-s-orange-600">
      <Image
        alt="DARE"
        src="/gaming.png"
        width={100}
        height={100}
        className="mx-auto object-contain top-0"
        priority
      />
      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm/6 font-medium text-gray-900">
              Tên đăng nhập
            </label>
            <div className="mt-2">
              <input
                id="email"
                name="email"
                type="text"
                required
                autoComplete="email"
                value={username}
                onChange={(e) => setusername(e.target.value)}
                placeholder="Tên đăng nhập"
                className="block w-full border-b-2 rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
              />
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between">
              <label htmlFor="password" className="block text-sm/6 font-medium text-gray-900">
                Mật khẩu
              </label>

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
            <div className="text-sm pt-2">
              <a href="#" className="font-semibold text-indigo-600 hover:text-indigo-500">
                Quên mật khẩu?
              </a>
            </div>

          </div>

          <div>
            <button
              type="submit"
              className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              disabled={loading}
            >
              {loading && <Loader2 className="animate-spin" />}
              Đăng nhập
            </button>
          </div>
        </form>

        <p className="mt-10 text-center text-sm/6 text-gray-500">
          hoặc{' '}
          <a href="/signup" className="font-semibold text-indigo-600 hover:text-indigo-500">
            đăng ký tại đây!
          </a>
        </p>
      </div>
    </div>
  )
}

export default Page;
