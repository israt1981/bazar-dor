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

export default function SignUpPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !email || !password || !confirmPassword) {
      toast.error("দয়া করে সব ফিল্ড সঠিকভাবে পূরণ করুন।");
      return;
    }

    if (password.length < 8) {
      toast.error("পাসওয়ার্ড কমপক্ষে ৮ অক্ষরের হতে হবে।");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("পাসওয়ার্ড মিলছে না!");
      return;
    }

    setLoading(true);

    try {
      const existingUsers: UserType[] = JSON.parse(
        localStorage.getItem("bazardor_users") || "[]"
      );
      
      const userExists = existingUsers.some((u: UserType) => u.email === email);
      if (userExists) {
        toast.error("এই ইমেইল দিয়ে ইতিমধ্যে একটি অ্যাকাউন্ট রয়েছে!");
        setLoading(false);
        return;
      }

      const newUser: UserType = { name, email, password };
      existingUsers.push(newUser);
      localStorage.setItem("bazardor_users", JSON.stringify(existingUsers));

      setLoading(false);
      toast.success("অ্যাকাউন্ট সফলভাবে তৈরি হয়েছে! অনুগ্রহ করে সাইন ইন করুন।");
      router.push("/signin");
    } catch {
      setLoading(false);
      toast.error("রেজিস্ট্রেশনে সমস্যা হয়েছে। আবার চেষ্টা করুন।");
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
      toast.error(`${provider} দিয়ে সাইন আপ করতে সমস্যা হয়েছে।`);
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12">
      <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm space-y-6">
        <div className="text-center space-y-1">
          <h1 className="text-2xl font-bold text-gray-900">অ্যাকাউন্ট তৈরি করুন</h1>
          <p className="text-xs text-gray-500">বিনামূল্যে সাইন আপ করে সব বিস্তারিত দাম দেখুন।</p>
        </div>

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">নাম</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="যেমন: রহিম উদ্দিন"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-emerald-600"
            />
          </div>

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
              placeholder="কমপক্ষে ৮ অক্ষর"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-emerald-600"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">পাসওয়ার্ড নিশ্চিত করুন</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="আবার লিখুন"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-emerald-600"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg text-sm shadow transition flex items-center justify-center cursor-pointer"
          >
            {loading ? "লোড হচ্ছে..." : "অ্যাকাউন্ট তৈরি করুন"}
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
          অ্যাকাউন্ট আছে?{" "}
          <Link href="/signin" className="text-emerald-600 font-semibold hover:underline">
            সাইন ইন করুন
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