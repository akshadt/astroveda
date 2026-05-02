import Link from "next/link";

export default function ShippingPolicyPage() {
  return (
    <div className="min-h-screen bg-[#FAF7F2] py-16 px-4">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl border border-[#E2E8F0] shadow-sm p-8 md:p-10">
        <Link href="/" className="text-sm text-[#64748B] hover:text-[#F97316] mb-8 inline-block">
          ← Back to Home
        </Link>
        <h1 className="font-playfair text-3xl md:text-4xl font-bold text-[#0F172A] mb-8">Shipping Policy</h1>

        <h2 className="text-xl font-bold text-[#0F172A] mt-8 mb-4">Shipping & Handling Charges</h2>
        <p className="text-[#64748B] leading-relaxed mb-4">
          We provide free shipping to select locations and shipping charges for certain locations shall be specified with your order.
        </p>

        <h2 className="text-xl font-bold text-[#0F172A] mt-8 mb-4">Track Order</h2>
        <p className="text-[#64748B] leading-relaxed mb-4">
          All users have the option to track their orders by clicking on Track Order.
        </p>

        <h2 className="text-xl font-bold text-[#0F172A] mt-8 mb-4">Time to Deliver</h2>
        <p className="text-[#64748B] leading-relaxed mb-4">
          The time taken for delivery tends to vary according to the destination; however, we make our best efforts to ensure that the order is delivered within 10-15 working days once you place the order. In the unlikely event that we fail to deliver your order within the stipulated period, we shall cancel the order and notify you.
        </p>
        <p className="text-[#64748B] leading-relaxed mb-4">
          We only partner with reputed courier agencies to ensure that the products reach you promptly and in perfect condition.
        </p>

        <h2 className="text-xl font-bold text-[#0F172A] mt-8 mb-4">Identity Verification</h2>
        <p className="text-[#64748B] leading-relaxed mb-4">
          We ensure that the delivery is made to the recipient and thus require identity proof for verification. Recipient needs to keep a photocopy of any of the following:
        </p>
        <ul className="list-disc pl-6 text-[#64748B] space-y-2 leading-relaxed">
          <li>Pan Card</li>
          <li>Driving License</li>
          <li>Passport</li>
          <li>Voter Identification Card</li>
          <li>Postal Identification Card (Aadhar)</li>
        </ul>
      </div>
    </div>
  );
}
