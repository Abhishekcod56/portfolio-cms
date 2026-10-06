import api from "./api";

export const getSkills = async () => {
  return api("/skills");
};

export const createSkill = async (data) => {
  return api("/skills", {
    method: "POST",
    body: JSON.stringify(data)
  });
};

export const updateSkill = async (id, data) => {
  return api(`/skills/${id}`, {
    method: "PUT",
    body: JSON.stringify(data)
  });
};

export const deleteSkill = async (id) => {
  return api(`/skills/${id}`, {
    method: "DELETE"
  });
};