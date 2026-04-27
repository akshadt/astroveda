"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Spinner from "@/components/ui/Spinner";

type Blog = {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  image: string;
  category: string;
  createdAt: string;
};

export default function BlogsPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await fetch("/api/blogs");
        if (!res.ok) throw new Error("Failed to load blogs");
        const data = await res.json();
        setBlogs(data);
      } catch (err: unknown) {
        console.error("Blogs fetch failed:", err);
        setError("Unable to load blogs at this time. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  return (
    <div className="bg-[#FAF7F2] min-h-screen">
      <div className="bg-[#0F172A] text-white py-20 px-4 text-center">
        <h1 className="font-playfair text-4xl md:text-5xl font-bold mb-4">OMKKAAR Blog</h1>
        <p className="text-[#F97316] max-w-2xl mx-auto text-lg font-medium">Insights into Astrology, Gemstones, and Spiritual Growth</p>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-16">
        {loading ? (
          <div className="flex justify-center py-20">
            <Spinner className="w-10 h-10 text-[#F97316]" />
          </div>
        ) : error ? (
          <div className="text-center text-red-500 py-10 bg-red-50 rounded-lg max-w-2xl mx-auto border border-red-100">
            {error}
          </div>
        ) : blogs.length === 0 ? (
          <div className="text-center text-[#64748B] py-20">
            <p className="text-xl font-medium">No blog posts found.</p>
            <p className="mt-2 text-sm">Check back later for new content.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogs.map((blog) => (
              <div key={blog._id} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border border-[#E2E8F0] flex flex-col group">
                <div className="h-56 overflow-hidden relative">
                  <span className="absolute top-4 left-4 bg-[#0F172A]/80 backdrop-blur-sm text-white text-xs font-bold px-3 py-1.5 rounded-full z-10">
                    {blog.category || "Astrology"}
                  </span>
                  <img 
                    src={blog.image || "https://picsum.photos/seed/placeholder/400/300"} 
                    alt={blog.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <div className="flex justify-between items-center text-xs text-[#64748B] font-bold mb-3 uppercase tracking-wider">
                    <span>{new Date(blog.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
                  </div>
                  <h3 className="font-playfair text-xl font-bold text-[#0F172A] mb-3 line-clamp-2 leading-snug group-hover:text-[#F97316] transition-colors">
                    {blog.title}
                  </h3>
                  <p className="text-[#64748B] text-sm line-clamp-3 mb-6 flex-1">
                    {blog.excerpt}
                  </p>
                  <Link 
                    href={`/blogs/${blog.slug}`} 
                    className="inline-flex items-center text-[#F97316] font-bold text-sm hover:text-[#EA6C0A]"
                  >
                    Read Article 
                    <svg className="w-4 h-4 ml-1.5 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
