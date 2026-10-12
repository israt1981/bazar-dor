"use client";

import Link from "next/link";
import { User, Mail, Edit } from "lucide-react";
import { authClient } from "@/lib/auth-client";

export default function ProfilePage() {
  const { data: session, isPending } = authClient.useSession();

  if (isPending) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center text-gray-500">
        প্রোফাইল লোড হচ্ছে...
      </div>
    );
  }

  const currentUser = session?.user;

  return (
    <div className="max-w-xl mx-auto px-4 py-16">
      <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm space-y-6">
        <div className="flex items-center justify-between border-b border-gray-100 pb-4">
          <h1 className="text-2xl font-bold text-gray-900">ব্যবহারকারী প্রোফাইল</h1>
          <Link
            href="/profile/update"
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium rounded-lg transition flex items-center gap-1.5 shadow-sm"
          >
            <Edit size={14} /> তথ্য আপডেট করুন
          </Link>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
            <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700">
              <User size={20} />
            </div>
            <div>
              <p className="text-xs text-gray-400">নাম</p>
              <p className="text-base font-semibold text-gray-800">
                {currentUser?.name || "অতিথি ব্যবহারকারী"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
            <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700">
              <Mail size={20} />
            </div>
            <div>
              <p className="text-xs text-gray-400">ইমেইল</p>
              <p className="text-base font-semibold text-gray-800">
                {currentUser?.email || "N/A"}
              </p>
            </div>
          </div>
        </div>

        <div className="pt-4 text-center">
          <Link href="/" className="text-xs text-emerald-600 font-semibold hover:underline">
            ← হোম পেজে ফিরে যান
          </Link>
        </div>
      </div>
    </div>
  );
}