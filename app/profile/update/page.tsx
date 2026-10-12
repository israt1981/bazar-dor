"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";

export default function UpdateProfilePage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  // BetterAuth session hook to get current user details
  const { data: session } = authClient.useSession();

  useEffect(() => {
    if (session?.user?.name) {
      setName(session.user.name);
    }
  }, [session]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("নাম খালি রাখা যাবে না।");
      return;
    }

    setLoading(true);

    try {
      await authClient.updateUser({
        name: name,
      }, {
        onSuccess: () => {
          setLoading(false);
          toast.success("প্রোফাইল সফলভাবে আপডেট করা হয়েছে!");
          router.push("/profile");
          router.refresh();
        },
        onError: (ctx) => {
          setLoading(false);
          toast.error(ctx.error.message || "আপডেট করতে সমস্যা হয়েছে।");
        }
      });
    } catch {
      setLoading(false);
      toast.error("আপডেট করতে সমস্যা হয়েছে।");
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm space-y-6">
        <div className="text-center space-y-1">
          <h1 className="text-2xl font-bold text-gray-900">প্রোফাইল আপডেট করুন</h1>
          <p className="text-xs text-gray-500">আপনার নাম পরিবর্তন করুন</p>
        </div>

        <form onSubmit={handleUpdate} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">নাম</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="আপনার নতুন নাম"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-emerald-600"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg text-sm shadow transition cursor-pointer"
          >
            {loading ? "আপডেট হচ্ছে..." : "তথ্য আপডেট করুন"}
          </button>
        </form>

        <div className="text-center pt-2">
          <Link href="/profile" className="text-xs text-gray-500 hover:text-emerald-600 transition">
            ← প্রোফাইলে ফিরে যান
          </Link>
        </div>
      </div>
    </div>
  );
}