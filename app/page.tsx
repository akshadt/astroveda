 "use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { gemstones } from "@/lib/mockData";
import type { Service } from "@/lib/types";

export default function Home() {
  const [services, setServices] = useState<Service[]>([]);
  const [servicesLoading, setServicesLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await fetch("/api/services");
        if (!res.ok) {
          const body = await res.json();
          throw new Error(body.error || `Request failed: ${res.status}`);
        }
        const data = await res.json();
        setServices(data);
      } catch (err) {
        console.error("Failed to fetch services:", err);
      } finally {
        setServicesLoading(false);
      }
    };

    fetchServices();
  }, []);

  const getServiceId = (title: string) => {
    return services.find((service) => service.title === title)?._id || null;
  };

  const kundliService = services.find((s) => s.title.toLowerCase().includes("kundli"));

  const features = [
    { icon: "📋", title: "Detailed Kundli Report", text: "Comprehensive 20+ page PDF analyzing all 12 houses of your life." },
    { icon: "⚡", title: "Expert Consultation", text: "1-on-1 session to decode your chart and answer pressing questions." },
    { icon: "🕐", title: "Fast Delivery", text: "Get your personalized reading and report delivered within 24 hours." },
    { icon: "🛡️", title: "Lifetime Access", text: "Keep your digital reports forever to reference as your life unfolds." },
  ];

  const testimonials = [
    { id: 1, name: "Priya Sharma", quote: "The consultation gave me immense clarity. The Kundli report accurately predicted my career shift. Highly recommend!", initial: "P" },
    { id: 2, name: "Rajesh Kumar", quote: "100% authentic guidance. Remedies were practical and effective. 24-hour delivery as promised.", initial: "R" },
    { id: 3, name: "Anjali Patel", quote: "I was skeptical at first, but the guidance completely changed my perspective. Best investment I made.", initial: "A" },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-[#FAF7F2]">
      
      {/* Hero Section */}
      <section className="bg-[#FAF7F2] py-20 md:py-32 px-4 border-b border-[#E2E8F0]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          
          <div className="space-y-6">
            <span className="inline-block bg-[#FFF7ED] text-[#F97316] font-bold text-xs px-4 py-1.5 rounded-full uppercase tracking-widest border border-[#F97316]/20">
              ✦ EXPERT VEDIC ASTROLOGY
            </span>
            <h1 className="font-playfair text-5xl md:text-6xl font-extrabold leading-tight">
              <span className="text-[#0F172A]">TALK TO</span> <span className="text-[#F97316]">EXPERT ASTROLOGER NOW!</span>
            </h1>
            <p className="text-xl text-[#0F172A] font-semibold">
              Get Your Personalized Kundli Report + Expert Consultation from Certified Vedic Astrologer
            </p>
            <p className="text-[#64748B] text-lg leading-relaxed max-w-lg">
              Discover your cosmic destiny, career path, love life, and financial future through ancient Vedic wisdom. Receive a detailed PDF report + 30-minute consultation within 24 hours.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link href={kundliService ? `/checkout?serviceId=${kundliService._id}` : "/services"}>
                <button className="px-8 py-3.5 bg-[#F97316] text-white font-bold rounded-lg hover:bg-[#EA6C0A] transition-all duration-200 text-center shadow-lg hover:shadow-xl">
                  Get My Kundli Now
                </button>
              </Link>
              <Link href="/services">
                <button className="px-8 py-3.5 bg-transparent border-2 border-[#0F172A] text-[#0F172A] font-bold rounded-lg hover:bg-[#0F172A] hover:text-white transition-all duration-200 text-center">
                  Talk to Astrologer Now
                </button>
              </Link>
            </div>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-xl border border-[#E2E8F0] relative max-w-md mx-auto w-full">
            <span className="absolute -top-4 -right-4 bg-white border border-[#E2E8F0] text-[#0F172A] font-bold text-sm px-4 py-2 rounded-full shadow-lg z-10">
              🏅 15+ Years of Experience
            </span>
            <div className="w-full h-64 bg-gray-100 rounded-xl mb-6 overflow-hidden">
              <img src="/astrologer.png" alt="Expert Astrologer" className="w-full h-full object-contain" />
            </div>
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-2xl font-bold text-[#0F172A] font-playfair">AstroVeda Expert</h3>
              <span className="bg-[#F97316] text-white text-xs p-0.5 rounded-full">✓</span>
            </div>
            <p className="text-[#F97316] font-semibold text-sm mb-3">Certified Vedic Astrologer and Vastu Consultant</p>
            <div className="flex items-center gap-2 mb-6">
              <span className="text-[#F97316] text-lg">⭐⭐⭐⭐⭐</span>
              <span className="text-[#64748B] text-sm font-medium">5.0 (12k+ Consultations)</span>
            </div>
            <ul className="space-y-2 text-[#64748B] text-sm mb-8">
              <li className="flex items-start gap-2"><span className="text-[#F97316]">●</span> Expert in Vedic Astrology, Numerology & Vastu</li>
              <li className="flex items-start gap-2"><span className="text-[#F97316]">●</span> ISO 9001:2015 Certified Professional</li>
              <li className="flex items-start gap-2"><span className="text-[#F97316]">●</span> Specializes in Life, Career & Marriage Remedies</li>
            </ul>
            <Link href="/services">
              <button className="block w-full py-3.5 bg-[#F97316] text-white font-bold rounded-lg hover:bg-[#EA6C0A] transition-all duration-200 text-center shadow-md">
                Consult Now
              </button>
            </Link>
          </div>

        </div>
      </section>

      {/* Features Grid */}
      <section className="bg-white py-20 px-4 border-b border-[#E2E8F0]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feat, idx) => (
            <div key={idx} className="bg-white p-6 rounded-xl shadow-sm border border-[#E2E8F0] hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-[#FFF7ED] rounded-full flex items-center justify-center text-2xl mb-4 text-[#F97316]">
                {feat.icon}
              </div>
              <h4 className="text-lg font-bold text-[#0F172A] mb-2">{feat.title}</h4>
              <p className="text-[#64748B] text-sm leading-relaxed">{feat.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Stats + Testimonials */}
      <section className="bg-[#F8FAFC] py-20 px-4 border-b border-[#E2E8F0]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-playfair text-4xl font-bold text-[#0F172A]">Trusted by 5,000+ Clients Worldwide</h2>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20 text-center">
            {[
              { num: "5,000+", label: "HAPPY CLIENTS" },
              { num: "15+", label: "Years EXPERIENCE" },
              { num: "4.9/5", label: "STAR RATING" },
              { num: "24-Hour", label: "DELIVERY" },
            ].map((stat, i) => (
              <div key={i} className="flex flex-col items-center">
                <span className="text-[#F97316] text-3xl mb-2">✦</span>
                <span className="text-3xl font-extrabold text-[#0F172A] mb-1">{stat.num}</span>
                <span className="text-xs text-[#64748B] font-bold tracking-wider">{stat.label}</span>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map(t => (
              <div key={t.id} className="bg-white p-8 rounded-xl shadow-sm border border-[#E2E8F0] relative flex flex-col h-full">
                <div className="text-[#F97316] text-xl mb-4">⭐⭐⭐⭐⭐</div>
                <p className="text-[#0F172A] italic mb-6 flex-grow leading-relaxed">"{t.quote}"</p>
                <div className="flex items-center gap-4 mt-auto">
                  <div className="w-12 h-12 rounded-full bg-[#0F172A] text-white flex items-center justify-center font-bold text-xl">
                    {t.initial}
                  </div>
                  <div>
                    <h5 className="font-bold text-[#0F172A]">{t.name}</h5>
                    <span className="text-[#64748B] text-xs font-semibold">Verified Client</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="bg-white py-24 px-4 border-b border-[#E2E8F0]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-playfair text-4xl font-bold text-[#0F172A] mb-4">Choose Your Reading</h2>
            <p className="text-[#64748B] text-lg font-medium">Transparent pricing. No hidden fees. 100% Satisfaction.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Basic */}
            <div className="bg-white p-8 rounded-2xl border border-[#E2E8F0] flex flex-col h-full hover:shadow-lg transition-shadow">
              <h3 className="text-2xl font-bold text-[#0F172A] mb-2">Basic</h3>
              <div className="text-4xl font-extrabold text-[#0F172A] mb-6">₹499</div>
              <ul className="space-y-4 mb-8 flex-grow">
                {["Basic Kundli PDF Report", "Career & Finance Overview", "Lucky Gemstone Suggestion", "Delivered within 48 hours"].map((feat, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="text-[#F97316] mt-0.5">✓</span>
                    <span className="text-[#64748B] text-sm">{feat}</span>
                  </li>
                ))}
              </ul>
              {servicesLoading ? (
                <button
                  type="button"
                  disabled
                  className="w-full block py-3 border-2 border-[#0F172A] text-[#0F172A] text-center font-bold rounded-lg mt-auto opacity-70 cursor-wait"
                >
                  <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-[#0F172A] border-t-transparent" />
                </button>
              ) : getServiceId("Basic Reading") ? (
                <Link href={`/checkout?serviceId=${getServiceId("Basic Reading")}`} className="w-full block py-3 border-2 border-[#0F172A] text-[#0F172A] text-center font-bold rounded-lg hover:bg-[#0F172A] hover:text-white transition-colors mt-auto">
                  Get Basic Report
                </Link>
              ) : (
                <button
                  type="button"
                  disabled
                  className="w-full block py-3 border-2 border-[#0F172A] text-[#0F172A] text-center font-bold rounded-lg mt-auto opacity-50 cursor-not-allowed"
                >
                  Currently Unavailable
                </button>
              )}
            </div>

            {/* Standard */}
            <div className="bg-white p-8 rounded-2xl border-2 border-[#F97316] shadow-xl flex flex-col h-full relative transform md:-translate-y-4">
              <span className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-[#F97316] text-white font-bold text-xs px-4 py-1.5 rounded-full uppercase tracking-wider">
                MOST POPULAR
              </span>
              <h3 className="text-2xl font-bold text-[#0F172A] mb-2">Standard</h3>
              <div className="text-4xl font-extrabold text-[#0F172A] mb-6">₹999</div>
              <ul className="space-y-4 mb-8 flex-grow">
                {["Detailed Kundli PDF Report", "15-Min Live Consultation", "Career Wealth & Love Paths", "Remedies & Gemstone Advice", "Delivered within 24 hours"].map((feat, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="text-[#F97316] mt-0.5">✓</span>
                    <span className="text-[#64748B] text-sm">{feat}</span>
                  </li>
                ))}
              </ul>
              {servicesLoading ? (
                <button
                  type="button"
                  disabled
                  className="w-full block py-3 bg-[#F97316] text-white text-center font-bold rounded-lg mt-auto shadow-md opacity-70 cursor-wait"
                >
                  <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                </button>
              ) : getServiceId("Standard Reading") ? (
                <Link href={`/checkout?serviceId=${getServiceId("Standard Reading")}`} className="w-full block py-3 bg-[#F97316] hover:bg-[#EA6C0A] text-white text-center font-bold rounded-lg transition-colors mt-auto shadow-md">
                  Book Popular Package
                </Link>
              ) : (
                <button
                  type="button"
                  disabled
                  className="w-full block py-3 bg-[#F97316] text-white text-center font-bold rounded-lg mt-auto shadow-md opacity-50 cursor-not-allowed"
                >
                  Currently Unavailable
                </button>
              )}
            </div>

            {/* Premium */}
            <div className="bg-white p-8 rounded-2xl border border-[#E2E8F0] flex flex-col h-full hover:shadow-lg transition-shadow">
              <h3 className="text-2xl font-bold text-[#0F172A] mb-2">Premium</h3>
              <div className="text-4xl font-extrabold text-[#0F172A] mb-6">₹1,999</div>
              <ul className="space-y-4 mb-8 flex-grow">
                {["Extensive Kundli PDF Report", "30-Min Live Consultation", "5-Year Future Predictions", "Vastu & Numerology Insights", "Priority 12-Hour Delivery"].map((feat, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="text-[#F97316] mt-0.5">✓</span>
                    <span className="text-[#64748B] text-sm">{feat}</span>
                  </li>
                ))}
              </ul>
              {servicesLoading ? (
                <button
                  type="button"
                  disabled
                  className="w-full block py-3 border-2 border-[#0F172A] text-[#0F172A] text-center font-bold rounded-lg mt-auto opacity-70 cursor-wait"
                >
                  <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-[#0F172A] border-t-transparent" />
                </button>
              ) : getServiceId("Premium Reading") ? (
                <Link href={`/checkout?serviceId=${getServiceId("Premium Reading")}`} className="w-full block py-3 border-2 border-[#0F172A] text-[#0F172A] text-center font-bold rounded-lg hover:bg-[#0F172A] hover:text-white transition-colors mt-auto">
                  Get Premium Reading
                </Link>
              ) : (
                <button
                  type="button"
                  disabled
                  className="w-full block py-3 border-2 border-[#0F172A] text-[#0F172A] text-center font-bold rounded-lg mt-auto opacity-50 cursor-not-allowed"
                >
                  Currently Unavailable
                </button>
              )}
            </div>

          </div>
        </div>
      </section>

      {/* Gemstones Preview */}
      <section className="bg-[#0F172A] py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
            <div className="max-w-2xl">
              <h2 className="font-playfair text-4xl font-bold text-white mb-4">Amplify Your Cosmic Energy with Lab-Certified Gemstones</h2>
              <p className="text-[#64748B] text-lg">Authentic, energized stones carefully selected to balance your planetary alignments and bring prosperity to your life.</p>
            </div>
            <Link href="/shop" className="shrink-0 px-6 py-3 border-2 border-white text-white font-bold rounded-lg hover:bg-white hover:text-[#0F172A] transition-colors">
              View All Gemstones
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {gemstones.map((gem) => (
              <div key={gem.id} className="bg-[#1e293b] rounded-xl overflow-hidden group hover:-translate-y-1 transition-transform duration-300 border border-gray-800 flex flex-col h-full shadow-xl">
                <div className="relative h-48 bg-gray-800 overflow-hidden">
                  <span className="absolute top-3 left-3 bg-gray-900/80 backdrop-blur-sm text-white text-xs font-semibold px-2 py-1 rounded z-10 uppercase tracking-wide">
                    {gem.zodiac}
                  </span>
                  <img src={gem.image} alt={gem.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 opacity-90 group-hover:opacity-100" />
                </div>
                <div className="p-5 flex flex-col flex-grow">
                  <h4 className="font-bold text-white text-lg mb-2 leading-tight">{gem.title}</h4>
                  <p className="text-sm text-[#64748B] mb-4 flex-grow line-clamp-2">{gem.description}</p>
                  <div className="flex items-center justify-between mt-auto">
                    <span className="text-[#F97316] font-bold text-lg">₹{gem.price}</span>
                    <Link href={`/checkout?productId=${gem.id}`} className="px-4 py-2 bg-[#F97316] hover:bg-[#EA6C0A] text-white text-sm font-bold rounded transition-colors shadow-md">
                      Add to Cart
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
