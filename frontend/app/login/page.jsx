"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import { Eye, EyeOff } from "lucide-react"
import AuthLayout from "@/components/auth-layout"
import { useRouter } from "next/navigation"

export default function LoginPage() {
  const router = useRouter()
  const [showPw, setShowPw] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [form, setForm] = useState({ email: "", password: "", remember: false })

  const onChange = e =>
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))

  const onSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)
    
    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: form.email,
          password: form.password,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Login failed")
      }

      // Store token in localStorage or cookies
      localStorage.setItem("token", data.token)
      localStorage.setItem("user", JSON.stringify(data.user))

      // Redirect to dashboard
      router.push("/dashboard")
    } catch (error) {
      console.error("Login error:", error)
      setError(error.message || "An error occurred during login")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthLayout
      title="Welcome Back"
      subtitle="Sign in to your dashboard"
      leftHeading="AI-Enhanced Workflow Management"
      leftParagraph="Streamline projects, automate scheduling, and boost productivity."
    >
      {/* ---------- form ---------- */}
      <form onSubmit={onSubmit} className="space-y-4">
        {error && (
          <div className="p-3 rounded-md bg-red-50 text-red-500 text-sm">
            {error}
          </div>
        )}
        
        {/* email */}
        <div className="space-y-1">
          <Label htmlFor="email">Email address</Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="jane@company.com"
            value={form.email}
            onChange={onChange}
            required
            className="h-11"
          />
        </div>

        {/* password */}
        <div className="space-y-1">
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Input
              id="password"
              name="password"
              type={showPw ? "text" : "password"}
              placeholder="••••••••"
              value={form.password}
              onChange={onChange}
              required
              className="h-11 pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPw(!showPw)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {/* remember + link */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="remember"
              checked={form.remember}
              onCheckedChange={val => setForm(p => ({ ...p, remember: val }))}
            />
            <Label htmlFor="remember" className="text-sm">
              Remember me
            </Label>
          </div>
          <Button variant="link" className="px-0 text-sm">
            Forgot password?
          </Button>
        </div>

        {/* submit */}
        <Button
          type="submit"
          className="w-full h-11 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700"
          disabled={isLoading}
        >
          {isLoading ? "Signing in…" : "Sign in"}
        </Button>
      </form>

      {/* divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <Separator />
        </div>
        <span className="relative bg-background px-2 text-xs uppercase text-muted-foreground">
          or continue with
        </span>
      </div>

      {/* social */}
      <div className="grid grid-cols-2 gap-4">
        <Button variant="outline" className="h-11">
          Google
        </Button>
        <Button variant="outline" className="h-11">
          Microsoft
        </Button>
      </div>

      {/* link to register */}
      <p className="text-center text-sm">
        New here?{" "}
        <Button variant="link" className="px-0">
          <a href="/register">Create an account</a>
        </Button>
      </p>
    </AuthLayout>
  )
}
