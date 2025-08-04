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

export default function RegisterPage() {
  const router = useRouter()
  const [showPw, setShowPw] = useState(false)
  const [showConfirmPw, setShowConfirmPw] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreeTerms: false,
  })

  const onChange = e =>
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))

  const onSubmit = async (e) => {
    e.preventDefault()
    setError("")

    // Validate passwords match
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match")
      return
    }

    // Validate terms agreement
    if (!form.agreeTerms) {
      setError("You must agree to the terms and conditions")
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullName: form.name,
          email: form.email,
          password: form.password,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Registration failed")
      }

      // Redirect to login page after successful registration
      router.push("/login")
    } catch (error) {
      console.error("Registration error:", error)
      setError(error.message || "An error occurred during registration")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthLayout
      title="Create an Account"
      subtitle="Sign up for your dashboard"
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
        
        {/* name */}
        <div className="space-y-1">
          <Label htmlFor="name">Full name</Label>
          <Input
            id="name"
            name="name"
            type="text"
            placeholder="Jane Smith"
            value={form.name}
            onChange={onChange}
            required
            className="h-11"
          />
        </div>

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

        {/* confirm password */}
        <div className="space-y-1">
          <Label htmlFor="confirmPassword">Confirm password</Label>
          <div className="relative">
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type={showConfirmPw ? "text" : "password"}
              placeholder="••••••••"
              value={form.confirmPassword}
              onChange={onChange}
              required
              className="h-11 pr-10"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPw(!showConfirmPw)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              {showConfirmPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {/* terms */}
        <div className="flex items-start space-x-2">
          <Checkbox
            id="agreeTerms"
            checked={form.agreeTerms}
            onCheckedChange={val => setForm(p => ({ ...p, agreeTerms: val }))}
            className="mt-1"
          />
          <Label htmlFor="agreeTerms" className="text-sm">
            I agree to the{" "}
            <Button variant="link" className="px-0 text-sm">
              terms of service
            </Button>{" "}
            and{" "}
            <Button variant="link" className="px-0 text-sm">
              privacy policy
            </Button>
          </Label>
        </div>

        {/* submit */}
        <Button
          type="submit"
          className="w-full h-11 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700"
          disabled={isLoading}
        >
          {isLoading ? "Creating account…" : "Create account"}
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

      {/* link to login */}
      <p className="text-center text-sm">
        Already have an account?{" "}
        <Button variant="link" className="px-0">
          <a href="/login">Sign in</a>
        </Button>
      </p>
    </AuthLayout>
  )
}
