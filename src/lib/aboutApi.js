import api from "./api";

export const getAbout = async () => {
  return api("/about");
};

export const updateAbout = async (data) => {
  return api("/about", {
    method: "PUT",
    body: JSON.stringify(data)
  });
};