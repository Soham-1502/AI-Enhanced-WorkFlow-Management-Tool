"use client"

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Bot, ShieldCheck, Users, Zap } from "lucide-react"

/**
 * Re-usable marketing + form shell for both Login & Register pages
 *
 * Props
 * ─ title          – big heading above the form card
 * ─ subtitle       – small text under the heading
 * ─ leftHeading    – hero heading on the marketing column
 * ─ leftParagraph  – hero paragraph on the marketing column
 * ─ children       – <form> or any elements rendered inside CardContent
 */
export default function AuthLayout({
  title,
  subtitle,
  leftHeading,
  leftParagraph,
  children,
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-violet-100 p-4">
      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-10 items-center">
        {/* ---------- Marketing column ---------- */}
        <section className="hidden lg:flex flex-col gap-8">
          <header className="space-y-4">
            <h1 className="text-4xl font-bold text-gray-900">{leftHeading}</h1>
            <p className="text-xl text-gray-600">{leftParagraph}</p>
          </header>

          <ul className="grid gap-6">
            {[
              {
                icon: Bot,
                color: "bg-blue-100 text-blue-600",
                title: "AI-Powered Scheduling",
                text: "Automatically resolve conflicts and optimise meeting times.",
              },
              {
                icon: Zap,
                color: "bg-green-100 text-green-600",
                title: "Smart Workflow Automation",
                text: "Eliminate repetitive tasks with intelligent automation.",
              },
              {
                icon: Users,
                color: "bg-purple-100 text-purple-600",
                title: "Team Collaboration",
                text: "Enhanced coordination and real-time project visibility.",
              },
              {
                icon: ShieldCheck,
                color: "bg-emerald-100 text-emerald-600",
                title: "Enterprise-grade Security",
                text: "Bank-level encryption and role-based access.",
              },
            ].map(({ icon: Icon, color, title, text }) => (
              <li
                key={title}
                className="flex items-start gap-4 p-4 bg-white/50 rounded-lg backdrop-blur-sm"
              >
                <span className={`p-2 rounded-lg ${color}`}>
                  <Icon className="h-6 w-6" />
                </span>
                <div>
                  <h3 className="font-semibold text-gray-900">{title}</h3>
                  <p className="text-gray-600 text-sm">{text}</p>
                </div>
              </li>
            ))}
          </ul>
        </section>

        {/* --------------- Auth form column --------------- */}
        <section className="w-full max-w-md mx-auto">
          <Card className="shadow-2xl border-0">
            <CardHeader className="text-center space-y-1">
              <CardTitle className="text-2xl font-bold">{title}</CardTitle>
              <CardDescription>{subtitle}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">{children}</CardContent>
          </Card>

          <p className="mt-4 text-center text-xs text-gray-500">
            By continuing you agree to our&nbsp;
            <a href="/terms" className="underline">
              Terms&nbsp;of&nbsp;Service
            </a>{" "}
            and&nbsp;
            <a href="/privacy" className="underline">
              Privacy&nbsp;Policy
            </a>
            .
          </p>
        </section>
      </div>
    </div>
  )
}
