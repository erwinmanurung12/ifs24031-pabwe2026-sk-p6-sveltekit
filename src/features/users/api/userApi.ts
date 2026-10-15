import { apiRequest } from "../../../helpers/apiHelper";

export const getUsers = () => apiRequest("/users");
export const getMe = () => apiRequest("/users/me");

export const putMe = ({ name, email }) =>
  apiRequest("/users/me", { method: "PUT", body: { name, email } });

export const postPhoto = (file) => {
  const form = new FormData();
  form.append("photo", file);
  return apiRequest("/users/photo", { method: "POST", body: form });
};

export const putPassword = ({ password, newPassword }) =>
  apiRequest("/users/change-password", { method: "PUT", body: { password, new_password: newPassword } });
