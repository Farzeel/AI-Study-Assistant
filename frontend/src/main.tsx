import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { StateProvider } from './pages/authPage/AuthPageContext.tsx'
import { GoogleOAuthProvider } from "@react-oauth/google";


createRoot(document.getElementById('root')!).render(
  <StrictMode>
<GoogleOAuthProvider clientId="628509377910-doljp0furas12mjhvll81k8hpkqhpgqv.apps.googleusercontent.com">
<StateProvider>

    <App />
</StateProvider>
</GoogleOAuthProvider>
  </StrictMode>,
)
