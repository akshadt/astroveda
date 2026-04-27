"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Footer() {
  const pathname = usePathname();
  if (pathname.startsWith("/admin")) return null;

  return (
    <footer className="bg-[#0F172A] text-white py-16 pb-24 md:pb-16 px-4 md:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-12 md:gap-8">
        
        {/* Brand Info */}
        <div className="space-y-4">
          <Link href="/" className="flex items-center">
            <img 
              src="/logo.png" 
              alt="OMKKAAR ASTROWORLD" 
              className="h-12 w-auto object-contain brightness-0 invert"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                e.currentTarget.nextElementSibling?.classList.remove('hidden');
                e.currentTarget.nextElementSibling?.classList.add('flex');
              }}
            />
            <div className="hidden flex-col">
              <span className="font-playfair font-bold text-2xl text-white leading-none tracking-wide">
                OMKKAAR
              </span>
              <span className="text-[#F97316] text-[10px] font-bold tracking-widest mt-1">
                ASTROWORLD
              </span>
            </div>
          </Link>
          <p className="text-sm text-[#64748B] max-w-sm pt-2">
            Empowering your life journey with ancient Vedic wisdom and expert guidance. Connect with top astrologers today.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-white font-semibold mb-6 text-lg font-playfair">Quick Links</h4>
          <ul className="space-y-3 flex flex-col text-sm text-[#64748B]">
            <Link href="/" className="hover:text-white transition-colors w-fit">Home</Link>
            <Link href="/shop" className="hover:text-white transition-colors w-fit">Shop</Link>
            <Link href="/checkout" className="hover:text-white transition-colors w-fit">Book Consultation</Link>
            <Link href="/about" className="hover:text-white transition-colors w-fit">About OMKKAAR</Link>
          </ul>
        </div>

        {/* Contact Us */}
        <div>
          <h4 className="text-white font-semibold mb-6 text-lg font-playfair">Contact Us</h4>
          <ul className="space-y-4 text-sm text-[#64748B]">
            <li className="flex items-start">
              <span className="mr-3 text-xl leading-none mt-1">📍</span>
              <span className="block leading-relaxed">
                22/FF, The Emperor Building,<br />
                Above Cake Shop,<br />
                Fatehgunj, Vadodara - 390002,<br />
                Gujarat, India
              </span>
            </li>
            <li className="flex items-center">
              <span className="mr-3 text-xl leading-none">✉️</span>
              <span>astroplatformmm@gmail.com</span>
            </li>
          </ul>
        </div>

        {/* Legal */}
        <div>
          <h4 className="text-white font-semibold mb-6 text-lg font-playfair">Legal</h4>
          <ul className="space-y-3 flex flex-col text-sm text-[#64748B]">
            <Link href="/privacy-policy" className="hover:text-white transition-colors w-fit">Privacy Policy</Link>
            <Link href="#" className="hover:text-white transition-colors w-fit">Refund Policy</Link>
            <Link href="#" className="hover:text-white transition-colors w-fit">Shipping Policy</Link>
          </ul>
        </div>

      </div>
      
      {/* Bottom Bar */}
      <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-gray-800 text-center text-sm text-[#64748B]">
        <p>&copy; {new Date().getFullYear()} OMKKAAR ASTROWORLD. All rights reserved.</p>
      </div>
    </footer>
  );
}
