import { http } from "./http";

export const getCsrfCookie = () => http.get("/sanctum/csrf-cookie");

// let csrfPromise: Promise<unknown> | null = null;

// export const getCsrfCookie = () => {
//   if (!csrfPromise) csrfPromise = http.get("/sanctum/csrf-cookie");
//   return csrfPromise;
// };
