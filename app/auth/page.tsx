"use client"

import type React from "react"
import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function AuthPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [userType, setUserType] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Login attempt with:", { email, password })
    // Here you would typically handle authentication
  }

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (userType) {
      // Navigate to the registration form with the selected user type
      router.push(`/auth/register?type=${userType}`)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f5f7fa] to-white flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <Link href="/" className="inline-block">
            <div className="flex items-center justify-center gap-3">
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-9xNdd6tEqppxZ2JNyyzzlibUNBOJ99.png"
                alt="ABH Connect Logo"
                width={50}
                height={50}
              />
              <span className="text-2xl font-bold text-[#0a3141]">ABH Connect</span>
            </div>
          </Link>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-[#0a3141]">Welcome</h1>
            <p className="text-gray-500 mt-2">Welcome back, please login to your account.</p>
          </div>

          <Tabs defaultValue="signin" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="signin" className="data-[state=active]:bg-[#d2f277] data-[state=active]:text-black">
                Sign In
              </TabsTrigger>
              <TabsTrigger value="register" className="data-[state=active]:bg-[#d2f277] data-[state=active]:text-black">
                Registration
              </TabsTrigger>
            </TabsList>
            <TabsContent value="signin">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email/Phone *
                  </label>
                  <Input
                    id="email"
                    type="text"
                    placeholder="Enter your email or phone"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="h-12"
                  />
                </div>
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                    Password *
                  </label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="h-12"
                  />
                </div>
                <div className="text-right">
                  <Link href="/auth/forgot-password" className="text-sm text-[#0a3141] hover:underline">
                    Forgot Password?
                  </Link>
                </div>
                <Button type="submit" className="w-full h-12 bg-[#0a3141] hover:bg-[#0a3141]/90 text-white">
                  Login
                </Button>
              </form>
            </TabsContent>
            <TabsContent value="register">
              <form onSubmit={handleRegisterSubmit} className="space-y-4">
                <div>
                  <label htmlFor="user-type" className="block text-sm font-medium text-gray-700 mb-1">
                    Register as *
                  </label>
                  <Select value={userType} onValueChange={setUserType} required>
                    <SelectTrigger id="user-type" className="h-12">
                      <SelectValue placeholder="Select account type" />
                    </SelectTrigger>
                    <SelectContent className="z-50">
                      <SelectItem value="applicant">Applicant</SelectItem>
                      <SelectItem value="company">Company</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button type="submit" className="w-full h-12 bg-[#0a3141] hover:bg-[#0a3141]/90 text-white">
                  Continue
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
