"use client";

import { useEffect, useState } from "react";

import {
  getServices,
  createService,
  updateService,
  deleteService
} from "../../../lib/serviceApi";

import Toast from "../../../components/Toast";
import ConfirmModal from "../../../components/ConfirmModal";

const emptyForm = {
  title: "",
  description: "",
  icon: ""
};

const ServicesPage = () => {
  const [services, setServices] =
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

  const loadServices = async () => {
    try {
      setLoading(true);

      const response =
        await getServices();

      const data = Array.isArray(response)
        ? response
        : response?.data || [];

      setServices(data);
    } catch (error) {
      showToast(
        error.message ||
          "Failed to load services.",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadServices();
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

    if (!form.title.trim()) {
      showToast(
        "Service title is required.",
        "error"
      );
      return;
    }

    try {
      setSaving(true);

      if (editingId) {
        await updateService(
          editingId,
          form
        );

        showToast(
          "Service updated successfully."
        );
      } else {
        await createService(form);

        showToast(
          "Service created successfully."
        );
      }

      resetForm();
      await loadServices();
    } catch (error) {
      showToast(
        error.message ||
          "Failed to save service.",
        "error"
      );
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (service) => {
    setEditingId(service.id);

    setForm({
      title: service.title || "",
      description:
        service.description || "",
      icon: service.icon || ""
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

      await deleteService(
        deleteItem.id
      );

      showToast(
        "Service deleted successfully."
      );

      setDeleteItem(null);

      if (editingId === deleteItem.id) {
        resetForm();
      }

      await loadServices();
    } catch (error) {
      showToast(
        error.message ||
          "Failed to delete service.",
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
        title="Delete Service"
        message={
          deleteItem
            ? `Are you sure you want to delete "${deleteItem.title}"?`
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
          Services
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          Manage the services displayed on your
          portfolio.
        </p>
      </div>

      <div className="grid gap-6 xl:grid-cols-[380px_1fr]">
        <section className="h-fit rounded-xl border border-gray-200 bg-white p-6">
          <h2 className="mb-6 text-lg font-bold">
            {editingId
              ? "Edit Service"
              : "Add Service"}
          </h2>

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
                placeholder="Web Development"
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
                placeholder="Describe this service..."
                className="w-full resize-none rounded-lg border border-gray-300 px-4 py-3 text-sm focus:border-black focus:outline-none"
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
                  ? "Update Service"
                  : "Create Service"}
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
              All Services
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              {services.length} service
              {services.length === 1
                ? ""
                : "s"}
            </p>
          </div>

          {loading ? (
            <div className="p-10 text-center">
              Loading services...
            </div>
          ) : services.length === 0 ? (
            <div className="p-10 text-center text-gray-500">
              No services found.
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {services.map((service) => (
                <div
                  key={service.id}
                  className="p-6"
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:justify-between">
                    <div>
                      <h3 className="font-bold">
                        {service.title}
                      </h3>

                      {service.description && (
                        <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-600">
                          {
                            service.description
                          }
                        </p>
                      )}

                      {service.icon && (
                        <p className="mt-3 text-xs text-gray-500">
                          Icon: {service.icon}
                        </p>
                      )}
                    </div>

                    <div className="flex shrink-0 gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          handleEdit(service)
                        }
                        className="rounded-lg border border-gray-300 px-4 py-2 text-sm hover:bg-gray-100"
                      >
                        Edit
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          setDeleteItem(service)
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

export default ServicesPage;