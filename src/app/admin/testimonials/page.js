"use client";

import { useEffect, useState } from "react";

import {
  getTestimonials,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial
} from "../../../lib/testimonialApi";

import Toast from "../../../components/Toast";
import ConfirmModal from "../../../components/ConfirmModal";

const emptyForm = {
  name: "",
  role: "",
  company: "",
  message: "",
  image: ""
};

const TestimonialsPage = () => {
  const [testimonials, setTestimonials] =
    useState([]);

  const [form, setForm] =
    useState(emptyForm);

  const [editingId, setEditingId] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [deleteItem, setDeleteItem] =
    useState(null);

  const [deleting, setDeleting] =
    useState(false);

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

  const loadTestimonials = async () => {
    try {
      setLoading(true);

      const response =
        await getTestimonials();

      const data = Array.isArray(response)
        ? response
        : response?.data || [];

      setTestimonials(data);
    } catch (error) {
      showToast(
        error.message ||
          "Failed to load testimonials.",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTestimonials();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value
    }));
  };

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!form.name.trim()) {
      showToast(
        "Name is required.",
        "error"
      );
      return;
    }

    if (!form.message.trim()) {
      showToast(
        "Testimonial message is required.",
        "error"
      );
      return;
    }

    try {
      setSaving(true);

      if (editingId) {
        await updateTestimonial(
          editingId,
          form
        );

        showToast(
          "Testimonial updated successfully."
        );
      } else {
        await createTestimonial(form);

        showToast(
          "Testimonial created successfully."
        );
      }

      resetForm();
      await loadTestimonials();
    } catch (error) {
      showToast(
        error.message ||
          "Failed to save testimonial.",
        "error"
      );
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (testimonial) => {
    setEditingId(testimonial.id);

    setForm({
      name: testimonial.name || "",
      role: testimonial.role || "",
      company:
        testimonial.company || "",
      message:
        testimonial.message || "",
      image: testimonial.image || ""
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

      await deleteTestimonial(
        deleteItem.id
      );

      showToast(
        "Testimonial deleted successfully."
      );

      setDeleteItem(null);

      if (editingId === deleteItem.id) {
        resetForm();
      }

      await loadTestimonials();
    } catch (error) {
      showToast(
        error.message ||
          "Failed to delete testimonial.",
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
        title="Delete Testimonial"
        message={
          deleteItem
            ? `Are you sure you want to delete the testimonial from "${deleteItem.name}"?`
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
          Testimonials
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          Manage client and customer testimonials.
        </p>
      </div>

      <div className="grid gap-6 xl:grid-cols-[380px_1fr]">
        <section className="h-fit rounded-xl border border-gray-200 bg-white p-6">
          <h2 className="mb-6 text-lg font-bold">
            {editingId
              ? "Edit Testimonial"
              : "Add Testimonial"}
          </h2>

          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >
            <div>
              <label className="mb-2 block text-sm font-medium">
                Name
              </label>

              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="John Doe"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:border-black focus:outline-none"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                Role
              </label>

              <input
                name="role"
                value={form.role}
                onChange={handleChange}
                placeholder="CEO"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:border-black focus:outline-none"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                Company
              </label>

              <input
                name="company"
                value={form.company}
                onChange={handleChange}
                placeholder="Company name"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:border-black focus:outline-none"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                Message
              </label>

              <textarea
                name="message"
                value={form.message}
                onChange={handleChange}
                rows={6}
                placeholder="Write the testimonial..."
                className="w-full resize-none rounded-lg border border-gray-300 px-4 py-3 text-sm focus:border-black focus:outline-none"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                Image URL
              </label>

              <input
                name="image"
                value={form.image}
                onChange={handleChange}
                placeholder="https://..."
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:border-black focus:outline-none"
              />
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
                  ? "Update Testimonial"
                  : "Create Testimonial"}
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
              All Testimonials
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              {testimonials.length} testimonial
              {testimonials.length === 1
                ? ""
                : "s"}
            </p>
          </div>

          {loading ? (
            <div className="p-10 text-center">
              Loading testimonials...
            </div>
          ) : testimonials.length === 0 ? (
            <div className="p-10 text-center text-gray-500">
              No testimonials found.
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {testimonials.map(
                (testimonial) => (
                  <div
                    key={testimonial.id}
                    className="p-6"
                  >
                    <div className="flex flex-col gap-5 lg:flex-row lg:justify-between">
                      <div className="max-w-2xl">
                        <p className="text-lg font-medium leading-7 text-gray-800">
                          “
                          {testimonial.message}
                          ”
                        </p>

                        <div className="mt-4">
                          <p className="font-bold">
                            {testimonial.name}
                          </p>

                          {(testimonial.role ||
                            testimonial.company) && (
                            <p className="mt-1 text-sm text-gray-500">
                              {
                                testimonial.role
                              }

                              {testimonial.role &&
                                testimonial.company &&
                                " · "}

                              {
                                testimonial.company
                              }
                            </p>
                          )}
                        </div>

                        {testimonial.image && (
                          <p className="mt-3 text-xs text-gray-500">
                            Image:{" "}
                            {
                              testimonial.image
                            }
                          </p>
                        )}
                      </div>

                      <div className="flex shrink-0 gap-2">
                        <button
                          type="button"
                          onClick={() =>
                            handleEdit(
                              testimonial
                            )
                          }
                          className="rounded-lg border border-gray-300 px-4 py-2 text-sm hover:bg-gray-100"
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            setDeleteItem(
                              testimonial
                            )
                          }
                          className="rounded-lg bg-red-600 px-4 py-2 text-sm text-white hover:bg-red-700"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                )
              )}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default TestimonialsPage;