"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { User, LogOut } from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();
  const [categories, setCategories] = useState<{ id: string; name: string; slug: string }[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const banglaDate = "রবিবার, ৭ অক্টোবর, ২০২৬"; // Match Figma format

  useEffect(() => {
    fetch("https://openapi.programming-hero.com/api/bazardor/categories")
      .then((res) => res.json())
      .then((data) => {
        if (data?.data) setCategories(data.data);
      })
      .catch((err) => console.error("Error fetching categories:", err));

    fetch("https://openapi.programming-hero.com/api/bazardor/products")
      .then((res) => res.json())
      .then((data) => {
        if (data?.data) setProducts(data.data);
      })
      .catch((err) => console.error("Error fetching products:", err));
  }, []);

  return (
    <header className="w-full bg-white shadow-sm sticky top-0 z-50">
      {/* Top Row: Logo & Auth */}
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between border-b border-gray-100">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl">🛒</span>
          <div>
            <h1 className="text-xl font-bold text-gray-800">বাজার দর</h1>
            <p className="text-xs text-gray-500">{banglaDate}</p>
          </div>
        </Link>

        {/* Auth Buttons / Profile */}
        <div className="relative">
          {!isLoggedIn ? (
            <div className="flex items-center gap-3">
              <Link
                href="/signin"
                className="px-4 py-1.5 text-sm font-medium text-emerald-600 border border-emerald-600 rounded-md hover:bg-emerald-50 transition"
              >
                সাইন ইন
              </Link>
              <Link
                href="/signup"
                className="px-4 py-1.5 text-sm font-medium text-white bg-emerald-600 rounded-md hover:bg-emerald-700 transition"
              >
                সাইন আপ
              </Link>
            </div>
          ) : (
            <div>
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center gap-2 focus:outline-none"
              >
                <div className="w-9 h-9 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold">
                  <User size={18} />
                </div>
              </button>

              {showDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg py-1 z-50">
                  <Link
                    href="/profile"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setShowDropdown(false)}
                  >
                    প্রোফাইল
                  </Link>
                  <button
                    onClick={() => {
                      setIsLoggedIn(false);
                      setShowDropdown(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                  >
                    <LogOut size={14} /> সাইন আউট
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Second Row: Category Navigation Links */}
      <nav className="max-w-7xl mx-auto px-4 py-2 flex items-center gap-6 overflow-x-auto text-sm font-medium text-gray-600">
        <Link
          href="/"
          className={`whitespace-nowrap pb-1 ${
            pathname === "/" ? "text-emerald-600 border-b-2 border-emerald-600 font-semibold" : "hover:text-emerald-600"
          }`}
        >
          হোম
        </Link>
        {categories.map((cat) => {
          const catPath = `/category/${cat.slug}`;
          const isActive = pathname === catPath;
          return (
            <Link
              key={cat.id || cat.slug}
              href={catPath}
              className={`whitespace-nowrap pb-1 transition ${
                isActive
                  ? "text-emerald-600 border-b-2 border-emerald-600 font-semibold"
                  : "hover:text-emerald-600"
              }`}
            >
              {cat.name}
            </Link>
          );
        })}
      </nav>

      {/* Price Ticker / Marquee */}
      <div className="bg-emerald-50 border-t border-b border-emerald-100 overflow-hidden py-2">
        <div className="flex whitespace-nowrap animate-pulse items-center gap-8 text-xs text-gray-700 overflow-x-auto">
          {products.map((prod, idx) => {
            const isUp = (prod.change || 0) >= 0;
            return (
              <div key={idx} className="flex items-center gap-1.5 px-2">
                <span>{prod.emoji || "📦"}</span>
                <span className="font-medium">{prod.name}</span>
                <span>{prod.price} টাকা/{prod.unit}</span>
                <span className={isUp ? "text-emerald-600 font-semibold" : "text-red-600 font-semibold"}>
                  {isUp ? "▲" : "▼"} {Math.abs(prod.change || 0)}%
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </header>
  );
}