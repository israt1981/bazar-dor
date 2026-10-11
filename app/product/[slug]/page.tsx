"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import { Product } from "@/types";

export default function ProductDetailsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`https://openapi.programming-hero.com/api/bazardor/products/${slug}`)
      .then((res) => res.json())
      .then((data) => {
        if (data?.data) {
          setProduct(data.data);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching product details:", err);
        setLoading(false);
      });
  }, [slug]);

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-12 space-y-6">
        <div className="h-40 bg-gray-100 rounded-xl animate-pulse"></div>
        <div className="h-64 bg-gray-100 rounded-xl animate-pulse"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold text-gray-800">পণ্যটি পাওয়া যায়নি</h2>
        <Link href="/" className="px-6 py-2.5 bg-emerald-600 text-white rounded-lg font-medium inline-block">
          হোম পেজে ফিরে যান
        </Link>
      </div>
    );
  }

  const isUp = (product.change || 0) >= 0;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      {/* Breadcrumb */}
      <div className="text-xs text-gray-500 flex items-center gap-2">
        <Link href="/" className="hover:text-emerald-600">হোম</Link>
        <span>/</span>
        <span className="text-gray-800 font-medium">{product.name}</span>
      </div>

      {/* Top Summary Card */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-sm">
        <div className="flex items-center gap-4">
          <span className="text-6xl bg-emerald-50 p-4 rounded-2xl">{product.emoji || "📦"}</span>
          <div className="space-y-1">
            <span className="text-xs bg-emerald-100 text-emerald-800 font-semibold px-2.5 py-0.5 rounded-full">
              {product.category}
            </span>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">{product.name}</h1>
            <p className="text-sm text-gray-500">প্রতি {product.unit}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-500">আজকের গড় মূল্য</p>
          <div className="text-2xl font-bold text-gray-900">{product.price} টাকা</div>
          <span className={`text-xs font-semibold inline-flex items-center gap-0.5 mt-1 ${isUp ? "text-emerald-600" : "text-red-600"}`}>
            {isUp ? "▲" : "▼"} {Math.abs(product.change || 0)}%
          </span>
        </div>
      </div>

      {/* Price Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-emerald-50/50 border border-emerald-100 rounded-xl p-4 text-center">
          সবনিম্ন মূল্য
          <div className="text-lg font-bold text-emerald-700 mt-1">{product.minPrice || Math.round(product.price * 0.95)} টাকা</div>
        </div>
        <div className="bg-emerald-50/50 border border-emerald-100 rounded-xl p-4 text-center">
          সর্বোচ্চ মূল্য
          <div className="text-lg font-bold text-emerald-700 mt-1">{product.maxPrice || Math.round(product.price * 1.05)} টাকা</div>
        </div>
        <div className="bg-emerald-50/50 border border-emerald-100 rounded-xl p-4 text-center">
          গড় মূল্য
          <div className="text-lg font-bold text-emerald-700 mt-1">{product.avgPrice || product.price} টাকা</div>
        </div>
      </div>

      {/* Bazar-wise Breakdown Table */}
      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="p-4 bg-gray-50 border-b border-gray-200 font-bold text-gray-800">
          বাজারভিত্তিক আজকের দাম
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50/70 border-b border-gray-200 text-xs uppercase text-gray-500">
              <tr>
                <th className="px-6 py-3">বাজারের নাম</th>
                <th className="px-6 py-3">স্থান</th>
                <th className="px-6 py-3">মূল্য</th>
                <th className="px-6 py-3">অবস্থা</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              <tr>
                <td className="px-6 py-4 font-medium text-gray-800">কারওয়ান বাজার</td>
                <td className="px-6 py-4">ঢাকা</td>
                <td className="px-6 py-4 font-semibold text-gray-900">{product.price} টাকা</td>
                <td className="px-6 py-4 text-emerald-600 font-medium">উপলব্ধ</td>
              </tr>
              <tr>
                <td className="px-6 py-4 font-medium text-gray-800">নিউ মার্কেট কাঁচাবাজার</td>
                <td className="px-6 py-4">ঢাকা</td>
                <td className="px-6 py-4 font-semibold text-gray-900">{Math.round(product.price * 1.02)} টাকা</td>
                <td className="px-6 py-4 text-emerald-600 font-medium">উপলব্ধ</td>
              </tr>
              <tr>
                <td className="px-6 py-4 font-medium text-gray-800">টঙ্গী বাজার</td>
                <td className="px-6 py-4">গাজীপুর</td>
                <td className="px-6 py-4 font-semibold text-gray-900">{Math.round(product.price * 0.98)} টাকা</td>
                <td className="px-6 py-4 text-emerald-600 font-medium">উপলব্ধ</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}