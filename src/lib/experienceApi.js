import api from "./api";

export const getExperience = async () => {
  return api("/experience");
};

export const createExperience = async (data) => {
  return api("/experience", {
    method: "POST",
    body: JSON.stringify(data)
  });
};

export const updateExperience = async (id, data) => {
  return api(`/experience/${id}`, {
    method: "PUT",
    body: JSON.stringify(data)
  });
};

export const deleteExperience = async (id) => {
  return api(`/experience/${id}`, {
    method: "DELETE"
  });
};