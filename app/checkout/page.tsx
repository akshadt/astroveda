"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect, Suspense } from "react";
import { services, gemstones } from "@/lib/mockData";
import Spinner from "@/components/ui/Spinner";
import type { Product, Service } from "@/lib/types";

declare global {
  interface Window {
    Razorpay: new (options: Record<string, unknown>) => { open: () => void };
  }
}

type CheckoutItem = (Service | Product) & { _id: string };

function CheckoutContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const serviceId = searchParams.get("serviceId");
  const productId = searchParams.get("productId");

  const [item, setItem] = useState<CheckoutItem | null>(null);

  const [formData, setFormData] = useState({ name: "", email: "", phone: "" });
  const [errors, setErrors] = useState({ name: "", email: "", phone: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [checkoutError, setCheckoutError] = useState("");
  const [loadingItem, setLoadingItem] = useState(true);

  const extractErrorMessage = async (response: Response, fallback: string) => {
    try {
      const body = await response.json();
      return body.error || fallback;
    } catch {
      return fallback;
    }
  };

  useEffect(() => {
    const fetchItem = async () => {
      try {
        if (!serviceId && !productId) {
          setLoadingItem(false);
          return;
        }

        if (serviceId) {
          const res = await fetch(`/api/services/${serviceId}`);
          if (res.ok) {
            const data = (await res.json()) as Service;
            setItem({ ...data, _id: data._id || serviceId });
          } else {
            const fallback = services.find((s) => s.id === serviceId);
            setItem(
              fallback
                ? ({
                    ...fallback,
                    _id: fallback.id,
                  } as CheckoutItem)
                : null,
            );
          }
        } else if (productId) {
          const res = await fetch(`/api/products/${productId}`);
          if (res.ok) {
            const data = (await res.json()) as Product;
            setItem({ ...data, _id: data._id || productId });
          } else {
            const fallback = gemstones.find((p) => p.id === productId);
            setItem(
              fallback
                ? ({
                    ...fallback,
                    _id: fallback.id,
                  } as CheckoutItem)
                : null,
            );
          }
        }
      } catch (err: unknown) {
        console.error("Checkout item fetch failed:", err);
      } finally {
        setLoadingItem(false);
      }
    };

    fetchItem();
  }, [serviceId, productId]);

  // If no item found, redirect or show error
  if (loadingItem) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-[#FAF7F2] min-h-screen">
        <Spinner className="w-10 h-10 text-[#F97316]" />
      </div>
    );
  }

  if (!item) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-[#FAF7F2] min-h-screen">
        <h2 className="text-2xl font-bold mb-4 text-[#0F172A]">No item selected for checkout</h2>
        <button onClick={() => router.push("/")} className="text-[#F97316] underline font-medium">Return Home</button>
      </div>
    );
  }

  const validate = () => {
    let valid = true;
    const newErrors = { name: "", email: "", phone: "" };

    if (!formData.name.trim()) {
      newErrors.name = "Name is required.";
      valid = false;
    }

    if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid emailaddress.";
      valid = false;
    }

    if (!/^\d{10}$/.test(formData.phone)) {
      newErrors.phone = "Phone number must be exactly 10 digits.";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const loadRazorpayScript = () =>
    new Promise<boolean>((resolve) => {
      if (document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]')) {
        resolve(true);
        return;
      }
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      setIsSubmitting(true);
      setCheckoutError("");

      try {
        const orderRes = await fetch("/api/orders", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userInfo: formData,
            items: [
              {
                itemId: item._id,
                itemType: serviceId ? "service" : "product",
                title: item.title,
                price: item.price,
              },
            ],
            totalAmount: item.price,
          }),
        });

        if (!orderRes.ok) {
          throw new Error(await extractErrorMessage(orderRes, "Order creation failed"));
        }
        const { orderId } = (await orderRes.json()) as { orderId: string };

        const rpOrderRes = await fetch("/api/payment/create-order", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            orderId,
            amount: item.price,
          }),
        });

        if (!rpOrderRes.ok) {
          throw new Error(await extractErrorMessage(rpOrderRes, "Razorpay order creation failed"));
        }

        const razorpayData = (await rpOrderRes.json()) as {
          razorpay_order_id: string;
          amount: number;
          currency: string;
        };

        const scriptLoaded = await loadRazorpayScript();
        if (!scriptLoaded || !window.Razorpay) {
          throw new Error("Razorpay SDK failed to load");
        }

        const razorpay = new window.Razorpay({
          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
          amount: razorpayData.amount,
          currency: razorpayData.currency,
          name: "AstroVeda",
          description: item.title,
          order_id: razorpayData.razorpay_order_id,
          handler: async (response: Record<string, string>) => {
            try {
              const verifyRes = await fetch("/api/payment/verify", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                  orderId,
                }),
              });

              if (!verifyRes.ok) {
                throw new Error(await extractErrorMessage(verifyRes, "Verification failed"));
              }

              router.push(`/payment-success?orderId=${orderId}`);
            } catch (err: unknown) {
              console.error("Payment verification failed:", err);
              setCheckoutError("Payment failed. Please try again.");
              setIsSubmitting(false);
            }
          },
          prefill: {
            name: formData.name,
            email: formData.email,
            contact: formData.phone,
          },
          theme: { color: "#F97316" },
        });

        razorpay.open();
      } catch (err: unknown) {
        console.error("Checkout submit failed:", err);
        setCheckoutError("Payment failed. Please try again.");
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div className="bg-[#FAF7F2] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-12 md:py-20">
        <h1 className="font-playfair text-3xl font-bold text-[#0F172A] mb-8 border-b border-[#E2E8F0] pb-4">Checkout</h1>
        
        <div className="flex flex-col-reverse md:flex-row gap-8 lg:gap-12">
          {/* Form Section */}
          <div className="flex-1 bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-[#E2E8F0]">
            <h2 className="text-xl font-bold text-[#0F172A] mb-6 font-playfair">Billing Details</h2>
            
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-[#0F172A] mb-1">Full Name</label>
                <input
                  type="text"
                  className={`w-full px-4 py-2.5 rounded-lg border ${errors.name ? 'border-red-500 focus:ring-red-500' : 'border-[#E2E8F0] focus:ring-[#F97316] focus:border-[#F97316]'} focus:outline-none focus:ring-2`}
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  disabled={isSubmitting}
                />
                {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-sm font-bold text-[#0F172A] mb-1">Email Address</label>
                <input
                  type="email"
                  className={`w-full px-4 py-2.5 rounded-lg border ${errors.email ? 'border-red-500 focus:ring-red-500' : 'border-[#E2E8F0] focus:ring-[#F97316] focus:border-[#F97316]'} focus:outline-none focus:ring-2`}
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  disabled={isSubmitting}
                />
                {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
              </div>

              <div>
                <label className="block text-sm font-bold text-[#0F172A] mb-1">Phone Number</label>
                <input
                  type="tel"
                  className={`w-full px-4 py-2.5 rounded-lg border ${errors.phone ? 'border-red-500 focus:ring-red-500' : 'border-[#E2E8F0] focus:ring-[#F97316] focus:border-[#F97316]'} focus:outline-none focus:ring-2`}
                  placeholder="10-digit mobile number"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  disabled={isSubmitting}
                />
                {errors.phone && <p className="mt-1 text-sm text-red-500">{errors.phone}</p>}
              </div>

              <div className="pt-4">
                {checkoutError && <p className="mb-3 text-sm text-red-500">{checkoutError}</p>}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center py-3.5 px-4 border border-transparent rounded-xl shadow-lg text-lg font-bold text-white bg-[#F97316] hover:bg-[#EA6C0A] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#F97316] transition-all disabled:opacity-70"
                >
                  {isSubmitting ? <Spinner /> : `Pay ₹${item.price}`}
                </button>
              </div>
            </form>
          </div>

          {/* Order Summary */}
          <div className="md:w-96">
            <div className="bg-[#FFF7ED] p-6 md:p-8 rounded-2xl border border-[#F97316]/20 sticky top-24">
              <h2 className="text-xl font-bold text-[#0F172A] mb-6 font-playfair">Order Summary</h2>
              
              <div className="flex items-start mb-6">
                <img src={item.image} alt={item.title} className="w-20 h-20 object-cover rounded-lg mr-4 border border-[#F97316]/30 shadow-sm" />
                <div>
                  <h3 className="font-bold text-[#0F172A] line-clamp-2">{item.title}</h3>
                  <p className="text-[#F97316] font-extrabold mt-1 text-lg">₹{item.price}</p>
                  {'duration' in item && (
                    <span className="inline-block mt-1 bg-white px-2 py-0.5 border border-[#F97316]/30 rounded text-xs text-[#0F172A] font-medium shadow-sm">
                      {item.duration}
                    </span>
                  )}
                </div>
              </div>

              <div className="border-t border-[#F97316]/20 pt-4 space-y-3">
                <div className="flex justify-between text-sm text-[#64748B] font-medium">
                  <span>Subtotal</span>
                  <span>₹{item.price}</span>
                </div>
                <div className="flex justify-between text-sm text-[#64748B] font-medium">
                  <span>Taxes & Fees</span>
                  <span>₹0</span>
                </div>
                <div className="flex justify-between text-xl font-extrabold text-[#0F172A] pt-3 border-t border-[#F97316]/20">
                  <span>Total</span>
                  <span className="text-[#F97316]">₹{item.price}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="flex justify-center items-center h-screen bg-[#FAF7F2]"><Spinner className="w-10 h-10 text-[#F97316]" /></div>}>
      <CheckoutContent />
    </Suspense>
  );
}
