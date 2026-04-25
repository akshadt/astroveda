"use client";

import { useEffect, useState } from "react";
import ServiceCard from "@/components/cards/ServiceCard";
import Spinner from "@/components/ui/Spinner";
import type { Service } from "@/lib/types";

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
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
    const fetchServices = async () => {
      try {
        const res = await fetch("/api/services");
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
  }, []);

  return (
    <div className="flex flex-col min-h-screen pb-16">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#1E1B4B] to-[#4C1D95] text-white py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="font-playfair text-4xl md:text-5xl font-bold mb-4">Our Astrology Services</h1>
          <p className="text-purple-100 max-w-2xl mx-auto text-lg">
            Ancient wisdom tailored for the modern world. Find clarity, overcome obstacles, and discover your true potential.
          </p>
        </div>
      </div>

      {/* Services Grid */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 -mt-8 relative z-10 w-full">
        {loading ? (
          <div className="flex justify-center py-16">
            <Spinner className="w-10 h-10 text-[#7C3AED]" />
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
