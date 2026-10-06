import api from "./api";

export const getMessages = async () => {
  return api("/contact");
};

export const deleteMessage = async (id) => {
  return api(`/contact/${id}`, {
    method: "DELETE"
  });
};