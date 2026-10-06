
"use client";

import { useEffect, useState } from "react";

import {
  getExperience,
  createExperience,
  updateExperience,
  deleteExperience
} from "../../../lib/experienceApi";

import Toast from "../../../components/Toast";
import ConfirmModal from "../../../components/ConfirmModal";

const emptyForm = {
  company: "",
  position: "",
  description: "",
  location: "",
  start_date: "",
  end_date: ""
};

const ExperiencePage = () => {
  const [experiences, setExperiences] = useState([]);

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

  const showToast = (message, type = "success") => {
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

  const loadExperience = async () => {
    try {
      setLoading(true);

      const response = await getExperience();

      const data = Array.isArray(response)
        ? response
        : response?.data || [];

      setExperiences(data);
    } catch (error) {
      showToast(
        error.message || "Failed to load experience.",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadExperience();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value
    }));
  };

  const resetForm = () => {
    setForm({ ...emptyForm });
    setEditingId(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const company = form.company.trim();
    const position = form.position.trim();

    if (!company) {
      showToast(
        "Company is required.",
        "error"
      );
      return;
    }

    if (!position) {
      showToast(
        "Position is required.",
        "error"
      );
      return;
    }

    const payload = {
      company,
      position,
      description: form.description.trim(),
      location: form.location.trim(),
      start_date: form.start_date || null,
      end_date: form.end_date || null
    };

    try {
      setSaving(true);

      if (editingId) {
        await updateExperience(
          editingId,
          payload
        );

        showToast(
          "Experience updated successfully."
        );
      } else {
        await createExperience(payload);

        showToast(
          "Experience created successfully."
        );
      }

      resetForm();

      await loadExperience();
    } catch (error) {
      showToast(
        error.message ||
          "Failed to save experience.",
        "error"
      );
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (experience) => {
    setEditingId(experience.id);

    setForm({
      company: experience.company || "",

      position:
        experience.position ||
        experience.role ||
        "",

      description:
        experience.description || "",

      location:
        experience.location || "",

      start_date:
        experience.start_date
          ? String(experience.start_date).slice(
              0,
              10
            )
          : "",

      end_date:
        experience.end_date
          ? String(experience.end_date).slice(
              0,
              10
            )
          : ""
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

      await deleteExperience(
        deleteItem.id
      );

      showToast(
        "Experience deleted successfully."
      );

      setDeleteItem(null);

      if (editingId === deleteItem.id) {
        resetForm();
      }

      await loadExperience();
    } catch (error) {
      showToast(
        error.message ||
          "Failed to delete experience.",
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
        title="Delete Experience"
        message={
          deleteItem
            ? `Are you sure you want to delete the experience at "${deleteItem.company}"?`
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
          Experience
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          Manage your professional experience.
        </p>
      </div>

      <div className="grid gap-6 xl:grid-cols-[380px_1fr]">
        <section className="h-fit rounded-xl border border-gray-200 bg-white p-6">
          <h2 className="mb-6 text-lg font-bold">
            {editingId
              ? "Edit Experience"
              : "Add Experience"}
          </h2>

          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >
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
                Position
              </label>

              <input
                name="position"
                value={form.position}
                onChange={handleChange}
                placeholder="Software Developer"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:border-black focus:outline-none"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                Description
              </label>

              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={5}
                placeholder="Describe your responsibilities..."
                className="w-full resize-none rounded-lg border border-gray-300 px-4 py-3 text-sm focus:border-black focus:outline-none"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                Location
              </label>

              <input
                name="location"
                value={form.location}
                onChange={handleChange}
                placeholder="Delhi, India"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:border-black focus:outline-none"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                Start Date
              </label>

              <input
                type="date"
                name="start_date"
                value={form.start_date}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:border-black focus:outline-none"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                End Date
              </label>

              <input
                type="date"
                name="end_date"
                value={form.end_date}
                onChange={handleChange}
                disabled={false}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:border-black focus:outline-none"
              />

              <p className="mt-1 text-xs text-gray-500">
                Leave empty if this is your current position.
              </p>
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
                  ? "Update Experience"
                  : "Create Experience"}
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
              All Experience
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              {experiences.length} record
              {experiences.length === 1
                ? ""
                : "s"}
            </p>
          </div>

          {loading ? (
            <div className="p-10 text-center">
              Loading experience...
            </div>
          ) : experiences.length === 0 ? (
            <div className="p-10 text-center text-gray-500">
              No experience found.
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {experiences.map(
                (experience) => (
                  <div
                    key={experience.id}
                    className="p-6"
                  >
                    <div className="flex flex-col gap-4 lg:flex-row lg:justify-between">
                      <div>
                        <h3 className="font-bold">
                          {experience.position ||
                            experience.role}
                        </h3>

                        <p className="mt-1 font-medium text-gray-700">
                          {experience.company}
                        </p>

                        {experience.location && (
                          <p className="mt-1 text-sm text-gray-500">
                            {experience.location}
                          </p>
                        )}

                        <p className="mt-2 text-xs text-gray-500">
                          {experience.start_date ||
                            "N/A"}{" "}
                          —{" "}
                          {experience.end_date ||
                            "Present"}
                        </p>

                        {experience.description && (
                          <p className="mt-3 max-w-2xl text-sm leading-6 text-gray-600">
                            {
                              experience.description
                            }
                          </p>
                        )}
                      </div>

                      <div className="flex shrink-0 gap-2">
                        <button
                          type="button"
                          onClick={() =>
                            handleEdit(
                              experience
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
                              experience
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

export default ExperiencePage;
