"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import Spinner from "@/components/ui/Spinner";
import type { Product } from "@/lib/types";
import { useParams } from "next/navigation";

export default function GemstoneDetail() {
  const params = useParams<{ id: string }>();
  const [gemstone, setGemstone] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const extractErrorMessage = async (response: Response) => {
    try {
      const body = await response.json();
      return body.error || `Request failed: ${response.status}`;
    } catch {
      return `Request failed: ${response.status}`;
    }
  };

  useEffect(() => {
    const fetchGemstone = async () => {
      const id = params?.id;
      if (!id) {
        setNotFound(true);
        setLoading(false);
        return;
      }
      try {
        const res = await fetch(`/api/products/${id}`);
        if (res.status === 404) {
          setNotFound(true);
          return;
        }
        if (!res.ok) {
          throw new Error(await extractErrorMessage(res));
        }
        const data = (await res.json()) as Product;
        setGemstone(data);
      } catch (err: unknown) {
        console.error("Gemstone detail fetch failed:", err);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };

    fetchGemstone();
  }, [params?.id]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-12 flex justify-center min-h-screen bg-[#FAF7F2] items-start pt-32">
        <Spinner className="w-10 h-10 text-[#F97316]" />
      </div>
    );
  }

  if (notFound || !gemstone) {
    return (
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-12 min-h-screen bg-[#FAF7F2]">
        <p className="text-[#64748B] text-lg text-center pt-20">Gemstone not found.</p>
      </div>
    );
  }

  return (
    <div className="bg-[#FAF7F2] min-h-screen pb-20">
      <div className="max-w-7xl mx-auto px-4 md:px-8 pt-12">
        <Link href="/shop" className="inline-flex items-center text-sm font-bold text-[#64748B] hover:text-[#F97316] mb-8 transition-colors">
          <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
          Back to all gemstones
        </Link>

        <div className="bg-white rounded-2xl shadow-xl border border-[#E2E8F0] overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2">
            {/* Hero Image */}
            <div className="h-80 md:h-full min-h-[400px] w-full bg-gray-100 relative">
              <span className="absolute top-4 left-4 bg-[#F97316] text-white text-xs font-bold px-3 py-1.5 rounded-full z-10 uppercase tracking-widest shadow-sm">
                {(gemstone as any).category || "Gemstone"}
              </span>
              <img
                src={gemstone.image || "https://picsum.photos/seed/default/600/400"}
                alt={gemstone.title}
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>

            {/* Details */}
            <div className="p-8 md:p-12 flex flex-col justify-center">
              
              <h1 className="font-playfair text-4xl font-bold text-[#0F172A] mb-4">{gemstone.title}</h1>
              
              <div className="flex flex-wrap gap-4 mb-6 text-[#64748B] text-sm">
                {gemstone.certification && (
                  <p>Certification: <span className="font-semibold text-[#0F172A]">{gemstone.certification}</span></p>
                )}
                {gemstone.zodiac && (
                  <p>Zodiac: <span className="font-semibold text-[#0F172A]">{gemstone.zodiac}</span></p>
                )}
              </div>

              <p className="text-[#64748B] text-lg leading-relaxed mb-8">{gemstone.description}</p>
              
              <div className="flex items-end gap-4 mb-8">
                <div>
                  <p className="text-sm text-[#64748B] font-bold mb-1 uppercase tracking-wide">Price</p>
                  <div className="text-4xl font-extrabold text-[#F97316]">₹{gemstone.price}</div>
                </div>
              </div>

              <Link
                href={`/checkout?productId=${gemstone._id || gemstone.id}`}
                className="w-full sm:w-auto text-center px-8 py-4 bg-[#F97316] hover:bg-[#EA6C0A] text-white text-lg font-bold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
              >
                Buy Now
              </Link>

              {/* Guarantees Section */}
              <div className="mt-12 pt-8 border-t border-[#E2E8F0] grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-[#FFF7ED] flex items-center justify-center text-[#F97316]">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-[#0F172A]">Secure Payment</h4>
                    <p className="text-xs text-[#64748B] font-medium">256-bit SSL</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-[#0F172A]">Fast Shipping</h4>
                    <p className="text-xs text-[#64748B] font-medium">Insured Delivery</p>
                  </div>
                </div>
              </div>
              
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
