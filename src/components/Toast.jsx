"use client";

import { useEffect } from "react";

const Toast = ({
  message,
  type = "success",
  onClose
}) => {
  useEffect(() => {
    if (!message) {
      return;
    }

    const timer = setTimeout(() => {
      if (onClose) {
        onClose();
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, [message, onClose]);

  if (!message) {
    return null;
  }

  const styles = {
    success:
      "border-green-200 bg-green-50 text-green-800",
    error:
      "border-red-200 bg-red-50 text-red-800",
    info:
      "border-blue-200 bg-blue-50 text-blue-800",
    warning:
      "border-yellow-200 bg-yellow-50 text-yellow-800"
  };

  const icons = {
    success: "✓",
    error: "!",
    info: "i",
    warning: "!"
  };

  return (
    <div className="fixed right-4 top-4 z-100 w-[calc(100%-2rem)] max-w-md">
      <div
        className={`flex items-start gap-3 rounded-xl border px-4 py-3 shadow-lg ${styles[type] || styles.success}`}
        role="alert"
      >
        <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-current text-xs font-bold">
          {icons[type] || icons.success}
        </div>

        <p className="flex-1 text-sm font-medium leading-6">
          {message}
        </p>

        <button
          type="button"
          onClick={onClose}
          className="shrink-0 text-lg leading-none opacity-60 transition hover:opacity-100"
          aria-label="Close notification"
        >
          ×
        </button>
      </div>
    </div>
  );
};

export default Toast;