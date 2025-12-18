import { Mail, Lock } from "lucide-react";
import HeaderButtons from "./headerBtn";
import { useAuthPageState } from "./AuthPageContext";
import { motion,AnimatePresence } from "motion/react"
import { useGoogleLogin } from "@react-oauth/google";
import { useAuth } from "../../hooks/useAuth";
import { useNavigate } from "react-router";
// import { useAuthStore } from "../../store/auth.store";

const LoginForm: React.FC = () => {
  const { toggleAuthPage } = useAuthPageState();
  const navigate = useNavigate()



 const {google} = useAuth()
  
 
 const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      console.log("Success!", tokenResponse);
      const data = await google(tokenResponse.access_token)
    
      if(data){
        navigate("/")
        console.log(data)
      }else{
        console.log("error while oging with google")
      }
    },
    onError: () => {
      console.log("Google Login Failed");
    },
  });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Attempting login...");
  };

  return (
    <div className="w-full lg:w-3/5 p-8 sm:p-16 bg-gray-900 text-gray-200">
      {/* Top Navigation Buttons */}
      <HeaderButtons />
      <AnimatePresence mode="wait">
      <motion.div
          key={toggleAuthPage}
          initial={{ opacity: 0, x: toggleAuthPage === "login" ? -40 : 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: toggleAuthPage === "login" ? 40 : -40 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="sm:w-[80%]"
          >
          

      <form onSubmit={handleLogin} className="space-y-6">
        {/* Username / Email */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-400">
            Username / Email ID
          </label>
          <div className="relative">
            <input
              type="text"
              placeholder={toggleAuthPage=="login"?`Enter your username or email`:"Email"}
              className="w-full p-3 pr-10 rounded-md bg-gray-800 border border-gray-700 text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-600"
              required
            />
            <Mail className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
          </div>
        </div>

        {/* Password */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-400">
            Password
          </label>
          <div className="relative">
            <input
              type="password"
              placeholder="Password"
              className="w-full p-3 pr-10 rounded-md bg-gray-800 border border-gray-700 text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-600"
              required
            />
            <Lock className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
          </div>
        </div>

        {/* Remember / Forgot */}
        {toggleAuthPage === "login" && (
          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 text-gray-400 select-none">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-gray-600 bg-gray-800 text-gray-600 focus:ring-gray-500"
              />
              Remember Me
            </label>

            <a
              href="#"
              className="text-gray-300 hover:text-white transition"
            >
              Forgot Password?
            </a>
          </div>
        )}

        {/* Main Button */}
        <button
          type="submit"
          className="w-full py-3 rounded-md bg-gray-700 text-white font-semibold hover:bg-gray-600 transition shadow-md"
        >
          {toggleAuthPage === "login" ? "Log In" : "Sign Up"}
        </button>
      </form>

  
      <div className="flex items-center my-8">
        <div className="grow h-px bg-gray-700" />
        <span className="mx-4 text-sm text-gray-500">or</span>
        <div className="grow h-px bg-gray-700" />
      </div>

    
      <div className="flex gap-4">
        <button onClick={()=>googleLogin()} className="flex-1 flex items-center justify-center gap-2 p-3 rounded-md bg-gray-800 border border-gray-700 hover:bg-gray-700 transition">
          <img
            src="https://img.icons8.com/color/20/000000/google-logo.png"
            alt="Google"
          />
          <span className="text-sm text-gray-200">
            {toggleAuthPage === "login"
              ? "Login with Google"
              : "Sign up with Google"}
          </span>
        </button>

        <button className="flex-1 flex items-center justify-center gap-2 p-3 rounded-md bg-gray-800 border border-gray-700 hover:bg-gray-700 transition">
          <img
            src="https://img.icons8.com/color/20/000000/facebook-new.png"
            alt="Facebook"
          />
          <span className="text-sm text-gray-200">
            {toggleAuthPage === "login"
              ? "Login with Facebook"
              : "Sign up with Facebook"}
          </span>
        </button>
      </div>
      </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default LoginForm;
