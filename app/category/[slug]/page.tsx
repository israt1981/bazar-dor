"use client";

export const dynamic = 'force-dynamic';

import { useEffect, useState, use, Suspense } from "react";
import Link from "next/link";
import { Product, Category } from "@/types";

function CategoryContent({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const [products, setProducts] = useState<Product[]>([]);
  const [categoryName, setCategoryName] = useState(slug);
  const [loading, setLoading] = useState(true);
  const [sortOrder, setSortOrder] = useState<string>("default");

  useEffect(() => {
    fetch(`https://openapi.programming-hero.com/api/bazardor/products?category=${slug}`)
      .then((res) => res.json())
      .then((data) => {
        const productList = Array.isArray(data) ? data : data?.data || [];
        setProducts(productList);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching category products:", err);
        setLoading(false);
      });

    fetch("https://openapi.programming-hero.com/api/bazardor/categories")
      .then((res) => res.json())
      .then((data) => {
        const catList = Array.isArray(data) ? data : data?.data || [];
        const match = catList.find((c: Category) => c.slug === slug);
        if (match) setCategoryName(match.nameBn);
      })
      .catch((err) => console.error("Error fetching categories:", err));
  }, [slug]);

  const sortedProducts = [...products].sort((a, b) => {
    if (sortOrder === "low-high") return (a.today || 0) - (b.today || 0);
    if (sortOrder === "high-low") return (b.today || 0) - (a.today || 0);
    return 0;
  });

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
        <div className="h-8 w-48 bg-gray-200 rounded animate-pulse"></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white p-4 rounded-xl border border-gray-200 animate-pulse h-48"></div>
          ))}
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="text-6xl">🔍</div>
        <h2 className="text-2xl font-bold text-gray-800">কোনো পণ্য পাওয়া যায়নি</h2>
        <p className="text-gray-500 text-sm">এই ক্যাটাগরিতে বর্তমানে কোনো পণ্য উপলব্ধ নেই বা লিংকটি সঠিক নয়।</p>
        <div>
          <Link
            href="/"
            className="px-6 py-2.5 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition inline-block shadow-sm"
          >
            হোম পেজে ফিরে যান
          </Link>
        </div>
      </div>
    );
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

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-gray-200 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{categoryName}</h1>
          <p className="text-xs text-gray-500">মোট {products.length} টি পণ্য পাওয়া গেছে</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-600">সাজান:</span>
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="border border-gray-300 bg-white rounded-lg px-3 py-1.5 text-sm text-gray-700 focus:outline-none focus:border-emerald-500"
          >
            <option value="default">ডিফল্ট</option>
            <option value="low-high">দাম: কম থেকে বেশি</option>
            <option value="high-low">দাম: বেশি থেকে কম</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {sortedProducts.map((prod) => {
          const dir = prod.change?.dir || "flat";
          const pct = prod.change?.pct || 0;
          let badgeColor = "bg-gray-50 text-gray-600";
          let symbol = "—";
          if (dir === "up") {
            badgeColor = "bg-emerald-50 text-emerald-600";
            symbol = "▲";
          } else if (dir === "down") {
            badgeColor = "bg-red-50 text-red-600";
            symbol = "▼";
          }

          return (
            <Link
              key={prod.id}
              href={`/product/${prod.id}`}
              className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-start justify-between mb-3">
                  <span className="text-3xl bg-gray-50 p-2 rounded-lg group-hover:scale-110 transition">
                    {prod.image || "📦"}
                  </span>
                  <span className={`text-xs font-semibold px-2 py-1 rounded-full flex items-center gap-0.5 ${badgeColor}`}>
                    {symbol} {Math.abs(pct)}%
                  </span>
                </div>
                <h3 className="font-semibold text-gray-900 text-base mb-1 group-hover:text-emerald-600 transition">
                  {prod.nameBn}
                </h3>
                <p className="text-xs text-gray-500">প্রতি {formatUnit(prod.unit)}</p>
              </div>
              <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
                <span className="text-xs text-gray-500">আজকের দাম</span>
                <span className="font-bold text-gray-900 text-sm">{prod.today} টাকা</span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

export default function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  return (
    <Suspense fallback={<div className="p-12 text-center text-gray-500">লোড হচ্ছে...</div>}>
      <CategoryContent params={params} />
    </Suspense>
  );
}