"use client";

import { useEffect, useState } from "react";

import {
  getMessages,
  deleteMessage
} from "../../../lib/messageApi";

import Toast from "../../../components/Toast";
import ConfirmModal from "../../../components/ConfirmModal";

const MessagesPage = () => {
  const [messages, setMessages] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

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

  const loadMessages = async () => {
    try {
      setLoading(true);

      const response =
        await getMessages();

      const data = Array.isArray(response)
        ? response
        : response?.data || [];

      setMessages(data);
    } catch (error) {
      showToast(
        error.message ||
          "Failed to load messages.",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMessages();
  }, []);

  const handleDelete = async () => {
    if (!deleteItem) {
      return;
    }

    try {
      setDeleting(true);

      await deleteMessage(
        deleteItem.id
      );

      showToast(
        "Message deleted successfully."
      );

      setDeleteItem(null);

      await loadMessages();
    } catch (error) {
      showToast(
        error.message ||
          "Failed to delete message.",
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
        title="Delete Message"
        message={
          deleteItem
            ? `Are you sure you want to delete the message from "${deleteItem.name}"? This action cannot be undone.`
            : ""
        }
        loading={deleting}
        onCancel={() =>
          setDeleteItem(null)
        }
        onConfirm={handleDelete}
      />

      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Messages
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Messages submitted through your portfolio
            contact form.
          </p>
        </div>

        <button
          type="button"
          onClick={loadMessages}
          disabled={loading}
          className="w-fit rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100 disabled:opacity-50"
        >
          Refresh
        </button>
      </div>

      <section className="rounded-xl border border-gray-200 bg-white">
        <div className="border-b border-gray-200 p-6">
          <h2 className="text-lg font-bold text-gray-900">
            Contact Messages
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            {messages.length} message
            {messages.length === 1
              ? ""
              : "s"}
          </p>
        </div>

        {loading ? (
          <div className="p-10 text-center">
            <div className="mx-auto h-9 w-9 animate-spin rounded-full border-4 border-gray-300 border-t-black" />

            <p className="mt-4 text-sm text-gray-500">
              Loading messages...
            </p>
          </div>
        ) : messages.length === 0 ? (
          <div className="p-10 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 text-2xl">
              ✉
            </div>

            <p className="mt-4 font-medium text-gray-700">
              No messages yet
            </p>

            <p className="mt-1 text-sm text-gray-500">
              Messages submitted from your portfolio
              contact form will appear here.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {messages.map((message) => (
              <article
                key={message.id}
                className="p-6"
              >
                <div className="flex flex-col gap-5 lg:flex-row lg:justify-between">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-3">
                      <h3 className="font-bold text-gray-900">
                        {message.name ||
                          "Unknown sender"}
                      </h3>

                      {message.created_at && (
                        <span className="text-xs text-gray-500">
                          {new Date(
                            message.created_at
                          ).toLocaleString()}
                        </span>
                      )}
                    </div>

                    <a
                      href={`mailto:${message.email}`}
                      className="mt-1 inline-block text-sm text-gray-600 underline hover:text-black"
                    >
                      {message.email}
                    </a>

                    {message.subject && (
                      <h4 className="mt-4 text-base font-semibold text-gray-900">
                        {message.subject}
                      </h4>
                    )}

                    <div className="mt-3 rounded-lg bg-gray-50 p-4">
                      <p className="whitespace-pre-wrap text-sm leading-6 text-gray-700">
                        {message.message}
                      </p>
                    </div>

                    <a
                      href={`mailto:${message.email}${
                        message.subject
                          ? `?subject=Re: ${encodeURIComponent(
                              message.subject
                            )}`
                          : ""
                      }`}
                      className="mt-4 inline-block rounded-lg bg-black px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-800"
                    >
                      Reply
                    </a>
                  </div>

                  <div className="shrink-0">
                    <button
                      type="button"
                      onClick={() =>
                        setDeleteItem(message)
                      }
                      className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default MessagesPage;