import { Navigate, Route, Routes } from "react-router-dom"
import React from 'react';
import HomePage from "./pages/HomePage/HomePage"
import AuthPage from "./pages/AuthPage/AuthPage"
import PageLayouts from "./layouts/PageLayouts/PageLayouts"
import ProfilePage from "./pages/ProfilePage/ProfilePage"
import { useAuthState } from "react-firebase-hooks/auth"
import { auth } from "./firebase/firebase"



function App() {
  const [authUser] = useAuthState(auth);
  return (
    <PageLayouts>
      <Routes>
        <Route path='/' element={authUser ? <HomePage /> : <Navigate to="/auth" />} />
        <Route path='/auth' element={!authUser ? <AuthPage /> : <Navigate to="/" />} />
        <Route path='/:username' element={<ProfilePage />} />
      </Routes>
    </PageLayouts>
  );
}

export default App;
