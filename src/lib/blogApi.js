import api from "./api";

export const getBlogs = async () => {
  return api("/blogs");
};

export const createBlog = async (data) => {
  return api("/blogs", {
    method: "POST",
    body: JSON.stringify(data)
  });
};

export const updateBlog = async (id, data) => {
  return api(`/blogs/${id}`, {
    method: "PUT",
    body: JSON.stringify(data)
  });
};

export const deleteBlog = async (id) => {
  return api(`/blogs/${id}`, {
    method: "DELETE"
  });
};