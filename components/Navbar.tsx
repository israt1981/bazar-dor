"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { User, LogOut } from "lucide-react";
import toast from "react-hot-toast";
import { Product, Category } from "@/types";

export default function Navbar() {
  const pathname = usePathname() || "/";
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);

  const options: Intl.DateTimeFormatOptions = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  const banglaDate = new Intl.DateTimeFormat("bn-BD", options).format(new Date());

  useEffect(() => {
    const checkAuth = () => {
      const loggedInStatus = localStorage.getItem("bazardor_logged_in");
      const userData = localStorage.getItem("bazardor_logged_in_user");
      if (loggedInStatus === "true" && userData) {
        setIsLoggedIn(true);
        setUser(JSON.parse(userData));
      } else {
        setIsLoggedIn(false);
        setUser(null);
      }
    };

    checkAuth();

    window.addEventListener("auth-change", checkAuth);

    fetch("https://openapi.programming-hero.com/api/bazardor/categories")
      .then((res) => res.json())
      .then((data) => {
        const catList = Array.isArray(data) ? data : data?.data || [];
        setCategories(catList);
      })
      .catch((err) => console.error("Error fetching categories:", err));

    fetch("https://openapi.programming-hero.com/api/bazardor/products")
      .then((res) => res.json())
      .then((data) => {
        const prodList = Array.isArray(data) ? data : data?.data || [];
        setProducts(prodList);
      })
      .catch((err) => console.error("Error fetching products:", err));

    return () => {
      window.removeEventListener("auth-change", checkAuth);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("bazardor_logged_in");
    localStorage.removeItem("bazardor_logged_in_user");
    setIsLoggedIn(false);
    setUser(null);
    setShowDropdown(false);

    window.dispatchEvent(new Event("auth-change"));

    toast.success("সফলভাবে সাইন আউট করা হয়েছে!");
    router.push("/signin");
  };

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
    <header className="w-full bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between border-b border-gray-100">
        <Link href="/" className="flex items-center gap-3">
          <div className="bg-[#0b5130] px-3 py-2 rounded-xl flex items-center justify-center shadow-sm">
            <Image
              src="/logo-icon.png"
              alt="BazarDor Logo"
              width={100}
              height={32}
              className="object-contain h-8 w-auto brightness-0 invert"
              priority
            />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-800">বাজার দর</h1>
            <p className="text-xs text-gray-500">{banglaDate}</p>
          </div>
        </Link>

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
            <div className="relative">
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center gap-2 focus:outline-none bg-gray-50 hover:bg-gray-100 px-3 py-1.5 rounded-full border border-gray-200 transition cursor-pointer"
              >
                <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center text-white font-bold text-sm">
                  {user?.name ? user.name.charAt(0).toUpperCase() : <User size={16} />}
                </div>
                <span className="text-sm font-medium text-gray-700 hidden sm:inline">
                  {user?.name || "ব্যবহারকারী"}
                </span>
                <span className="text-xs text-gray-400">▼</span>
              </button>

              {showDropdown && (
                <div className="absolute right-0 mt-2 w-52 bg-white border border-gray-200 rounded-xl shadow-lg py-2 z-50">
                  <div className="px-4 py-2 border-b border-gray-100 mb-1">
                    <p className="text-xs font-bold text-gray-900">{user?.name}</p>
                    <p className="text-[11px] text-gray-500 truncate">{user?.email}</p>
                  </div>
                  <Link
                    href="/profile"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-emerald-50 hover:text-emerald-600"
                    onClick={() => setShowDropdown(false)}
                  >
                    প্রোফাইল
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 transition cursor-pointer"
                  >
                    <LogOut size={14} /> সাইন আউট
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <nav className="max-w-7xl mx-auto px-4 py-2.5 flex items-center gap-6 overflow-x-auto text-sm font-medium text-gray-600">
        <Link
          href="/"
          className={`whitespace-nowrap pb-1 flex items-center gap-1.5 ${
            pathname === "/" ? "text-emerald-600 border-b-2 border-emerald-600 font-semibold" : "hover:text-emerald-600"
          }`}
        >
          <span>🏠</span> হোম
        </Link>
        {categories.map((cat) => {
          const catPath = `/category/${cat.slug}`;
          const isActive = pathname === catPath;
          return (
            <Link
              key={cat.id || cat.slug}
              href={catPath}
              className={`whitespace-nowrap pb-1 transition flex items-center gap-1.5 ${
                isActive
                  ? "text-emerald-600 border-b-2 border-emerald-600 font-semibold"
                  : "hover:text-emerald-600"
              }`}
            >
              <span>{cat.icon}</span> {cat.nameBn}
            </Link>
          );
        })}
      </nav>

      <div className="bg-emerald-50 border-t border-b border-emerald-100 overflow-hidden py-2 relative flex items-center">
        <div className="flex whitespace-nowrap animate-marquee items-center gap-12 text-xs text-gray-700">
          {[...products, ...products].map((prod, idx) => {
            const dir = prod.change?.dir || "flat";
            const pct = prod.change?.pct || 0;
            let symbol = "—";
            let colorClass = "text-gray-600 font-semibold";
            if (dir === "up") {
              symbol = "▲";
              colorClass = "text-emerald-600 font-semibold";
            } else if (dir === "down") {
              symbol = "▼";
              colorClass = "text-red-600 font-semibold";
            }

            return (
              <div key={idx} className="flex items-center gap-1.5 px-3">
                <span>{prod.image || "📦"}</span>
                <span className="font-medium">{prod.nameBn}</span>
                <span>{prod.today} টাকা/{formatUnit(prod.unit)}</span>
                <span className={colorClass}>
                  {symbol} {Math.abs(pct)}%
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </header>
  );
}