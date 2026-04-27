"use client";

import { useEffect, useState } from "react";
import ServiceCard from "@/components/cards/ServiceCard";
import Spinner from "@/components/ui/Spinner";
import type { Service } from "@/lib/types";
import { useSearchParams, useRouter } from "next/navigation";
import { Suspense } from "react";

function ServicesContent() {
  const [services, setServices] = useState<Service[]>([]);
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
    const fetchServices = async () => {
      try {
        setLoading(true);
        const url = currentCategory !== 'all' ? `/api/services?category=${currentCategory}` : "/api/services";
        const res = await fetch(url);
        if (!res.ok) {
          throw new Error(await extractErrorMessage(res));
        }
        const data = (await res.json()) as Service[];
        setServices(data);
      } catch (err: unknown) {
        console.error("Services fetch failed:", err);
        setError("Unable to load services right now.");
        setServices([]);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, [currentCategory]);

  return (
    <div className="flex flex-col min-h-screen pb-16">
      {/* Header Banner */}
      <div className="bg-[#F97316] text-white py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="font-playfair text-4xl md:text-5xl font-bold mb-4">Our Astrology Services</h1>
          <p className="text-white/90 max-w-2xl mx-auto text-lg">
            Ancient wisdom tailored for the modern world. Find clarity, overcome obstacles, and discover your true potential.
          </p>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 mt-8">
        <div className="flex flex-wrap justify-center gap-2 sm:gap-3 pb-2 mb-8">
          {[
            { label: "All Services", value: "all" },
            { label: "Astrology", value: "astrology" },
            { label: "Tarot Reading", value: "tarot" },
            { label: "Numerology Consultation", value: "numerology" },
            { label: "Vastu Consultation", value: "vastu" },
          ].map((cat) => (
            <button
              key={cat.value}
              onClick={() => {
                if (cat.value === 'all') {
                  router.push('/services');
                } else {
                  router.push(`/services?category=${cat.value}`);
                }
              }}
              className={`px-4 py-2 sm:px-6 sm:py-2.5 rounded-full font-bold transition-all duration-200 border-2 text-sm sm:text-base ${currentCategory === cat.value ? 'bg-[#F97316] text-white border-[#F97316] shadow-md' : 'bg-white text-[#0F172A] border-[#E2E8F0] hover:border-[#F97316] hover:bg-[#FFF7ED]'}`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Services Grid */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 mt-6 relative z-10 w-full">
        {loading ? (
          <div className="flex justify-center py-16">
            <Spinner className="w-10 h-10 text-[#F97316]" />
          </div>
        ) : (
          <>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            {services.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
                {services.map((service) => (
                  <ServiceCard key={service._id || service.id} service={service} />
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-500 py-12">No services available</p>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default function ServicesPage() {
  return (
    <Suspense fallback={<div className="flex justify-center py-16"><Spinner className="w-10 h-10 text-[#F97316]" /></div>}>
      <ServicesContent />
    </Suspense>
  );
}
