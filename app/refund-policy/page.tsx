import Link from "next/link";

export default function RefundPolicyPage() {
  return (
    <div className="min-h-screen bg-[#FAF7F2] py-16 px-4">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl border border-[#E2E8F0] shadow-sm p-8 md:p-10">
        <Link href="/" className="text-sm text-[#64748B] hover:text-[#F97316] mb-8 inline-block">
          ← Back to Home
        </Link>
        <h1 className="font-playfair text-3xl md:text-4xl font-bold text-[#0F172A] mb-8">Refund Policy</h1>

        <h2 className="text-xl font-bold text-[#0F172A] mt-8 mb-4">Cancellation and Refunds</h2>
        <p className="text-[#64748B] leading-relaxed mb-4">
          A refund shall be provided if you cancel any order before it has been prepared by calling us to notify us about the cancellation and we will determine if it is possible to cancel/modify the order.
        </p>
        <p className="text-[#64748B] leading-relaxed mb-4">
          However, once the order has been shipped we will not be able to cancel or modify it. We offer returns and exchanges for orders damaged in transit or if you have received incorrect item(s). In case of a damaged package/incorrect item(s), please contact us within 3 days of receipt of the order along with a parcel opening video of the product.
        </p>
        <p className="text-[#64748B] leading-relaxed mb-4">
          Please note that to be eligible for a return, you must return the item(s) unused and in the same condition that you received it, in its original packaging, along with the invoice.
        </p>

        <h2 className="text-xl font-bold text-[#0F172A] mt-8 mb-4">Refunds shall not be provided if:</h2>
        <ul className="list-disc pl-6 text-[#64748B] space-y-2 leading-relaxed">
          <li>The products are returned in a used or damaged condition</li>
          <li>The products are not faulty or damaged</li>
          <li>Incorrect or outdated delivery address including any form of PO Box address</li>
          <li>After 3 failed delivery attempts by our courier agent</li>
          <li>Package refused by recipient</li>
          <li>Sizing issues — please review our size guides carefully before purchase</li>
          <li>Minor color and design variation — all products are handmade and use natural stones so there may be some variation from photographs</li>
          <li>Parcel opening video is required for any replacement</li>
        </ul>
      </div>
    </div>
  );
}
