import type { LoginPayload, RegisterPayload } from "../types/auth.types";
import api from "./axios";



export const registerApi = (data: RegisterPayload) =>
  api.post("/auth/register", data);


export const loginApi = (data: LoginPayload) =>
  api.post("/auth/login", data);


export const googleLoginApi = (token: string) =>
  api.post("/auth/google", { idToken:token });

export const refreshTokenApi = () =>
  api.get("/auth/refresh-token");


export const logoutApi = () =>
  api.post("/auth/logout");
