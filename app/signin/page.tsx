"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";

interface UserType {
  name: string;
  email: string;
  password?: string;
}

export default function SignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("দয়া করে ইমেইল এবং পাসওয়ার্ড প্রদান করুন।");
      return;
    }

    setLoading(true);

    try {
      const existingUsers: UserType[] = JSON.parse(
        localStorage.getItem("bazardor_users") || "[]"
      );
      const foundUser = existingUsers.find(
        (u: UserType) => u.email === email && u.password === password
      );

      if (foundUser) {
        localStorage.setItem("bazardor_logged_in", "true");
        localStorage.setItem("bazardor_logged_in_user", JSON.stringify(foundUser));
        
        window.dispatchEvent(new Event("auth-change"));

        setLoading(false);
        toast.success(`স্বাগতম, ${foundUser.name}! সফলভাবে লগইন হয়েছে।`);
        router.push("/");
      } else {
        setLoading(false);
        toast.error("ভুল ইমেইল অথবা পাসওয়ার্ড! সঠিক তথ্য দিন বা সাইন আপ করুন।");
      }
    } catch {
      setLoading(false);
      toast.error("লগইন করতে সমস্যা হয়েছে।");
    }
  };

  // Real Social Authentication using BetterAuth Client SDK
  const handleSocialAuth = async (provider: "google" | "github") => {
    try {
      setLoading(true);
      await authClient.signIn.social({
        provider: provider,
        callbackURL: "/",
      });
    } catch (error) {
      console.error("Social Auth Error:", error);
      toast.error(`${provider} দিয়ে লগইন করতে সমস্যা হয়েছে।`);
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12">
      <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm space-y-6">
        <div className="text-center space-y-1">
          <h1 className="text-2xl font-bold text-gray-900">সাইন ইন</h1>
          <p className="text-xs text-gray-500">আপনার বাজার দর অ্যাকাউন্টে প্রবেশ করুন</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">ইমেইল</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-emerald-600"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">পাসওয়ার্ড</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-emerald-600"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg text-sm shadow transition flex items-center justify-center cursor-pointer"
          >
            {loading ? "লগইন হচ্ছে..." : "লগ ইন"}
          </button>
        </form>

        <div className="relative flex py-2 items-center">
          <div className="flex-1 border-t border-gray-200"></div>
          <span className="mx-4 text-xs text-gray-400">অথবা</span>
          <div className="flex-1 border-t border-gray-200"></div>
        </div>

        {/* Real Social Authentication Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => handleSocialAuth("google")}
            disabled={loading}
            className="py-2.5 px-3 border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium rounded-lg text-xs transition flex items-center justify-center gap-2 cursor-pointer"
          >
            Google
          </button>
          <button
            type="button"
            onClick={() => handleSocialAuth("github")}
            disabled={loading}
            className="py-2.5 px-3 border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium rounded-lg text-xs transition flex items-center justify-center gap-2 cursor-pointer"
          >
            GitHub
          </button>
        </div>

        <p className="text-center text-xs text-gray-500 pt-2">
          কোনো অ্যাকাউন্ট নেই?{" "}
          <Link href="/signup" className="text-emerald-600 font-semibold hover:underline">
            সাইন আপ করুন
          </Link>
        </p>
      </div>

      <div className="text-center mt-6">
        <Link href="/" className="text-xs text-gray-500 hover:text-emerald-600 transition">
          ← হোম পেজে ফিরে যান
        </Link>
      </div>
    </div>
  );
}