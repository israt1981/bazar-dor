"use client";

import Link from "next/link";
import { User } from "lucide-react";

export default function ProfilePage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-12 space-y-6">
      <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm space-y-6">
        <h1 className="text-2xl font-bold text-gray-800 text-center">আমার প্রোফাইল</h1>
        <div className="flex flex-col sm:flex-row items-center gap-6 border-b border-gray-100 pb-6">
          <div className="w-20 h-20 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center font-bold text-2xl shadow-inner">
            <User size={36} />
          </div>
          <div className="space-y-1 text-center sm:text-left">
            <h2 className="text-lg font-bold text-gray-800">Mohammad Israt Hossain</h2>
            <p className="text-sm text-gray-500">habibutsho.ph@gmail.com</p>
          </div>
        </div>
        <div className="flex justify-end">
          <Link
            href="/profile/update"
            className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded-lg transition shadow-sm"
          >
            তথ্য আপডেট করুন
          </Link>
        </div>
      </div>
    </div>
  );
}