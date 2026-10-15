import { apiRequest } from "../../../helpers/apiHelper";

export const postLogin = ({ email, password }) =>
  apiRequest("/auth/login", { method: "POST", body: { email, password }, auth: false });

export const postRegister = ({ name, email, password }) =>
  apiRequest("/auth/register", { method: "POST", body: { name, email, password }, auth: false });
