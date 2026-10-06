"use client";

import { useEffect, useState } from "react";

import {
  getSkills,
  createSkill,
  updateSkill,
  deleteSkill
} from "../../../lib/skillApi";

import Toast from "../../../components/Toast";
import ConfirmModal from "../../../components/ConfirmModal";

const emptyForm = {
  name: "",
  category: "",
  level: "",
  icon: ""
};

const SkillsPage = () => {
  const [skills, setSkills] = useState([]);
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
    setToast({ message, type });

    setTimeout(() => {
      setToast({
        message: "",
        type: "success"
      });
    }, 3000);
  };

  const loadSkills = async () => {
    try {
      setLoading(true);

      const response = await getSkills();

      const data = Array.isArray(response)
        ? response
        : response?.data || [];

      setSkills(data);
    } catch (error) {
      showToast(
        error.message || "Failed to load skills.",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSkills();
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
        "Skill name is required.",
        "error"
      );
      return;
    }

    try {
      setSaving(true);

      if (editingId) {
        await updateSkill(editingId, form);

        showToast(
          "Skill updated successfully."
        );
      } else {
        await createSkill(form);

        showToast(
          "Skill created successfully."
        );
      }

      resetForm();
      await loadSkills();
    } catch (error) {
      showToast(
        error.message || "Failed to save skill.",
        "error"
      );
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (skill) => {
    setEditingId(skill.id);

    setForm({
      name: skill.name || "",
      category: skill.category || "",
      level: skill.level || "",
      icon: skill.icon || ""
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

      await deleteSkill(deleteItem.id);

      showToast(
        "Skill deleted successfully."
      );

      setDeleteItem(null);

      if (editingId === deleteItem.id) {
        resetForm();
      }

      await loadSkills();
    } catch (error) {
      showToast(
        error.message || "Failed to delete skill.",
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
        title="Delete Skill"
        message={
          deleteItem
            ? `Are you sure you want to delete "${deleteItem.name}"? This action cannot be undone.`
            : ""
        }
        loading={deleting}
        onCancel={() => setDeleteItem(null)}
        onConfirm={handleDelete}
      />

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          Skills
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          Manage your technical and professional
          skills.
        </p>
      </div>

      <div className="grid gap-6 xl:grid-cols-[380px_1fr]">
        <section className="h-fit rounded-xl border border-gray-200 bg-white p-6">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold">
                {editingId
                  ? "Edit Skill"
                  : "Add Skill"}
              </h2>

              <p className="mt-1 text-xs text-gray-500">
                Add skill information.
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
                Name
              </label>

              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="JavaScript"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-black"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                Category
              </label>

              <input
                name="category"
                value={form.category}
                onChange={handleChange}
                placeholder="Frontend"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-black"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                Level
              </label>

              <input
                name="level"
                value={form.level}
                onChange={handleChange}
                placeholder="Advanced"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-black"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                Icon
              </label>

              <input
                name="icon"
                value={form.icon}
                onChange={handleChange}
                placeholder="Code2"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-black"
              />
            </div>

            <button
              type="submit"
              disabled={saving}
              className="w-full rounded-lg bg-black px-5 py-3 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-50"
            >
              {saving
                ? "Saving..."
                : editingId
                ? "Update Skill"
                : "Create Skill"}
            </button>
          </form>
        </section>

        <section className="rounded-xl border border-gray-200 bg-white">
          <div className="border-b border-gray-200 p-6">
            <h2 className="text-lg font-bold">
              All Skills
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              {skills.length} skill
              {skills.length === 1 ? "" : "s"}
            </p>
          </div>

          {loading ? (
            <div className="p-10 text-center">
              Loading skills...
            </div>
          ) : skills.length === 0 ? (
            <div className="p-10 text-center text-gray-500">
              No skills found.
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {skills.map((skill) => (
                <div
                  key={skill.id}
                  className="p-6"
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <h3 className="font-bold text-gray-900">
                        {skill.name}
                      </h3>

                      <div className="mt-2 flex flex-wrap gap-2">
                        {skill.category && (
                          <span className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-700">
                            {skill.category}
                          </span>
                        )}

                        {skill.level && (
                          <span className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-700">
                            {skill.level}
                          </span>
                        )}
                      </div>

                      {skill.icon && (
                        <p className="mt-2 text-xs text-gray-500">
                          Icon: {skill.icon}
                        </p>
                      )}
                    </div>

                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          handleEdit(skill)
                        }
                        className="rounded-lg border border-gray-300 px-4 py-2 text-sm hover:bg-gray-100"
                      >
                        Edit
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          setDeleteItem(skill)
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

export default SkillsPage;