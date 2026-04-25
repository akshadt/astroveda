"use client";

import { useEffect, useState } from "react";
import GemstoneCard from "@/components/cards/GemstoneCard";
import Spinner from "@/components/ui/Spinner";
import type { Product } from "@/lib/types";
import { gemstones as mockGemstones } from "@/lib/mockData";

export default function ShopPage() {
  const [gemstones, setGemstones] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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
        const res = await fetch("/api/products");
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
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-[#FAF7F2] pb-16">
      {/* Header Banner */}
      <div className="bg-[#0F172A] text-white py-20 px-4 border-b border-[#E2E8F0]">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="font-playfair text-4xl md:text-5xl font-bold mb-4">Our Gemstone Collection</h1>
          <p className="text-[#64748B] max-w-2xl mx-auto text-lg">
            Authentic, lab-certified gemstones carefully selected to balance your planetary alignments and bring prosperity.
          </p>
        </div>
      </div>

      {/* Products Grid */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 -mt-8 relative z-10 w-full">
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
