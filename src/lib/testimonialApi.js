import api from "./api";

export const getTestimonials = async () => {
  return api("/testimonials");
};

export const createTestimonial = async (data) => {
  return api("/testimonials", {
    method: "POST",
    body: JSON.stringify(data)
  });
};

export const updateTestimonial = async (
  id,
  data
) => {
  return api(`/testimonials/${id}`, {
    method: "PUT",
    body: JSON.stringify(data)
  });
};

export const deleteTestimonial = async (id) => {
  return api(`/testimonials/${id}`, {
    method: "DELETE"
  });
};