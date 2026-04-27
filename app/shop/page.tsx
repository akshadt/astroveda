"use client";

import { useEffect, useState } from "react";
import GemstoneCard from "@/components/cards/GemstoneCard";
import Spinner from "@/components/ui/Spinner";
import type { Product } from "@/lib/types";
import { gemstones as mockGemstones } from "@/lib/mockData";
import { useSearchParams, useRouter } from "next/navigation";
import { Suspense } from "react";

function ShopContent() {
  const [gemstones, setGemstones] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const searchParams = useSearchParams();
  const router = useRouter();
  const currentCategory = searchParams.get('category') || 'all';

  const extractErrorMessage = async (response: Response) => {
    try {
      const body = await response.json();
      return body.error || `Request failed: ${response.status}`;
    } catch {
      return `Request failed: ${response.status}`;
    }
  };

  useEffect(() => {
    const fetchGemstones = async () => {
      try {
        setLoading(true);
        const url = currentCategory !== 'all' ? `/api/products?category=${currentCategory}` : "/api/products";
        const res = await fetch(url);
        if (!res.ok) {
          throw new Error(await extractErrorMessage(res));
        }
        const data = (await res.json()) as Product[];
        setGemstones(data.length > 0 ? data : mockGemstones);
      } catch (err: unknown) {
        console.error("Products fetch failed:", err);
        setError("Unable to load live gemstones right now, showing preview.");
        setGemstones(mockGemstones);
      } finally {
        setLoading(false);
      }
    };

    fetchGemstones();
  }, [currentCategory]);

  return (
    <div className="flex flex-col min-h-screen bg-[#FAF7F2] pb-16">
      {/* Header Banner */}
      <div className="bg-[#F97316] text-white py-20 px-4 border-b border-[#E2E8F0]">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="font-playfair text-4xl md:text-5xl font-bold mb-4">Our Gemstone Collection</h1>
          <p className="text-white/90 max-w-2xl mx-auto text-lg">
            Authentic, lab-certified gemstones carefully selected to balance your planetary alignments and bring prosperity.
          </p>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 mt-8">
        <div className="flex overflow-x-auto gap-3 pb-2 mb-8 scrollbar-hide">
          {[
            { label: "All Products", value: "all" },
            { label: "Healing Crystals", value: "healing" },
            { label: "Gemstones", value: "gemstones" },
            { label: "Rudraksha", value: "rudraksha" },
            { label: "Pooja Items", value: "pooja" },
          ].map((cat) => (
            <button
              key={cat.value}
              onClick={() => {
                if (cat.value === 'all') {
                  router.push('/shop');
                } else {
                  router.push(`/shop?category=${cat.value}`);
                }
              }}
              className={`whitespace-nowrap flex-shrink-0 px-6 py-2.5 rounded-full font-bold transition-all duration-200 border-2 ${currentCategory === cat.value ? 'bg-[#F97316] text-white border-[#F97316] shadow-md' : 'bg-white text-[#0F172A] border-[#F97316] hover:bg-[#FFF7ED]'}`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Products Grid */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 mt-6 relative z-10 w-full">
        {loading ? (
          <div className="flex justify-center py-16 bg-white rounded-xl shadow-sm border border-[#E2E8F0]">
            <Spinner className="w-10 h-10 text-[#F97316]" />
          </div>
        ) : (
          <>
            {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
            {gemstones.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
                {gemstones.map((gem) => (
                  <GemstoneCard key={gem._id || gem.id} product={gem} />
                ))}
              </div>
            ) : (
              <p className="text-center text-[#64748B] py-12">No gemstones available</p>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="flex justify-center py-16"><Spinner className="w-10 h-10 text-[#F97316]" /></div>}>
      <ShopContent />
    </Suspense>
  );
}
