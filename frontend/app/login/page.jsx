'use client'

import { Eye, EyeOff } from "lucide-react";
import { useState , useEffect} from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import PageTransition from "@/components/PageTransition";

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Login attempt:', form);
    setTimeout(() => {
      router.push('/');
    }, 500);
  };

  // For Login Page
const [subtitle, setSubtitle] = useState("");

  useEffect(() => {
    const messages = [
      "We’re excited to see you again!",
      "Let’s get things done.",
      "Sign in to continue organizing like a pro.",
      "Enter your hub of collaboration.",
      "Glad to have you back on board!"
    ];
    const random = Math.floor(Math.random() * messages.length);
    setSubtitle(messages[random]);
  }, []);;


  return (
    <PageTransition>
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="bg-[#2f3136]/80 backdrop-blur-sm p-6 rounded-xl shadow-lg w-full max-w-sm">
          <div className="text-center mb-4">
            <h1 className="text-2xl font-semibold text-white mb-1">Welcome Back</h1>
            {subtitle && (
  <p className="mb-5 text-center text-gray-300">{subtitle}</p>
)}

          </div>

          <form onSubmit={handleSubmit} className="flex flex-col space-y-3">
            <div className="flex flex-col space-y-1">
              <label className="text-sm font-medium text-white">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Enter your email"
                className="bg-[#202225] p-2 text-sm text-white rounded-md placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>

            <div className="flex flex-col space-y-1">
              <label className="text-sm font-medium text-white">
                Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  className="bg-[#202225] p-2 pr-10 text-sm text-white rounded-md w-full placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(prev => !prev)}
                  className="absolute right-2 top-2 text-white"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="text-right">
              <Link href="/forgot" className="text-xs text-indigo-400 hover:underline">
                Forgot Password?
              </Link>
            </div>

            <button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium py-2 rounded-md transition duration-300"
            >
              Login
            </button>
          </form>

          <p className="text-xs text-gray-400 mt-3 text-center">
            Need an account?{' '}
            <Link href="/register" className="text-indigo-400 hover:underline">
              Register
            </Link>
          </p>
        </div>
      </div>
    </PageTransition>
  );
}
