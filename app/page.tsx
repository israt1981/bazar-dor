"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Product } from "@/types";

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("https://openapi.programming-hero.com/api/bazardor/products")
      .then((res) => res.json())
      .then((data) => {
        if (data?.data) {
          setProducts(data.data);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching products:", err);
        setLoading(false);
      });
  }, []);

  const sortedByChange = [...products].sort((a, b) => (b.change || 0) - (a.change || 0));
  const topRisers = sortedByChange.slice(0, 6);
  const topFallers = [...products].sort((a, b) => (a.change || 0) - (b.change || 0)).slice(0, 6);

  const scrollToAllProducts = () => {
    const section = document.getElementById("সব-পণ্য");
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-12">
      <section className="bg-emerald-50/60 border border-emerald-100 rounded-2xl p-6 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="space-y-4 max-w-2xl">
          <span className="text-xs font-semibold text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full uppercase tracking-wider">
            বাজার দর আপডেট
          </span>
          <h1 className="text-3xl md:text-5xl font-bold text-gray-800 leading-tight">
            আজকের বাজারের দাম এক নজরে
          </h1>
          <p className="text-gray-600 text-sm md:text-base leading-relaxed">
            চাল, ডাল, তেল, সবজি, মাছ, মাংস ও মসলার আজকের বাজারদর — প্রাত্যহিক বাজারভিত্তিক দাম, সামঞ্জস্যপূর্ণ তুলনা ও সঠিক তথ্য।
          </p>
          <div>
            <button
              onClick={scrollToAllProducts}
              className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg shadow transition"
            >
              সব পণ্য দেখুন
            </button>
          </div>
        </div>
        <div className="shrink-0">
          <div className="w-48 h-48 md:w-64 md:h-64 bg-emerald-100 rounded-full flex items-center justify-center text-7xl md:text-8xl shadow-inner">
            🧺
          </div>
        </div>
      </section>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-white p-4 rounded-xl border border-gray-200 animate-pulse h-48"></div>
          ))}
        </div>
      ) : (
        <>
          <section className="space-y-4">
            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <span className="text-emerald-600">▲</span> আজ দাম বেড়েছে
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {topRisers.map((prod) => (
                <ProductCard key={prod.id} product={prod} />
              ))}
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <span className="text-red-600">▼</span> আজ দাম কমেছে
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {topFallers.map((prod) => (
                <ProductCard key={prod.id} product={prod} />
              ))}
            </div>
          </section>

          <section id="সব-পণ্য" className="space-y-6 pt-6">
            <div className="border-b border-gray-200 pb-3">
              <h2 className="text-2xl font-bold text-gray-800">সব পণ্য</h2>
              <p className="text-sm text-gray-500">সকল নিত্যপ্রয়োজনীয় পণ্যের তালিকা ও বর্তমান বাজারমূল্য</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {products.map((prod) => (
                <ProductCard key={prod.id} product={prod} />
              ))}
            </div>
          </section>
        </>
      )}
    </div>
  );
}

function ProductCard({ product }: { product: Product }) {
  const isUp = (product.change || 0) >= 0;
  
  return (
    <Link
      href={`/product/${product.id}`}
      className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition flex flex-col justify-between group"
    >
      <div>
        <div className="flex items-start justify-between mb-3">
          <span className="text-3xl bg-gray-50 p-2 rounded-lg group-hover:scale-110 transition">
            {product.emoji || "📦"}
          </span>
          <span
            className={`text-xs font-semibold px-2 py-1 rounded-full flex items-center gap-0.5 ${
              isUp ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"
            }`}
          >
            {isUp ? "▲" : "▼"} {Math.abs(product.change || 0)}%
          </span>
        </div>
        <h3 className="font-semibold text-gray-800 text-base mb-1 group-hover:text-emerald-600 transition">
          {product.name}
        </h3>
        <p className="text-xs text-gray-500">প্রতি {product.unit}</p>
      </div>
      <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
        <span className="text-xs text-gray-500">আজকের দাম</span>
        <span className="font-bold text-gray-800 text-sm">{product.price} টাকা</span>
      </div>
    </Link>
  );
}