"use client";

import { useEffect, useState, use, Suspense } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Product } from "@/types";

function ProductDetailsContent({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check authentication (using localStorage as a simple check for BetterAuth/Session state)
    const authStatus = localStorage.getItem("bazardor_logged_in");
    if (!authStatus) {
      router.push("/signin");
      return;
    }

    fetch(`https://openapi.programming-hero.com/api/bazardor/products/${slug}`)
      .then((res) => res.json())
      .then((data) => {
        const prodData = data?.data || data;
        setProduct(prodData);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching product details:", err);
        setLoading(false);
      });
  }, [slug, router]);

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-12 space-y-6">
        <div className="h-40 bg-gray-100 rounded-xl animate-pulse"></div>
        <div className="h-64 bg-gray-100 rounded-xl animate-pulse"></div>
      </div>
    );
  }

  if (!product || !product.nameBn) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold text-gray-800">পণ্যটি পাওয়া যায়নি</h2>
        <Link href="/" className="px-6 py-2.5 bg-emerald-600 text-white rounded-lg font-medium inline-block shadow-sm">
          হোম পেজে ফিরে যান
        </Link>
      </div>
    );
  }

  const dir = product.change?.dir || "flat";
  const pct = product.change?.pct || 0;
  let badgeColor = "text-gray-600";
  let symbol = "—";
  if (dir === "up") {
    badgeColor = "text-emerald-600";
    symbol = "▲";
  } else if (dir === "down") {
    badgeColor = "text-red-600";
    symbol = "▼";
  }

  const formatUnit = (u: string) => {
    switch (u) {
      case "kg": return "কেজি";
      case "litre": return "লিটার";
      case "dozen": return "ডজন";
      case "piece": return "পিস";
      default: return u;
    }
  };

  const marketList = product.markets || [];
  const allMins = marketList.map((m) => m.min);
  const allMaxs = marketList.map((m) => m.max);
  const minPrice = allMins.length > 0 ? Math.min(...allMins) : Math.round(product.today * 0.95);
  const maxPrice = allMaxs.length > 0 ? Math.max(...allMaxs) : Math.round(product.today * 1.05);
  const avgPrice = marketList.length > 0 
    ? Math.round(marketList.reduce((acc, m) => acc + (m.min + m.max) / 2, 0) / marketList.length)
    : product.today;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      <div className="text-xs text-gray-500 flex items-center gap-2">
        <Link href="/" className="hover:text-emerald-600">হোম</Link>
        <span>/</span>
        <span className="text-gray-800 font-medium">{product.nameBn}</span>
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-sm">
        <div className="flex items-center gap-4">
          <span className="text-6xl bg-emerald-50 p-4 rounded-2xl">{product.image || "📦"}</span>
          <div className="space-y-1">
            <span className="text-xs bg-emerald-100 text-emerald-800 font-semibold px-2.5 py-0.5 rounded-full">
              {product.categoryNameBn || product.category}
            </span>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{product.nameBn}</h1>
            <p className="text-sm text-gray-500">প্রতি {formatUnit(product.unit)}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-500">আজকের গড় মূল্য</p>
          <div className="text-2xl font-bold text-gray-900">{product.today} টাকা</div>
          <span className={`text-xs font-semibold inline-flex items-center gap-0.5 mt-1 ${badgeColor}`}>
            {symbol} {Math.abs(pct)}%
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-emerald-50/50 border border-emerald-100 rounded-xl p-4 text-center">
          <span className="text-xs text-gray-500">সর্বনিম্ন মূল্য</span>
          <div className="text-lg font-bold text-emerald-700 mt-1">{minPrice} টাকা</div>
        </div>
        <div className="bg-emerald-50/50 border border-emerald-100 rounded-xl p-4 text-center">
          <span className="text-xs text-gray-500">সর্বোচ্চ মূল্য</span>
          <div className="text-lg font-bold text-emerald-700 mt-1">{maxPrice} টাকা</div>
        </div>
        <div className="bg-emerald-50/50 border border-emerald-100 rounded-xl p-4 text-center">
          <span className="text-xs text-gray-500">গড় বাজারদর</span>
          <div className="text-lg font-bold text-emerald-700 mt-1">{avgPrice} টাকা</div>
        </div>
      </div>

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
                <th className="px-6 py-3">সর্বনিম্ন মূল্য</th>
                <th className="px-6 py-3">সর্বোচ্চ মূল্য</th>
                <th className="px-6 py-3">অবস্থা</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {marketList.length > 0 ? (
                marketList.map((m, idx) => (
                  <tr key={idx} className="hover:bg-gray-50/50 transition">
                    <td className="px-6 py-4 font-medium text-gray-900">{m.market}</td>
                    <td className="px-6 py-4">{m.division}</td>
                    <td className="px-6 py-4 font-semibold text-gray-900">{m.min} টাকা</td>
                    <td className="px-6 py-4 font-semibold text-gray-900">{m.max} টাকা</td>
                    <td className="px-6 py-4 text-emerald-600 font-medium">উপলব্ধ</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-6 text-center text-gray-400">
                    বাজারভিত্তিক ডেটা উপলব্ধ নেই
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default function ProductDetailsPage({ params }: { params: Promise<{ slug: string }> }) {
  return (
    <Suspense fallback={<div className="p-12 text-center text-gray-500">লোড হচ্ছে...</div>}>
      <ProductDetailsContent params={params} />
    </Suspense>
  );
}