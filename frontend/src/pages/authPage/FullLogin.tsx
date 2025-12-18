import LoginForm from './LoginForm'
import LeftSection from './HeroSection'
import { useNavigate } from 'react-router';
import { useAuthStore } from '../../store/auth.store';
import { useEffect } from 'react';

const FullLogin = () => {
  const navigate = useNavigate();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
useEffect(()=>{

  if(isAuthenticated){
    navigate("/")
  }
},[])
  return (
    <div className="bg-white shadow-2xl  overflow-hidden h-screen w-full flex">
        
    {/* Left Side: Hero Section */}
    <LeftSection />

    {/* Right Side: Login Form */}
    <LoginForm />
    
  </div>
  )
}

export default FullLogin
