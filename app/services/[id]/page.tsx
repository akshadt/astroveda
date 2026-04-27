"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import Spinner from "@/components/ui/Spinner";
import type { Service } from "@/lib/types";
import { useParams } from "next/navigation";

export default function ServiceDetail() {
  const params = useParams<{ id: string }>();
  const [service, setService] = useState<Service | null>(null);
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
    const fetchService = async () => {
      const id = params?.id;
      if (!id) {
        setNotFound(true);
        setLoading(false);
        return;
      }
      try {
        const res = await fetch(`/api/services/${id}`);
        if (res.status === 404) {
          setNotFound(true);
          return;
        }
        if (!res.ok) {
          throw new Error(await extractErrorMessage(res));
        }
        const data = (await res.json()) as Service;
        setService(data);
      } catch (err: unknown) {
        console.error("Service detail fetch failed:", err);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };

    fetchService();
  }, [params?.id]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-12 flex justify-center">
        <Spinner className="w-10 h-10 text-[#7C3AED]" />
      </div>
    );
  }

  if (notFound || !service) {
    return (
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-12">
        <p className="text-gray-600 text-lg">Service not found.</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-12">
      <Link href="/services" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-[#7C3AED] mb-8 transition-colors">
        <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
        Back to all services
      </Link>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Hero Image */}
          <div className="h-64 md:h-full min-h-[400px] w-full bg-gray-100 relative">
            <img
              src={service.image || 'https://picsum.photos/seed/default/600/400'}
              alt={service.title}
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>

          {/* Details */}
          <div className="p-8 md:p-12 flex flex-col justify-center">
            <div className="inline-flex items-center space-x-2 mb-4">
              <span className="bg-purple-100 text-[#7C3AED] text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                {service.duration} Session
              </span>
            </div>
            
            <h1 className="font-playfair text-4xl font-bold text-gray-900 mb-4">{service.title}</h1>
            <p className="text-gray-600 text-lg leading-relaxed mb-8">{service.description}</p>
            
            <div className="flex items-end gap-4 mb-8">
              <div>
                <p className="text-sm text-gray-500 font-medium mb-1">Total investment</p>
                <div className="text-3xl font-bold text-[#D97706]">₹{service.price}</div>
              </div>
            </div>

            <Link
              href={`/checkout?serviceId=${service._id}`}
              className="w-full sm:w-auto text-center px-8 py-4 bg-[#7C3AED] hover:bg-[#4C1D95] text-white font-semibold rounded-xl transition-all duration-200 shadow-md hover:shadow-lg hover:-translate-y-0.5"
            >
              Book Now
            </Link>

            {/* What to Expect Section */}
            <div className="mt-12 pt-8 border-t border-gray-100">
              <h3 className="font-playfair text-xl font-bold text-gray-900 mb-4">What to Expect</h3>
              <ul className="space-y-3">
                {[
                  "Detailed analysis of your planetary positions.",
                  "Actionable insights and personalized remedies.",
                  "Complete privacy and confidential consultation."
                ].map((item, index) => (
                  <li key={index} className="flex items-start text-gray-600">
                    <svg className="w-5 h-5 text-[#D97706] mr-3 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
