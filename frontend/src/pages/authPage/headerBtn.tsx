import { useAuthPageState } from "./AuthPageContext";



const HeaderButtons = () => {
  const { handleToogleAuthPage, toggleAuthPage } = useAuthPageState();

  return (
    <div className="flex justify-end mb-10">
      <div className="relative flex w-80 bg-gray-900/80 border border-gray-700 rounded-full p-1">
     
        <div
          className={`absolute top-1 bottom-1 w-1/2 rounded-full bg-gray-700 transition-all duration-300 ${
            toggleAuthPage === "login" ? "left-1" : "left-1/2"
          }`}
        />

    
        <button
          onClick={() => handleToogleAuthPage("login")}
          className={`relative z-10 w-1/2 py-2 text-sm font-medium transition ${
            toggleAuthPage === "login"
              ? "text-white"
              : "text-gray-400 hover:text-gray-200"
          }`}
        >
          Log In
        </button>

      
        <button
          onClick={() => handleToogleAuthPage("signUp")}
          className={`relative z-10 w-1/2 py-2 text-sm font-medium transition ${
            toggleAuthPage === "signUp"
              ? "text-white"
              : "text-gray-400 hover:text-gray-200"
          }`}
        >
          Sign Up
        </button>
      </div>
    </div>
  );
};

export default HeaderButtons;
