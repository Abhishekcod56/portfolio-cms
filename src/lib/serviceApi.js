import api from "./api";

export const getServices = async () => {
  return api("/services");
};

export const createService = async (data) => {
  return api("/services", {
    method: "POST",
    body: JSON.stringify(data)
  });
};

export const updateService = async (id, data) => {
  return api(`/services/${id}`, {
    method: "PUT",
    body: JSON.stringify(data)
  });
};

export const deleteService = async (id) => {
  return api(`/services/${id}`, {
    method: "DELETE"
  });
};