import { http } from "./http.services";

export const getCsrfCookie = () => http.get("/sanctum/csrf-cookie");
