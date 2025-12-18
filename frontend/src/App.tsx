import { BrowserRouter, Route, Routes } from "react-router"
import FullLogin from "./pages/authPage/FullLogin"
import ProtectedRoute from "./components/RequireAuth"
import DashboardPage from "./pages/DashboardPage"
import { useEffect, useRef } from "react";
import { useAuthStore } from "./store/auth.store";
import { useAuth } from "./hooks/useAuth";




function App() {

  const hasCheckedSession = useRef(false);
  const {refresh} = useAuth()
  const setAuth = useAuthStore((state) => state.setAuth);
  const clearAuth = useAuthStore((state) => state.clearAuth);
  
  // useEffect(() => {
  //   if (hasCheckedSession.current) return;
  //   hasCheckedSession.current = true;

  //   const restoreSession = async () => {
  //     try {
  //       const res = await refresh();
  //       console.log(res)
  //       setAuth(res.user, res.accessToken);
  //     } catch {
  //       console.log("error in refreshing");
  //       clearAuth();
  //     }
  //   };
  //   restoreSession();
  // }, []);

  return (
    <>
    <BrowserRouter>
      <Routes>
        <Route path={"/auth"} element={<FullLogin/>} />

        {/* Protected routes */}
        <Route path="/" element={<ProtectedRoute />}>
          <Route index element={<DashboardPage />} />
        </Route>
      </Routes>
    </BrowserRouter>

      
   
    </>
  )
}

export default App
