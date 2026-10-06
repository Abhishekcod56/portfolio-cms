"use client";

import { useEffect, useState } from "react";

import {
  getAbout,
  updateAbout
} from "../../../lib/aboutApi";

import Toast from "../../../components/Toast";

const emptyForm = {
  title: "",
  description: "",
  profile_image: "",
  email: "",
  phone: "",
  location: "",
  github_url: "",
  linkedin_url: "",
  resume_url: ""
};

const AboutPage = () => {
  const [form, setForm] =
    useState(emptyForm);

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
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

  const loadAbout = async () => {
    try {
      setLoading(true);

      const response =
        await getAbout();

      const data =
        response?.data || response;

      if (data) {
        setForm({
          title: data.title || "",
          description:
            data.description || "",
          profile_image:
            data.profile_image || "",
          email: data.email || "",
          phone: data.phone || "",
          location:
            data.location || "",
          github_url:
            data.github_url || "",
          linkedin_url:
            data.linkedin_url || "",
          resume_url:
            data.resume_url || ""
        });
      }
    } catch (error) {
      showToast(
        error.message ||
          "Failed to load About information.",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAbout();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!form.title.trim()) {
      showToast(
        "Title is required.",
        "error"
      );
      return;
    }

    try {
      setSaving(true);

      await updateAbout(form);

      showToast(
        "About information updated successfully."
      );
    } catch (error) {
      showToast(
        error.message ||
          "Failed to update About information.",
        "error"
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
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

        <div className="rounded-xl border border-gray-200 bg-white p-10 text-center">
          <div className="mx-auto h-9 w-9 animate-spin rounded-full border-4 border-gray-300 border-t-black" />

          <p className="mt-4 text-sm text-gray-500">
            Loading About information...
          </p>
        </div>
      </div>
    );
  }

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

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          About
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          Manage the information displayed in
          your portfolio About section.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="max-w-4xl space-y-6"
      >
        <section className="rounded-xl border border-gray-200 bg-white p-6">
          <h2 className="text-lg font-bold text-gray-900">
            Basic Information
          </h2>

          <div className="mt-6 space-y-5">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Title
              </label>

              <input
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="Full Stack Developer"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-black"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Description
              </label>

              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={7}
                placeholder="Write your professional introduction..."
                className="w-full resize-y rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-black"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Profile Image URL
              </label>

              <input
                name="profile_image"
                value={form.profile_image}
                onChange={handleChange}
                placeholder="https://..."
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-black"
              />

              {form.profile_image && (
                <div className="mt-4">
                  <img
                    src={form.profile_image}
                    alt="Profile preview"
                    className="h-28 w-28 rounded-xl object-cover"
                    onError={(event) => {
                      event.currentTarget.style.display =
                        "none";
                    }}
                  />
                </div>
              )}
            </div>
          </div>
        </section>

        <section className="rounded-xl border border-gray-200 bg-white p-6">
          <h2 className="text-lg font-bold text-gray-900">
            Contact Information
          </h2>

          <div className="mt-6 grid gap-5 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Email
              </label>

              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-black"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Phone
              </label>

              <input
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="+91..."
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-black"
              />
            </div>

            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Location
              </label>

              <input
                name="location"
                value={form.location}
                onChange={handleChange}
                placeholder="India"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-black"
              />
            </div>
          </div>
        </section>

        <section className="rounded-xl border border-gray-200 bg-white p-6">
          <h2 className="text-lg font-bold text-gray-900">
            Social & Resume
          </h2>

          <div className="mt-6 space-y-5">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                GitHub URL
              </label>

              <input
                type="url"
                name="github_url"
                value={form.github_url}
                onChange={handleChange}
                placeholder="https://github.com/..."
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-black"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                LinkedIn URL
              </label>

              <input
                type="url"
                name="linkedin_url"
                value={form.linkedin_url}
                onChange={handleChange}
                placeholder="https://linkedin.com/in/..."
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-black"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Resume URL
              </label>

              <input
                type="url"
                name="resume_url"
                value={form.resume_url}
                onChange={handleChange}
                placeholder="https://..."
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-black"
              />
            </div>
          </div>
        </section>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="rounded-lg bg-black px-8 py-3 text-sm font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {saving
              ? "Saving..."
              : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AboutPage;