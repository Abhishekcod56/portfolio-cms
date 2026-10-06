"use client";

import { useEffect, useState } from "react";

import {
  getBlogs,
  createBlog,
  updateBlog,
  deleteBlog
} from "../../../lib/blogApi";

import Toast from "../../../components/Toast";
import ConfirmModal from "../../../components/ConfirmModal";

const emptyForm = {
  title: "",
  slug: "",
  excerpt: "",
  content: "",
  featured_image: "",
  author: "",
  status: "draft"
};

const BlogsPage = () => {
  const [blogs, setBlogs] = useState([]);
  const [form, setForm] = useState(emptyForm);

  const [editingId, setEditingId] = useState(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [deleteItem, setDeleteItem] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const [toast, setToast] = useState({
    message: "",
    type: "success"
  });

  const showToast = (
    message,
    type = "success"
  ) => {
    setToast({
      message,
      type
    });

    setTimeout(() => {
      setToast({
        message: "",
        type: "success"
      });
    }, 3000);
  };

  const loadBlogs = async () => {
    try {
      setLoading(true);

      const response = await getBlogs();

      const data = Array.isArray(response)
        ? response
        : response?.data || [];

      setBlogs(data);
    } catch (error) {
      showToast(
        error.message || "Failed to load blogs.",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBlogs();
  }, []);

  const handleChange = (event) => {
    const {
      name,
      value
    } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value
    }));
  };

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
  };

  const createSlug = () => {
    if (!form.title.trim()) {
      showToast(
        "Enter a title first.",
        "error"
      );

      return;
    }

    const slug = form.title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");

    setForm((current) => ({
      ...current,
      slug
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!form.title.trim()) {
      showToast(
        "Blog title is required.",
        "error"
      );

      return;
    }

    if (!form.slug.trim()) {
      showToast(
        "Blog slug is required.",
        "error"
      );

      return;
    }

    if (!form.content.trim()) {
      showToast(
        "Blog content is required.",
        "error"
      );

      return;
    }

    try {
      setSaving(true);

      const payload = {
        title: form.title.trim(),
        slug: form.slug.trim(),
        excerpt: form.excerpt.trim(),
        content: form.content.trim(),
        featured_image:
          form.featured_image.trim() || null,
        author: form.author.trim(),
        status: form.status
      };

      if (editingId) {
        await updateBlog(
          editingId,
          payload
        );

        showToast(
          "Blog updated successfully."
        );
      } else {
        await createBlog(payload);

        showToast(
          "Blog created successfully."
        );
      }

      resetForm();
      await loadBlogs();
    } catch (error) {
      showToast(
        error.message ||
          "Failed to save blog.",
        "error"
      );
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (blog) => {
    setEditingId(blog.id);

    setForm({
      title: blog.title || "",
      slug: blog.slug || "",
      excerpt: blog.excerpt || "",
      content: blog.content || "",
      featured_image:
        blog.featured_image || "",
      author: blog.author || "",
      status: blog.status || "draft"
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  const handleDelete = async () => {
    if (!deleteItem) {
      return;
    }

    try {
      setDeleting(true);

      await deleteBlog(deleteItem.id);

      showToast(
        "Blog deleted successfully."
      );

      setDeleteItem(null);

      if (editingId === deleteItem.id) {
        resetForm();
      }

      await loadBlogs();
    } catch (error) {
      showToast(
        error.message ||
          "Failed to delete blog.",
        "error"
      );
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div>
      <Toast
        message={toast.message}
        type={toast.type}
        onClose={() =>
          setToast({
            message: "",
            type: "success"
          })
        }
      />

      <ConfirmModal
        open={Boolean(deleteItem)}
        title="Delete Blog"
        message={
          deleteItem
            ? `Are you sure you want to delete "${deleteItem.title}"? This action cannot be undone.`
            : ""
        }
        loading={deleting}
        onCancel={() =>
          setDeleteItem(null)
        }
        onConfirm={handleDelete}
      />

      <div className="mb-8">
        <h1 className="text-2xl font-bold">
          Blogs
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          Create and manage your portfolio
          blog posts.
        </p>
      </div>

      <div className="grid gap-6 xl:grid-cols-[420px_1fr]">
        <section className="h-fit rounded-xl border border-gray-200 bg-white p-6">
          <div className="mb-6 flex items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold">
                {editingId
                  ? "Edit Blog"
                  : "Create Blog"}
              </h2>

              <p className="mt-1 text-xs text-gray-500">
                Write and publish an article.
              </p>
            </div>

            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="text-sm text-gray-500 hover:text-black"
              >
                Cancel
              </button>
            )}
          </div>

          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >
            <div>
              <label className="mb-2 block text-sm font-medium">
                Title
              </label>

              <input
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="My First Blog"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:border-black focus:outline-none"
              />
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between gap-2">
                <label className="text-sm font-medium">
                  Slug
                </label>

                <button
                  type="button"
                  onClick={createSlug}
                  className="text-xs font-medium text-gray-600 underline hover:text-black"
                >
                  Generate
                </button>
              </div>

              <input
                name="slug"
                value={form.slug}
                onChange={handleChange}
                placeholder="my-first-blog"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:border-black focus:outline-none"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                Excerpt
              </label>

              <textarea
                name="excerpt"
                value={form.excerpt}
                onChange={handleChange}
                rows={3}
                placeholder="Short description..."
                className="w-full resize-none rounded-lg border border-gray-300 px-4 py-3 text-sm focus:border-black focus:outline-none"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                Content
              </label>

              <textarea
                name="content"
                value={form.content}
                onChange={handleChange}
                rows={10}
                placeholder="Write your blog content..."
                className="w-full resize-y rounded-lg border border-gray-300 px-4 py-3 text-sm focus:border-black focus:outline-none"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                Featured Image URL
              </label>

              <input
                name="featured_image"
                value={form.featured_image}
                onChange={handleChange}
                placeholder="https://..."
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:border-black focus:outline-none"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                Author
              </label>

              <input
                name="author"
                value={form.author}
                onChange={handleChange}
                placeholder="Your name"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:border-black focus:outline-none"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                Status
              </label>

              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm focus:border-black focus:outline-none"
              >
                <option value="draft">
                  Draft
                </option>

                <option value="published">
                  Published
                </option>
              </select>
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={saving}
                className="flex-1 rounded-lg bg-black px-5 py-3 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-50"
              >
                {saving
                  ? "Saving..."
                  : editingId
                  ? "Update Blog"
                  : "Create Blog"}
              </button>

              {editingId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="rounded-lg border border-gray-300 px-4 py-3 text-sm hover:bg-gray-100"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </section>

        <section className="rounded-xl border border-gray-200 bg-white">
          <div className="border-b border-gray-200 p-6">
            <h2 className="text-lg font-bold">
              All Blogs
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              {blogs.length} blog
              {blogs.length === 1
                ? ""
                : "s"}
            </p>
          </div>

          {loading ? (
            <div className="p-10 text-center">
              Loading blogs...
            </div>
          ) : blogs.length === 0 ? (
            <div className="p-10 text-center text-gray-500">
              No blogs found.
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {blogs.map((blog) => (
                <div
                  key={blog.id}
                  className="p-6"
                >
                  <div className="flex flex-col gap-5 lg:flex-row lg:justify-between">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-bold text-gray-900">
                          {blog.title}
                        </h3>

                        <span
                          className={`rounded-full px-3 py-1 text-xs font-medium ${
                            blog.status ===
                            "published"
                              ? "bg-green-100 text-green-700"
                              : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {blog.status ===
                          "published"
                            ? "Published"
                            : "Draft"}
                        </span>
                      </div>

                      {blog.excerpt && (
                        <p className="mt-2 line-clamp-3 text-sm leading-6 text-gray-600">
                          {blog.excerpt}
                        </p>
                      )}

                      <div className="mt-3 space-y-1 text-xs text-gray-500">
                        {blog.slug && (
                          <p>
                            Slug:{" "}
                            <span className="font-medium text-gray-700">
                              {blog.slug}
                            </span>
                          </p>
                        )}

                        {blog.author && (
                          <p>
                            Author:{" "}
                            <span className="font-medium text-gray-700">
                              {blog.author}
                            </span>
                          </p>
                        )}

                        {blog.published_at && (
                          <p>
                            Published:{" "}
                            <span className="font-medium text-gray-700">
                              {new Date(
                                blog.published_at
                              ).toLocaleDateString()}
                            </span>
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex shrink-0 gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          handleEdit(blog)
                        }
                        className="rounded-lg border border-gray-300 px-4 py-2 text-sm hover:bg-gray-100"
                      >
                        Edit
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          setDeleteItem(blog)
                        }
                        className="rounded-lg bg-red-600 px-4 py-2 text-sm text-white hover:bg-red-700"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default BlogsPage;