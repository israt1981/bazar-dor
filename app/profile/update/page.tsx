"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";

export default function UpdateProfilePage() {
  const router = useRouter();
  const [name, setName] = useState("Mohammad Israt Hossain");

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) {
      toast.error("নাম খালি রাখা যাবে না");
      return;
    }
    toast.success("প্রোফাইল সফলভাবে আপডেট করা হয়েছে!");
    setTimeout(() => {
      router.push("/profile");
    }, 1000);
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <Toaster position="top-center" />
      <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm space-y-6">
        <h1 className="text-xl font-bold text-gray-800 text-center">প্রোফাইল তথ্য আপডেট</h1>
        <form onSubmit={handleUpdate} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">নাম</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-emerald-500"
            />
          </div>
          <button
            type="submit"
            className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg transition shadow-sm"
          >
            আপডেট ইনফরমেশন
          </button>
        </form>
      </div>
    </div>
  );
}