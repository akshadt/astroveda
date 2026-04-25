import Link from "next/link";

export const metadata = {
  title: "About Us - AstroVeda",
  description: "Learn more about AstroVeda, a premium Vedic astrology platform.",
};

export default function AboutPage() {
  return (
    <div className="bg-[#FAF7F2] min-h-screen py-20 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-xl border border-[#E2E8F0] p-8 md:p-16">
        <h1 className="font-playfair text-5xl font-extrabold text-[#0F172A] mb-8 text-center">About AstroVeda</h1>
        
        <div className="w-24 h-1.5 bg-[#F97316] mx-auto rounded-full mb-12"></div>

        <div className="space-y-8 text-[#64748B] text-lg leading-relaxed">
          <p>
            AstroVeda is a premium Vedic astrology platform dedicated to bringing ancient cosmic wisdom to the modern seeker. We believe that astrology is not just about prediction—it is a profound tool for self-discovery, spiritual growth, and actionable guidance.
          </p>

          <p>
            Founded by certified Vedic astrologers with decades of experience, AstroVeda bridges the gap between traditional astrological sciences and contemporary lifestyle challenges. Our mission is to empower individuals to make confident choices in their careers, relationships, and personal journeys through the lens of planetary alignments.
          </p>

          <h2 className="text-3xl font-bold text-[#0F172A] font-playfair mt-12 mb-6">Our Core Philosophy</h2>
          
          <ul className="space-y-6">
            <li className="flex gap-4">
              <span className="text-[#F97316] text-2xl">✧</span>
              <div>
                <strong className="text-[#0F172A] block text-xl mb-1">Authenticity</strong>
                We adhere strictly to the classical texts of Jyotish (Vedic Astrology), ensuring every reading and consultation is rooted in time-tested principles.
              </div>
            </li>
            <li className="flex gap-4">
              <span className="text-[#F97316] text-2xl">✧</span>
              <div>
                <strong className="text-[#0F172A] block text-xl mb-1">Practicality</strong>
                Our insights go beyond philosophical concepts. We provide actionable remedies, including lab-certified gemstones and accessible lifestyle shifts.
              </div>
            </li>
            <li className="flex gap-4">
              <span className="text-[#F97316] text-2xl">✧</span>
              <div>
                <strong className="text-[#0F172A] block text-xl mb-1">Confidentiality</strong>
                Your journey is sacred. We guarantee the utmost privacy and security for all client interactions and personal data.
              </div>
            </li>
          </ul>

          <div className="mt-16 p-8 bg-[#0F172A] rounded-2xl text-center">
            <h3 className="text-2xl font-bold text-white mb-4">Ready to discover your path?</h3>
            <Link href="/services" className="inline-block px-8 py-3.5 bg-[#F97316] text-white font-bold rounded-lg hover:bg-[#EA6C0A] transition-colors">
              Explore Our Services
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
