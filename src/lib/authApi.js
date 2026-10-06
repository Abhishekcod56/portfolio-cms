import api from "./api";

export const loginAdmin = async (
  email,
  password
) => {
  return api("/auth/login", {
    method: "POST",
    body: JSON.stringify({
      email,
      password
    })
  });
};

export const getCurrentAdmin = async () => {
  return api("/auth/me");
};

export const changeAdminPassword = async (
  currentPassword,
  newPassword
) => {
  return api("/auth/change-password", {
    method: "PUT",
    body: JSON.stringify({
      currentPassword,
      newPassword
    })
  });
};

export const logoutAdmin = () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminUser");
  }
};