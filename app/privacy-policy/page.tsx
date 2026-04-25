export const metadata = {
  title: "Privacy Policy - AstroVeda",
  description: "Privacy Policy for AstroVeda.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="bg-white min-h-screen py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="font-playfair text-4xl md:text-5xl font-bold text-[#0F172A] mb-4">Privacy Policy</h1>
        <p className="text-[#64748B] mb-12">Last Updated: October 2023</p>

        <div className="space-y-8 text-[#0F172A] text-base md:text-lg leading-relaxed">
          <section>
            <h2 className="text-2xl font-bold mb-4 font-playfair">1. Information We Collect</h2>
            <p className="text-[#64748B]">
              At AstroVeda, we collect personal information that you provide to us directly when you register for an account, book a consultation, or purchase a gemstone. This includes your name, email address, phone number, birth details (date, time, and location), and payment information.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 font-playfair">2. How We Use Your Information</h2>
            <p className="text-[#64748B] mb-4">We use the information we collect to:</p>
            <ul className="list-disc pl-6 text-[#64748B] space-y-2">
              <li>Generate accurate astrological charts and reports (Kundli).</li>
              <li>Process your transactions and deliver services/products.</li>
              <li>Communicate with you regarding your appointments and orders.</li>
              <li>Improve our website, services, and customer experience.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 font-playfair">3. Data Protection and Security</h2>
            <p className="text-[#64748B]">
              We implement a variety of security measures to maintain the safety of your personal information. Your birth details and consultation records are kept strictly confidential and are only accessible by certified astrologers assigned to your case. Payment data is processed through secure, encrypted payment gateways.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 font-playfair">4. Third-Party Disclosure</h2>
            <p className="text-[#64748B]">
              We do not sell, trade, or otherwise transfer your Personally Identifiable Information to outside parties. This does not include trusted third parties who assist us in operating our website, conducting our business, or servicing you, so long as those parties agree to keep this information confidential.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 font-playfair">5. Contact Us</h2>
            <p className="text-[#64748B]">
              If there are any questions regarding this privacy policy, you may contact us using the information below:<br/><br/>
              <strong>Email:</strong> support@astroveda.com<br/>
              <strong>WhatsApp:</strong> +91 95809 98842
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
