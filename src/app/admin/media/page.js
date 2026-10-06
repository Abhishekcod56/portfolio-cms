
"use client";

import { useState } from "react";

import {
  uploadImage
} from "../../../lib/mediaApi";

import Toast from "../../../components/Toast";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:5000/api";

const BACKEND_URL = API_URL.replace(
  /\/api\/?$/,
  ""
);

const MediaPage = () => {
  const [file, setFile] =
    useState(null);

  const [preview, setPreview] =
    useState("");

  const [uploadedUrl, setUploadedUrl] =
    useState("");

  const [uploading, setUploading] =
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

  const handleFileChange = (event) => {
    const selectedFile =
      event.target.files?.[0];

    if (!selectedFile) {
      return;
    }

    if (
      !selectedFile.type.startsWith(
        "image/"
      )
    ) {
      showToast(
        "Please select an image file.",
        "error"
      );

      event.target.value = "";
      return;
    }

    setFile(selectedFile);
    setUploadedUrl("");

    const objectUrl =
      URL.createObjectURL(selectedFile);

    setPreview(objectUrl);
  };

  const handleUpload = async () => {
    if (!file) {
      showToast(
        "Please select an image first.",
        "error"
      );
      return;
    }

    try {
      setUploading(true);

      const response =
        await uploadImage(file);

      /*
       * Backend returns:
       *
       * {
       *   success: true,
       *   data: {
       *     filePath: "/uploads/example.jpg"
       *   }
       * }
       */

      const filePath =
        response?.data?.filePath || "";

      if (!filePath) {
        throw new Error(
          "Image uploaded, but the image URL was not returned."
        );
      }

      const fullUrl =
        filePath.startsWith("http")
          ? filePath
          : `${BACKEND_URL}${filePath}`;

      setUploadedUrl(fullUrl);

      showToast(
        "Image uploaded successfully."
      );
    } catch (error) {
      showToast(
        error.message ||
          "Failed to upload image.",
        "error"
      );
    } finally {
      setUploading(false);
    }
  };

  const handleReset = () => {
    setFile(null);
    setPreview("");
    setUploadedUrl("");

    const input =
      document.getElementById(
        "media-file"
      );

    if (input) {
      input.value = "";
    }
  };

  const copyUrl = async () => {
    if (!uploadedUrl) {
      return;
    }

    try {
      await navigator.clipboard.writeText(
        uploadedUrl
      );

      showToast(
        "Image URL copied to clipboard."
      );
    } catch (error) {
      showToast(
        "Could not copy the URL.",
        "error"
      );
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

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          Media
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          Upload images for projects, blogs,
          testimonials, and your profile.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-xl border border-gray-200 bg-white p-6">
          <h2 className="text-lg font-bold text-gray-900">
            Upload Image
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Select an image from your computer.
          </p>

          <div className="mt-6">
            <label
              htmlFor="media-file"
              className="flex min-h-48 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 px-6 py-10 text-center transition hover:border-gray-500 hover:bg-gray-100"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white text-2xl shadow-sm">
                ↑
              </div>

              <p className="mt-4 text-sm font-semibold text-gray-800">
                Choose an image
              </p>

              <p className="mt-1 text-xs text-gray-500">
                Click here to browse files
              </p>

              {file && (
                <p className="mt-4 max-w-full truncate text-xs font-medium text-gray-700">
                  {file.name}
                </p>
              )}
            </label>

            <input
              id="media-file"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>

          <div className="mt-6 flex gap-3">
            <button
              type="button"
              onClick={handleUpload}
              disabled={!file || uploading}
              className="flex-1 rounded-lg bg-black px-5 py-3 text-sm font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {uploading
                ? "Uploading..."
                : "Upload Image"}
            </button>

            <button
              type="button"
              onClick={handleReset}
              disabled={uploading}
              className="rounded-lg border border-gray-300 px-5 py-3 text-sm font-medium text-gray-700 transition hover:bg-gray-100 disabled:opacity-50"
            >
              Reset
            </button>
          </div>
        </section>

        <section className="rounded-xl border border-gray-200 bg-white p-6">
          <h2 className="text-lg font-bold text-gray-900">
            Preview
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Preview the selected image before using
            it.
          </p>

          {preview ? (
            <div className="mt-6 overflow-hidden rounded-xl border border-gray-200 bg-gray-50">
              <img
                src={preview}
                alt="Selected preview"
                className="max-h-100 w-full object-contain"
              />
            </div>
          ) : (
            <div className="mt-6 flex min-h-64 items-center justify-center rounded-xl border border-gray-200 bg-gray-50">
              <p className="text-sm text-gray-500">
                No image selected
              </p>
            </div>
          )}

          {uploadedUrl && (
            <div className="mt-6">
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Uploaded Image URL
              </label>

              <div className="flex flex-col gap-2 sm:flex-row">
                <input
                  value={uploadedUrl}
                  readOnly
                  className="min-w-0 flex-1 rounded-lg border border-gray-300 bg-gray-50 px-4 py-3 text-xs text-gray-700 outline-none"
                />

                <button
                  type="button"
                  onClick={copyUrl}
                  className="rounded-lg bg-black px-5 py-3 text-sm font-medium text-white hover:bg-gray-800"
                >
                  Copy URL
                </button>
              </div>

              <a
                href={uploadedUrl}
                target="_blank"
                rel="noreferrer"
                className="mt-2 inline-block text-sm font-medium text-blue-600 hover:underline"
              >
                Open Image
              </a>
            </div>
          )}
        </section>
      </div>

      <section className="mt-6 rounded-xl border border-gray-200 bg-white p-6">
        <h2 className="text-lg font-bold text-gray-900">
          How to use uploaded images
        </h2>

        <div className="mt-4 grid gap-4 md:grid-cols-3">
          <div className="rounded-lg bg-gray-50 p-4">
            <p className="font-semibold text-gray-900">
              1. Upload
            </p>

            <p className="mt-1 text-sm leading-6 text-gray-600">
              Select an image and upload it through
              this page.
            </p>
          </div>

          <div className="rounded-lg bg-gray-50 p-4">
            <p className="font-semibold text-gray-900">
              2. Copy URL
            </p>

            <p className="mt-1 text-sm leading-6 text-gray-600">
              Click Copy URL after the upload
              succeeds.
            </p>
          </div>

          <div className="rounded-lg bg-gray-50 p-4">
            <p className="font-semibold text-gray-900">
              3. Use URL
            </p>

            <p className="mt-1 text-sm leading-6 text-gray-600">
              Paste the URL into your project,
              blog, testimonial, or About image
              field.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default MediaPage;