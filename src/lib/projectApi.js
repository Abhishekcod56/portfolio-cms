import api from "./api";

export const getProjects = async () => {
  return api("/projects");
};

export const createProject = async (data) => {
  return api("/projects", {
    method: "POST",
    body: JSON.stringify(data)
  });
};

export const updateProject = async (id, data) => {
  return api(`/projects/${id}`, {
    method: "PUT",
    body: JSON.stringify(data)
  });
};

export const deleteProject = async (id) => {
  return api(`/projects/${id}`, {
    method: "DELETE"
  });
};