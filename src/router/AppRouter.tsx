// src/router/AppRouter.tsx
import { JSX, useContext } from 'react';
// import { Navigate, Route, Routes } from 'react-router-dom';
// import Login from '../components/Login';
import Register from '../components/Register';
// import Home from '../pages/Home';
import CompleteProfile from '../components/CompleteProfile';
import { AuthContext } from '../context/AuthContext';
import { Navigate, Route, Routes } from 'react-router';
import Home from '../pages/Home';
import Login from '../components/Login';

export const AppRouter = (): JSX.Element => {
  const { authStatus, hasUserProfile } = useContext(AuthContext);

  console.log("Estado desde AppRouter:", authStatus, hasUserProfile);

  if (authStatus === 'checking') {
    return <p>Loading session 🔥...</p>;
  }

  return (
    <Routes>
      {authStatus === 'authenticated' ? (
        hasUserProfile ? (
          <>
            <Route path="/home" element={<Home />} />
            <Route path="/*" element={<Navigate to="/home" />} />
          </>
        ) : (
          <>
            <Route path="/complete-profile" element={<CompleteProfile />} />
            <Route path="/*" element={<Navigate to="/complete-profile" />} />
          </>
        )
      ) : (
        <>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/*" element={<Navigate to="/login" />} />
        </>
      )}
    </Routes>
  );
};
