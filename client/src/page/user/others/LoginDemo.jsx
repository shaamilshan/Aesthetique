'use client'

import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Link } from 'react-router-dom'
import RegImg from "../../../assets/register.png";

export default function LoginDemo() {
  const [showPassword, setShowPassword] = useState(false)

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="flex items-center justify-center px-8 py-12 md:px-12">
        <div className="w-full max-w-[440px] space-y-8">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold tracking-tight">Create Account</h1>
          </div>
          <form className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none" htmlFor="name">
                Name
              </label>
              <Input
                id="name"
                placeholder="Enter your Name"
                type="text"
                className="h-12"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none" htmlFor="email">
                Email
              </label>
              <Input
                id="email"
                placeholder="Enter your E-mail id"
                type="email"
                className="h-12"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none" htmlFor="password">
                Password
              </label>
              <div className="relative">
                <Input
                  id="password"
                  placeholder="Enter your password"
                  type={showPassword ? 'text' : 'password'}
                  className="h-12 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>
            <Button className="h-12 w-full bg-black text-white hover:bg-black/90" type="submit">
              Register
            </Button>
          </form>
          <div className="text-center text-sm">
            Already a User?{' '}
            <Link className="font-medium text-primary hover:underline" href="#">
              Login
            </Link>
          </div>
        </div>
      </div>
      <div className="hidden bg-black lg:block">
        <div className="relative flex h-full items-center justify-center">
          <img
            alt="Luxury chronograph watch"
            className="object-cover"
            height={800}
            width={800}
            src={RegImg} 
          />
        </div>
      </div>
    </div>
  )
}