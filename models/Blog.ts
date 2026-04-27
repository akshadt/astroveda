import mongoose, { Schema, model, models } from "mongoose";

const blogSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    excerpt: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    author: {
      type: String,
      default: "Mukesh Ravindra Gupta",
    },
    image: {
      type: String,
    },
    category: {
      type: String,
      default: "Astrology",
    },
  },
  { timestamps: true }
);

const Blog = models.Blog || model("Blog", blogSchema);
export default Blog;
