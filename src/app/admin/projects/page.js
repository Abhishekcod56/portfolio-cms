
"use client";

import { useEffect, useState } from "react";
import {
  getProjects,
  createProject,
  updateProject,
  deleteProject
} from "../../../lib/projectApi";
import Toast from "../../../components/Toast";
import ConfirmModal from "../../../components/ConfirmModal";

const emptyForm = {
  title: "",
  slug: "",
  description: "",
  image: "",
  technologies: "",
  github_url: "",
  live_url: "",
  featured: false
};

const createSlug = (value) => {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
};

const ProjectsPage = () => {
  const [projects, setProjects] = useState([]);
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
  };

  const loadProjects = async () => {
    try {
      setLoading(true);

      const response = await getProjects();

      const data = Array.isArray(response)
        ? response
        : response?.data || [];

      setProjects(data);
    } catch (error) {
      showToast(
        error.message ||
          "Failed to load projects.",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const handleChange = (event) => {
    const {
      name,
      value,
      type,
      checked
    } = event.target;

    setForm((current) => {
      const nextForm = {
        ...current,
        [name]:
          type === "checkbox"
            ? checked
            : value
      };

      if (name === "title" && !editingId) {
        nextForm.slug = createSlug(value);
      }

      return nextForm;
    });
  };

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!form.title.trim()) {
      showToast(
        "Project title is required.",
        "error"
      );
      return;
    }

    if (!form.slug.trim()) {
      showToast(
        "Project slug is required.",
        "error"
      );
      return;
    }

    try {
      setSaving(true);

      const payload = {
        title: form.title.trim(),
        slug: form.slug.trim(),
        description:
          form.description.trim(),
        image: form.image.trim(),
        technologies:
          form.technologies.trim(),
        github_url:
          form.github_url.trim(),
        live_url:
          form.live_url.trim(),
        featured: Boolean(form.featured)
      };

      if (editingId) {
        await updateProject(
          editingId,
          payload
        );

        showToast(
          "Project updated successfully."
        );
      } else {
        await createProject(payload);

        showToast(
          "Project created successfully."
        );
      }

      resetForm();
      await loadProjects();
    } catch (error) {
      showToast(
        error.message ||
          "Failed to save project.",
        "error"
      );
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (project) => {
    setEditingId(project.id);

    setForm({
      title: project.title || "",
      slug: project.slug || "",
      description:
        project.description || "",
      image: project.image || "",
      technologies:
        project.technologies || "",
      github_url:
        project.github_url || "",
      live_url:
        project.live_url || "",
      featured: Boolean(project.featured)
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

      await deleteProject(
        deleteItem.id
      );

      showToast(
        "Project deleted successfully."
      );

      setDeleteItem(null);

      if (editingId === deleteItem.id) {
        resetForm();
      }

      await loadProjects();
    } catch (error) {
      showToast(
        error.message ||
          "Failed to delete project.",
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
        title="Delete Project"
        message={
          deleteItem
            ? `Are you sure you want to delete "${deleteItem.title}"? This action cannot be undone.`
            : ""
        }
        confirmText="Delete"
        cancelText="Cancel"
        loading={deleting}
        onCancel={() =>
          setDeleteItem(null)
        }
        onConfirm={handleDelete}
      />

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          Projects
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          Create and manage your portfolio
          projects.
        </p>
      </div>

      <div className="grid gap-6 xl:grid-cols-[380px_1fr]">
        <section className="h-fit rounded-xl border border-gray-200 bg-white p-6">
          <div className="mb-6 flex items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold text-gray-900">
                {editingId
                  ? "Edit Project"
                  : "Add Project"}
              </h2>

              <p className="mt-1 text-xs text-gray-500">
                Fill in the project details.
              </p>
            </div>

            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="text-sm font-medium text-gray-500 hover:text-gray-900"
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
              <label
                htmlFor="title"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Title
              </label>

              <input
                id="title"
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="Portfolio Website"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-black"
              />
            </div>

            <div>
              <label
                htmlFor="slug"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Slug
              </label>

              <input
                id="slug"
                name="slug"
                value={form.slug}
                onChange={handleChange}
                placeholder="portfolio-website"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-black"
              />

              <p className="mt-1 text-xs text-gray-500">
                Generated automatically from
                the title.
              </p>
            </div>

            <div>
              <label
                htmlFor="description"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Description
              </label>

              <textarea
                id="description"
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={5}
                placeholder="Describe the project..."
                className="w-full resize-none rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-black"
              />
            </div>

            <div>
              <label
                htmlFor="image"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Image URL
              </label>

              <input
                id="image"
                name="image"
                value={form.image}
                onChange={handleChange}
                placeholder="https://..."
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-black"
              />
            </div>

            <div>
              <label
                htmlFor="technologies"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Technologies
              </label>

              <input
                id="technologies"
                name="technologies"
                value={form.technologies}
                onChange={handleChange}
                placeholder="React, Node.js, MySQL"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-black"
              />

              <p className="mt-1 text-xs text-gray-500">
                Use the format expected by your
                backend.
              </p>
            </div>

            <div>
              <label
                htmlFor="github_url"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                GitHub URL
              </label>

              <input
                id="github_url"
                name="github_url"
                value={form.github_url}
                onChange={handleChange}
                placeholder="https://github.com/..."
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-black"
              />
            </div>

            <div>
              <label
                htmlFor="live_url"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Live URL
              </label>

              <input
                id="live_url"
                name="live_url"
                value={form.live_url}
                onChange={handleChange}
                placeholder="https://..."
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-black"
              />
            </div>

            <label className="flex cursor-pointer items-center gap-3">
              <input
                type="checkbox"
                name="featured"
                checked={form.featured}
                onChange={handleChange}
                className="h-4 w-4 rounded border-gray-300"
              />

              <span className="text-sm font-medium text-gray-700">
                Featured project
              </span>
            </label>

            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                disabled={saving}
                className="flex-1 rounded-lg bg-black px-5 py-3 text-sm font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {saving
                  ? "Saving..."
                  : editingId
                    ? "Update Project"
                    : "Create Project"}
              </button>

              {editingId && (
                <button
                  type="button"
                  onClick={resetForm}
                  disabled={saving}
                  className="rounded-lg border border-gray-300 px-5 py-3 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </section>

        <section className="rounded-xl border border-gray-200 bg-white">
          <div className="border-b border-gray-200 p-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-gray-900">
                  All Projects
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  {projects.length} project
                  {projects.length === 1
                    ? ""
                    : "s"}
                </p>
              </div>

              <button
                type="button"
                onClick={loadProjects}
                disabled={loading}
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100 disabled:opacity-50"
              >
                Refresh
              </button>
            </div>
          </div>

          {loading ? (
            <div className="p-10 text-center">
              <div className="mx-auto h-9 w-9 animate-spin rounded-full border-4 border-gray-300 border-t-black" />

              <p className="mt-4 text-sm text-gray-500">
                Loading projects...
              </p>
            </div>
          ) : projects.length === 0 ? (
            <div className="p-10 text-center">
              <p className="font-medium text-gray-700">
                No projects found.
              </p>

              <p className="mt-1 text-sm text-gray-500">
                Create your first project using
                the form.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {projects.map((project) => (
                <div
                  key={project.id}
                  className="p-6"
                >
                  <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-base font-bold text-gray-900">
                          {project.title}
                        </h3>

                        {Boolean(
                          project.featured
                        ) && (
                          <span className="rounded-full bg-black px-2.5 py-1 text-xs font-medium text-white">
                            Featured
                          </span>
                        )}
                      </div>

                      {project.slug && (
                        <p className="mt-1 text-xs text-gray-400">
                          /{project.slug}
                        </p>
                      )}

                      {project.description && (
                        <p className="mt-2 line-clamp-3 text-sm leading-6 text-gray-600">
                          {project.description}
                        </p>
                      )}

                      {project.technologies && (
                        <p className="mt-3 text-xs text-gray-500">
                          <span className="font-semibold text-gray-700">
                            Technologies:
                          </span>{" "}
                          {project.technologies}
                        </p>
                      )}

                      <div className="mt-4 flex flex-wrap gap-3">
                        {project.github_url && (
                          <a
                            href={
                              project.github_url
                            }
                            target="_blank"
                            rel="noreferrer"
                            className="text-xs font-medium text-gray-700 underline"
                          >
                            GitHub
                          </a>
                        )}

                        {project.live_url && (
                          <a
                            href={
                              project.live_url
                            }
                            target="_blank"
                            rel="noreferrer"
                            className="text-xs font-medium text-gray-700 underline"
                          >
                            Live Demo
                          </a>
                        )}
                      </div>
                    </div>

                    <div className="flex shrink-0 gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          handleEdit(project)
                        }
                        className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
                      >
                        Edit
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          setDeleteItem(project)
                        }
                        className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700"
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

export default ProjectsPage;
