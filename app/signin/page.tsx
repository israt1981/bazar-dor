"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";

export default function SignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("অনুগ্রহ করে সকল ফিল্ড পূরণ করুন");
      return;
    }
    // Simulate successful login for assignment flow
    toast.success(" সফলভাবে সাইন ইন হয়েছে!");
    setTimeout(() => {
      router.push("/");
    }, 1000);
  };

  const handleSocialLogin = (provider: string) => {
    toast.success(`${provider} দিয়ে সফলভাবে লগইন হয়েছে!`);
    setTimeout(() => {
      router.push("/");
    }, 1000);
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <Toaster position="top-center" />
      <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold text-gray-800">সাইন ইন</h1>
          <p className="text-xs text-gray-500">বিস্তারিত নাম, বাজার তুলনা ও প্রোফাইল দেখতে অ্যাকাউন্টে ঢুকুন[cite: 2]।</p>
        </div>

        <form onSubmit={handleSignIn} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">ইমেইল</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="habibutsho.ph@gmail.com"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-emerald-500"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">পাসওয়ার্ড</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-emerald-500"
            />
          </div>
          <button
            type="submit"
            className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg transition shadow-sm"
          >
            সাইন ইন
          </button>
        </form>

        <div className="relative flex py-2 items-center">
          <div className="flex-grow border-t border-gray-200"></div>
          <span className="flex-shrink mx-4 text-xs text-gray-400">অথবা</span>
          <div className="flex-grow border-t border-gray-200"></div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => handleSocialLogin("Google")}
            className="w-full border border-gray-300 py-2 rounded-lg text-xs font-medium text-gray-700 hover:bg-gray-50 transition"
          >
            Google দিয়ে চালিয়ে যান
          </button>
          <button
            onClick={() => handleSocialLogin("GitHub")}
            className="w-full border border-gray-300 py-2 rounded-lg text-xs font-medium text-gray-700 hover:bg-gray-50 transition"
          >
            GitHub দিয়ে চালিয়ে যান
          </button>
        </div>

        <div className="text-center text-xs text-gray-500 pt-2">
          অ্যাকাউন্ট নেই?{" "}
          <Link href="/signup" className="text-emerald-600 font-semibold hover:underline">
            সাইন আপ করুন
          </Link>
        </div>

        <div className="text-center pt-2">
          <Link href="/" className="text-xs text-gray-400 hover:underline">
            ← হোম পেজে ফিরে যান
          </Link>
        </div>
      </div>
    </div>
  );
}