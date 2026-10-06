import api from "./api";

export const getMedia = async () => {
  return api("/media");
};

export const uploadImage = async (file) => {
  const formData = new FormData();

  formData.append("image", file);

  return api("/upload/image", {
    method: "POST",
    body: formData
  });
};
