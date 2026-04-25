"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Modal from "@/components/ui/Modal";
import Spinner from "@/components/ui/Spinner";
import type { Service } from "@/lib/types";

export default function ServicesManagement() {
  const router = useRouter();
  const [servicesList, setServicesList] = useState<Service[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  
  // Form State
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: 0,
    duration: "",
    image: ""
  });

  const openAddModal = () => {
    setEditingId(null);
    setFormData({ title: "", description: "", price: 0, duration: "", image: "" });
    setError(null);
    setSaveSuccess(false);
    setIsModalOpen(true);
  };

  const openEditModal = (service: Service) => {
    setEditingId(service._id || service.id || null);
    setFormData({
      title: service.title,
      description: service.description,
      price: service.price,
      duration: service.duration || "",
      image: service.image || ""
    });
    setError(null);
    setSaveSuccess(false);
    setIsModalOpen(true);
  };

  const extractErrorMessage = async (response: Response) => {
    try {
      const body = await response.json();
      return body.error || `HTTP ${response.status}`;
    } catch {
      return `HTTP ${response.status}`;
    }
  };

  const getBase64SizeBytes = (value: string) => {
    const base64Body = value.split(",")[1] || "";
    const padding = (base64Body.match(/=*$/)?.[0].length ?? 0);
    return Math.floor((base64Body.length * 3) / 4) - padding;
  };

  const getErrorMessage = (err: unknown) => {
    if (err instanceof Error) return err.message;
    return "Something went wrong.";
  };

  const fetchServices = async () => {
    try {
      const res = await fetch("/api/services", { credentials: "include" });
      if (!res.ok) {
        if (res.status === 401) {
          throw new Error("Session expired. Please log in again.");
        }
        throw new Error(await extractErrorMessage(res));
      }
      const data = (await res.json()) as Service[];
      setServicesList(data);
      setLoadError(null);
    } catch (err: unknown) {
      console.error("Fetch failed:", err);
      setLoadError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this service?")) {
      setLoading(true);
      try {
        const res = await fetch(`/api/services/${id}`, { method: "DELETE", credentials: "include" });
        if (!res.ok) {
          if (res.status === 401) {
            throw new Error("Session expired. Please log in again.");
          }
          throw new Error(await extractErrorMessage(res));
        }
        setLoadError(null);
        await fetchServices();
      } catch (err: unknown) {
        console.error("Delete failed:", err);
        setLoadError(getErrorMessage(err));
        setLoading(false);
      }
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 1024 * 1024) {
        setError("Image too large. Please upload an image under 1MB.");
        return;
      }
      setError(null);
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, image: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    setSaving(true);
    setError(null);
    setSaveSuccess(false);

    try {
      const payload = { ...formData };
      if (payload.image?.startsWith("data:image") && getBase64SizeBytes(payload.image) > 1024 * 1024) {
        throw new Error("Image too large. Please upload an image under 1MB.");
      }
      const requestPayload =
        editingId && payload.image && !payload.image.startsWith("data:image")
          ? (({ image: _image, ...rest }) => rest)(payload)
          : payload;

      const res = await fetch(editingId ? `/api/services/${editingId}` : "/api/services", {
        method: editingId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(requestPayload),
      });

      if (!res.ok) {
        if (res.status === 401) {
          throw new Error("Session expired. Please log in again.");
        }
        throw new Error(await extractErrorMessage(res));
      }

      setSaveSuccess(true);
      await fetchServices();
      setTimeout(() => {
        setFormData({ title: "", description: "", price: 0, duration: "", image: "" });
        setIsModalOpen(false);
        setSaving(false);
      }, 1000);
    } catch (err: unknown) {
      console.error('Save failed:', err);
      const message = getErrorMessage(err);
      setError(message);
      if (message === "Session expired. Please log in again.") {
        setTimeout(() => router.push("/admin/login"), 600);
      }
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold font-playfair text-[#0F172A]">Services Management</h1>
          <p className="text-[#64748B] text-sm mt-1">Manage astrology services offered to users.</p>
        </div>
        <button
          onClick={openAddModal}
          className="px-4 py-2.5 bg-[#F97316] hover:bg-[#EA6C0A] text-white text-sm font-bold rounded-lg transition-colors shadow-sm flex items-center"
        >
          <svg className="w-5 h-5 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
          Add New Service
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-[#E2E8F0] overflow-hidden">
        {loading ? (
          <div className="py-10 flex justify-center">
            <Spinner className="w-8 h-8 text-[#F97316]" />
          </div>
        ) : (
          <div className="overflow-x-auto w-full">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-[#F8FAFC] border-b border-[#E2E8F0]">
              <tr>
                <th className="px-6 py-4 font-bold text-[#64748B]">Service Title</th>
                <th className="px-6 py-4 font-bold text-[#64748B]">Duration</th>
                <th className="px-6 py-4 font-bold text-[#64748B]">Price</th>
                <th className="px-6 py-4 font-bold text-[#64748B] text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0]">
              {servicesList.length > 0 ? (
                servicesList.map((service) => (
                  <tr key={service._id || service.id} className="hover:bg-[#F8FAFC]">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <img src={service.image || "https://picsum.photos/seed/placeholder/100/100"} alt="" className="w-10 h-10 rounded-md object-cover mr-3 border border-[#E2E8F0]" />
                        <div className="font-bold text-[#0F172A] truncate max-w-[200px]">{service.title}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-[#64748B]">{service.duration}</td>
                    <td className="px-6 py-4 font-bold text-[#F97316]">₹{service.price}</td>
                    <td className="px-6 py-4 text-right">
                      <button onClick={() => openEditModal(service)} className="text-blue-600 hover:text-blue-800 font-bold mr-4">Edit</button>
                      <button onClick={() => handleDelete(service._id || service.id || "")} className="text-red-500 hover:text-red-700 font-bold">Delete</button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-6 py-10 text-center text-[#64748B] font-medium">
                    No services found. Add one to get started.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          </div>
        )}
        {loadError && <p className="px-6 pb-4 text-sm text-red-500">{loadError}</p>}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => !saving && setIsModalOpen(false)}
        title={editingId ? "Edit Service" : "Add New Service"}
      >
        <div className="space-y-4">
          {saveSuccess && <p className="text-green-600 text-sm font-bold bg-green-50 p-3 rounded-lg border border-green-200">Saved successfully!</p>}
          <div>
            <label className="block text-sm font-bold text-[#0F172A] mb-1">Title</label>
            <input type="text" required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full px-3 py-2 border border-[#E2E8F0] rounded-lg focus:ring-[#F97316] focus:border-[#F97316] outline-none" />
          </div>
          <div>
            <label className="block text-sm font-bold text-[#0F172A] mb-1">Description</label>
            <textarea required value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full px-3 py-2 border border-[#E2E8F0] rounded-lg focus:ring-[#F97316] focus:border-[#F97316] outline-none min-h-[80px]" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-[#0F172A] mb-1">Price (₹)</label>
              <input type="number" required min="0" value={formData.price} onChange={e => setFormData({...formData, price: Number(e.target.value)})} className="w-full px-3 py-2 border border-[#E2E8F0] rounded-lg focus:ring-[#F97316] focus:border-[#F97316] outline-none" />
            </div>
            <div>
              <label className="block text-sm font-bold text-[#0F172A] mb-1">Duration</label>
              <input type="text" required placeholder="e.g. 45 mins" value={formData.duration} onChange={e => setFormData({...formData, duration: e.target.value})} className="w-full px-3 py-2 border border-[#E2E8F0] rounded-lg focus:ring-[#F97316] focus:border-[#F97316] outline-none" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-bold text-[#0F172A] mb-1">Upload Image</label>
            <input type="file" accept="image/*" onChange={handleImageChange} className="w-full px-3 py-2 border border-[#E2E8F0] rounded-lg outline-none text-sm bg-gray-50" />
            {formData.image && formData.image.startsWith('http') && (
              <p className="text-xs text-green-600 mt-1">Current image preserved. Upload a new one to replace.</p>
            )}
          </div>
          <div className="pt-4 flex justify-end gap-3">
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button type="button" onClick={() => setIsModalOpen(false)} disabled={saving} className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-[#0F172A] rounded-lg font-bold transition-colors disabled:opacity-50">Cancel</button>
            <button type="button" onClick={handleSubmit} disabled={saving} className="px-4 py-2 bg-[#F97316] hover:bg-[#EA6C0A] text-white rounded-lg font-bold transition-colors disabled:opacity-50 min-w-[120px] flex justify-center">
              {saving ? <Spinner className="w-5 h-5 text-white" /> : "Save Changes"}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
