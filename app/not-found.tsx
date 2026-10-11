import Link from "next/link";

export default function NotFound() {
  return (
    <div className="max-w-md mx-auto px-4 py-32 text-center space-y-4">
      <div className="text-7xl font-bold text-emerald-600">404</div>
      <h2 className="text-2xl font-bold text-gray-800">পাতাটি পাওয়া যায়নি</h2>
      <p className="text-gray-500 text-sm">আপনি যে পেজটি খুঁজছেন তা বিদ্যমান নয় বা সরানো হয়েছে।</p>
      <div>
        <Link
          href="/"
          className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg transition inline-block shadow-sm"
        >
          হোম পেজে ফিরে যান
        </Link>
      </div>
    </div>
  );
}