import { googleLoginApi, loginApi, logoutApi, refreshTokenApi, registerApi } from "../../api/auth.api";
import { useAuthStore } from "../../store/auth.store";
import type { LoginPayload, RegisterPayload } from "../../types/auth.types";

  export const authService = {
    login: async (data: LoginPayload) => {
      const res = await loginApi(data);
      const { user, accessToken } = res.data;

      useAuthStore.getState().setAuth(user , accessToken);
      return res.data;
    },
    googleLogin: async (id: string) => {
        try {
            const res = await googleLoginApi(id);
            const { accessToken,user } = res.data;
           
      
            useAuthStore.getState().setAuth(user , accessToken);
            return res.data;
        } catch (error) {
            console.log(error)
            return null
        }
 
    },
  
    register: async (data: RegisterPayload) => {
      const res = await registerApi(data);
      return res.data;
    },
  
    refresh: async () => {
      const res = await refreshTokenApi();
    
      return res.data;
    },
  
    logout: async () => {
      await logoutApi();
      useAuthStore.getState().clearAuth();
    },
  };
  