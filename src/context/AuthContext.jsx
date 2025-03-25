import { createContext, useEffect, useState } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authStatus, setAuthStatus] = useState('checking');
  const [hasUserProfile, setHasUserProfile] = useState(false);
  const [accountId, setAccountId] = useState(null);
  const [role, setRole] = useState(null);
  const [user, setUser] = useState(null); 

  const checkUserProfile = async () => {
    try {
      const userRes = await fetch("http://localhost:8080/users/myInfo", {
        method: 'GET',
        credentials: 'include'
      });

      if (!userRes.ok) {
        setUser(null);
        setHasUserProfile(false);
        return;
      }

      const text = await userRes.text();

      try {
        const parsed = JSON.parse(text);
        setHasUserProfile(!!parsed.idUser);
        if (parsed.idUser) {
          setUser(parsed);
          setRole(parsed.account?.role?.roleId || null);
          setHasUserProfile(true);
        } else {
          setUser(null);
          setHasUserProfile(false);
        }
      } catch (err) {
        setUser(null);
        setHasUserProfile(false);
      }
    } catch (err) {
      setUser(null);
      console.error("Error al validar perfil:", err);
      setHasUserProfile(false);
    }
  };

  useEffect(() => {
    fetch('http://localhost:8080/auth/accounts/sessionInfo', {
      method: 'GET',
      credentials: 'include'
    })
      .then(async (res) => {
        if (res.ok) {
          const data = await res.json();
          setRole(data.account?.role?.roleId || null);
          setAccountId(data.accountId);
          setAuthStatus('authenticated');
          await checkUserProfile();
        } else {
          setAuthStatus('not-authenticated');
          setRole(null);
          setHasUserProfile(false);
        }
      })
      .catch(() => {
        setAuthStatus('not-authenticated');
        setRole(null);
        setHasUserProfile(false);
      });
  }, []);

  const login = async () => {
    const res = await fetch("http://localhost:8080/auth/accounts/sessionInfo", {
      method: 'GET',
      credentials: 'include'
    });

    if (res.ok) {
      const data = await res.json();
      setRole(data.account?.role?.roleId || null);
      setAccountId(data.accountId);
      setAuthStatus('authenticated');
      await checkUserProfile();
    } else {
      setAccountId(null);
      setAuthStatus('not-authenticated');
      setRole(null);
      setHasUserProfile(false);
    }
  };

  const logout = () => {
    setAuthStatus('not-authenticated');
    setRole(null);
    setHasUserProfile(false);
    setAccountId(null);
  };

  return (
    <AuthContext.Provider value={{
      hasUserProfile,
      setHasUserProfile,
      authStatus,
      role,
      accountId,
      login,
      logout,
      user
    }}>
      {children}
    </AuthContext.Provider>
  );
};
