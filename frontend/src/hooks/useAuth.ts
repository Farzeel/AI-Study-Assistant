import { authService } from "../services/auth/authServices";
import type { LoginPayload, RegisterPayload } from "../types/auth.types";


export const useAuth = () => {
  const login = async (data: LoginPayload) => {
    return await authService.login(data);
  };

  const register = async (data: RegisterPayload) => {
    return await authService.register(data);
  };
  const google = async (id: string) => {
    return await authService.googleLogin(id);
  };

 
  const refresh= async () => {
   return await authService.refresh();

  };


  const logout = async () => {
    await authService.logout();
  };

  return { login, register, logout,google,refresh };
};
