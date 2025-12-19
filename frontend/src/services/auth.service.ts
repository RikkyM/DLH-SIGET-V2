import type { LoginCredentials, User } from "@/types/auth.types";
import { http } from "./http";
import { getCsrfCookie } from "./csrf.service";

export const login = async (payload: LoginCredentials) => {
  await getCsrfCookie();
  return await http.post<User>("/api/login", payload);
};

export const logout = async () => {
  return await http.post("/api/logout");
};
