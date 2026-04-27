"use client";

import Link from "next/link";
import { useState } from "react";

export default function AboutPage() {
  const [lightboxImg, setLightboxImg] = useState<string | null>(null);
  const [showAllAwards, setShowAllAwards] = useState(false);

  const awardsPhotos = [
    "/awards/(11546).JPG",
    "/awards/(13402).JPG",
    "/awards/20250608_190249.jpg",
    "/awards/2E1A3266.JPG",
    "/awards/2E1A3648 (1).jpg",
    "/awards/2E1A3648.JPG",
    "/awards/6M1A1039.JPG",
    "/awards/6M1A1123.JPG",
    "/awards/6M1A1505.JPG",
    "/awards/Advance Crystal Healing Certificate.png",
    "/awards/Asian Awards Certificate.jpeg",
    "/awards/Asian Awards Trophy.jpeg",
    "/awards/DSC_0253.JPG",
    "/awards/DSC_8775.JPG",
    "/awards/DSC_8776.JPG",
    "/awards/IMG-20181109-WA0011.jpg",
    "/awards/IMG_7832.JPG",
    "/awards/IMG_8989 (1).JPG",
    "/awards/IMG_8989.JPG",
    "/awards/MEET7524.JPG",
    "/awards/MSU Certificate Astrology.jpg",
    "/awards/Prerna Award.jpg",
    "/awards/Tamas Global Awards Certificate.jpg",
    "/awards/V_J19456.JPG",
    "/awards/V_J19458.JPG",
    "/awards/WhatsApp Image 2024-05-09 at 16.48.50_afb5b730.jpg",
    "/awards/WhatsApp Image 2025-01-26 at 3.55.32 PM.jpeg",
    "/awards/WhatsApp Image 2025-03-22 at 9.58.10 PM.jpeg",
    "/awards/WhatsApp Image 2026-04-27 at 22.37.14.jpeg",
    "/awards/WhatsApp Image 2026-04-27 at 22.37.20.jpeg",
    "/awards/WhatsApp Image 2026-04-27 at 22.37.23.jpeg",
    "/awards/WhatsApp Image 2026-04-27 at 22.37.25.jpeg",
    "/awards/WhatsApp Image 2026-04-27 at 22.37.30.jpeg",
    "/awards/_J0A6182.JPG",
  ];

  const visibleImages = showAllAwards ? awardsPhotos : awardsPhotos.slice(0, 4);

  return (
    <div className="bg-[#FAF7F2] min-h-screen">
      {/* Section 1 - Header */}
      <section className="bg-white py-16 px-4 text-center border-b border-[#E2E8F0]">
        <div className="max-w-3xl mx-auto">
          <span className="text-[#F97316] text-sm font-bold tracking-widest uppercase mb-4 inline-block">About Us</span>
          <h1 className="font-playfair text-4xl md:text-5xl font-extrabold text-[#0F172A] mb-6">Astrologer Mukesh Ravindra Gupta</h1>
          <div className="flex items-center justify-center gap-4 max-w-[200px] mx-auto">
            <div className="h-[1px] bg-[#E2E8F0] flex-1"></div>
            <div className="w-2 h-2 bg-[#F97316] rotate-45"></div>
            <div className="h-[1px] bg-[#E2E8F0] flex-1"></div>
          </div>
        </div>
      </section>

      {/* Section 2 - Bio */}
      <section className="py-20 px-4 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="relative mx-auto lg:mx-0 w-full max-w-[450px]">
            {/* Orange Corner Accent */}
            <div className="absolute -top-4 -left-4 w-24 h-24 border-t-4 border-l-4 border-[#F97316] z-0"></div>
            <div className="absolute -bottom-4 -right-4 w-24 h-24 border-b-4 border-r-4 border-[#F97316] z-0"></div>
            <img 
              src="/astrologer.png" 
              alt="Mukesh Ravindra Gupta" 
              className="w-full relative z-10 shadow-xl object-cover"
            />
          </div>
          
          <div className="space-y-6">
            <p className="text-[#64748B] text-lg leading-relaxed">
              With over 15 years of experience in Vedic Astrology, Mukesh Ravindra Gupta has guided thousands of people towards a better, happier and enlightened life. His accurate predictions and practical remedies have brought positive transformation in many lives across the globe.
            </p>
            <p className="text-[#64748B] text-lg leading-relaxed">
              He is an expert in Vedic Astrology, Numerology, Vastu Shastra, Gemstone Consultation and Spiritual Healing.
            </p>

            <div className="grid grid-cols-2 gap-6 mt-8">
              <div className="bg-white p-6 rounded-xl border border-[#E2E8F0] shadow-sm text-center hover:-translate-y-1 transition-transform">
                <span className="text-[#F97316] text-3xl block mb-2">⭐</span>
                <span className="block text-2xl font-extrabold text-[#0F172A]">15+</span>
                <span className="text-sm font-bold text-[#64748B]">Years of Experience</span>
              </div>
              <div className="bg-white p-6 rounded-xl border border-[#E2E8F0] shadow-sm text-center hover:-translate-y-1 transition-transform">
                <span className="text-[#F97316] text-3xl block mb-2">👥</span>
                <span className="block text-2xl font-extrabold text-[#0F172A]">50K+</span>
                <span className="text-sm font-bold text-[#64748B]">Happy Clients</span>
              </div>
              <div className="bg-white p-6 rounded-xl border border-[#E2E8F0] shadow-sm text-center hover:-translate-y-1 transition-transform">
                <span className="text-[#F97316] text-3xl block mb-2">🌍</span>
                <span className="block text-2xl font-extrabold text-[#0F172A]">20+</span>
                <span className="text-sm font-bold text-[#64748B]">Countries Served</span>
              </div>
              <div className="bg-white p-6 rounded-xl border border-[#E2E8F0] shadow-sm text-center hover:-translate-y-1 transition-transform">
                <span className="text-[#F97316] text-3xl block mb-2">🏆</span>
                <span className="block text-2xl font-extrabold text-[#0F172A]">100+</span>
                <span className="text-sm font-bold text-[#64748B]">Awards & Honors</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 3 - Awards & Honors */}
      <section className="bg-white py-20 px-4 border-y border-[#E2E8F0]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-playfair text-3xl font-bold text-[#0F172A] mb-4 tracking-wide">AWARDS & HONORS</h2>
            <div className="flex items-center justify-center gap-4 max-w-[150px] mx-auto">
              <div className="h-[1px] bg-[#F97316] flex-1"></div>
              <div className="w-2 h-2 rounded-full bg-[#F97316]"></div>
              <div className="h-[1px] bg-[#F97316] flex-1"></div>
            </div>
          </div>

          <div className="flex overflow-x-auto pb-8 snap-x snap-mandatory gap-6 md:grid md:grid-cols-4 md:overflow-visible">
            {[
              { icon: "🏆", title: "Best Astrologer Award 2020", desc: "For exceptional contribution in astrology & guidance" },
              { icon: "🥇", title: "Excellence in Astrology 2021", desc: "For accurate predictions and client satisfaction" },
              { icon: "🏅", title: "Jyotish Ratna Award 2022", desc: "For outstanding services in Vedic Astrology" },
              { icon: "🌟", title: "Global Excellence Award 2023", desc: "For spiritual guidance and social impact" },
            ].map((award, i) => (
              <div key={i} className="min-w-[280px] snap-center bg-[#FAF7F2] p-8 rounded-xl border border-[#E2E8F0] text-center shadow-sm">
                <span className="text-4xl block mb-4">{award.icon}</span>
                <h3 className="font-bold text-[#0F172A] text-lg mb-2">{award.title}</h3>
                <p className="text-sm text-[#64748B]">{award.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 4 - Photo Gallery */}
      <section id="awards-section" className="py-20 px-4 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="font-playfair text-3xl font-bold text-[#0F172A] mb-4 tracking-wide uppercase">Awards with Astrologer</h2>
          <div className="flex items-center justify-center gap-4 max-w-[150px] mx-auto mb-4">
            <div className="h-[1px] bg-[#F97316] flex-1"></div>
            <div className="w-1.5 h-1.5 rotate-45 bg-[#F97316]"></div>
            <div className="h-[1px] bg-[#F97316] flex-1"></div>
          </div>
          <p className="text-sm text-[#64748B]">Click on any image to view full size</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 transition-all duration-300">
          {visibleImages.map((src, index) => (
            <div
              key={index}
              className="rounded-xl overflow-hidden cursor-pointer hover:scale-105 transition-all duration-200 shadow-md"
              onClick={() => setLightboxImg(src)}
            >
              <img
                src={src}
                alt={`Award photo ${index + 1}`}
                className="w-full h-48 object-cover"
              />
            </div>
          ))}
        </div>

        {awardsPhotos.length > 4 && (
          <div className="flex justify-center mt-6">
            <button
              onClick={() => {
                if (showAllAwards) {
                  setShowAllAwards(false);
                  document.getElementById('awards-section')?.scrollIntoView({ behavior: 'smooth' });
                } else {
                  setShowAllAwards(true);
                }
              }}
              className="px-8 py-3 bg-[#F97316] text-white rounded-full font-medium hover:bg-[#EA6C0A] transition-all duration-200"
            >
              {showAllAwards ? 'Show Less' : `See More Photos (${awardsPhotos.length - 4} more)`}
            </button>
          </div>
        )}
      </section>

      {/* Section 5 - CTA Banner */}
      <section className="bg-[#F97316] py-16 px-4">
        <div className="max-w-4xl mx-auto text-center text-white">
          <div className="text-4xl mb-6">📅</div>
          <h2 className="font-playfair text-3xl md:text-4xl font-bold mb-4">Consult Mukesh Ravindra Gupta for a better tomorrow.</h2>
          <p className="text-white/90 text-lg mb-8 max-w-2xl mx-auto">
            Book your appointment today and take the first step towards a greater, happier and successful life.
          </p>
          <Link 
            href="/services" 
            className="inline-block px-8 py-3.5 bg-transparent border-2 border-white text-white font-bold rounded-lg hover:bg-white hover:text-[#F97316] transition-colors"
          >
            Book Appointment
          </Link>
        </div>
      </section>

      {/* Lightbox */}
      {lightboxImg && (
        <div 
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setLightboxImg(null)}
        >
          <button 
            className="absolute top-6 right-6 text-white text-4xl hover:text-[#F97316] focus:outline-none"
            onClick={(e) => { e.stopPropagation(); setLightboxImg(null); }}
          >
            &times;
          </button>
          <img 
            src={lightboxImg} 
            alt="Full size award" 
            className="max-w-full max-h-[90vh] object-contain rounded"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
}
